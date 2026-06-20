class BannerModel {
  final String id;
  final String image;
  final String title;
  final String actionType; // CAMPAIGN, PRODUCT, REWARD, SCREEN, URL
  final String actionId;
  final int order;

  BannerModel({
    required this.id, required this.image, required this.title,
    required this.actionType, required this.actionId, this.order = 0,
  });

  factory BannerModel.fromJson(Map<String, dynamic> json) {
    return BannerModel(
      id: json['id'] ?? json['_id'] ?? '',
      image: json['image'] ?? '',
      title: json['title'] ?? '',
      actionType: json['actionType'] ?? '',
      actionId: json['actionId'] ?? '',
      order: json['order'] ?? 0,
    );
  }
}

class CampaignModel {
  final String id;
  final String title;
  final String description;
  final String? image;
  final String type;
  final int multiplier;
  final String? startsAt;
  final String? endsAt;
  final bool isActive;

  CampaignModel({
    required this.id, required this.title, required this.description,
    this.image, required this.type, this.multiplier = 1,
    this.startsAt, this.endsAt, this.isActive = true,
  });

  factory CampaignModel.fromJson(Map<String, dynamic> json) {
    return CampaignModel(
      id: json['id'] ?? json['_id'] ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      image: json['image'],
      type: json['type'] ?? '',
      multiplier: json['multiplier'] ?? 1,
      startsAt: json['startsAt'],
      endsAt: json['endsAt'],
      isActive: json['isActive'] ?? true,
    );
  }
}
