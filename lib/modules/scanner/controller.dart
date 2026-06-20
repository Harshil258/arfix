import 'dart:convert';
import 'package:get/get.dart';
import '../../core/network/api_exceptions.dart';
import '../../core/storage/storage_service.dart';
import '../../core/utils/helpers.dart';
import '../../data/models/coupon_model.dart';
import '../../data/repositories/coupon_repository.dart';

class ScannerController extends GetxController {
  final _couponRepo = CouponRepository();
  final _storage = Get.find<StorageService>();

  final isProcessing = false.obs;
  final scanResult = Rxn<ScanResultModel>();
  final hasScanned = false.obs;

  Future<void> processScan(String rawValue) async {
    if (isProcessing.value || hasScanned.value) return;

    isProcessing.value = true;
    hasScanned.value = true;

    try {
      // Parse QR data — expecting JSON with {id, code}
      Map<String, dynamic> qrData;
      try {
        qrData = jsonDecode(rawValue);
      } catch (_) {
        // Fallback: treat entire value as code
        Helpers.showSnackbar(title: 'Invalid QR', message: 'QR code format not recognized', isError: true);
        isProcessing.value = false;
        _resetAfterDelay();
        return;
      }

      final code = (qrData['code'] ?? qrData['couponCode'] ?? '').toString().trim();
      final id = (qrData['id'] ?? qrData['couponId'] ?? '').toString().trim();

      if (code.isEmpty || id.isEmpty) {
        Helpers.showSnackbar(title: 'Invalid QR', message: 'Missing coupon data', isError: true);
        isProcessing.value = false;
        _resetAfterDelay();
        return;
      }

      // Get current user ID
      final userData = _storage.getUserData();
      final userId = userData?['id'] ?? '';

      if (userId.isEmpty) {
        Helpers.showSnackbar(title: 'Error', message: 'User not found. Please re-login.', isError: true);
        isProcessing.value = false;
        _resetAfterDelay();
        return;
      }

      // Call API
      final result = await _couponRepo.scanCoupon(code: code, id: id, userId: userId);
      scanResult.value = result;

      // Save to local history
      await _storage.addScanToHistory({
        'code': code,
        'coins': result.coupon.price,
        'date': DateTime.now().toIso8601String(),
        'status': 'SUCCESS',
      });

      // Update cached user coins
      if (userData != null) {
        userData['coins'] = result.newBalance;
        await _storage.saveUserData(userData);
      }

      Helpers.showSnackbar(
        title: '🎉 Congratulations!',
        message: 'You earned ${result.coupon.price} coins!',
        isSuccess: true,
      );
    } on ApiException catch (e) {
      Helpers.showSnackbar(title: 'Scan Failed', message: e.message, isError: true);
      _resetAfterDelay();
    } catch (e) {
      Helpers.showSnackbar(title: 'Error', message: 'Something went wrong', isError: true);
      _resetAfterDelay();
    } finally {
      isProcessing.value = false;
    }
  }

  void _resetAfterDelay() {
    Future.delayed(const Duration(seconds: 3), () {
      hasScanned.value = false;
      scanResult.value = null;
    });
  }

  void resetScanner() {
    hasScanned.value = false;
    scanResult.value = null;
  }
}
