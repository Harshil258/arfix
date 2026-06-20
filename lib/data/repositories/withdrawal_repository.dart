import '../models/withdrawal_model.dart';
import '../models/product_model.dart';
import '../providers/withdrawal_provider.dart';

class WithdrawalRepository {
  final _provider = WithdrawalProvider();

  Future<WithdrawalModel> createWithdrawal({required Map<String, dynamic> data}) async {
    final response = await _provider.createWithdrawal(data: data);
    final responseData = response['data'] ?? response;
    return WithdrawalModel.fromJson(responseData['withdrawal'] ?? responseData);
  }

  Future<WithdrawalModel?> getWithdrawalStatus(String userId) async {
    final data = await _provider.getWithdrawalStatus(userId);
    final responseData = data['data'] ?? data;
    if (responseData['withdrawal'] == null) return null;
    return WithdrawalModel.fromJson(responseData['withdrawal']);
  }

  Future<({List<WithdrawalModel> withdrawals, PaginationModel pagination})> getWithdrawalHistory(String userId) async {
    final data = await _provider.getWithdrawalHistory(userId);
    final responseData = data['data'] ?? data;
    final withdrawals = (responseData['withdrawals'] as List? ?? [])
        .map((e) => WithdrawalModel.fromJson(e)).toList();
    final pagination = PaginationModel.fromJson(responseData['pagination'] ?? {});
    return (withdrawals: withdrawals, pagination: pagination);
  }

  Future<({List<WithdrawalModel> withdrawals, PaginationModel pagination})> getMyWithdrawals({
    int page = 1, int limit = 10, String? status,
  }) async {
    final data = await _provider.getMyWithdrawals(page: page, limit: limit, status: status);
    final responseData = data['data'] ?? data;
    final withdrawals = (responseData['withdrawals'] as List? ?? [])
        .map((e) => WithdrawalModel.fromJson(e)).toList();
    final pagination = PaginationModel.fromJson(responseData['pagination'] ?? {});
    return (withdrawals: withdrawals, pagination: pagination);
  }

  Future<WithdrawalModel> cancelWithdrawal(String withdrawalId) async {
    final data = await _provider.cancelWithdrawal(withdrawalId);
    final responseData = data['data'] ?? data;
    return WithdrawalModel.fromJson(responseData['withdrawal'] ?? responseData);
  }
}
