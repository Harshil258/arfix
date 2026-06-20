class SupportMessageModel {
  final String id;
  final String subject;
  final String? message;
  final String? preview;
  final String status;
  final bool isReadByStaff;
  final String? createdAt;
  final String? updatedAt;

  SupportMessageModel({
    required this.id, required this.subject,
    this.message, this.preview, required this.status,
    this.isReadByStaff = false, this.createdAt, this.updatedAt,
  });

  factory SupportMessageModel.fromJson(Map<String, dynamic> json) {
    return SupportMessageModel(
      id: json['id'] ?? json['_id'] ?? '',
      subject: json['subject'] ?? '',
      message: json['message'],
      preview: json['preview'],
      status: json['status'] ?? 'OPEN',
      isReadByStaff: json['isReadByStaff'] ?? false,
      createdAt: json['createdAt'],
      updatedAt: json['updatedAt'],
    );
  }
}
