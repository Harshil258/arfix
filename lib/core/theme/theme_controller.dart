import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';

import '../constants/app_constants.dart';

class ThemeController extends GetxController {
  final _storage = GetStorage();
  final _themeMode = ThemeMode.dark.obs;

  ThemeMode get themeMode => _themeMode.value;
  bool get isDarkMode => _themeMode.value == ThemeMode.dark;

  @override
  void onInit() {
    super.onInit();
    _loadTheme();
  }

  void _loadTheme() {
    final savedTheme = _storage.read(AppConstants.themeKey);
    if (savedTheme != null) {
      _themeMode.value =
          savedTheme == 'dark' ? ThemeMode.dark : ThemeMode.light;
    }
  }

  void toggleTheme() {
    _themeMode.value =
        isDarkMode ? ThemeMode.light : ThemeMode.dark;
    _storage.write(
      AppConstants.themeKey,
      isDarkMode ? 'dark' : 'light',
    );
    Get.changeThemeMode(_themeMode.value);
  }

  void setTheme(ThemeMode mode) {
    _themeMode.value = mode;
    _storage.write(
      AppConstants.themeKey,
      mode == ThemeMode.dark ? 'dark' : 'light',
    );
    Get.changeThemeMode(mode);
  }
}
