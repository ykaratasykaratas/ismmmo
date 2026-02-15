class User {
  final String id;
  final String fullName;
  final String phone;
  final String roomNumber;
  final String email;
  final String status;
  final String? categoryId;

  User({
    required this.id,
    required this.fullName,
    required this.phone,
    required this.roomNumber,
    required this.email,
    required this.status,
    this.categoryId,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      fullName: json['fullName'],
      phone: json['phone'],
      roomNumber: json['roomNumber'],
      email: json['email'],
      status: json['status'],
      categoryId: json['categoryId'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'fullName': fullName,
      'phone': phone,
      'roomNumber': roomNumber,
      'email': email,
      'status': status,
      'categoryId': categoryId,
    };
  }
}
