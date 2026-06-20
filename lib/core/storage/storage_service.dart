import 'dart:developer' as dev;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';

import '../constants/app_constants.dart';

class StorageService extends GetxService {
  late final GetStorage _box;
  FlutterSecureStorage? _secureStorage;
  bool _secureStorageAvailable = false;

  @override
  void onInit() {
    super.onInit();
    _box = GetStorage();
    _initSecureStorage();
  }

  void _initSecureStorage() {
    try {
      _secureStorage = const FlutterSecureStorage(
        aOptions: AndroidOptions(encryptedSharedPreferences: true),
        iOptions: IOSOptions(accessibility: KeychainAccessibility.first_unlock),
      );
      _secureStorageAvailable = true;
    } catch (e) {
      dev.log('SecureStorage init failed, using GetStorage fallback: $e');
      _secureStorageAvailable = false;
    }
  }

  // ─── Secure Token Storage (with GetStorage fallback) ───
  Future<void> saveToken(String token) async {
    // Always save to GetStorage as backup
    await _box.write(AppConstants.tokenKey, token);
    if (_secureStorageAvailable && _secureStorage != null) {
      try {
        await _secureStorage!
            .write(key: AppConstants.tokenKey, value: token)
            .timeout(const Duration(seconds: 3));
      } catch (e) {
        dev.log('SecureStorage write failed: $e');
      }
    }
  }

  Future<String?> getToken() async {
    try {
      // Try secure storage first with timeout, fallback to GetStorage
      if (_secureStorageAvailable && _secureStorage != null) {
        try {
          final token = await _secureStorage!
              .read(key: AppConstants.tokenKey)
              .timeout(const Duration(seconds: 2));
          if (token != null && token.isNotEmpty) return token;
        } catch (e) {
          dev.log('SecureStorage read failed, using GetStorage: $e');
        }
      }
      return _box.read<String>(AppConstants.tokenKey);
    } catch (e) {
      dev.log('getToken failed entirely: $e');
      return null;
    }
  }

  Future<void> deleteToken() async {
    await _box.remove(AppConstants.tokenKey);
    if (_secureStorageAvailable && _secureStorage != null) {
      try {
        await _secureStorage!
            .delete(key: AppConstants.tokenKey)
            .timeout(const Duration(seconds: 3));
      } catch (_) {}
    }
  }

  // ─── General Storage ───
  Future<void> write(String key, dynamic value) async {
    await _box.write(key, value);
  }

  T? read<T>(String key) {
    return _box.read<T>(key);
  }

  Future<void> remove(String key) async {
    await _box.remove(key);
  }

  bool hasData(String key) {
    return _box.hasData(key);
  }

  // ─── User Data ───
  Future<void> saveUserData(Map<String, dynamic> userData) async {
    await _box.write(AppConstants.userKey, userData);
  }

  Map<String, dynamic>? getUserData() {
    final data = _box.read(AppConstants.userKey);
    if (data != null) {
      return Map<String, dynamic>.from(data);
    }
    return null;
  }

  Future<void> clearUserData() async {
    await _box.remove(AppConstants.userKey);
  }

  // ─── Onboarding ───
  bool get isOnboardingShown =>
      _box.read(AppConstants.onboardingKey) ?? false;

  Future<void> setOnboardingShown() async {
    await _box.write(AppConstants.onboardingKey, true);
  }

  // ─── Scan History (local) ───
  List<Map<String, dynamic>> getScanHistory() {
    final data = _box.read(AppConstants.scanHistoryKey);
    if (data != null) {
      return List<Map<String, dynamic>>.from(
        (data as List).map((e) => Map<String, dynamic>.from(e)),
      );
    }
    return [];
  }

  Future<void> addScanToHistory(Map<String, dynamic> scan) async {
    final history = getScanHistory();
    history.insert(0, scan);
    if (history.length > 100) {
      history.removeRange(100, history.length);
    }
    await _box.write(AppConstants.scanHistoryKey, history);
  }

  // ─── Clear All ───
  Future<void> clearAll() async {
    if (_secureStorageAvailable && _secureStorage != null) {
      try {
        await _secureStorage!.deleteAll().timeout(const Duration(seconds: 3));
      } catch (_) {}
    }
    await _box.erase();
  }
}
