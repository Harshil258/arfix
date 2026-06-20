// API Constants for Arfix backend

class ApiConstants {
  ApiConstants._();

  // Base URL - use local network IP for physical device testing
  static const String baseUrl = 'https://api.artilefix.com/';
  // https://affiliate-occupier-viewable.ngrok-free.dev/api/v1
  static const String apiPrefix = '/api/v1';
  static String get apiBaseUrl => '$baseUrl$apiPrefix';

  // Auth endpoints
  static const String signup = '/auth/signup';
  static const String login = '/auth/login';
  static const String me = '/auth/me';
  static const String changePassword = '/auth/password';
  static const String sendOtp = '/auth/send-otp';
  static const String verifyOtp = '/auth/verify-otp/email';
  static const String googleSignIn = '/auth/google';
  static const String forgotPassword = '/auth/forgot-password';
  static const String resetPassword = '/auth/reset-password';
  static const String refreshToken = '/auth/refresh';
  static const String updateMobile = '/auth/mobile';
  static const String deleteAccount = '/auth/me'; // DELETE method

  // Product endpoints
  static const String products = '/products';

  // Coupon endpoints
  static const String scanCoupon = '/coupons/scan';
  static const String couponHistory = '/coupons/history';

  // Wallet endpoints
  static const String wallet = '/wallet';
  static const String walletTransactions = '/wallet/transactions';

  // Reward endpoints
  static const String rewards = '/rewards';
  static const String rewardRedemptions = '/rewards/redemptions';
  static String redeemReward(String rewardId) => '/rewards/$rewardId/redeem';

  // Support endpoints
  static const String supportMessages = '/support/messages';
  static const String mySupportMessages = '/support/messages/me';

  // Notification endpoints
  static const String notificationRegister = '/notifications/register';
  static const String notifications = '/notifications';
  static String markNotificationRead(String id) => '/notifications/$id/read';

  // Leaderboard endpoints
  static const String leaderboard = '/leaderboard';

  // Campaign & Banner endpoints
  static const String campaigns = '/campaigns';
  static const String banners = '/banners';

  // Video endpoints
  static const String videos = '/videos';

  // Config endpoints
  static const String config = '/config';

  // Withdrawal endpoints
  static const String withdrawals = '/withdrawals';
  static const String myWithdrawals = '/withdrawals/me';
  static String withdrawalStatus(String userId) => '/withdrawals/$userId/status';
  static String withdrawalHistory(String userId) => '/withdrawals/$userId/history';
  static String cancelWithdrawal(String withdrawalId) => '/withdrawals/$withdrawalId/cancel';

  // Timeouts
  static const int connectTimeout = 30000;
  static const int receiveTimeout = 30000;
  static const int sendTimeout = 30000;
}
