import '../models/product_model.dart';
import '../models/reward_model.dart';
import '../providers/reward_provider.dart';

class RewardRepository {
  final _provider = RewardProvider();

  Future<({List<RewardModel> rewards, List<String> categories, PaginationModel pagination})> getRewards({
    int page = 1, int limit = 20, String? category,
  }) async {
    final data = await _provider.getRewards(page: page, limit: limit, category: category);
    final responseData = data['data'] ?? data;
    final rewards = (responseData['rewards'] as List? ?? [])
        .map((e) => RewardModel.fromJson(e)).toList();
    final categories = (responseData['categories'] as List? ?? [])
        .map((e) => e.toString()).toList();
    final pagination = PaginationModel.fromJson(responseData['pagination'] ?? {});
    return (rewards: rewards, categories: categories, pagination: pagination);
  }

  Future<({RedemptionModel redemption, int newBalance})> redeemReward({
    required String rewardId, String? upiId,
  }) async {
    final data = await _provider.redeemReward(rewardId: rewardId, upiId: upiId);
    final responseData = data['data'] ?? data;
    return (
      redemption: RedemptionModel.fromJson(responseData['redemption'] ?? {}),
      newBalance: (responseData['newBalance'] ?? 0) as int,
    );
  }

  Future<({List<RedemptionModel> redemptions, PaginationModel pagination})> getMyRedemptions({
    int page = 1, int limit = 20,
  }) async {
    final data = await _provider.getMyRedemptions(page: page, limit: limit);
    final responseData = data['data'] ?? data;
    final redemptions = (responseData['redemptions'] as List? ?? [])
        .map((e) => RedemptionModel.fromJson(e)).toList();
    final pagination = PaginationModel.fromJson(responseData['pagination'] ?? {});
    return (redemptions: redemptions, pagination: pagination);
  }
}
