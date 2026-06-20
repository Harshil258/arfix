import 'package:get/get.dart';

class Validators {
  Validators._();

  static String? validateEmail(String? value) {
    if (value == null || value.isEmpty) return 'Email is required'.tr;
    final regex = RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
    if (!regex.hasMatch(value)) return 'Enter a valid email'.tr;
    return null;
  }

  static String? validatePassword(String? value) {
    if (value == null || value.isEmpty) return 'Password is required'.tr;
    if (value.length < 8) return 'Minimum 8 characters'.tr;
    if (!value.contains(RegExp(r'[A-Z]'))) return 'At least one uppercase letter'.tr;
    if (!value.contains(RegExp(r'[a-z]'))) return 'At least one lowercase letter'.tr;
    if (!value.contains(RegExp(r'[0-9]'))) return 'At least one digit'.tr;
    return null;
  }

  static String? validateConfirmPassword(String? value, String password) {
    if (value == null || value.isEmpty) return 'Confirm your password'.tr;
    if (value != password) return 'Passwords do not match'.tr;
    return null;
  }

  static String? validateName(String? value) {
    if (value == null || value.isEmpty) return 'Name is required'.tr;
    if (value.length < 2) return 'At least 2 characters'.tr;
    if (value.length > 50) return 'Maximum 50 characters'.tr;
    return null;
  }

  static String? validateRequired(String? value, String fieldName) {
    if (value == null || value.trim().isEmpty) return '${fieldName.tr} ${'is required'.tr}';
    return null;
  }

  static String? validateSubject(String? value) {
    if (value == null || value.isEmpty) return 'Subject is required'.tr;
    if (value.length > 200) return 'Maximum 200 characters'.tr;
    return null;
  }

  static String? validateMessage(String? value) {
    if (value == null || value.isEmpty) return 'Message is required'.tr;
    if (value.length > 10000) return 'Maximum 10000 characters'.tr;
    return null;
  }

  static String? validateMobile(String? value) {
    if (value == null || value.trim().isEmpty) return 'Mobile number is required'.tr;
    final regex = RegExp(r'^\+?[\d\s-]{7,20}$');
    if (!regex.hasMatch(value.trim())) return 'Enter a valid mobile number'.tr;
    return null;
  }
}
