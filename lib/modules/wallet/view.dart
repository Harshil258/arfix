import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:get/get.dart';
import '../../core/constants/color_constants.dart';
import '../../core/utils/helpers.dart';
import '../../core/widgets/empty_state_widget.dart';
import '../../core/widgets/skeleton_loader.dart';
import 'controller.dart';

class WalletView extends GetView<WalletController> {
  const WalletView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('My Wallet'.tr)),
      body: Obx(() {
        if (controller.isLoading.value) {
          return const Padding(
            padding: EdgeInsets.all(20),
            child: Column(children: [
              SkeletonLoader(height: 200, borderRadius: 24),
              SizedBox(height: 24),
              SkeletonLoader(height: 60),
              SizedBox(height: 12),
              SkeletonLoader(height: 60),
            ]),
          );
        }

        final summary = controller.walletSummary.value;

        return RefreshIndicator(
          onRefresh: controller.loadData,
          child: ListView(
            padding: const EdgeInsets.all(20),
            children: [
              // Balance card
              Container(
                padding: const EdgeInsets.all(28),
                decoration: BoxDecoration(
                  gradient: AppColors.primaryGradient,
                  borderRadius: BorderRadius.circular(28),
                  boxShadow: [BoxShadow(
                    color: AppColors.primary.withValues(alpha: 0.35),
                    blurRadius: 24, offset: const Offset(0, 10),
                  )],
                ),
                child: Column(
                  children: [
                    Text('Available Balance'.tr,
                      style: const TextStyle(color: Colors.white70, fontSize: 15)),
                    const SizedBox(height: 16),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.monetization_on, color: AppColors.coinGold, size: 40),
                        const SizedBox(width: 12),
                        Text('${summary?.balance ?? 0}',
                          style: const TextStyle(color: Colors.white, fontSize: 52, fontWeight: FontWeight.w800)),
                      ],
                    ).animate().scale(duration: 500.ms, curve: Curves.elasticOut),
                    const SizedBox(height: 8),
                    Text('coins'.tr, style: const TextStyle(color: Colors.white60, fontSize: 16)),
                    const SizedBox(height: 20),
                    ElevatedButton.icon(
                      onPressed: () => Get.toNamed('/withdraw'),
                      icon: const Icon(Icons.account_balance, size: 18),
                      label: Text('Withdraw Request'.tr),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.accent,
                        foregroundColor: AppColors.primaryDark,
                        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                    ),
                  ],
                ),
              ).animate().fadeIn(duration: 400.ms).slideY(begin: 0.1),
              const SizedBox(height: 32),

              // Stats row
              Row(
                children: [
                  Expanded(child: _StatCard(
                    icon: Icons.qr_code_scanner, label: 'Total Scans'.tr,
                    value: '${summary?.totalScans ?? 0}', color: AppColors.primary,
                  )),
                  const SizedBox(width: 12),
                  Expanded(child: _StatCard(
                    icon: Icons.arrow_upward, label: 'Earned'.tr,
                    value: Helpers.formatCoins(summary?.totalEarned ?? 0), color: AppColors.success,
                  )),
                  const SizedBox(width: 12),
                  Expanded(child: _StatCard(
                    icon: Icons.arrow_downward, label: 'Redeemed'.tr,
                    value: Helpers.formatCoins(summary?.totalRedeemed ?? 0), color: AppColors.warning,
                  )),
                ],
              ).animate().fadeIn(delay: 200.ms).slideY(begin: 0.1),
              const SizedBox(height: 32),

              // Filter chips
              Row(
                children: [
                  Text('Transactions'.tr, style: Theme.of(context).textTheme.headlineSmall),
                  const Spacer(),
                  _FilterChip(label: 'All'.tr, isSelected: controller.selectedType.value == null,
                    onTap: () => controller.filterByType(null)),
                  const SizedBox(width: 4),
                  _FilterChip(label: 'Earned'.tr, isSelected: controller.selectedType.value == 'EARNED',
                    onTap: () => controller.filterByType('EARNED')),
                  const SizedBox(width: 4),
                  _FilterChip(label: 'Spent'.tr, isSelected: controller.selectedType.value == 'REDEEMED',
                    onTap: () => controller.filterByType('REDEEMED')),
                ],
              ),
              const SizedBox(height: 16),

              if (controller.transactions.isEmpty)
                EmptyStateWidget(
                  icon: Icons.receipt_long_outlined,
                  title: 'No transactions yet'.tr,
                  subtitle: 'Your transactions will appear here'.tr,
                )
              else
                ...controller.transactions.asMap().entries.map((entry) {
                  final txn = entry.value;
                  final isEarned = txn.isEarned;
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
                        Container(
                          width: 44, height: 44,
                          decoration: BoxDecoration(
                            color: (isEarned ? AppColors.success : AppColors.warning).withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Icon(
                            isEarned ? Icons.add_circle_outline : Icons.remove_circle_outline,
                            color: isEarned ? AppColors.success : AppColors.warning,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(txn.title, style: Theme.of(context).textTheme.titleSmall),
                            if (txn.description != null)
                              Text(txn.description!, style: Theme.of(context).textTheme.bodySmall,
                                maxLines: 1, overflow: TextOverflow.ellipsis),
                            Text(Helpers.timeAgo(txn.createdAt ?? ''),
                              style: Theme.of(context).textTheme.bodySmall?.copyWith(fontSize: 11)),
                          ],
                        )),
                        Text('${isEarned ? '+' : ''}${txn.coins}',
                          style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            color: isEarned ? AppColors.success : AppColors.warning,
                            fontWeight: FontWeight.w700)),
                      ],
                    ),
                  ).animate().fadeIn(delay: Duration(milliseconds: 50 * entry.key)).slideX(begin: 0.03);
                }),

              // Load more indicator
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

class _StatCard extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final Color color;

  const _StatCard({required this.icon, required this.label, required this.value, required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Theme.of(context).dividerColor),
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: 24),
          const SizedBox(height: 8),
          Text(value, style: Theme.of(context).textTheme.titleLarge?.copyWith(
            fontWeight: FontWeight.w700)),
          const SizedBox(height: 4),
          Text(label, style: Theme.of(context).textTheme.bodySmall?.copyWith(fontSize: 11)),
        ],
      ),
    );
  }
}

class _FilterChip extends StatelessWidget {
  final String label;
  final bool isSelected;
  final VoidCallback onTap;

  const _FilterChip({required this.label, required this.isSelected, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.primary : Colors.transparent,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: isSelected ? AppColors.primary : Theme.of(context).dividerColor),
        ),
        child: Text(label, style: TextStyle(
          fontSize: 12, fontWeight: FontWeight.w600,
          color: isSelected ? Colors.white : null)),
      ),
    );
  }
}
