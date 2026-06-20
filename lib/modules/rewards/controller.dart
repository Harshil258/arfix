import 'package:get/get.dart';
import '../../core/network/api_exceptions.dart';
import '../../core/storage/storage_service.dart';
import '../../core/utils/helpers.dart';
import '../../data/models/reward_model.dart';
import '../../data/models/product_model.dart';
import '../../data/repositories/reward_repository.dart';

class RewardsController extends GetxController {
  final _repo = RewardRepository();
  final _storage = Get.find<StorageService>();

  final rewards = <RewardModel>[].obs;
  final redemptions = <RedemptionModel>[].obs;
  final categories = <String>[].obs;
  final selectedCategory = RxnString();
  final isLoading = true.obs;
  final isRedeeming = false.obs;
  final pagination = Rxn<PaginationModel>();

  int get userCoins {
    final data = _storage.getUserData();
    return data?['coins'] ?? 0;
  }

  @override
  void onInit() {
    super.onInit();
    loadRewards();
  }

  Future<void> loadRewards({bool refresh = false}) async {
    if (refresh) isLoading.value = true;
    try {
      final result = await _repo.getRewards(
        page: 1, limit: 20,
        category: selectedCategory.value,
      );
      rewards.value = result.rewards;
      categories.value = result.categories;
      pagination.value = result.pagination;
    } on ApiException catch (e) {
      Helpers.showSnackbar(title: 'Error', message: e.message, isError: true);
    } catch (_) {
      Helpers.showSnackbar(title: 'Error', message: 'Failed to load rewards', isError: true);
    } finally {
      isLoading.value = false;
    }
  }

  void filterByCategory(String? category) {
    selectedCategory.value = category;
    isLoading.value = true;
    loadRewards();
  }

  Future<void> redeemReward(String rewardId, {String? upiId}) async {
    isRedeeming.value = true;
    try {
      final result = await _repo.redeemReward(rewardId: rewardId, upiId: upiId);
      // Update cached user coins
      final userData = _storage.getUserData();
      if (userData != null) {
        userData['coins'] = result.newBalance;
        await _storage.saveUserData(userData);
      }
      Helpers.showSnackbar(
        title: '🎉 Reward Redeemed!',
        message: 'Your ${result.redemption.rewardTitle} is being processed',
        isSuccess: true,
      );
      loadRewards(refresh: true);
    } on ApiException catch (e) {
      Helpers.showSnackbar(title: 'Error', message: e.message, isError: true);
    } finally {
      isRedeeming.value = false;
    }
  }

  Future<void> loadRedemptions() async {
    try {
      final result = await _repo.getMyRedemptions();
      redemptions.value = result.redemptions;
    } catch (_) {}
  }
}
