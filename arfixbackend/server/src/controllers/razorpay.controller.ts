import { Response, NextFunction } from "express";
import { AxiosError } from "axios";
import User from "@/models/user.model";
import {
  getRazorpayAccountNumber,
  inrToPaise,
  paiseToInr,
  razorpayX,
} from "@/utils/razorpayX.client";
import RazorpayTopup from "@/models/razorpayTopup.model";
import { AuthenticatedRequest } from "@/types/User";
import { BadRequestError } from "@/utils/AppError";
import { sendSuccess } from "@/utils/response";

interface BankingBalanceItem {
  account_number?: string;
  amount?: number;
  available_amount?: number;
  account_type?: string;
  bank_name?: string;
  bank_code?: string;
  currency?: string;
  refreshed_at?: number;
}

interface RazorpayTransactionItem {
  id: string;
  entity: string;
  amount: number;
  currency: string;
  credit?: number;
  debit?: number;
  balance?: number;
  source?: Record<string, unknown>;
  created_at: number;
}

const razorpayErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as { error?: { description?: string } } | undefined;
    return data?.error?.description ?? error.message;
  }
  if (error instanceof Error) return error.message;
  return "Razorpay request failed.";
};

// GET /api/v1/razorpay/balance
export const getRazorpayBalance = async (
  _req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const accountNumber = getRazorpayAccountNumber();

    const { data } = await razorpayX.get<{ items?: BankingBalanceItem[] }>(
      "/banking_balances",
      { params: { count: 100 } },
    );

    const items = data.items ?? [];
    const matched =
      accountNumber != null
        ? items.find((item) => item.account_number === accountNumber)
        : items[0];

    const primary = matched ?? items[0];

    sendSuccess(res, 200, "Razorpay balance fetched successfully.", {
      accountNumber: primary?.account_number ?? accountNumber ?? null,
      balanceInr: primary?.amount != null ? paiseToInr(primary.amount) : 0,
      availableBalanceInr:
        primary?.available_amount != null ? paiseToInr(primary.available_amount) : 0,
      currency: primary?.currency ?? "INR",
      accountType: primary?.account_type ?? null,
      bankName: primary?.bank_name ?? null,
      refreshedAt: primary?.refreshed_at
        ? new Date(primary.refreshed_at * 1000).toISOString()
        : null,
      allAccounts: items.map((item) => ({
        accountNumber: item.account_number,
        balanceInr: item.amount != null ? paiseToInr(item.amount) : 0,
        availableBalanceInr:
          item.available_amount != null ? paiseToInr(item.available_amount) : 0,
        accountType: item.account_type,
        bankName: item.bank_name,
      })),
    });
  } catch (error) {
    next(BadRequestError(razorpayErrorMessage(error)));
  }
};

// GET /api/v1/razorpay/transactions
export const getRazorpayTransactions = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const accountNumber = getRazorpayAccountNumber();
    if (!accountNumber) {
      throw BadRequestError(
        "RAZORPAY_ACCOUNT_NUMBER is not configured on the server.",
      );
    }

    const {
      page = "1",
      limit = "20",
      from,
      to,
    } = req.query as {
      page?: string;
      limit?: string;
      from?: string;
      to?: string;
    };

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const params: Record<string, string | number> = {
      account_number: accountNumber,
      count: limitNum,
      skip,
    };

    if (from) params.from = Math.floor(new Date(from).getTime() / 1000);
    if (to) params.to = Math.floor(new Date(to).getTime() / 1000);

    const { data } = await razorpayX.get<{
      count: number;
      items: RazorpayTransactionItem[];
    }>("/transactions", { params });

    const items = data.items ?? [];

    const transactions = items.map((txn) => {
      const isCredit = (txn.credit ?? 0) > 0;
      const amountPaise = isCredit ? (txn.credit ?? 0) : (txn.debit ?? txn.amount ?? 0);

      return {
        id: txn.id,
        type: isCredit ? "CREDIT" : "DEBIT",
        amountInr: paiseToInr(amountPaise),
        balanceAfterInr: txn.balance != null ? paiseToInr(txn.balance) : null,
        currency: txn.currency,
        sourceType:
          txn.source && typeof txn.source === "object" && "entity" in txn.source
            ? String((txn.source as { entity?: string }).entity)
            : null,
        sourceId:
          txn.source && typeof txn.source === "object" && "id" in txn.source
            ? String((txn.source as { id?: string }).id)
            : null,
        createdAt: new Date(txn.created_at * 1000).toISOString(),
      };
    });

    sendSuccess(res, 200, "Razorpay transactions fetched successfully.", {
      accountNumber,
      transactions,
      pagination: {
        page: pageNum,
        limit: limitNum,
        count: data.count ?? items.length,
        hasMore: items.length === limitNum,
      },
    });
  } catch (error) {
    next(BadRequestError(razorpayErrorMessage(error)));
  }
};

// POST /api/v1/razorpay/topup
export const createRazorpayTopup = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const adminId = req.user?.id;
    if (!adminId) throw BadRequestError("Not authenticated.");

    const { amount, note } = req.body as { amount: number; note?: string };
    const amountPaise = inrToPaise(amount);

    const admin = await User.findById(adminId).select("name email");
    if (!admin) throw BadRequestError("Admin user not found.");

    const { data: paymentLink } = await razorpayX.post<{
      id: string;
      short_url: string;
    }>("/payment_links", {
      amount: amountPaise,
      currency: "INR",
      accept_partial: false,
      description: note?.trim() || "ARFIX RazorpayX wallet top-up",
      customer: {
        name: admin.name,
        email: admin.email,
      },
      notify: { sms: false, email: true },
      reminder_enable: true,
      notes: {
        purpose: "razorpayx_topup",
        adminId: String(adminId),
      },
    });

    const record = await RazorpayTopup.create({
      createdBy: adminId,
      amountInr: amount,
      amountPaise,
      paymentLinkId: paymentLink.id,
      shortUrl: paymentLink.short_url,
      status: "created",
      note: note?.trim() ?? "",
    });

    sendSuccess(res, 201, "Payment link created. Complete payment to add funds.", {
      topup: {
        id: String(record._id),
        amountInr: record.amountInr,
        paymentLinkId: record.paymentLinkId,
        shortUrl: record.shortUrl,
        status: record.status,
        note: record.note,
        createdAt: record.createdAt,
      },
    });
  } catch (error) {
    next(BadRequestError(razorpayErrorMessage(error)));
  }
};

// GET /api/v1/razorpay/topups
export const listRazorpayTopups = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { page = "1", limit = "10" } = req.query as {
      page?: string;
      limit?: string;
    };

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [topups, total] = await Promise.all([
      RazorpayTopup.find()
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      RazorpayTopup.countDocuments(),
    ]);

    sendSuccess(res, 200, "Top-up history fetched successfully.", {
      topups: topups.map((t) => {
        const creator = t.createdBy as
          | { _id: unknown; name?: string; email?: string }
          | null
          | undefined;
        return {
          id: String(t._id),
          amountInr: t.amountInr,
          paymentLinkId: t.paymentLinkId,
          shortUrl: t.shortUrl,
          status: t.status,
          note: t.note,
          createdAt: t.createdAt,
          createdBy: creator
            ? { id: String(creator._id), name: creator.name, email: creator.email }
            : null,
        };
      }),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};
