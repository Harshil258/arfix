import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:get/get.dart';
import '../../../core/utils/validators.dart';
import '../../../core/widgets/app_logo.dart';
import '../../../core/widgets/custom_button.dart';
import '../../../core/widgets/custom_text_field.dart';
import '../controller.dart';

class ResetPasswordView extends GetView<AuthController> {
  const ResetPasswordView({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(title: Text('Reset Password'.tr)),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Form(
            key: controller.resetFormKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 24),
                const AppLogo(size: 72, showBackground: true)
                    .animate().scale(duration: 500.ms, curve: Curves.elasticOut),
                const SizedBox(height: 24),
                Text('Set New Password'.tr, style: theme.textTheme.displaySmall)
                    .animate().fadeIn(delay: 200.ms),
                const SizedBox(height: 8),
                Text(
                  'Enter the reset token sent to your email and your new password below.'.tr,
                  style: theme.textTheme.bodyLarge?.copyWith(
                    color: theme.textTheme.bodySmall?.color),
                ).animate().fadeIn(delay: 300.ms),
                const SizedBox(height: 32),
                
                // Token Field
                CustomTextField(
                  controller: controller.resetTokenController,
                  hintText: 'Reset Token / Code'.tr,
                  prefixIcon: Icons.vpn_key_outlined,
                  validator: (v) => v == null || v.trim().isEmpty ? 'Reset token is required'.tr : null,
                ).animate().fadeIn(delay: 400.ms).slideY(begin: 0.1),
                const SizedBox(height: 16),
                
                // New Password Field
                CustomTextField(
                  controller: controller.resetNewPasswordController,
                  hintText: 'New Password'.tr,
                  prefixIcon: Icons.lock_outlined,
                  isPassword: true,
                  validator: Validators.validatePassword,
                ).animate().fadeIn(delay: 450.ms).slideY(begin: 0.1),
                const SizedBox(height: 16),
                
                // Confirm Password Field
                CustomTextField(
                  controller: controller.resetConfirmPasswordController,
                  hintText: 'Confirm New Password'.tr,
                  prefixIcon: Icons.lock_outlined,
                  isPassword: true,
                  validator: (v) => Validators.validateConfirmPassword(
                    v, controller.resetNewPasswordController.text),
                ).animate().fadeIn(delay: 500.ms).slideY(begin: 0.1),
                const SizedBox(height: 32),
                
                // Submit Button
                Obx(() => CustomButton(
                  text: 'Reset Password'.tr,
                  isLoading: controller.isLoading.value,
                  onPressed: controller.resetPassword,
                )).animate().fadeIn(delay: 550.ms).slideY(begin: 0.1),
                const SizedBox(height: 24),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
