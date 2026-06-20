class WalletSummaryModel {
  final int balance;
  final int totalEarned;
  final int totalRedeemed;
  final int totalScans;
  final String? memberSince;

  WalletSummaryModel({
    required this.balance, required this.totalEarned,
    required this.totalRedeemed, required this.totalScans, this.memberSince,
  });

  factory WalletSummaryModel.fromJson(Map<String, dynamic> json) {
    return WalletSummaryModel(
      balance: json['balance'] ?? 0,
      totalEarned: json['totalEarned'] ?? 0,
      totalRedeemed: json['totalRedeemed'] ?? 0,
      totalScans: json['totalScans'] ?? 0,
      memberSince: json['memberSince'],
    );
  }
}

class TransactionModel {
  final String id;
  final String type; // EARNED, REDEEMED, BONUS
  final int coins;
  final String title;
  final String? description;
  final String? createdAt;

  TransactionModel({
    required this.id, required this.type, required this.coins,
    required this.title, this.description, this.createdAt,
  });

  factory TransactionModel.fromJson(Map<String, dynamic> json) {
    return TransactionModel(
      id: json['id'] ?? json['_id'] ?? '',
      type: json['type'] ?? '',
      coins: json['coins'] ?? 0,
      title: json['title'] ?? '',
      description: json['description'],
      createdAt: json['createdAt'],
    );
  }

  bool get isEarned => type == 'EARNED' || type == 'BONUS';
  bool get isRedeemed => type == 'REDEEMED';
}
