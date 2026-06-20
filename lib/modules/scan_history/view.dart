import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:get/get.dart';
import '../../core/constants/color_constants.dart';
import '../../core/utils/helpers.dart';
import '../../core/widgets/empty_state_widget.dart';
import '../../core/widgets/skeleton_loader.dart';
import 'controller.dart';

class ScanHistoryView extends GetView<ScanHistoryController> {
  const ScanHistoryView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Scan History'.tr)),
      body: Obx(() {
        if (controller.isLoading.value) {
          return Padding(
            padding: const EdgeInsets.all(16),
            child: Column(children: [
              const SkeletonLoader(height: 80, borderRadius: 16),
              const SizedBox(height: 12),
              ...List.generate(4, (_) => const Padding(
                padding: EdgeInsets.only(bottom: 8),
                child: SkeletonLoader(height: 72),
              )),
            ]),
          );
        }

        if (controller.scans.isEmpty) {
          return EmptyStateWidget(
            icon: Icons.qr_code_2,
            title: 'No scans yet'.tr,
            subtitle: 'Start scanning ARFIX products to see your history here'.tr,
          );
        }

        return RefreshIndicator(
          onRefresh: () => controller.loadHistory(refresh: true),
          child: ListView(
            padding: const EdgeInsets.all(16),
            children: [
              // Summary card
              if (controller.summary.value != null)
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    gradient: AppColors.successGradient,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      Column(
                        children: [
                          Text('${controller.summary.value!.totalScans}',
                            style: const TextStyle(color: Colors.white, fontSize: 28, fontWeight: FontWeight.w800)),
                          Text('Total Scans'.tr, style: const TextStyle(color: Colors.white70, fontSize: 12)),
                        ],
                      ),
                      Container(width: 1, height: 40, color: Colors.white24),
                      Column(
                        children: [
                          Text(Helpers.formatCoins(controller.summary.value!.totalCoinsEarned),
                            style: const TextStyle(color: Colors.white, fontSize: 28, fontWeight: FontWeight.w800)),
                          Text('Coins Earned'.tr, style: const TextStyle(color: Colors.white70, fontSize: 12)),
                        ],
                      ),
                    ],
                  ),
                ).animate().fadeIn(duration: 400.ms).slideY(begin: 0.1),
              const SizedBox(height: 16),

              // Scan list
              ...controller.scans.asMap().entries.map((entry) {
                final scan = entry.value;
                return Container(
                  margin: const EdgeInsets.only(bottom: 8),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Theme.of(context).cardColor,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: Theme.of(context).dividerColor),
                  ),
                  child: Row(
                    children: [
                      // Product image or icon
                      Container(
                        width: 48, height: 48,
                        decoration: BoxDecoration(
                          color: AppColors.success.withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(14),
                        ),
                        child: scan.productImage != null && scan.productImage!.isNotEmpty
                            ? ClipRRect(
                                borderRadius: BorderRadius.circular(14),
                                child: Image.network(
                                  Helpers.buildImageUrl(scan.productImage),
                                  fit: BoxFit.cover,
                                  errorBuilder: (_, __, ___) =>
                                      const Icon(Icons.check_circle, color: AppColors.success),
                                ),
                              )
                            : const Icon(Icons.check_circle, color: AppColors.success),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(scan.productName ?? 'Code: ${scan.couponCode}',
                              style: Theme.of(context).textTheme.titleSmall),
                            const SizedBox(height: 4),
                            Text(
                              scan.scannedAt != null ? Helpers.formatDateTime(scan.scannedAt!) : '',
                              style: Theme.of(context).textTheme.bodySmall,
                            ),
                          ],
                        ),
                      ),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Text('+${scan.coinsEarned}',
                            style: Theme.of(context).textTheme.titleMedium?.copyWith(
                              color: AppColors.success, fontWeight: FontWeight.w700)),
                          const SizedBox(height: 2),
                          Text('coins'.tr, style: const TextStyle(fontSize: 11, color: AppColors.lightTextSecondary)),
                        ],
                      ),
                    ],
                  ),
                ).animate().fadeIn(delay: Duration(milliseconds: 50 * entry.key)).slideX(begin: 0.05);
              }),

              // Load more
              if (controller.isLoadingMore.value)
                const Padding(
                  padding: EdgeInsets.all(16),
                  child: Center(child: CircularProgressIndicator()),
                ),
            ],
          ),
        );
      }),
    );
  }
}
