import 'package:get/get.dart' hide Response;
import '../../core/constants/api_constants.dart';
import '../../core/network/api_client.dart';

class RewardProvider {
  final ApiClient _apiClient = Get.find<ApiClient>();

  Future<Map<String, dynamic>> getRewards({int page = 1, int limit = 20, String? category}) async {
    final params = <String, dynamic>{'page': page, 'limit': limit};
    if (category != null) params['category'] = category;
    final response = await _apiClient.get(ApiConstants.rewards, queryParameters: params);
    return response.data;
  }

  Future<Map<String, dynamic>> redeemReward({required String rewardId, String? upiId}) async {
    final data = <String, dynamic>{};
    if (upiId != null) data['upiId'] = upiId;
    final response = await _apiClient.post(ApiConstants.redeemReward(rewardId), data: data);
    return response.data;
  }

  Future<Map<String, dynamic>> getMyRedemptions({int page = 1, int limit = 20}) async {
    final response = await _apiClient.get(ApiConstants.rewardRedemptions,
      queryParameters: {'page': page, 'limit': limit});
    return response.data;
  }
}
