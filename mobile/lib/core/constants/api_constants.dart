class ApiConstants {
  // Replace with your machine's local IP
  static const String baseUrl = 'http://192.168.1.36:3000/api';

  static const String login = '$baseUrl/auth/login';
  static const String register = '$baseUrl/auth/register';
  static const String users = '$baseUrl/users';
  static const String announcements = '$baseUrl/announcements';
  static const String participations = '$baseUrl/participations';
}
