import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:get/get.dart';
import '../../core/constants/color_constants.dart';
import '../../core/widgets/app_logo.dart';
import 'controller.dart';

class SplashView extends GetView<SplashController> {
  const SplashView({super.key});

  @override
  Widget build(BuildContext context) {
    // Access controller to trigger lazy instantiation & start navigation
    controller;
    return Scaffold(
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(gradient: AppColors.primaryGradient),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Animated Logo
            AppLogo(size: 140)
                .animate()
                .scale(duration: 800.ms, curve: Curves.elasticOut)
                .then()
                .shimmer(duration: 1200.ms, color: Colors.white30),
            const SizedBox(height: 32),
            Text(
              'ARFIX',
              style: Theme.of(context).textTheme.displayLarge?.copyWith(
                    color: Colors.white,
                    fontWeight: FontWeight.w800,
                    letterSpacing: 8,
                  ),
            ).animate().fadeIn(delay: 400.ms, duration: 600.ms).slideY(begin: 0.3),
            const SizedBox(height: 8),
            Text(
              'Scan. Earn. Redeem.',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    color: Colors.white70,
                    letterSpacing: 2,
                  ),
            ).animate().fadeIn(delay: 700.ms, duration: 600.ms),
            const SizedBox(height: 64),
            const SizedBox(
              width: 32, height: 32,
              child: CircularProgressIndicator(
                strokeWidth: 2.5,
                valueColor: AlwaysStoppedAnimation(Colors.white70),
              ),
            ).animate().fadeIn(delay: 1000.ms, duration: 400.ms),
          ],
        ),
      ),
    );
  }
}
