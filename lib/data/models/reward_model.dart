class RewardModel {
  final String id;
  final String title;
  final String description;
  final int coinsRequired;
  final String category;
  final String? image;
  final int stock;
  final bool isActive;
  final String? expiresAt;

  RewardModel({
    required this.id, required this.title, required this.description,
    required this.coinsRequired, required this.category,
    this.image, this.stock = 0, this.isActive = true, this.expiresAt,
  });

  factory RewardModel.fromJson(Map<String, dynamic> json) {
    return RewardModel(
      id: json['id'] ?? json['_id'] ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      coinsRequired: json['coinsRequired'] ?? 0,
      category: json['category'] ?? '',
      image: json['image'],
      stock: json['stock'] ?? 0,
      isActive: json['isActive'] ?? true,
      expiresAt: json['expiresAt'],
    );
  }
}

class RedemptionModel {
  final String id;
  final String rewardTitle;
  final int coinsSpent;
  final String status; // PROCESSING, COMPLETED, FAILED, CANCELLED
  final String? createdAt;
  final String? completedAt;
  final String? estimatedDelivery;

  RedemptionModel({
    required this.id, required this.rewardTitle, required this.coinsSpent,
    required this.status, this.createdAt, this.completedAt, this.estimatedDelivery,
  });

  factory RedemptionModel.fromJson(Map<String, dynamic> json) {
    return RedemptionModel(
      id: json['id'] ?? json['_id'] ?? '',
      rewardTitle: json['rewardTitle'] ?? '',
      coinsSpent: json['coinsSpent'] ?? 0,
      status: json['status'] ?? 'PROCESSING',
      createdAt: json['createdAt'],
      completedAt: json['completedAt'],
      estimatedDelivery: json['estimatedDelivery'],
    );
  }
}
