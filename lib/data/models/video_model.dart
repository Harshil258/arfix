class VideoModel {
  final String id;
  final String url;
  final String youtubeId;
  final String? title;
  final String? description;
  final AddedByUser? addedBy;
  final String createdAt;

  VideoModel({
    required this.id,
    required this.url,
    required this.youtubeId,
    this.title,
    this.description,
    this.addedBy,
    required this.createdAt,
  });

  factory VideoModel.fromJson(Map<String, dynamic> json) {
    return VideoModel(
      id: json['id'] ?? json['_id'] ?? '',
      url: json['url'] ?? '',
      youtubeId: json['youtubeId'] ?? '',
      title: json['title'],
      description: json['description'],
      addedBy: json['addedBy'] != null ? AddedByUser.fromJson(json['addedBy']) : null,
      createdAt: json['createdAt'] ?? '',
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'url': url,
    'youtubeId': youtubeId,
    'title': title,
    'description': description,
    'addedBy': addedBy?.toJson(),
    'createdAt': createdAt,
  };
}

class AddedByUser {
  final String id;
  final String name;

  AddedByUser({required this.id, required this.name});

  factory AddedByUser.fromJson(Map<String, dynamic> json) {
    return AddedByUser(
      id: json['id'] ?? json['_id'] ?? '',
      name: json['name'] ?? '',
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
  };
}
