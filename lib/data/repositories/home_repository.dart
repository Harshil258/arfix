import '../models/banner_model.dart';
import '../models/scan_history_model.dart';
import '../models/product_model.dart';
import '../providers/home_provider.dart';

class HomeRepository {
  final _provider = HomeProvider();

  Future<List<BannerModel>> getBanners() async {
    final data = await _provider.getBanners();
    final responseData = data['data'] ?? data;
    return (responseData['banners'] as List? ?? [])
        .map((e) => BannerModel.fromJson(e)).toList();
  }

  Future<List<CampaignModel>> getCampaigns() async {
    final data = await _provider.getCampaigns();
    final responseData = data['data'] ?? data;
    return (responseData['campaigns'] as List? ?? [])
        .map((e) => CampaignModel.fromJson(e)).toList();
  }

  Future<({List<ScanHistoryItemModel> scans, ScanHistorySummary summary, PaginationModel pagination})> getScanHistory({
    int page = 1, int limit = 20,
  }) async {
    final data = await _provider.getScanHistory(page: page, limit: limit);
    final responseData = data['data'] ?? data;
    final scans = (responseData['scans'] as List? ?? [])
        .map((e) => ScanHistoryItemModel.fromJson(e)).toList();
    final summary = ScanHistorySummary.fromJson(responseData['summary'] ?? {});
    final pagination = PaginationModel.fromJson(responseData['pagination'] ?? {});
    return (scans: scans, summary: summary, pagination: pagination);
  }
}
