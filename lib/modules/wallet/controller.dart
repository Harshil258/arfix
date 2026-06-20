import 'package:get/get.dart';
import '../../core/network/api_exceptions.dart';
import '../../core/utils/helpers.dart';
import '../../data/models/wallet_model.dart';
import '../../data/models/product_model.dart';
import '../../data/repositories/wallet_repository.dart';

class WalletController extends GetxController {
  final _walletRepo = WalletRepository();

  final walletSummary = Rxn<WalletSummaryModel>();
  final transactions = <TransactionModel>[].obs;
  final isLoading = true.obs;
  final isLoadingMore = false.obs;
  final selectedType = RxnString();
  final pagination = Rxn<PaginationModel>();

  @override
  void onInit() {
    super.onInit();
    loadData();
  }

  Future<void> loadData() async {
    isLoading.value = true;
    try {
      final summary = await _walletRepo.getWalletSummary();
      walletSummary.value = summary;

      final result = await _walletRepo.getTransactions(
        page: 1, limit: 20, type: selectedType.value,
      );
      transactions.value = result.transactions;
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
      final result = await _walletRepo.getTransactions(
        page: pagination.value!.page + 1, limit: 20, type: selectedType.value,
      );
      transactions.addAll(result.transactions);
      pagination.value = result.pagination;
    } catch (_) {}
    isLoadingMore.value = false;
  }

  void filterByType(String? type) {
    selectedType.value = type;
    loadData();
  }
}
