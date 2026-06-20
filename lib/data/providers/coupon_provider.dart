import 'package:get/get.dart' hide Response;
import '../../core/constants/api_constants.dart';
import '../../core/network/api_client.dart';

class CouponProvider {
  final ApiClient _apiClient = Get.find<ApiClient>();

  Future<Map<String, dynamic>> scanCoupon({
    required String code, required String id, required String userId,
  }) async {
    final response = await _apiClient.post(ApiConstants.scanCoupon, data: {
      'code': code, 'id': id, 'userId': userId,
    });
    return response.data;
  }
}
