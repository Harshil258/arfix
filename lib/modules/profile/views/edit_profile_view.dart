import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../../core/utils/validators.dart';
import '../../../core/widgets/custom_button.dart';
import '../../../core/widgets/custom_text_field.dart';
import '../controller.dart';

class EditProfileView extends GetView<ProfileController> {
  const EditProfileView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Edit Profile'.tr)),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Form(
          key: controller.editFormKey,
          child: Column(
            children: [
              CustomTextField(
                controller: controller.nameController,
                hintText: 'Full Name'.tr,
                prefixIcon: Icons.person_outline,
                validator: Validators.validateName,
              ),
              const SizedBox(height: 16),
              CustomTextField(
                controller: controller.mobileController,
                hintText: 'Mobile Number'.tr,
                prefixIcon: Icons.phone_outlined,
                keyboardType: TextInputType.phone,
                validator: Validators.validateMobile,
              ),
              const SizedBox(height: 32),
              Obx(() => CustomButton(
                text: 'Save Changes'.tr,
                isLoading: controller.isLoading.value,
                onPressed: controller.updateProfile,
              )),
            ],
          ),
        ),
      ),
    );
  }
}
