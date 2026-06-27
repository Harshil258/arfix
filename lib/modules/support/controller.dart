import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../core/network/api_exceptions.dart';
import '../../core/utils/helpers.dart';
import '../../data/models/support_message_model.dart';
import '../../data/repositories/support_repository.dart';

class SupportController extends GetxController {
  final _repo = SupportRepository();

  // Ticket creation
  final subjectController = TextEditingController();
  final messageController = TextEditingController();
  final ticketFormKey = GlobalKey<FormState>();
  final isSubmitting = false.obs;

  // Ticket list
  final tickets = <SupportMessageModel>[].obs;
  final isLoading = false.obs;

  // Detail
  final selectedTicket = Rxn<SupportMessageModel>();
  final isLoadingDetail = false.obs;

  Future<void> submitTicket() async {
    if (!ticketFormKey.currentState!.validate()) return;
    isSubmitting.value = true;
    try {
      await _repo.submitMessage(
        subject: subjectController.text.trim(),
        message: messageController.text.trim(),
      );
      Helpers.showSnackbar(title: 'Sent!', message: 'Support ticket submitted', isSuccess: true);
      subjectController.clear();
      messageController.clear();
      Get.back();
    } on ApiException catch (e) {
      Helpers.showSnackbar(title: 'Error', message: e.message, isError: true);
    } finally {
      isSubmitting.value = false;
    }
  }

  Future<void> loadTickets() async {
    isLoading.value = true;
    try {
      final result = await _repo.getMyMessages();
      tickets.value = result.messages;
    } catch (_) {}
    isLoading.value = false;
  }

  Future<void> loadTicketDetail(String id) async {
    isLoadingDetail.value = true;
    try {
      selectedTicket.value = await _repo.getMessageDetail(id);
    } catch (_) {}
    isLoadingDetail.value = false;
  }


}
