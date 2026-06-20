class WithdrawalModel {
  final String id;
  final String status;
  final int amount;
  final String? upiId;
  final Map<String, dynamic>? bankDetails;
  final String? rejectionReason;
  final String? razorpayPayoutId;
  final String? createdAt;
  final String? updatedAt;

  WithdrawalModel({
    required this.id, required this.status, required this.amount,
    this.upiId, this.bankDetails, this.rejectionReason, this.razorpayPayoutId,
    this.createdAt, this.updatedAt,
  });

  factory WithdrawalModel.fromJson(Map<String, dynamic> json) {
    return WithdrawalModel(
      id: json['_id'] ?? json['id'] ?? '',
      status: json['status'] ?? '',
      amount: json['amount'] ?? 0,
      upiId: json['upiId'],
      bankDetails: json['bankDetails'] != null ? Map<String, dynamic>.from(json['bankDetails']) : null,
      rejectionReason: json['rejectionReason'],
      razorpayPayoutId: json['razorpayPayoutId'],
      createdAt: json['createdAt'],
      updatedAt: json['updatedAt'],
    );
  }
}
