class NotificationModel {
  final String id;
  final String title;
  final String body;
  final String type;
  final bool isRead;
  final String? createdAt;
  final Map<String, dynamic>? data;

  NotificationModel({
    required this.id, required this.title, required this.body,
    required this.type, this.isRead = false, this.createdAt, this.data,
  });

  factory NotificationModel.fromJson(Map<String, dynamic> json) {
    return NotificationModel(
      id: json['id'] ?? json['_id'] ?? '',
      title: json['title'] ?? '',
      body: json['body'] ?? '',
      type: json['type'] ?? '',
      isRead: json['isRead'] ?? false,
      createdAt: json['createdAt'],
      data: json['data'] != null ? Map<String, dynamic>.from(json['data']) : null,
    );
  }
}
