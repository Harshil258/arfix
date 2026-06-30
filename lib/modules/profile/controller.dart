import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../app/routes/app_routes.dart';
import '../../core/constants/api_constants.dart';
import '../../core/network/api_client.dart';
import '../../core/network/api_exceptions.dart';
import '../../core/storage/storage_service.dart';
import '../../core/utils/helpers.dart';
import '../../data/models/user_model.dart';
import '../../data/repositories/auth_repository.dart';

class ProfileController extends GetxController {
  final _repo = AuthRepository();
  final _storage = Get.find<StorageService>();
  final _apiClient = Get.find<ApiClient>();

  final user = Rxn<UserModel>();
  final isLoading = false.obs;
  final nameController = TextEditingController();
  final mobileController = TextEditingController();
  final editFormKey = GlobalKey<FormState>();
  
  // Social Links
  final socialLinks = <String, String>{}.obs;
  final isLoadingSocialLinks = false.obs;

  // Language Support
  final currentLanguage = 'English'.obs;

  // Change password
  final currentPasswordController = TextEditingController();
  final newPasswordController = TextEditingController();
  final confirmNewPasswordController = TextEditingController();
  final passwordFormKey = GlobalKey<FormState>();

  // Delete account
  final deletePasswordController = TextEditingController();

  @override
  void onInit() {
    super.onInit();
    _loadUser();
    
    // Load current language
    final lang = _storage.read<String>('language_code') ?? 'en';
    currentLanguage.value = lang == 'hi' ? 'Hindi' : 'English';

    // Populate fallback social links
    socialLinks.value = {
      'facebookLink': 'https://facebook.com',
      'instagramLink': 'https://instagram.com',
      'youtubeLink': 'https://youtube.com',
    };

    fetchSocialLinks();
  }

  Future<void> fetchSocialLinks() async {
    isLoadingSocialLinks.value = true;
    try {
      final response = await _apiClient.get(ApiConstants.getSocialLinks);
      if (response.data != null && response.data['success'] == true) {
        final data = response.data['data'];
        if (data is Map) {
          socialLinks.clear();
          data.forEach((key, value) {
            if (value != null && value.toString().isNotEmpty) {
              socialLinks[key.toString()] = value.toString();
            }
          });
        }
      }
    } catch (e) {
      debugPrint('Error fetching social links: $e');
    } finally {
      isLoadingSocialLinks.value = false;
    }
  }

  void changeLanguage(String lang) {
    currentLanguage.value = lang;
    if (lang == 'Hindi') {
      _storage.write('language_code', 'hi');
      _storage.write('country_code', 'IN');
      Get.updateLocale(const Locale('hi', 'IN'));
    } else {
      _storage.write('language_code', 'en');
      _storage.write('country_code', 'US');
      Get.updateLocale(const Locale('en', 'US'));
    }
  }

  void _loadUser() {
    final data = _storage.getUserData();
    if (data != null) {
      user.value = UserModel.fromJson(data);
      nameController.text = user.value?.name ?? '';
      mobileController.text = user.value?.mobile ?? '';
    }
    _fetchUser();
  }

  Future<void> _fetchUser() async {
    try {
      final freshUser = await _repo.getMe();
      user.value = freshUser;
      nameController.text = freshUser.name;
      mobileController.text = freshUser.mobile ?? '';
      await _storage.saveUserData(freshUser.toJson());
    } catch (_) {}
  }

  Future<void> updateProfile() async {
    if (!editFormKey.currentState!.validate()) return;
    isLoading.value = true;
    try {
      final updated = await _repo.updateProfile(
        name: nameController.text.trim(),
        mobile: mobileController.text.trim(),
      );
      user.value = updated;
      await _storage.saveUserData(updated.toJson());
      Helpers.showSnackbar(title: 'Success', message: 'Profile updated', isSuccess: true);
      Get.back();
    } on ApiException catch (e) {
      Helpers.showSnackbar(title: 'Error', message: e.message, isError: true);
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> changePassword() async {
    if (!passwordFormKey.currentState!.validate()) return;
    isLoading.value = true;
    try {
      await _repo.changePassword(
        currentPassword: currentPasswordController.text,
        newPassword: newPasswordController.text,
        confirmNewPassword: confirmNewPasswordController.text,
      );
      Helpers.showSnackbar(title: 'Success', message: 'Password changed', isSuccess: true);
      currentPasswordController.clear();
      newPasswordController.clear();
      confirmNewPasswordController.clear();
      Get.back();
    } on ApiException catch (e) {
      Helpers.showSnackbar(title: 'Error', message: e.message, isError: true);
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> deleteAccount(String password) async {
    isLoading.value = true;
    try {
      await _repo.deleteAccount(password: password);
      Helpers.showSnackbar(title: 'Account Deleted', message: 'Your account has been deleted', isSuccess: true);
      await _storage.clearAll();
      Get.offAllNamed(AppRoutes.login);
    } on ApiException catch (e) {
      Helpers.showSnackbar(title: 'Error', message: e.message, isError: true);
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> logout() async {
    await _storage.clearAll();
    Get.offAllNamed(AppRoutes.login);
  }


}
