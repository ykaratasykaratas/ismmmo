import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../core/constants/api_constants.dart';
import '../models/user_model.dart';

class AuthService {
  Future<User?> login(String phone, String password) async {
    try {
      final response = await http.post(
        Uri.parse(ApiConstants.login),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'phone': phone, 'password': password}),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final user = User.fromJson(data);
        await _saveUser(user);
        return user;
      } else {
        throw Exception(
          jsonDecode(response.body)['error'] ?? 'Giriş yapılamadı.',
        );
      }
    } catch (e) {
      rethrow;
    }
  }

  Future<User?> register({
    required String fullName,
    required String phone,
    required String password,
    required String email,
    required String roomNumber,
    required DateTime birthDate,
  }) async {
    try {
      final response = await http.post(
        Uri.parse(ApiConstants.register),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'fullName': fullName,
          'phone': phone,
          'password': password,
          'email': email,
          'roomNumber': roomNumber,
          'birthDate': birthDate.toIso8601String(),
        }),
      );

      if (response.statusCode == 201) {
        final data = jsonDecode(response.body);
        return User.fromJson(data);
      } else {
        throw Exception(
          jsonDecode(response.body)['error'] ?? 'Kayıt yapılamadı.',
        );
      }
    } catch (e) {
      rethrow;
    }
  }

  Future<void> _saveUser(User user) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('user', jsonEncode(user.toJson()));
  }

  Future<User?> getUser() async {
    final prefs = await SharedPreferences.getInstance();
    final userStr = prefs.getString('user');
    if (userStr != null) {
      return User.fromJson(jsonDecode(userStr));
    }
    return null;
  }

  Future<void> changePassword(
    String userId,
    String oldPassword,
    String newPassword,
  ) async {
    try {
      final response = await http.post(
        Uri.parse('${ApiConstants.baseUrl}/api/auth/change-password'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'userId': userId,
          'oldPassword': oldPassword,
          'newPassword': newPassword,
        }),
      );

      if (response.statusCode != 200) {
        throw Exception(
          jsonDecode(response.body)['error'] ?? 'Şifre değiştirilemedi.',
        );
      }
    } catch (e) {
      rethrow;
    }
  }

  Future<User> updateProfile(String userId, Map<String, dynamic> data) async {
    try {
      final response = await http.patch(
        Uri.parse(
          '${ApiConstants.baseUrl}/api/users/$userId',
        ), // Using the generic user update endpoint
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(data),
      );

      if (response.statusCode == 200) {
        final responseData = jsonDecode(response.body);
        final updatedUser = User.fromJson(responseData);
        await _saveUser(updatedUser); // Update local storage
        return updatedUser;
      } else {
        throw Exception(
          jsonDecode(response.body)['error'] ?? 'Profil güncellenemedi.',
        );
      }
    } catch (e) {
      rethrow;
    }
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('user');
  }
}
