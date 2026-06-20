import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:get/get.dart';
import '../../core/constants/color_constants.dart';
import '../../core/widgets/custom_button.dart';
import 'controller.dart';

class OnboardingView extends GetView<OnboardingController> {
  const OnboardingView({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final primaryColor = theme.colorScheme.primary;

    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            // Skip button
            Align(
              alignment: Alignment.topRight,
              child: TextButton(
                onPressed: controller.completeOnboarding,
                child: Text('Skip'.tr, style: theme.textTheme.titleMedium?.copyWith(color: primaryColor)),
              ),
            ),
            // Pages
            Expanded(
              child: PageView.builder(
                controller: controller.pageController,
                itemCount: controller.pages.length,
                onPageChanged: (i) => controller.currentPage.value = i,
                itemBuilder: (context, index) {
                  final page = controller.pages[index];
                  return Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 40),
                    child: SingleChildScrollView(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Container(
                            width: 160, height: 160,
                            decoration: BoxDecoration(
                              gradient: isDark ? AppColors.goldGradient : AppColors.primaryGradient,
                              shape: BoxShape.circle,
                              boxShadow: [BoxShadow(color: primaryColor.withValues(alpha: 0.3), blurRadius: 40)],
                            ),
                            child: Icon(page['icon'] as IconData, size: 72, color: isDark ? Colors.black : Colors.white),
                          ).animate().scale(duration: 600.ms, curve: Curves.elasticOut),
                          const SizedBox(height: 48),
                          Text(
                            (page['title'] as String).tr,
                            style: theme.textTheme.displaySmall,
                            textAlign: TextAlign.center,
                          ).animate().fadeIn(delay: 200.ms, duration: 500.ms).slideY(begin: 0.2),
                          const SizedBox(height: 16),
                          Text(
                            (page['desc'] as String).tr,
                            style: theme.textTheme.bodyLarge?.copyWith(
                              color: theme.colorScheme.onSurface.withValues(alpha: 0.7),
                            ),
                            textAlign: TextAlign.center,
                          ).animate().fadeIn(delay: 400.ms, duration: 500.ms),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
            // Dots + Button
            Padding(
              padding: const EdgeInsets.all(32),
              child: Column(
                children: [
                  // Dot indicators
                  Obx(() => Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: List.generate(
                      controller.pages.length,
                      (i) => AnimatedContainer(
                        duration: const Duration(milliseconds: 300),
                        margin: const EdgeInsets.symmetric(horizontal: 4),
                        width: controller.currentPage.value == i ? 32 : 8,
                        height: 8,
                        decoration: BoxDecoration(
                          color: controller.currentPage.value == i ? primaryColor : primaryColor.withValues(alpha: 0.2),
                          borderRadius: BorderRadius.circular(4),
                        ),
                      ),
                    ),
                  )),
                  const SizedBox(height: 32),
                  Obx(() => CustomButton(
                    text: controller.currentPage.value == controller.pages.length - 1 ? 'Get Started'.tr : 'Next'.tr,
                    gradient: isDark ? AppColors.goldGradient : AppColors.primaryGradient,
                    onPressed: controller.nextPage,
                  )),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
