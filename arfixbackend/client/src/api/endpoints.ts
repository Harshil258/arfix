/**
 * API paths aligned with BACKEND_API_SPEC.md (base URL: /api/v1).
 * Admin-only paths are grouped under `admin` where they differ from the mobile spec.
 */
export const API_ENDPOINTS = {
  auth: {
    signup: "/auth/signup",
    login: "/auth/login",
    adminLogin: "/auth/admin/login",
    me: "/auth/me",
    password: "/auth/password",
    sendOtp: "/auth/send-otp",
    verifyOtp: "/auth/verify-otp",
    google: "/auth/google",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    refresh: "/auth/refresh",
    mobile: "/auth/mobile",
  },
  products: {
    list: "/products",
    byId: (id: string) => `/products/${id}`,
  },
  coupons: {
    scan: "/coupons/scan",
    history: "/coupons/history",
    sessions: "/coupons/sessions",
    create: "/coupons/create",
    inactivate: "/coupons/inactivate",
    byId: (id: string) => `/coupons/${id}`,
    sessionPdf: (sessionId: string) => `/coupons/session/${sessionId}/pdf`,
  },
  wallet: {
    summary: "/wallet",
    transactions: "/wallet/transactions",
  },
  transactions: {
    userHistory: (userId: string) => `/transactions/${userId}/history`,
  },
  rewards: {
    list: "/rewards",
    redemptions: "/rewards/redemptions",
    redeem: (rewardId: string) => `/rewards/${rewardId}/redeem`,
  },
  support: {
    messages: "/support/messages",
    messageById: (id: string) => `/support/messages/${id}`,
    myMessages: "/support/messages/me",
    myMessageById: (messageId: string) => `/support/messages/me/${messageId}`,
  },
  leaderboard: "/leaderboard",
  campaigns: "/campaigns",
  banners: "/banners",
  notifications: {
    list: "/notifications",
    register: "/notifications/register",
    markRead: (id: string) => `/notifications/${id}/read`,
  },
  config: "/config",
  users: {
    list: "/users",
    byId: (id: string) => `/users/${id}`,
  },
  dashboard: {
    summary: "/dashboard/summary",
  },
  razorpay: {
    balance: "/razorpay/balance",
    transactions: "/razorpay/transactions",
    topup: "/razorpay/topup",
    topups: "/razorpay/topups",
  },
  withdrawals: {
    list: "/withdrawals",
    pendingCount: "/withdrawals/pending-count",
    webhook: "/withdrawals/webhook",
    userStatus: (userId: string) => `/withdrawals/${userId}/status`,
    userHistory: (userId: string) => `/withdrawals/${userId}/history`,
    approve: (withdrawalId: string) => `/withdrawals/${withdrawalId}/approve`,
    reject: (withdrawalId: string) => `/withdrawals/${withdrawalId}/reject`,
  },
} as const;
