import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:get/get.dart';
import '../../../core/widgets/app_logo.dart';
import '../../../core/widgets/custom_button.dart';
import '../../../core/widgets/custom_text_field.dart';
import '../controller.dart';

class VerifyOtpView extends GetView<AuthController> {
  const VerifyOtpView({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text('Verification'.tr),
        leading: const BackButton(),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Form(
            key: controller.otpFormKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 24),
                // Premium animated Logo
                const AppLogo(size: 72, showBackground: true)
                    .animate().scale(duration: 500.ms, curve: Curves.elasticOut),
                const SizedBox(height: 24),
                
                // Title
                Text(
                  'Enter Code'.tr, 
                  style: theme.textTheme.displaySmall,
                ).animate().fadeIn(delay: 200.ms).slideX(begin: -0.1),
                const SizedBox(height: 8),
                
                // Subtitle showing email dynamically
                Obx(() => Text(
                  '${'We\'ve sent a verification code to'.tr} ${controller.verificationEmail.value}',
                  style: theme.textTheme.bodyLarge?.copyWith(
                    color: theme.textTheme.bodySmall?.color,
                  ),
                )).animate().fadeIn(delay: 300.ms),
                const SizedBox(height: 32),
                
                // OTP Input Field
                CustomTextField(
                  controller: controller.otpController,
                  hintText: 'Enter OTP Code'.tr,
                  prefixIcon: Icons.security_outlined,
                  keyboardType: TextInputType.text,
                  validator: (v) {
                    if (v == null || v.trim().isEmpty) {
                      return 'OTP code is required'.tr;
                    }
                    if (v.trim().length < 4 || v.trim().length > 8) {
                      return 'OTP must be between 4 and 8 characters'.tr;
                    }
                    return null;
                  },
                ).animate().fadeIn(delay: 400.ms).slideY(begin: 0.1),
                const SizedBox(height: 32),
                
                // Verify Button
                Obx(() => CustomButton(
                  text: 'Verify Code'.tr,
                  isLoading: controller.isLoading.value,
                  onPressed: controller.verifyOtp,
                )).animate().fadeIn(delay: 500.ms).slideY(begin: 0.1),
                const SizedBox(height: 24),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
