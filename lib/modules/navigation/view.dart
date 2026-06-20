import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../app/routes/app_routes.dart';
import '../../core/constants/color_constants.dart';
import '../home/view.dart';
import '../home/controller.dart';
import '../wallet/view.dart';
import '../wallet/controller.dart';
import '../products/views/product_list_view.dart';
import '../profile/view.dart';
import '../profile/controller.dart';
import 'controller.dart';

class NavigationView extends GetView<NavigationController> {
  const NavigationView({super.key});

  @override
  Widget build(BuildContext context) {
    final profileController = Get.find<ProfileController>();
    final pages = [
      const HomeView(),
      const WalletView(),
      const SizedBox(), // Scanner placeholder (opens as separate page)
      const ProductListView(),
      const ProfileView(),
    ];

    return Obx(() {
      // Register dependency on language selection
      final lang = profileController.currentLanguage.value;

      return Scaffold(
        body: IndexedStack(
          key: ValueKey(lang),
          index: controller.currentIndex.value,
          children: pages,
        ),
        bottomNavigationBar: Container(
          decoration: BoxDecoration(
            color: Theme.of(context).bottomNavigationBarTheme.backgroundColor,
            border: Border(top: BorderSide(
              color: Theme.of(context).dividerColor, width: 0.5,
            )),
          ),
          child: SafeArea(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _NavItem(icon: Icons.home_rounded, label: 'Home'.tr,
                    isActive: controller.currentIndex.value == 0,
                    onTap: () => controller.changePage(0)),
                _NavItem(icon: Icons.account_balance_wallet_rounded, label: 'Wallet'.tr,
                  isActive: controller.currentIndex.value == 1,
                  onTap: () => controller.changePage(1)),
                // Center scan button
                GestureDetector(
                  onTap: () async {
                    await Get.toNamed(AppRoutes.scanner);
                    if (Get.isRegistered<HomeController>()) {
                      Get.find<HomeController>().refreshUser();
                    }
                    if (Get.isRegistered<WalletController>()) {
                      Get.find<WalletController>().loadData();
                    }
                  },
                  child: Container(
                    width: 56, height: 56,
                    decoration: BoxDecoration(
                      gradient: AppColors.primaryGradient,
                      shape: BoxShape.circle,
                      boxShadow: [BoxShadow(
                        color: AppColors.primaryDark.withValues(alpha: 0.4),
                        blurRadius: 12, offset: const Offset(0, 4),
                      )],
                    ),
                    child: const Icon(Icons.qr_code_scanner, color: Colors.white, size: 28),
                  ),
                ),
                _NavItem(icon: Icons.inventory_2_rounded, label: 'Products'.tr,
                  isActive: controller.currentIndex.value == 3,
                  onTap: () => controller.changePage(3)),
                _NavItem(icon: Icons.person_rounded, label: 'Profile'.tr,
                  isActive: controller.currentIndex.value == 4,
                  onTap: () => controller.changePage(4)),
              ],
            ),
          ),
        ),
      ),
    );
  });
}
}

class _NavItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final bool isActive;
  final VoidCallback onTap;

  const _NavItem({required this.icon, required this.label, required this.isActive, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final activeColor = Theme.of(context).colorScheme.primary;
    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: SizedBox(
        width: 56,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: isActive ? activeColor.withValues(alpha: 0.12) : Colors.transparent,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, size: 24,
                color: isActive ? activeColor : Theme.of(context).textTheme.bodySmall?.color),
            ),
            const SizedBox(height: 2),
            Text(label, style: TextStyle(
              fontSize: 10, fontWeight: isActive ? FontWeight.w600 : FontWeight.w400,
              color: isActive ? activeColor : Theme.of(context).textTheme.bodySmall?.color,
            )),
          ],
        ),
      ),
    );
  }
}
