import '../models/notification_model.dart';
import '../models/product_model.dart';
import '../providers/notification_provider.dart';

class NotificationRepository {
  final _provider = NotificationProvider();

  Future<({List<NotificationModel> notifications, int unreadCount, PaginationModel pagination})> getNotifications({
    int page = 1, int limit = 20,
  }) async {
    final data = await _provider.getNotifications(page: page, limit: limit);
    final responseData = data['data'] ?? data;
    final notifications = (responseData['notifications'] as List? ?? [])
        .map((e) => NotificationModel.fromJson(e)).toList();
    final int unreadCount = responseData['unreadCount'] ?? 0;
    final pagination = PaginationModel.fromJson(responseData['pagination'] ?? {});
    return (notifications: notifications, unreadCount: unreadCount, pagination: pagination);
  }

  Future<void> markAsRead(String id) async {
    await _provider.markAsRead(id);
  }

  Future<void> registerFcmToken({required String token, required String platform}) async {
    await _provider.registerFcmToken(token: token, platform: platform);
  }
}
