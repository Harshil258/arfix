import 'package:get/get.dart' hide Response;
import '../../core/constants/api_constants.dart';
import '../../core/network/api_client.dart';

class VideoProvider {
  final ApiClient _apiClient = Get.find<ApiClient>();

  Future<Map<String, dynamic>> getVideos() async {
    final response = await _apiClient.get(ApiConstants.videos);
    return response.data;
  }

  Future<Map<String, dynamic>> createVideo({
    required String url,
    String? title,
    String? description,
  }) async {
    final response = await _apiClient.post(ApiConstants.videos, data: {
      'url': url,
      if (title != null && title.isNotEmpty) 'title': title,
      if (description != null && description.isNotEmpty) 'description': description,
    });
    return response.data;
  }
}
