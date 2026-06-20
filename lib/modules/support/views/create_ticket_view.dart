import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:get/get.dart';
import '../../../core/constants/color_constants.dart';
import '../../../core/utils/validators.dart';
import '../../../core/widgets/custom_button.dart';
import '../../../core/widgets/custom_text_field.dart';
import '../controller.dart';

class CreateTicketView extends GetView<SupportController> {
  const CreateTicketView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Customer Support'.tr)),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Form(
          key: controller.ticketFormKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: AppColors.primaryGradient,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.support_agent, color: Colors.white, size: 32),
                    const SizedBox(width: 16),
                    Expanded(child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Need Help?'.tr, style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.w600)),
                        const SizedBox(height: 4),
                        Text('Submit a ticket and we\'ll get back to you shortly.'.tr,
                          style: const TextStyle(color: Colors.white70, fontSize: 13)),
                      ],
                    )),
                  ],
                ),
              ).animate().fadeIn(duration: 400.ms).slideY(begin: 0.1),
              const SizedBox(height: 28),

              Text('Subject'.tr, style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: 8),
              CustomTextField(
                controller: controller.subjectController,
                hintText: 'Brief description of your issue'.tr,
                prefixIcon: Icons.subject,
                validator: Validators.validateSubject,
              ).animate().fadeIn(delay: 200.ms),
              const SizedBox(height: 20),

              Text('Message'.tr, style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: 8),
              CustomTextField(
                controller: controller.messageController,
                hintText: 'Describe your issue in detail...'.tr,
                maxLines: 6,
                validator: Validators.validateMessage,
              ).animate().fadeIn(delay: 300.ms),
              const SizedBox(height: 32),

              Obx(() => CustomButton(
                text: 'Submit Ticket'.tr,
                icon: Icons.send,
                isLoading: controller.isSubmitting.value,
                onPressed: controller.submitTicket,
              )).animate().fadeIn(delay: 400.ms),

              const SizedBox(height: 24),
              // View existing tickets
              Center(
                child: TextButton.icon(
                  onPressed: () {
                    controller.loadTickets();
                    _showTicketsSheet(context);
                  },
                  icon: const Icon(Icons.list_alt, size: 18),
                  label: Text('View My Tickets'.tr),
                ),
              ).animate().fadeIn(delay: 500.ms),
            ],
          ),
        ),
      ),
    );
  }

  void _showTicketsSheet(BuildContext context) {
    Get.bottomSheet(
      Container(
        height: MediaQuery.of(context).size.height * 0.6,
        decoration: BoxDecoration(
          color: Theme.of(context).scaffoldBackgroundColor,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
        ),
        child: Column(
          children: [
            Container(
              margin: const EdgeInsets.only(top: 12),
              width: 40, height: 4,
              decoration: BoxDecoration(
                color: Theme.of(context).dividerColor,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(16),
              child: Text('My Tickets'.tr, style: Theme.of(context).textTheme.headlineSmall),
            ),
            Expanded(
              child: Obx(() {
                if (controller.isLoading.value) {
                  return const Center(child: CircularProgressIndicator());
                }
                if (controller.tickets.isEmpty) {
                  return Center(child: Text('No tickets yet'.tr));
                }
                return ListView.separated(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  itemCount: controller.tickets.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 8),
                  itemBuilder: (context, index) {
                    final ticket = controller.tickets[index];
                    return ListTile(
                      tileColor: Theme.of(context).cardColor,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      title: Text(ticket.subject, maxLines: 1, overflow: TextOverflow.ellipsis),
                      subtitle: Text(ticket.status.tr, style: TextStyle(
                        color: _statusColor(ticket.status), fontWeight: FontWeight.w600, fontSize: 12)),
                      trailing: const Icon(Icons.chevron_right, size: 20),
                      onTap: () {
                        Get.back();
                        Get.toNamed('/support-detail', arguments: ticket.id);
                      },
                    );
                  },
                );
              }),
            ),
          ],
        ),
      ),
      isScrollControlled: true,
    );
  }

  Color _statusColor(String status) {
    switch (status.toUpperCase()) {
      case 'OPEN': return AppColors.info;
      case 'IN_PROGRESS': return AppColors.warning;
      case 'RESOLVED': return AppColors.success;
      default: return AppColors.lightTextSecondary;
    }
  }
}
