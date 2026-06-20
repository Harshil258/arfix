import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:get/get.dart';
import '../../core/constants/color_constants.dart';
import '../../core/utils/helpers.dart';
import '../../core/widgets/empty_state_widget.dart';
import '../../core/widgets/skeleton_loader.dart';
import 'controller.dart';

class NotificationsView extends GetView<NotificationsController> {
  const NotificationsView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Notifications'.tr),
        actions: [
          Obx(() => controller.unreadCount.value > 0
            ? Padding(
                padding: const EdgeInsets.only(right: 16),
                child: Center(
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppColors.primary.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text('${controller.unreadCount.value} ${'unread'.tr}',
                      style: const TextStyle(color: AppColors.primary, fontSize: 12, fontWeight: FontWeight.w600)),
                  ),
                ),
              )
            : const SizedBox()),
        ],
      ),
      body: Obx(() {
        if (controller.isLoading.value) {
          return Padding(
            padding: const EdgeInsets.all(16),
            child: Column(children: List.generate(5, (_) => const Padding(
              padding: EdgeInsets.only(bottom: 8),
              child: SkeletonLoader(height: 80),
            ))),
          );
        }

        if (controller.notifications.isEmpty) {
          return EmptyStateWidget(
            icon: Icons.notifications_none,
            title: 'No notifications'.tr,
            subtitle: 'You\'re all caught up!'.tr,
          );
        }

        return RefreshIndicator(
          onRefresh: () => controller.loadNotifications(refresh: true),
          child: ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: controller.notifications.length,
            separatorBuilder: (_, __) => const SizedBox(height: 8),
            itemBuilder: (context, index) {
              final notif = controller.notifications[index];
              return GestureDetector(
                onTap: () {
                  if (!notif.isRead) controller.markAsRead(notif.id);
                },
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: notif.isRead
                      ? Theme.of(context).cardColor
                      : AppColors.primary.withValues(alpha: 0.05),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: notif.isRead
                        ? Theme.of(context).dividerColor
                        : AppColors.primary.withValues(alpha: 0.2),
                    ),
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 44, height: 44,
                        decoration: BoxDecoration(
                          color: _getTypeColor(notif.type).withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Icon(_getTypeIcon(notif.type), color: _getTypeColor(notif.type), size: 22),
                      ),
                      const SizedBox(width: 14),
                      Expanded(child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(notif.title,
                            style: Theme.of(context).textTheme.titleSmall?.copyWith(
                              fontWeight: notif.isRead ? FontWeight.w500 : FontWeight.w700)),
                          const SizedBox(height: 4),
                          Text(notif.body, style: Theme.of(context).textTheme.bodySmall,
                            maxLines: 2, overflow: TextOverflow.ellipsis),
                          const SizedBox(height: 4),
                          Text(Helpers.timeAgo(notif.createdAt ?? ''),
                            style: Theme.of(context).textTheme.bodySmall?.copyWith(fontSize: 11)),
                        ],
                      )),
                      if (!notif.isRead)
                        Container(
                          width: 8, height: 8,
                          decoration: const BoxDecoration(color: AppColors.primary, shape: BoxShape.circle),
                        ),
                    ],
                  ),
                ),
              ).animate().fadeIn(delay: Duration(milliseconds: 50 * index)).slideX(begin: 0.03);
            },
          ),
        );
      }),
    );
  }

  IconData _getTypeIcon(String type) {
    switch (type) {
      case 'SCAN': return Icons.qr_code_scanner;
      case 'REWARD': return Icons.card_giftcard;
      case 'PROMO': return Icons.campaign;
      case 'SYSTEM': return Icons.settings;
      default: return Icons.notifications;
    }
  }

  Color _getTypeColor(String type) {
    switch (type) {
      case 'SCAN': return AppColors.success;
      case 'REWARD': return AppColors.coinGold;
      case 'PROMO': return AppColors.accent;
      case 'SYSTEM': return AppColors.info;
      default: return AppColors.primary;
    }
  }
}
