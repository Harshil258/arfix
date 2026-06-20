import 'package:get/get.dart';
import '../../core/network/api_exceptions.dart';
import '../../core/utils/helpers.dart';
import '../../data/models/notification_model.dart';
import '../../data/models/product_model.dart';
import '../../data/repositories/notification_repository.dart';

class NotificationsController extends GetxController {
  final _repo = NotificationRepository();

  final notifications = <NotificationModel>[].obs;
  final unreadCount = 0.obs;
  final isLoading = true.obs;
  final pagination = Rxn<PaginationModel>();

  @override
  void onInit() {
    super.onInit();
    loadNotifications();
  }

  Future<void> loadNotifications({bool refresh = false}) async {
    if (refresh) isLoading.value = true;
    try {
      final result = await _repo.getNotifications(page: 1, limit: 50);
      notifications.value = result.notifications;
      unreadCount.value = result.unreadCount;
      pagination.value = result.pagination;
    } on ApiException catch (e) {
      Helpers.showSnackbar(title: 'Error', message: e.message, isError: true);
    } catch (_) {}
    isLoading.value = false;
  }

  Future<void> markAsRead(String id) async {
    try {
      await _repo.markAsRead(id);
      final index = notifications.indexWhere((n) => n.id == id);
      if (index != -1) {
        final n = notifications[index];
        notifications[index] = NotificationModel(
          id: n.id, title: n.title, body: n.body,
          type: n.type, isRead: true, createdAt: n.createdAt, data: n.data,
        );
        unreadCount.value = notifications.where((n) => !n.isRead).length;
      }
    } catch (_) {}
  }
}
