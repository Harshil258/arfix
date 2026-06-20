import 'dart:developer' as dev;
import 'package:get/get.dart';
import '../../app/routes/app_routes.dart';
import '../../core/storage/storage_service.dart';

class SplashController extends GetxController {
  final StorageService _storage = Get.find<StorageService>();

  @override
  void onInit() {
    super.onInit();
    _navigate();
  }

  Future<void> _navigate() async {
    await Future.delayed(const Duration(milliseconds: 2500));

    try {
      dev.log('[Splash] Checking token...');
      final token = await _storage.getToken().timeout(
        const Duration(seconds: 5),
        onTimeout: () {
          dev.log('[Splash] getToken timed out after 5s');
          return null;
        },
      );
      final onboardingShown = _storage.isOnboardingShown;

      dev.log('[Splash] token=${token != null ? "exists" : "null"}, onboarding=$onboardingShown');

      if (!onboardingShown) {
        Get.offAllNamed(AppRoutes.onboarding);
      } else if (token != null && token.isNotEmpty) {
        Get.offAllNamed(AppRoutes.navigation);
      } else {
        Get.offAllNamed(AppRoutes.login);
      }
    } catch (e) {
      dev.log('[Splash] Error during navigation: $e');
      // Fallback: go to login on any error
      Get.offAllNamed(AppRoutes.login);
    }
  }
}
