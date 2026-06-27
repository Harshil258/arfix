import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:get/get.dart';
import '../../../core/utils/validators.dart';
import '../../../core/widgets/custom_button.dart';
import '../../../core/widgets/custom_text_field.dart';
import '../controller.dart';

class SignupView extends GetView<AuthController> {
  const SignupView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(leading: const BackButton()),
      body: SafeArea(
        child: SingleChildScrollView(
          clipBehavior: Clip.none,
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Form(
            key: controller.signupFormKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 16),
                Text('Create Account'.tr, style: Theme.of(context).textTheme.displaySmall)
                    .animate().fadeIn().slideX(begin: -0.1),
                const SizedBox(height: 8),
                Text('Start earning rewards today'.tr,
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                    color: Theme.of(context).textTheme.bodySmall?.color,
                  )).animate().fadeIn(delay: 100.ms),
                const SizedBox(height: 40),
                CustomTextField(
                  controller: controller.signupNameController,
                  hintText: 'Full Name'.tr,
                  prefixIcon: Icons.person_outline,
                  validator: Validators.validateName,
                ).animate().fadeIn(delay: 200.ms).slideY(begin: 0.1),
                const SizedBox(height: 16),
                CustomTextField(
                  controller: controller.signupEmailController,
                  hintText: 'Email address'.tr,
                  prefixIcon: Icons.email_outlined,
                  keyboardType: TextInputType.emailAddress,
                  validator: Validators.validateEmail,
                ).animate().fadeIn(delay: 300.ms).slideY(begin: 0.1),
                const SizedBox(height: 16),
                CustomTextField(
                  controller: controller.signupMobileController,
                  hintText: 'Mobile Number'.tr,
                  prefixIcon: Icons.phone_outlined,
                  keyboardType: TextInputType.phone,
                  validator: Validators.validateMobile,
                ).animate().fadeIn(delay: 350.ms).slideY(begin: 0.1),
                const SizedBox(height: 16),
                CustomTextField(
                  controller: controller.signupPasswordController,
                  hintText: 'Password'.tr,
                  prefixIcon: Icons.lock_outlined,
                  isPassword: true,
                  validator: Validators.validatePassword,
                ).animate().fadeIn(delay: 400.ms).slideY(begin: 0.1),
                const SizedBox(height: 16),
                CustomTextField(
                  controller: controller.signupConfirmController,
                  hintText: 'Confirm Password'.tr,
                  prefixIcon: Icons.lock_outlined,
                  isPassword: true,
                  validator: (v) => Validators.validateConfirmPassword(
                    v, controller.signupPasswordController.text),
                ).animate().fadeIn(delay: 500.ms).slideY(begin: 0.1),
                const SizedBox(height: 32),
                Obx(() => CustomButton(
                  text: 'Create Account'.tr,
                  isLoading: controller.isLoading.value,
                  onPressed: controller.signup,
                )).animate().fadeIn(delay: 600.ms).slideY(begin: 0.1),
                const SizedBox(height: 24),
                Center(
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text('Already have an account? '.tr,
                        style: Theme.of(context).textTheme.bodyMedium),
                      GestureDetector(
                        onTap: () => Get.back(),
                        child: Text('Login'.tr,
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
