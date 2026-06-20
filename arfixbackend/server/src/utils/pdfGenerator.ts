import QRCode from "qrcode";
import PDFDocument from "pdfkit";
import { Readable } from "stream";
import { CouponQRPayload } from "@/types/Coupon";

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 40;
const QR_SIZE = 150;
const CARD_WIDTH = 230;
const CARD_HEIGHT = 230;
const COLS = 2;
const COL_GAP = (PAGE_WIDTH - MARGIN * 2 - CARD_WIDTH * COLS) / (COLS - 1);
const ROW_GAP = 20;

const payloadToQRBuffer = async (payload: CouponQRPayload): Promise<Buffer> => {
  const dataUrl = await QRCode.toDataURL(JSON.stringify(payload), {
    errorCorrectionLevel: "H",
    margin: 1,
    width: 300,
  });
  const base64 = dataUrl.replace(/^data:image\/png;base64,/, "");
  return Buffer.from(base64, "base64");
};

export const generateCouponsPDF = async (
  coupons: CouponQRPayload[],
): Promise<Readable> => {
  const doc = new PDFDocument({
    size: "A4",
    margin: MARGIN,
    autoFirstPage: true,
    info: { Title: "Coupon QR Codes", Author: "Auth API" },
  });

  // Header
  doc
    .fontSize(18)
    .font("Helvetica-Bold")
    .text("Coupon QR Codes", MARGIN, MARGIN, { align: "center" })
    .moveDown(0.4)
    .fontSize(9)
    .font("Helvetica")
    .fillColor("#888888")
    .text(`Generated: ${new Date().toUTCString()}`, { align: "center" })
    .fillColor("#000000");

  let cursor = 110;

  for (let i = 0; i < coupons.length; i++) {
    const col = i % COLS;
    const x = MARGIN + col * (CARD_WIDTH + COL_GAP);

    if (i > 0 && col === 0) {
      if (cursor + CARD_HEIGHT > PAGE_HEIGHT - MARGIN) {
        doc.addPage();
        cursor = MARGIN + 20;
      }
    }

    const y = cursor;
    const payload = coupons[i];

    // Card border
    doc
      .roundedRect(x, y, CARD_WIDTH, CARD_HEIGHT, 8)
      .strokeColor("#DDDDDD")
      .lineWidth(1)
      .stroke();

    // QR image only — no labels below
    const qrBuffer = await payloadToQRBuffer(payload);
    doc.image(
      qrBuffer,
      x + (CARD_WIDTH - QR_SIZE) / 2,
      y + (CARD_HEIGHT - QR_SIZE) / 2,
      {
        width: QR_SIZE,
        height: QR_SIZE,
      },
    );

    if (col === COLS - 1 || i === coupons.length - 1) {
      cursor += CARD_HEIGHT + ROW_GAP;
    }
  }

  doc.end();
  return doc as unknown as Readable;
};
