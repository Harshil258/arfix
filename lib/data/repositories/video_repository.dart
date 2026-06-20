import '../models/video_model.dart';
import '../providers/video_provider.dart';

class VideoRepository {
  final VideoProvider _provider = VideoProvider();

  Future<List<VideoModel>> getVideos() async {
    final data = await _provider.getVideos();
    final responseData = data['data'] ?? data;
    
    final List<dynamic> videosList = (responseData is Map && responseData.containsKey('videos'))
        ? responseData['videos'] as List
        : (responseData is List ? responseData : []);
        
    return videosList.map((e) => VideoModel.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<VideoModel> createVideo({
    required String url,
    String? title,
    String? description,
  }) async {
    final data = await _provider.createVideo(
      url: url,
      title: title,
      description: description,
    );
    final responseData = data['data'] ?? data;
    final videoJson = (responseData is Map && responseData.containsKey('video'))
        ? responseData['video']
        : responseData;
    return VideoModel.fromJson(videoJson as Map<String, dynamic>);
  }
}
