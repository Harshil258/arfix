import '../models/support_message_model.dart';
import '../models/product_model.dart';
import '../providers/support_provider.dart';

class SupportRepository {
  final SupportProvider _provider = SupportProvider();

  Future<SupportMessageModel> submitMessage({
    required String subject, required String message,
  }) async {
    final data = await _provider.submitMessage(subject: subject, message: message);
    final responseData = data['data'] ?? data;
    return SupportMessageModel.fromJson(responseData['message'] ?? responseData);
  }

  Future<({List<SupportMessageModel> messages, PaginationModel pagination})> getMyMessages({
    int page = 1, int limit = 10, String? status,
  }) async {
    final data = await _provider.getMyMessages(page: page, limit: limit, status: status);
    final responseData = data['data'] ?? data;
    final messages = (responseData['messages'] as List?)
        ?.map((e) => SupportMessageModel.fromJson(e))
        .toList() ?? [];
    final pagination = PaginationModel.fromJson(responseData['pagination'] ?? {});
    return (messages: messages, pagination: pagination);
  }

  Future<SupportMessageModel> getMessageDetail(String id) async {
    final data = await _provider.getMessageDetail(id);
    final responseData = data['data'] ?? data;
    return SupportMessageModel.fromJson(responseData['message'] ?? responseData);
  }
}
