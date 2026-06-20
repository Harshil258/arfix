import 'package:get/get.dart' hide Response;
import '../../core/constants/api_constants.dart';
import '../../core/network/api_client.dart';

class HomeProvider {
  final ApiClient _apiClient = Get.find<ApiClient>();

  Future<Map<String, dynamic>> getBanners() async {
    final response = await _apiClient.get(ApiConstants.banners);
    return response.data;
  }

  Future<Map<String, dynamic>> getCampaigns() async {
    final response = await _apiClient.get(ApiConstants.campaigns);
    return response.data;
  }

  Future<Map<String, dynamic>> getConfig() async {
    final response = await _apiClient.get(ApiConstants.config);
    return response.data;
  }

  Future<Map<String, dynamic>> getLeaderboard({String period = 'WEEKLY'}) async {
    final response = await _apiClient.get(ApiConstants.leaderboard,
      queryParameters: {'period': period});
    return response.data;
  }

  Future<Map<String, dynamic>> getScanHistory({int page = 1, int limit = 20}) async {
    final response = await _apiClient.get(ApiConstants.couponHistory,
      queryParameters: {'page': page, 'limit': limit});
    return response.data;
  }
}
