import 'package:get/get.dart' hide Response;
import '../../core/constants/api_constants.dart';
import '../../core/network/api_client.dart';

class WalletProvider {
  final ApiClient _apiClient = Get.find<ApiClient>();

  Future<Map<String, dynamic>> getWalletSummary() async {
    final response = await _apiClient.get(ApiConstants.wallet);
    return response.data;
  }

  Future<Map<String, dynamic>> getTransactions({int page = 1, int limit = 20, String? type}) async {
    final params = <String, dynamic>{'page': page, 'limit': limit};
    if (type != null) params['type'] = type;
    final response = await _apiClient.get(ApiConstants.walletTransactions, queryParameters: params);
    return response.data;
  }
}
