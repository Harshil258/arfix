import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../app/routes/app_routes.dart';
import '../../core/storage/storage_service.dart';

class OnboardingController extends GetxController {
  final pageController = PageController();
  final currentPage = 0.obs;
  final StorageService _storage = Get.find<StorageService>();

  final pages = [
    {'icon': Icons.qr_code_scanner, 'title': 'Scan & Earn', 'desc': 'Scan QR codes on ARFIX products and earn reward coins instantly.'},
    {'icon': Icons.stars, 'title': 'Collect Rewards', 'desc': 'Accumulate coins with every scan and unlock exclusive rewards.'},
    {'icon': Icons.redeem, 'title': 'Redeem Benefits', 'desc': 'Use your coins for cashback, discounts, and special offers.'},
  ];

  void nextPage() {
    if (currentPage.value < pages.length - 1) {
      pageController.nextPage(duration: const Duration(milliseconds: 400), curve: Curves.easeInOut);
    } else {
      completeOnboarding();
    }
  }

  void completeOnboarding() {
    _storage.setOnboardingShown();
    Get.offAllNamed(AppRoutes.login);
  }

  @override
  void onClose() {
    pageController.dispose();
    super.onClose();
  }
}
