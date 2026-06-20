import 'package:get/get.dart' hide Response;
import '../../core/constants/api_constants.dart';
import '../../core/network/api_client.dart';

class SupportProvider {
  final ApiClient _apiClient = Get.find<ApiClient>();

  Future<Map<String, dynamic>> submitMessage({
    required String subject, required String message,
  }) async {
    final response = await _apiClient.post(ApiConstants.supportMessages, data: {
      'subject': subject, 'message': message,
    });
    return response.data;
  }

  Future<Map<String, dynamic>> getMyMessages({
    int page = 1, int limit = 10, String? status,
  }) async {
    final params = <String, dynamic>{'page': page, 'limit': limit, 'sortBy': 'createdAt', 'order': 'desc'};
    if (status != null) params['status'] = status;
    final response = await _apiClient.get(ApiConstants.mySupportMessages, queryParameters: params);
    return response.data;
  }

  Future<Map<String, dynamic>> getMessageDetail(String messageId) async {
    final response = await _apiClient.get('${ApiConstants.mySupportMessages}/$messageId');
    return response.data;
  }
}
