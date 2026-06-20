import 'package:get/get.dart' hide Response;
import '../../core/constants/api_constants.dart';
import '../../core/network/api_client.dart';

class NotificationProvider {
  final ApiClient _apiClient = Get.find<ApiClient>();

  Future<Map<String, dynamic>> getNotifications({int page = 1, int limit = 20}) async {
    final response = await _apiClient.get(ApiConstants.notifications,
      queryParameters: {'page': page, 'limit': limit});
    return response.data;
  }

  Future<Map<String, dynamic>> markAsRead(String id) async {
    final response = await _apiClient.patch(ApiConstants.markNotificationRead(id));
    return response.data;
  }

  Future<Map<String, dynamic>> registerFcmToken({required String token, required String platform}) async {
    final response = await _apiClient.post(ApiConstants.notificationRegister,
      data: {'fcmToken': token, 'platform': platform});
    return response.data;
  }
}
