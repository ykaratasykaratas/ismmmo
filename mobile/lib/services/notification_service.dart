import 'dart:convert';
import 'dart:io';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

import '../core/constants/api_constants.dart';

class NotificationService {
  final FirebaseMessaging _firebaseMessaging = FirebaseMessaging.instance;

  Future<void> initialize() async {
    final prefs = await SharedPreferences.getInstance();
    final bool isEnabled = prefs.getBool('notifications_enabled') ?? true;

    if (!isEnabled) {
      debugPrint('Notifications are disabled by user.');
      return;
    }

    // Request permission for iOS
    if (Platform.isIOS) {
      await _firebaseMessaging.requestPermission(
        alert: true,
        badge: true,
        sound: true,
      );
    }

    // Get FCM Token
    try {
      String? token;

      // Retry up to 5 times
      for (int i = 0; i < 5; i++) {
        try {
          token = await _firebaseMessaging.getToken();
          if (token != null) break;
        } catch (e) {
          debugPrint('FCM Token Retry ${i + 1}: $e');
          if (i < 4) await Future.delayed(const Duration(seconds: 5));
        }
      }

      if (token != null) {
        debugPrint('FCM Token: $token');
        await _sendTokenToBackend(token);
      } else {
        debugPrint('FCM Token could not be retrieved.');
      }

      // Listen for token refreshes
      _firebaseMessaging.onTokenRefresh.listen((newToken) {
        debugPrint('NotificationService: Token Refreshed: $newToken');
        _sendTokenToBackend(newToken);
      });

      // Handle Foreground Messages
      FirebaseMessaging.onMessage.listen((RemoteMessage message) {
        debugPrint('Got a message whilst in the foreground!');
        debugPrint('Message data: ${message.data}');

        if (message.notification != null) {
          debugPrint(
            'Message also contained a notification: ${message.notification}',
          );
          // You could show a local notification here if needed
        }
      });
    } catch (e) {
      debugPrint('Error getting FCM token: $e');
    }
  }

  Future<void> toggleNotifications(bool enable) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('notifications_enabled', enable);

    if (enable) {
      await initialize();
    } else {
      try {
        await _firebaseMessaging.deleteToken();
        debugPrint('Notifications disabled: FCM Token deleted.');
      } catch (e) {
        debugPrint('Error disabling notifications: $e');
      }
    }
  }

  Future<void> _sendTokenToBackend(String token) async {
    try {
      // Create/Get user ID if logged in (optional implementation detail)
      final prefs = await SharedPreferences.getInstance();
      final userData = prefs.getString('user_data');
      String? userId;

      if (userData != null) {
        final user = jsonDecode(userData);
        userId = user['id'];
      }

      final url = Uri.parse(ApiConstants.deviceToken);

      debugPrint('NotificationService: Sending token to backend: $url');
      debugPrint(
        'NotificationService: Request Body: ${jsonEncode({'token': token, 'userId': userId})}',
      );

      final response = await http.post(
        url,
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: jsonEncode({'token': token, 'userId': userId}),
      );

      debugPrint(
        'NotificationService: Response Status: ${response.statusCode}',
      );
      debugPrint('NotificationService: Response Body: ${response.body}');

      if (response.statusCode == 200) {
        debugPrint('NotificationService: Token registered successfully');
      } else {
        debugPrint('NotificationService: Failed to register token');
      }
    } catch (e) {
      debugPrint('NotificationService: Error sending token to backend: $e');
    }
  }
}
