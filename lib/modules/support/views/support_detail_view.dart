import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../../core/utils/helpers.dart';
import '../../../core/widgets/skeleton_loader.dart';
import '../controller.dart';

class SupportDetailView extends GetView<SupportController> {
  const SupportDetailView({super.key});

  @override
  Widget build(BuildContext context) {
    final ticketId = Get.arguments as String?;
    if (ticketId != null && controller.selectedTicket.value?.id != ticketId) {
      controller.loadTicketDetail(ticketId);
    }
    return Scaffold(
      appBar: AppBar(title: Text('Ticket Detail'.tr)),
      body: Obx(() {
        if (controller.isLoadingDetail.value) {
          return const Padding(
            padding: EdgeInsets.all(20),
            child: Column(children: [
              SkeletonLoader(height: 24, width: 200),
              SizedBox(height: 16),
              SkeletonLoader(height: 100),
            ]),
          );
        }

        final ticket = controller.selectedTicket.value;
        if (ticket == null) return Center(child: Text('Ticket not found'.tr));

        return SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Status badge
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: Helpers.getStatusColor(ticket.status).withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(ticket.status.tr,
                  style: TextStyle(color: Helpers.getStatusColor(ticket.status),
                    fontWeight: FontWeight.w600, fontSize: 12)),
              ),
              const SizedBox(height: 16),
              Text(ticket.subject, style: Theme.of(context).textTheme.headlineMedium),
              const SizedBox(height: 8),
              if (ticket.createdAt != null)
                Text(Helpers.formatDateTime(ticket.createdAt!),
                  style: Theme.of(context).textTheme.bodySmall),
              const SizedBox(height: 24),
              const Divider(),
              const SizedBox(height: 16),
              Text(ticket.message ?? ticket.preview ?? '',
                style: Theme.of(context).textTheme.bodyLarge?.copyWith(height: 1.6)),
            ],
          ),
        );
      }),
    );
  }
}
