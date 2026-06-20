import '../models/coupon_model.dart';
import '../providers/coupon_provider.dart';

class CouponRepository {
  final CouponProvider _provider = CouponProvider();

  Future<ScanResultModel> scanCoupon({
    required String code, required String id, required String userId,
  }) async {
    final data = await _provider.scanCoupon(code: code, id: id, userId: userId);
    final responseData = data['data'] ?? data;
    return ScanResultModel.fromJson(responseData);
  }
}
