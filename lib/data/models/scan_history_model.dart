class ScanHistoryItemModel {
  final String id;
  final String couponCode;
  final int coinsEarned;
  final String? productName;
  final String? productImage;
  final String? scannedAt;

  ScanHistoryItemModel({
    required this.id, required this.couponCode, required this.coinsEarned,
    this.productName, this.productImage, this.scannedAt,
  });

  factory ScanHistoryItemModel.fromJson(Map<String, dynamic> json) {
    return ScanHistoryItemModel(
      id: json['id'] ?? json['_id'] ?? '',
      couponCode: json['couponCode'] ?? '',
      coinsEarned: json['coinsEarned'] ?? 0,
      productName: json['productName'],
      productImage: json['productImage'],
      scannedAt: json['scannedAt'],
    );
  }
}

class ScanHistorySummary {
  final int totalScans;
  final int totalCoinsEarned;

  ScanHistorySummary({required this.totalScans, required this.totalCoinsEarned});

  factory ScanHistorySummary.fromJson(Map<String, dynamic> json) {
    return ScanHistorySummary(
      totalScans: json['totalScans'] ?? 0,
      totalCoinsEarned: json['totalCoinsEarned'] ?? 0,
    );
  }
}
