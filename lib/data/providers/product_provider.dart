import 'package:get/get.dart' hide Response;
import '../../core/constants/api_constants.dart';
import '../../core/network/api_client.dart';

class ProductProvider {
  final ApiClient _apiClient = Get.find<ApiClient>();

  Future<Map<String, dynamic>> getProducts({
    int page = 1, int limit = 20,
    String? search, String sortBy = 'createdAt', String order = 'desc',
  }) async {
    final params = <String, dynamic>{
      'page': page, 'limit': limit, 'sortBy': sortBy, 'order': order,
    };
    if (search != null && search.isNotEmpty) params['search'] = search;
    final response = await _apiClient.get(ApiConstants.products, queryParameters: params);
    return response.data;
  }

  Future<Map<String, dynamic>> getProduct(String id) async {
    final response = await _apiClient.get('${ApiConstants.products}/$id');
    return response.data;
  }
}
