import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../../core/utils/validators.dart';
import '../../../core/widgets/custom_button.dart';
import '../../../core/widgets/custom_text_field.dart';
import '../controller.dart';

class ChangePasswordView extends GetView<ProfileController> {
  const ChangePasswordView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Change Password'.tr)),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Form(
          key: controller.passwordFormKey,
          child: Column(
            children: [
              CustomTextField(
                controller: controller.currentPasswordController,
                hintText: 'Current Password'.tr,
                prefixIcon: Icons.lock_outlined,
                isPassword: true,
                validator: (v) => Validators.validateRequired(v, 'Current password'.tr),
              ),
              const SizedBox(height: 16),
              CustomTextField(
                controller: controller.newPasswordController,
                hintText: 'New Password'.tr,
                prefixIcon: Icons.lock_outlined,
                isPassword: true,
                validator: Validators.validatePassword,
              ),
              const SizedBox(height: 16),
              CustomTextField(
                controller: controller.confirmNewPasswordController,
                hintText: 'Confirm New Password'.tr,
                prefixIcon: Icons.lock_outlined,
                isPassword: true,
                validator: (v) => Validators.validateConfirmPassword(
                  v, controller.newPasswordController.text),
              ),
              const SizedBox(height: 32),
              Obx(() => CustomButton(
                text: 'Change Password'.tr,
                isLoading: controller.isLoading.value,
                onPressed: controller.changePassword,
              )),
            ],
          ),
        ),
      ),
    );
  }
}
