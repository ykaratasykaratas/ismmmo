import 'dart:convert';
import 'package:http/http.dart' as http;
import '../core/constants/api_constants.dart';
import '../models/announcement_model.dart';
import 'auth_service.dart';

class AnnouncementService {
  final AuthService _authService = AuthService();

  Future<List<Announcement>> getAnnouncements() async {
    try {
      final user = await _authService.getUser();
      String url = ApiConstants.announcements;
      if (user?.categoryId != null) {
        url += '?categoryId=${user!.categoryId}';
      }

      final response = await http.get(Uri.parse(url));

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((json) => Announcement.fromJson(json)).toList();
      } else {
        throw Exception('Duyurular yüklenemedi');
      }
    } catch (e) {
      throw Exception('Bağlantı hatası: $e');
    }
  }

  Future<void> joinEvent(String announcementId, int plusCount) async {
    try {
      final user = await _authService.getUser();
      if (user == null) throw Exception('Giriş yapmalısınız');

      final response = await http.post(
        Uri.parse(ApiConstants.participations),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'announcementId': announcementId,
          'userId': user.id,
          'plusCount': plusCount,
        }),
      );

      if (response.statusCode != 201) {
        final error = jsonDecode(response.body)['error'];
        throw Exception(error ?? 'Katılım başarısız');
      }
    } catch (e) {
      rethrow;
    }
  }
}
