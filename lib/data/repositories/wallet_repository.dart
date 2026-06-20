import '../models/product_model.dart';
import '../models/wallet_model.dart';
import '../providers/wallet_provider.dart';

class WalletRepository {
  final _provider = WalletProvider();

  Future<WalletSummaryModel> getWalletSummary() async {
    final data = await _provider.getWalletSummary();
    final responseData = data['data'] ?? data;
    return WalletSummaryModel.fromJson(responseData);
  }

  Future<({List<TransactionModel> transactions, PaginationModel pagination})> getTransactions({
    int page = 1, int limit = 20, String? type,
  }) async {
    final data = await _provider.getTransactions(page: page, limit: limit, type: type);
    final responseData = data['data'] ?? data;
    final transactions = (responseData['transactions'] as List? ?? [])
        .map((e) => TransactionModel.fromJson(e)).toList();
    final pagination = PaginationModel.fromJson(responseData['pagination'] ?? {});
    return (transactions: transactions, pagination: pagination);
  }
}
