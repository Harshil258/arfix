import 'package:get/get.dart' hide Response;
import '../../core/constants/api_constants.dart';
import '../../core/network/api_client.dart';

class WithdrawalProvider {
  final ApiClient _apiClient = Get.find<ApiClient>();

  Future<Map<String, dynamic>> createWithdrawal({required Map<String, dynamic> data}) async {
    final response = await _apiClient.post(ApiConstants.withdrawals, data: data);
    return response.data;
  }

  Future<Map<String, dynamic>> getWithdrawalStatus(String userId) async {
    final response = await _apiClient.get(ApiConstants.withdrawalStatus(userId));
    return response.data;
  }

  Future<Map<String, dynamic>> getWithdrawalHistory(String userId) async {
    final response = await _apiClient.get(ApiConstants.withdrawalHistory(userId));
    return response.data;
  }

  Future<Map<String, dynamic>> getMyWithdrawals({int page = 1, int limit = 10, String? status}) async {
    final params = <String, dynamic>{'page': page, 'limit': limit};
    if (status != null) params['status'] = status;
    final response = await _apiClient.get(ApiConstants.myWithdrawals, queryParameters: params);
    return response.data;
  }

  Future<Map<String, dynamic>> cancelWithdrawal(String withdrawalId) async {
    final response = await _apiClient.patch(ApiConstants.cancelWithdrawal(withdrawalId));
    return response.data;
  }
}
