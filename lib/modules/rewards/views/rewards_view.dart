import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:get/get.dart';
import '../../../core/constants/color_constants.dart';
import '../../../core/utils/helpers.dart';
import '../../../core/widgets/empty_state_widget.dart';
import '../../../core/widgets/skeleton_loader.dart';
import '../controller.dart';

class RewardsView extends GetView<RewardsController> {
  const RewardsView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Rewards'.tr),
        actions: [
          TextButton.icon(
            onPressed: () => _showRedemptions(context),
            icon: const Icon(Icons.receipt_long, size: 18),
            label: Text('My Redemptions'.tr),
          ),
        ],
      ),
      body: Obx(() {
        if (controller.isLoading.value) {
          return const Padding(
            padding: EdgeInsets.all(20),
            child: Column(children: [
              SkeletonLoader(height: 80),
              SizedBox(height: 12),
              SkeletonLoader(height: 180),
              SizedBox(height: 12),
              SkeletonLoader(height: 180),
            ]),
          );
        }

        return RefreshIndicator(
          onRefresh: () => controller.loadRewards(refresh: true),
          child: ListView(
            padding: const EdgeInsets.all(16),
            children: [
              // Balance card
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: AppColors.primaryGradient,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.monetization_on, color: AppColors.coinGold, size: 36),
                    const SizedBox(width: 14),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Your Balance'.tr, style: const TextStyle(color: Colors.white70, fontSize: 13)),
                        Text('${controller.userCoins} ${'coins'.tr}',
                          style: const TextStyle(color: Colors.white, fontSize: 26, fontWeight: FontWeight.w800)),
                      ],
                    ),
                  ],
                ),
              ).animate().fadeIn(duration: 400.ms).slideY(begin: 0.1),
              const SizedBox(height: 20),

              // Category chips
              if (controller.categories.isNotEmpty) ...[
                SizedBox(
                  height: 40,
                  child: ListView(
                    scrollDirection: Axis.horizontal,
                    children: [
                      _CategoryChip(label: 'All'.tr, isSelected: controller.selectedCategory.value == null,
                        onTap: () => controller.filterByCategory(null)),
                      ...controller.categories.map((cat) => _CategoryChip(
                        label: cat, isSelected: controller.selectedCategory.value == cat,
                        onTap: () => controller.filterByCategory(cat),
                      )),
                    ],
                  ),
                ),
                const SizedBox(height: 20),
              ],

              // Rewards list
              if (controller.rewards.isEmpty)
                EmptyStateWidget(
                  icon: Icons.card_giftcard,
                  title: 'No rewards available'.tr,
                  subtitle: 'Check back soon for new rewards!'.tr,
                )
              else
                ...controller.rewards.asMap().entries.map((entry) {
                  final reward = entry.value;
                  final canRedeem = controller.userCoins >= reward.coinsRequired;
                  return Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    decoration: BoxDecoration(
                      color: Theme.of(context).cardColor,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: Theme.of(context).dividerColor),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Image
                        if (reward.image != null && reward.image!.isNotEmpty)
                          ClipRRect(
                            borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
                            child: Image.network(
                              Helpers.buildImageUrl(reward.image),
                              height: 140, width: double.infinity, fit: BoxFit.cover,
                              errorBuilder: (_, __, ___) => Container(
                                height: 140, color: AppColors.primary.withValues(alpha: 0.05),
                                child: const Center(child: Icon(Icons.card_giftcard, size: 48, color: AppColors.primary)),
                              ),
                            ),
                          ),
                        Padding(
                          padding: const EdgeInsets.all(16),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Expanded(child: Text(reward.title,
                                    style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w700))),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                    decoration: BoxDecoration(
                                      color: AppColors.coinGold.withValues(alpha: 0.15),
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    child: Row(
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        const Icon(Icons.monetization_on, color: AppColors.coinGold, size: 14),
                                        const SizedBox(width: 4),
                                        Text('${reward.coinsRequired}',
                                          style: const TextStyle(color: AppColors.coinGold, fontWeight: FontWeight.w700, fontSize: 13)),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 6),
                              Text(reward.description, style: Theme.of(context).textTheme.bodySmall, maxLines: 2, overflow: TextOverflow.ellipsis),
                              const SizedBox(height: 4),
                              Text('${'Stock'.tr}: ${reward.stock}', style: Theme.of(context).textTheme.bodySmall),
                              const SizedBox(height: 14),
                              SizedBox(
                                width: double.infinity,
                                child: Obx(() => ElevatedButton(
                                  onPressed: canRedeem && !controller.isRedeeming.value && reward.stock > 0
                                      ? () => _confirmRedeem(context, reward)
                                      : null,
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: canRedeem ? AppColors.primary : Colors.grey,
                                    foregroundColor: Colors.white,
                                    padding: const EdgeInsets.symmetric(vertical: 14),
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                                  ),
                                  child: Text(reward.stock == 0 ? 'Out of Stock'.tr
                                    : canRedeem ? 'Redeem'.tr : 'Not Enough Coins'.tr),
                                )),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ).animate().fadeIn(delay: Duration(milliseconds: 100 * entry.key)).slideY(begin: 0.05);
                }),
            ],
          ),
        );
      }),
    );
  }

  void _confirmRedeem(BuildContext context, dynamic reward) {
    Get.dialog(
      AlertDialog(
        title: Text('Confirm Redemption'.tr),
        content: Text('${'Redeem'.tr} "${reward.title}" ${'for'.tr} ${reward.coinsRequired} ${'coins'.tr}?'),
        actions: [
          TextButton(onPressed: () => Get.back(), child: Text('Cancel'.tr)),
          ElevatedButton(
            onPressed: () {
              Get.back();
              controller.redeemReward(reward.id);
            },
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary),
            child: Text('Redeem'.tr),
          ),
        ],
      ),
    );
  }

  void _showRedemptions(BuildContext context) {
    controller.loadRedemptions();
    Get.bottomSheet(
      Container(
        constraints: BoxConstraints(maxHeight: MediaQuery.of(context).size.height * 0.7),
        decoration: BoxDecoration(
          color: Theme.of(context).scaffoldBackgroundColor,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: Column(
          children: [
            const SizedBox(height: 12),
            Container(width: 40, height: 4, decoration: BoxDecoration(
              color: Colors.grey[400], borderRadius: BorderRadius.circular(2))),
            const SizedBox(height: 16),
            Text('My Redemptions'.tr, style: Theme.of(context).textTheme.headlineSmall),
            const SizedBox(height: 16),
            Expanded(
              child: Obx(() {
                if (controller.redemptions.isEmpty) {
                  return Center(child: Text('No redemptions yet'.tr));
                }
                return ListView.separated(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  itemCount: controller.redemptions.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 8),
                  itemBuilder: (context, index) {
                    final r = controller.redemptions[index];
                    return ListTile(
                      leading: Icon(_getStatusIcon(r.status), color: Helpers.getStatusColor(r.status)),
                      title: Text(r.rewardTitle),
                      subtitle: Text('${r.coinsSpent} ${'coins'.tr} • ${Helpers.timeAgo(r.createdAt ?? '')}'),
                      trailing: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: Helpers.getStatusColor(r.status).withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(r.status, style: TextStyle(
                          color: Helpers.getStatusColor(r.status), fontSize: 11, fontWeight: FontWeight.w600)),
                      ),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      tileColor: Theme.of(context).cardColor,
                    );
                  },
                );
              }),
            ),
          ],
        ),
      ),
    );
  }

  IconData _getStatusIcon(String status) {
    switch (status) {
      case 'COMPLETED': return Icons.check_circle;
      case 'PROCESSING': return Icons.hourglass_bottom;
      case 'FAILED': return Icons.cancel;
      case 'CANCELLED': return Icons.block;
      default: return Icons.pending;
    }
  }
}

class _CategoryChip extends StatelessWidget {
  final String label;
  final bool isSelected;
  final VoidCallback onTap;

  const _CategoryChip({required this.label, required this.isSelected, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(right: 8),
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          decoration: BoxDecoration(
            color: isSelected ? AppColors.primary : Theme.of(context).cardColor,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: isSelected ? AppColors.primary : Theme.of(context).dividerColor),
          ),
          child: Text(label, style: TextStyle(
            color: isSelected ? Colors.white : null, fontWeight: FontWeight.w600, fontSize: 13)),
        ),
      ),
    );
  }
}
