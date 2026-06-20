import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../app/routes/app_routes.dart';
import '../../core/network/api_exceptions.dart';
import '../../core/storage/storage_service.dart';
import '../../core/utils/helpers.dart';
import '../../data/repositories/auth_repository.dart';

class AuthController extends GetxController {
  final _repo = AuthRepository();
  final _storage = Get.find<StorageService>();

  // Login
  final loginEmailController = TextEditingController();
  final loginPasswordController = TextEditingController();
  final loginFormKey = GlobalKey<FormState>();

  // Signup
  final signupNameController = TextEditingController();
  final signupEmailController = TextEditingController();
  final signupMobileController = TextEditingController();
  final signupPasswordController = TextEditingController();
  final signupConfirmController = TextEditingController();
  final signupFormKey = GlobalKey<FormState>();

  // Forgot Password
  final forgotPasswordEmailController = TextEditingController();
  final forgotPasswordFormKey = GlobalKey<FormState>();

  // OTP Verification
  final otpController = TextEditingController();
  final otpFormKey = GlobalKey<FormState>();
  final verificationEmail = ''.obs;
  final isForgotPasswordFlow = false.obs;

  // Reset Password
  final resetTokenController = TextEditingController();
  final resetNewPasswordController = TextEditingController();
  final resetConfirmPasswordController = TextEditingController();
  final resetFormKey = GlobalKey<FormState>();

  final isLoading = false.obs;

  Future<void> login() async {
    if (!loginFormKey.currentState!.validate()) return;
    isLoading.value = true;
    try {
      final result = await _repo.login(
        email: loginEmailController.text.trim(),
        password: loginPasswordController.text,
      );
      await _storage.saveToken(result.token);
      await _storage.saveUserData(result.user.toJson());
      Helpers.showSnackbar(title: 'Welcome back!', message: 'Login successful', isSuccess: true);
      Get.offAllNamed(AppRoutes.navigation);
    } on ApiException catch (e) {
      Helpers.showSnackbar(title: 'Login Failed', message: e.message, isError: true);
    } catch (e) {
      Helpers.showSnackbar(title: 'Error', message: 'Something went wrong', isError: true);
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> signup() async {
    if (!signupFormKey.currentState!.validate()) return;
    isLoading.value = true;
    try {
      await _repo.signup(
        name: signupNameController.text.trim(),
        email: signupEmailController.text.trim(),
        mobile: signupMobileController.text.trim(),
        password: signupPasswordController.text,
        confirmPassword: signupConfirmController.text,
      );
      
      verificationEmail.value = signupEmailController.text.trim();
      isForgotPasswordFlow.value = false;
      otpController.clear();

      Helpers.showSnackbar(
        title: 'Success'.tr, 
        message: 'Account created. Please verify your email using the OTP sent.'.tr, 
        isSuccess: true
      );
      Get.toNamed(AppRoutes.verifyOtp);
    } on ApiException catch (e) {
      Helpers.showSnackbar(title: 'Signup Failed'.tr, message: e.message, isError: true);
    } catch (e) {
      Helpers.showSnackbar(title: 'Error'.tr, message: 'Something went wrong'.tr, isError: true);
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> forgotPassword() async {
    if (!forgotPasswordFormKey.currentState!.validate()) return;
    isLoading.value = true;
    try {
      await _repo.forgotPassword(email: forgotPasswordEmailController.text.trim());
      
      verificationEmail.value = forgotPasswordEmailController.text.trim();
      isForgotPasswordFlow.value = true;
      otpController.clear();

      Helpers.showSnackbar(
        title: 'Success'.tr,
        message: 'Password reset OTP sent to your email'.tr,
        isSuccess: true,
      );
      Get.toNamed(AppRoutes.verifyOtp);
    } on ApiException catch (e) {
      Helpers.showSnackbar(title: 'Error'.tr, message: e.message, isError: true);
    } catch (e) {
      Helpers.showSnackbar(title: 'Error'.tr, message: 'Something went wrong'.tr, isError: true);
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> resetPassword() async {
    if (!resetFormKey.currentState!.validate()) return;
    isLoading.value = true;
    try {
      await _repo.resetPassword(
        token: resetTokenController.text.trim(),
        newPassword: resetNewPasswordController.text,
        confirmNewPassword: resetConfirmPasswordController.text,
      );
      Helpers.showSnackbar(
        title: 'Success'.tr,
        message: 'Password reset successfully. Please login with your new password.'.tr,
        isSuccess: true,
      );
      
      // Clear fields and go back to login screen
      forgotPasswordEmailController.clear();
      resetTokenController.clear();
      resetNewPasswordController.clear();
      resetConfirmPasswordController.clear();
      
      Get.offAllNamed(AppRoutes.login);
    } on ApiException catch (e) {
      Helpers.showSnackbar(title: 'Error'.tr, message: e.message, isError: true);
    } catch (e) {
      Helpers.showSnackbar(title: 'Error'.tr, message: 'Something went wrong'.tr, isError: true);
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> verifyOtp() async {
    if (!otpFormKey.currentState!.validate()) return;
    isLoading.value = true;
    try {
      final result = await _repo.verifyOtp(
        email: verificationEmail.value,
        otp: otpController.text.trim(),
      );
      
      if (isForgotPasswordFlow.value) {
        // Forgot Password flow -> Go to reset password
        if (result.resetToken != null && result.resetToken!.isNotEmpty) {
          resetTokenController.text = result.resetToken!;
        } else {
          resetTokenController.clear();
        }
        resetNewPasswordController.clear();
        resetConfirmPasswordController.clear();
        
        Helpers.showSnackbar(
          title: 'Success'.tr,
          message: 'OTP verified successfully.'.tr,
          isSuccess: true,
        );
        Get.toNamed(AppRoutes.resetPassword);
      } else {
        // Signup flow -> Save token and login user
        if (result.token != null && result.token!.isNotEmpty) {
          await _storage.saveToken(result.token!);
        }
        if (result.user != null) {
          await _storage.saveUserData(result.user!.toJson());
        }
        Helpers.showSnackbar(
          title: 'Welcome!'.tr,
          message: 'Email verified and logged in successfully.'.tr,
          isSuccess: true,
        );
        Get.offAllNamed(AppRoutes.navigation);
      }
    } on ApiException catch (e) {
      Helpers.showSnackbar(title: 'Verification Failed'.tr, message: e.message, isError: true);
    } catch (e) {
      Helpers.showSnackbar(title: 'Error'.tr, message: 'Something went wrong'.tr, isError: true);
    } finally {
      isLoading.value = false;
    }
  }

  @override
  void onClose() {
    loginEmailController.dispose();
    loginPasswordController.dispose();
    signupNameController.dispose();
    signupEmailController.dispose();
    signupMobileController.dispose();
    signupPasswordController.dispose();
    signupConfirmController.dispose();
    forgotPasswordEmailController.dispose();
    otpController.dispose();
    resetTokenController.dispose();
    resetNewPasswordController.dispose();
    resetConfirmPasswordController.dispose();
    super.onClose();
  }
}
