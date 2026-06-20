import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../core/network/api_exceptions.dart';
import '../../core/utils/helpers.dart';
import '../../data/models/video_model.dart';
import '../../data/repositories/video_repository.dart';

class AboutController extends GetxController {
  final _repo = VideoRepository();

  final videos = <VideoModel>[].obs;
  final isLoading = false.obs;
  final isSubmitting = false.obs;

  // Video submit controllers
  final urlController = TextEditingController();
  final titleController = TextEditingController();
  final descriptionController = TextEditingController();
  final formKey = GlobalKey<FormState>();

  @override
  void onInit() {
    super.onInit();
    fetchVideos();
  }

  Future<void> fetchVideos() async {
    isLoading.value = true;
    try {
      final fetched = await _repo.getVideos();
      videos.assignAll(fetched);
    } on ApiException catch (e) {
      Helpers.showSnackbar(title: 'Error', message: e.message, isError: true);
    } catch (_) {
      Helpers.showSnackbar(title: 'Error', message: 'Failed to fetch videos', isError: true);
    } finally {
      isLoading.value = false;
    }
  }

  String? validateYoutubeUrl(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'YouTube URL is required';
    }
    final regExp = RegExp(r'^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*');
    final match = regExp.firstMatch(value);
    if (match == null || match.group(2)?.length != 11) {
      return 'Please enter a valid YouTube URL';
    }
    return null;
  }

  Future<void> addVideo() async {
    if (!formKey.currentState!.validate()) return;
    isSubmitting.value = true;
    try {
      final newVideo = await _repo.createVideo(
        url: urlController.text.trim(),
        title: titleController.text.trim().isEmpty ? null : titleController.text.trim(),
        description: descriptionController.text.trim().isEmpty ? null : descriptionController.text.trim(),
      );
      videos.insert(0, newVideo);
      urlController.clear();
      titleController.clear();
      descriptionController.clear();
      Get.back(); // close dialog
      Helpers.showSnackbar(title: 'Success', message: 'Video added successfully', isSuccess: true);
    } on ApiException catch (e) {
      Helpers.showSnackbar(title: 'Error', message: e.message, isError: true);
    } catch (_) {
      Helpers.showSnackbar(title: 'Error', message: 'Failed to add video', isError: true);
    } finally {
      isSubmitting.value = false;
    }
  }

  @override
  void onClose() {
    urlController.dispose();
    titleController.dispose();
    descriptionController.dispose();
    super.onClose();
  }
}
