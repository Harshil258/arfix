class AppConstants {
  AppConstants._();

  static const String appName = 'Arfix Rewards';
  static const String appTagline = 'Scan. Earn. Redeem.';

  // Storage keys
  static const String tokenKey = 'access_token';
  static const String userKey = 'user_data';
  static const String themeKey = 'theme_mode';
  static const String languageKey = 'language';
  static const String onboardingKey = 'onboarding_shown';
  static const String scanHistoryKey = 'scan_history';

  // Pagination
  static const int defaultPageSize = 20;

  // Validation
  static const int minPasswordLength = 8;
  static const int minNameLength = 2;
  static const int maxNameLength = 50;
  static const int maxSubjectLength = 200;
  static const int maxMessageLength = 10000;

  // Animation durations
  static const int splashDurationMs = 2500;
  static const int shortAnimationMs = 200;
  static const int mediumAnimationMs = 400;
  static const int longAnimationMs = 600;
}
