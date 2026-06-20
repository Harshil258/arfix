import 'package:get/get.dart';
import '../../core/network/api_exceptions.dart';
import '../../core/utils/helpers.dart';
import '../../data/models/scan_history_model.dart';
import '../../data/models/product_model.dart';
import '../../data/repositories/home_repository.dart';

class ScanHistoryController extends GetxController {
  final _homeRepo = HomeRepository();

  final scans = <ScanHistoryItemModel>[].obs;
  final summary = Rxn<ScanHistorySummary>();
  final isLoading = true.obs;
  final isLoadingMore = false.obs;
  final pagination = Rxn<PaginationModel>();

  @override
  void onInit() {
    super.onInit();
    loadHistory();
  }

  Future<void> loadHistory({bool refresh = false}) async {
    if (refresh) isLoading.value = true;
    try {
      final result = await _homeRepo.getScanHistory(page: 1, limit: 20);
      scans.value = result.scans;
      summary.value = result.summary;
      pagination.value = result.pagination;
    } on ApiException catch (e) {
      Helpers.showSnackbar(title: 'Error', message: e.message, isError: true);
    } catch (_) {}
    isLoading.value = false;
  }

  Future<void> loadMore() async {
    if (isLoadingMore.value || pagination.value == null || !pagination.value!.hasMore) return;
    isLoadingMore.value = true;
    try {
      final result = await _homeRepo.getScanHistory(
        page: pagination.value!.page + 1, limit: 20,
      );
      scans.addAll(result.scans);
      summary.value = result.summary;
      pagination.value = result.pagination;
    } catch (_) {}
    isLoadingMore.value = false;
  }
}
