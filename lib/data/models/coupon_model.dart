class CouponModel {
  final String id;
  final String code;
  final int price;
  final String status;
  final String? scannedBy;

  CouponModel({
    required this.id, required this.code,
    required this.price, required this.status, this.scannedBy,
  });

  factory CouponModel.fromJson(Map<String, dynamic> json) {
    return CouponModel(
      id: json['id'] ?? json['_id'] ?? '',
      code: json['code'] ?? '',
      price: json['price'] ?? 0,
      status: json['status'] ?? '',
      scannedBy: json['scannedBy'],
    );
  }
}

class ScanResultModel {
  final CouponModel coupon;
  final String userId;
  final String userName;
  final int newBalance;

  ScanResultModel({
    required this.coupon, required this.userId,
    required this.userName, required this.newBalance,
  });

  factory ScanResultModel.fromJson(Map<String, dynamic> json) {
    return ScanResultModel(
      coupon: CouponModel.fromJson(json['coupon'] ?? {}),
      userId: json['user']?['id'] ?? '',
      userName: json['user']?['name'] ?? '',
      newBalance: json['user']?['coins'] ?? 0,
    );
  }
}
