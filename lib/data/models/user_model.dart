class UserModel {
  final String id;
  final String name;
  final String email;
  final String role;
  final int coins;
  final String? mobile;
  final String? createdAt;

  UserModel({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
    this.coins = 0,
    this.mobile,
    this.createdAt,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] ?? json['_id'] ?? '',
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      role: json['role'] ?? 'user',
      coins: json['coins'] ?? 0,
      mobile: json['mobile'],
      createdAt: json['createdAt'],
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id, 'name': name, 'email': email,
    'role': role, 'coins': coins, 'mobile': mobile, 'createdAt': createdAt,
  };

  UserModel copyWith({String? name, int? coins, String? mobile}) {
    return UserModel(
      id: id, name: name ?? this.name, email: email,
      role: role, coins: coins ?? this.coins,
      mobile: mobile ?? this.mobile, createdAt: createdAt,
    );
  }
}
