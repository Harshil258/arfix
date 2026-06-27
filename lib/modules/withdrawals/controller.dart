import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../core/network/api_exceptions.dart';
import '../../core/storage/storage_service.dart';
import '../../core/utils/helpers.dart';
import '../../data/models/withdrawal_model.dart';
import '../../data/repositories/withdrawal_repository.dart';
import '../../data/repositories/auth_repository.dart';
import '../home/controller.dart';
import '../wallet/controller.dart';

class WithdrawalController extends GetxController {
  final _withdrawalRepo = WithdrawalRepository();
  final _authRepo = AuthRepository();
  final _storage = Get.find<StorageService>();

  final formKey = GlobalKey<FormState>();
  final amountCtrl = TextEditingController();
  final upiCtrl = TextEditingController();

  final isLoading = false.obs;
  final isSubmitting = false.obs;
  final history = <WithdrawalModel>[].obs;
  final userCoins = 0.obs;

  @override
  void onInit() {
    super.onInit();
    _loadUserCoins();
    loadHistory();
  }

  void _loadUserCoins() {
    final userData = _storage.getUserData();
    userCoins.value = userData?['coins'] ?? 0;
    _fetchFreshUserCoins();
  }

  Future<void> _fetchFreshUserCoins() async {
    try {
      final user = await _authRepo.getMe();
      userCoins.value = user.coins;
      await _storage.saveUserData(user.toJson());
    } catch (_) {}
  }

  Future<void> loadHistory() async {
    isLoading.value = true;
    try {
      final result = await _withdrawalRepo.getMyWithdrawals(page: 1, limit: 30);
      history.value = result.withdrawals;
    } catch (_) {}
    isLoading.value = false;
  }

  Future<void> requestWithdrawal() async {
    if (!formKey.currentState!.validate()) return;

    final amountStr = amountCtrl.text.trim();
    final amount = int.tryParse(amountStr);

    if (amount == null || amount < 100) {
      Helpers.showSnackbar(
        title: 'Invalid Amount',
        message: 'Minimum withdrawal is 100 coins (₹100).',
        isError: true,
      );
      return;
    }

    if (amount > userCoins.value) {
      Helpers.showSnackbar(
        title: 'Insufficient Balance',
        message: 'You only have ${userCoins.value} coins.',
        isError: true,
      );
      return;
    }

    isSubmitting.value = true;
    try {
      final payload = {
        'amount': amount,
        'upiId': upiCtrl.text.trim(),
      };

      await _withdrawalRepo.createWithdrawal(data: payload);
      
      Helpers.showSnackbar(
        title: '🎉 Request Submitted!',
        message: 'Your withdrawal request for $amount coins is being processed.',
        isSuccess: true,
      );

      // Clear fields
      amountCtrl.clear();
      upiCtrl.clear();
      
      // Update coins locally & refresh other controllers
      await _fetchFreshUserCoins();
      if (Get.isRegistered<HomeController>()) {
        Get.find<HomeController>().refreshUser();
      }
      if (Get.isRegistered<WalletController>()) {
        Get.find<WalletController>().loadData();
      }

      loadHistory();
    } on ApiException catch (e) {
      Helpers.showSnackbar(title: 'Request Failed', message: e.message, isError: true);
    } catch (e) {
      Helpers.showSnackbar(title: 'Error', message: 'Failed to submit request', isError: true);
    } finally {
      isSubmitting.value = false;
    }
  }

  Future<void> cancelWithdrawal(String withdrawalId) async {
    isLoading.value = true;
    try {
      await _withdrawalRepo.cancelWithdrawal(withdrawalId);
      Helpers.showSnackbar(
        title: 'Cancelled',
        message: 'Withdrawal request cancelled successfully.',
        isSuccess: true,
      );
      await _fetchFreshUserCoins();
      if (Get.isRegistered<HomeController>()) {
        Get.find<HomeController>().refreshUser();
      }
      if (Get.isRegistered<WalletController>()) {
        Get.find<WalletController>().loadData();
      }
      loadHistory();
    } on ApiException catch (e) {
      Helpers.showSnackbar(title: 'Failed', message: e.message, isError: true);
    } catch (_) {
      Helpers.showSnackbar(title: 'Error', message: 'Failed to cancel request', isError: true);
    } finally {
      isLoading.value = false;
    }
  }


}
