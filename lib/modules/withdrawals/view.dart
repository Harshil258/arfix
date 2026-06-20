import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:get/get.dart';
import '../../core/constants/color_constants.dart';
import '../../core/utils/helpers.dart';
import '../../core/widgets/custom_button.dart';
import '../../core/widgets/custom_text_field.dart';
import '../../core/widgets/empty_state_widget.dart';
import '../../core/widgets/skeleton_loader.dart';
import 'controller.dart';

class WithdrawalView extends GetView<WithdrawalController> {
  const WithdrawalView({super.key});

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          title: Text('Withdraw Funds'.tr),
          bottom: TabBar(
            indicatorColor: Theme.of(context).colorScheme.primary,
            labelColor: Theme.of(context).colorScheme.primary,
            unselectedLabelColor: Theme.of(context).textTheme.bodySmall?.color,
            tabs: [
              Tab(icon: const Icon(Icons.account_balance_wallet), text: 'Request Payout'.tr),
              Tab(icon: const Icon(Icons.history), text: 'History'.tr),
            ],
          ),
        ),
        body: TabBarView(
          children: [
            _buildRequestTab(context),
            _buildHistoryTab(context),
          ],
        ),
      ),
    );
  }

  Widget _buildRequestTab(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Form(
        key: controller.formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Balance card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: AppColors.primaryGradient,
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.primaryDark.withValues(alpha: 0.3),
                    blurRadius: 15,
                    offset: const Offset(0, 6),
                  ),
                ],
              ),
              child: Row(
                children: [
                  const Icon(Icons.monetization_on, color: AppColors.coinGold, size: 36),
                  const SizedBox(width: 14),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Withdrawable Balance'.tr, style: const TextStyle(color: Colors.white70, fontSize: 13)),
                      Obx(() => Text('${controller.userCoins.value} ${'coins'.tr}',
                        style: const TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.w800))),
                    ],
                  ),
                ],
              ),
            ).animate().fadeIn(duration: 400.ms).slideY(begin: 0.1),
            const SizedBox(height: 24),

            Text('UPI Payment Details'.tr, style: Theme.of(context).textTheme.headlineSmall),
            const SizedBox(height: 16),

            CustomTextField(
              controller: controller.upiCtrl,
              hintText: 'Enter UPI ID (e.g. name@upi)'.tr,
              prefixIcon: Icons.qr_code_scanner,
              validator: (v) {
                if (v == null || v.trim().isEmpty) return 'UPI ID is required'.tr;
                if (!v.contains('@')) return 'Enter a valid UPI ID (must contain @)'.tr;
                return null;
              },
            ).animate().fadeIn(delay: 100.ms),
            const SizedBox(height: 24),

            Text('Withdrawal Amount'.tr, style: Theme.of(context).textTheme.headlineSmall),
            const SizedBox(height: 12),

            CustomTextField(
              controller: controller.amountCtrl,
              hintText: 'Enter coins to withdraw (Min 100)'.tr,
              prefixIcon: Icons.monetization_on_outlined,
              keyboardType: TextInputType.number,
              validator: (v) {
                if (v == null || v.isEmpty) return 'Amount is required'.tr;
                final amt = int.tryParse(v);
                if (amt == null) return 'Enter a valid number'.tr;
                if (amt < 100) return 'Minimum withdrawal is 100 coins'.tr;
                return null;
              },
            ).animate().fadeIn(delay: 200.ms),
            const SizedBox(height: 32),

            Obx(() => CustomButton(
              text: 'Request Withdrawal'.tr,
              isLoading: controller.isSubmitting.value,
              onPressed: controller.requestWithdrawal,
            )).animate().fadeIn(delay: 300.ms),
          ],
        ),
      ),
    );
  }

  Widget _buildHistoryTab(BuildContext context) {
    return Obx(() {
      if (controller.isLoading.value) {
        return const Padding(
          padding: EdgeInsets.all(20),
          child: Column(
            children: [
              SkeletonLoader(height: 70),
              SizedBox(height: 12),
              SkeletonLoader(height: 70),
              SizedBox(height: 12),
              SkeletonLoader(height: 70),
            ],
          ),
        );
      }

      if (controller.history.isEmpty) {
        return RefreshIndicator(
          onRefresh: controller.loadHistory,
          child: const SingleChildScrollView(
            physics: AlwaysScrollableScrollPhysics(),
            child: SizedBox(
              height: 400,
              child: EmptyStateWidget(
                icon: Icons.history,
                title: 'No withdrawal history',
                subtitle: 'Submit your first payout request to view it here.',
              ),
            ),
          ),
        );
      }

      return RefreshIndicator(
        onRefresh: controller.loadHistory,
        child: ListView.builder(
          padding: const EdgeInsets.all(16),
          itemCount: controller.history.length,
          itemBuilder: (context, index) {
            final w = controller.history[index];
            final Color statusColor = _getStatusColor(w.status);
            final isPending = w.status.toLowerCase() == 'pending';
            
            return Container(
              margin: const EdgeInsets.only(bottom: 12),
              decoration: BoxDecoration(
                color: Theme.of(context).cardColor,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Theme.of(context).dividerColor, width: 0.8),
              ),
              child: ListTile(
                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                leading: Container(
                  width: 44, height: 44,
                  decoration: BoxDecoration(
                    color: statusColor.withValues(alpha: 0.12),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(Icons.account_balance_wallet, color: statusColor, size: 20),
                ),
                title: Text('₹${w.amount}', 
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w700)),
                subtitle: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 4),
                    Text('${'UPI ID'.tr}: ${w.upiId ?? 'N/A'}', 
                      style: Theme.of(context).textTheme.bodySmall),
                    if (w.createdAt != null) ...[
                      const SizedBox(height: 2),
                      Text(Helpers.formatDate(w.createdAt!),
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(fontSize: 11)),
                    ],
                    if (w.status.toLowerCase() == 'rejected' && w.rejectionReason != null) ...[
                      const SizedBox(height: 6),
                      Text('${'Reason'.tr}: ${w.rejectionReason}', 
                        style: const TextStyle(color: AppColors.error, fontSize: 12, fontWeight: FontWeight.w500)),
                    ]
                  ],
                ),
                trailing: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: statusColor.withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        w.status.tr,
                        style: TextStyle(
                          color: statusColor,
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                          letterSpacing: 0.5,
                        ),
                      ),
                    ),
                    if (isPending) ...[
                      const SizedBox(height: 6),
                      GestureDetector(
                        onTap: () => _confirmCancel(context, w.id),
                        child: Text(
                          'Cancel'.tr,
                          style: const TextStyle(
                            color: AppColors.error,
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            decoration: TextDecoration.underline,
                          ),
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            );
          },
        ),
      );
    });
  }

  void _confirmCancel(BuildContext context, String withdrawalId) {
    Get.dialog(
      AlertDialog(
        title: Text('Cancel Request'.tr),
        content: Text('Are you sure you want to cancel this withdrawal request?'.tr),
        actions: [
          TextButton(onPressed: () => Get.back(), child: Text('No'.tr)),
          ElevatedButton(
            onPressed: () {
              Get.back();
              controller.cancelWithdrawal(withdrawalId);
            },
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.error),
            child: Text('Yes, Cancel'.tr),
          ),
        ],
      ),
    );
  }

  Color _getStatusColor(String status) {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return AppColors.warning;
      case 'APPROVED':
        return AppColors.info;
      case 'COMPLETED':
        return AppColors.success;
      case 'CANCELLED':
        return AppColors.lightTextSecondary;
      case 'REJECTED':
      case 'FAILED':
        return AppColors.error;
      default:
        return AppColors.lightTextSecondary;
    }
  }
}
