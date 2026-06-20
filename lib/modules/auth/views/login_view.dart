import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:get/get.dart';
import '../../../app/routes/app_routes.dart';
import '../../../core/utils/validators.dart';
import '../../../core/widgets/app_logo.dart';
import '../../../core/widgets/custom_button.dart';
import '../../../core/widgets/custom_text_field.dart';
import '../controller.dart';

class LoginView extends GetView<AuthController> {
  const LoginView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Form(
            key: controller.loginFormKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 60),
                // Header
                const AppLogo(size: 72, showBackground: true)
                    .animate().scale(duration: 500.ms, curve: Curves.elasticOut),
                const SizedBox(height: 24),
                Text('Welcome Back'.tr, style: Theme.of(context).textTheme.displaySmall)
                    .animate().fadeIn(delay: 200.ms).slideX(begin: -0.1),
                const SizedBox(height: 8),
                Text(
                  'Sign in to continue earning rewards'.tr,
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                    color: Theme.of(context).textTheme.bodySmall?.color,
                  ),
                ).animate().fadeIn(delay: 300.ms),
                const SizedBox(height: 48),
                // Fields
                CustomTextField(
                  controller: controller.loginEmailController,
                  hintText: 'Email address'.tr,
                  prefixIcon: Icons.email_outlined,
                  keyboardType: TextInputType.emailAddress,
                  validator: Validators.validateEmail,
                ).animate().fadeIn(delay: 400.ms).slideY(begin: 0.1),
                const SizedBox(height: 16),
                CustomTextField(
                  controller: controller.loginPasswordController,
                  hintText: 'Password'.tr,
                  prefixIcon: Icons.lock_outlined,
                  isPassword: true,
                  validator: Validators.validatePassword,
                ).animate().fadeIn(delay: 500.ms).slideY(begin: 0.1),
                const SizedBox(height: 8),
                 Align(
                  alignment: Alignment.centerRight,
                  child: GestureDetector(
                    onTap: () => Get.toNamed(AppRoutes.forgotPassword),
                    child: Text('Forgot Password?'.tr,
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: Theme.of(context).colorScheme.primary, fontWeight: FontWeight.w600)),
                  ),
                ).animate().fadeIn(delay: 550.ms),
                const SizedBox(height: 24),
                // Login button
                Obx(() => CustomButton(
                  text: 'Login'.tr,
                  isLoading: controller.isLoading.value,
                  onPressed: controller.login,
                )).animate().fadeIn(delay: 600.ms).slideY(begin: 0.1),
                const SizedBox(height: 24),
                // Signup link
                Center(
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text("Don't have an account? ".tr,
                        style: Theme.of(context).textTheme.bodyMedium),
                      GestureDetector(
                        onTap: () => Get.toNamed(AppRoutes.signup),
                        child: Text('Sign Up'.tr,
                          style: Theme.of(context).textTheme.titleMedium?.copyWith(color: Theme.of(context).colorScheme.primary)),
                      ),
                    ],
                  ),
                ).animate().fadeIn(delay: 700.ms),
                const SizedBox(height: 32),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
