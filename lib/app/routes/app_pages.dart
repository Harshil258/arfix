import 'package:get/get.dart';
import 'app_routes.dart';

import '../../modules/splash/binding.dart';
import '../../modules/splash/view.dart';
import '../../modules/onboarding/binding.dart';
import '../../modules/onboarding/view.dart';
import '../../modules/auth/binding.dart';
import '../../modules/auth/views/login_view.dart';
import '../../modules/auth/views/signup_view.dart';
import '../../modules/auth/views/forgot_password_view.dart';
import '../../modules/auth/views/verify_otp_view.dart';
import '../../modules/auth/views/reset_password_view.dart';
import '../../modules/navigation/binding.dart';
import '../../modules/navigation/view.dart';
import '../../modules/scanner/binding.dart';
import '../../modules/scanner/view.dart';
import '../../modules/products/binding.dart';
import '../../modules/products/views/product_detail_view.dart';
import '../../modules/profile/binding.dart';
import '../../modules/profile/views/edit_profile_view.dart';
import '../../modules/profile/views/change_password_view.dart';
import '../../modules/support/binding.dart';
import '../../modules/support/views/create_ticket_view.dart';
import '../../modules/support/views/support_detail_view.dart';
import '../../modules/scan_history/binding.dart';
import '../../modules/scan_history/view.dart';
import '../../modules/rewards/binding.dart';
import '../../modules/rewards/views/rewards_view.dart';
import '../../modules/notifications/binding.dart';
import '../../modules/notifications/view.dart';
import '../../modules/withdrawals/binding.dart';
import '../../modules/withdrawals/view.dart';
import '../../modules/about/binding.dart';
import '../../modules/about/view.dart';

class AppPages {
  AppPages._();

  static final List<GetPage> pages = [
    GetPage(name: AppRoutes.splash, page: () => const SplashView(), binding: SplashBinding()),
    GetPage(name: AppRoutes.onboarding, page: () => const OnboardingView(), binding: OnboardingBinding()),
    GetPage(name: AppRoutes.login, page: () => const LoginView(), binding: AuthBinding()),
    GetPage(name: AppRoutes.signup, page: () => const SignupView(), binding: AuthBinding()),
    GetPage(name: AppRoutes.forgotPassword, page: () => const ForgotPasswordView(), binding: AuthBinding()),
    GetPage(name: AppRoutes.verifyOtp, page: () => const VerifyOtpView(), binding: AuthBinding()),
    GetPage(name: AppRoutes.resetPassword, page: () => const ResetPasswordView(), binding: AuthBinding()),
    GetPage(name: AppRoutes.navigation, page: () => const NavigationView(), binding: NavigationBinding()),
    GetPage(name: AppRoutes.scanner, page: () => const ScannerView(), binding: ScannerBinding()),
    GetPage(name: AppRoutes.productDetail, page: () => const ProductDetailView(), binding: ProductBinding()),
    GetPage(name: AppRoutes.editProfile, page: () => const EditProfileView(), binding: ProfileBinding()),
    GetPage(name: AppRoutes.changePassword, page: () => const ChangePasswordView(), binding: ProfileBinding()),
    GetPage(name: AppRoutes.createTicket, page: () => const CreateTicketView(), binding: SupportBinding()),
    GetPage(name: AppRoutes.supportDetail, page: () => const SupportDetailView(), binding: SupportBinding()),
    GetPage(name: AppRoutes.scanHistory, page: () => const ScanHistoryView(), binding: ScanHistoryBinding()),
    GetPage(name: AppRoutes.rewards, page: () => const RewardsView(), binding: RewardsBinding()),
    GetPage(name: AppRoutes.notifications, page: () => const NotificationsView(), binding: NotificationsBinding()),
    GetPage(name: AppRoutes.withdraw, page: () => const WithdrawalView(), binding: WithdrawalBinding()),
    GetPage(name: AppRoutes.about, page: () => const AboutView(), binding: AboutBinding()),
  ];
}
