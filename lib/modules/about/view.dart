import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:get/get.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:cached_network_image/cached_network_image.dart';

import '../../core/constants/color_constants.dart';
import '../../core/utils/helpers.dart';
import 'controller.dart';

class AboutView extends GetView<AboutController> {
  const AboutView({super.key});

  Future<void> _launchUrl(String url) async {
    final Uri uri = Uri.parse(url);
    try {
      if (!await launchUrl(uri, mode: LaunchMode.externalApplication)) {
        Helpers.showSnackbar(title: 'Error', message: 'Could not launch $url', isError: true);
      }
    } catch (e) {
      Helpers.showSnackbar(title: 'Error', message: 'Could not launch URL: $e', isError: true);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('About App'.tr),
      ),
      body: RefreshIndicator(
        onRefresh: controller.fetchVideos,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Premium branding header
              Center(
                child: Column(
                  children: [
                    Container(
                      width: 80,
                      height: 80,
                      decoration: BoxDecoration(
                        color: const Color(0xFF07232F),
                        borderRadius: BorderRadius.circular(16),
                        boxShadow: [
                          BoxShadow(
                            color: AppColors.primary.withValues(alpha: 0.2),
                            blurRadius: 16,
                          )
                        ],
                      ),
                      child: const Center(
                        child: Text(
                          'ARFIX',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 22,
                            fontWeight: FontWeight.w900,
                            letterSpacing: 1.0,
                          ),
                        ),
                      ),
                    ).animate().scale(duration: 400.ms, curve: Curves.elasticOut),
                    const SizedBox(height: 16),
                    Text(
                      'ARFIX Rewards'.tr,
                      style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                            fontWeight: FontWeight.w800,
                          ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '${'Version'.tr} 1.0.0',
                      style: Theme.of(context).textTheme.bodySmall,
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'Scan QR codes on ARFIX products and earn reward coins instantly. Accumulate coins with every scan and unlock exclusive rewards.'.tr,
                      textAlign: TextAlign.center,
                      style: const TextStyle(height: 1.4),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Videos Section Header
              Text(
                'YouTube Videos'.tr,
                style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 12),

              // Video List
              Obx(() {
                if (controller.isLoading.value && controller.videos.isEmpty) {
                  return const Center(
                    child: Padding(
                      padding: EdgeInsets.symmetric(vertical: 32),
                      child: CircularProgressIndicator(),
                    ),
                  );
                }

                if (controller.videos.isEmpty) {
                  return Center(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(vertical: 40, horizontal: 20),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.video_library_outlined, size: 48, color: Theme.of(context).hintColor),
                          const SizedBox(height: 12),
                          Text(
                            'No YouTube videos available'.tr,
                            style: const TextStyle(fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Be the first to share an ARFIX video!'.tr,
                            style: TextStyle(color: Theme.of(context).hintColor),
                          ),
                        ],
                      ),
                    ),
                  );
                }

                return ListView.separated(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: controller.videos.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 16),
                  itemBuilder: (context, index) {
                    final video = controller.videos[index];
                    return _buildVideoCard(context, video);
                  },
                );
              }),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildVideoCard(BuildContext context, dynamic video) {
    final String thumbnailUrl = 'https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg';

    return Container(
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 8,
            offset: const Offset(0, 4),
          )
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Thumbnail with YouTube Play overlay
            GestureDetector(
              onTap: () => _launchUrl(video.url),
              child: Stack(
                alignment: Alignment.center,
                children: [
                  CachedNetworkImage(
                    imageUrl: thumbnailUrl,
                    height: 180,
                    width: double.infinity,
                    fit: BoxFit.cover,
                    placeholder: (context, url) => Container(
                      height: 180,
                      color: Colors.grey[300],
                      child: const Center(child: CircularProgressIndicator()),
                    ),
                    errorWidget: (context, url, error) => Container(
                      height: 180,
                      color: Colors.grey[200],
                      child: const Icon(Icons.broken_image, size: 40),
                    ),
                  ),
                  Container(
                    width: double.infinity,
                    height: 180,
                    color: Colors.black.withValues(alpha: 0.2),
                  ),
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: const BoxDecoration(
                      color: Colors.red,
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.play_arrow, color: Colors.white, size: 32),
                  ).animate().scale(delay: 200.ms, duration: 400.ms, curve: Curves.elasticOut),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    video.title ?? 'Arfix Product Video',
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                  ),
                  if (video.description != null && video.description.isNotEmpty) ...[
                    const SizedBox(height: 6),
                    Text(
                      video.description,
                      style: TextStyle(color: Theme.of(context).hintColor, fontSize: 13),
                    ),
                  ],
                  const SizedBox(height: 12),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Icon(Icons.person_outline, size: 14, color: Theme.of(context).hintColor),
                          const SizedBox(width: 4),
                          Text(
                            video.addedBy?.name ?? 'System',
                            style: TextStyle(color: Theme.of(context).hintColor, fontSize: 12),
                          ),
                        ],
                      ),
                      Text(
                        _formatDate(video.createdAt),
                        style: TextStyle(color: Theme.of(context).hintColor, fontSize: 11),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _formatDate(String isoString) {
    try {
      final date = DateTime.parse(isoString);
      return '${date.day}/${date.month}/${date.year}';
    } catch (_) {
      return '';
    }
  }
}
