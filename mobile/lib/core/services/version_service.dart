import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:package_info_plus/package_info_plus.dart';
import 'package:url_launcher/url_launcher.dart';
import '../constants/api_constants.dart';

class VersionService {
  static Future<void> checkVersion(BuildContext context) async {
    try {
      // 1. Get Current App Version
      PackageInfo packageInfo = await PackageInfo.fromPlatform();
      String currentVersion = packageInfo.version;

      // 2. Fetch Latest Version from API
      final response = await http.get(
        Uri.parse('${ApiConstants.baseUrl}/mobile-version'),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        String latestVersion = data['version'] ?? '1.0.0';
        String updateUrl = data['url'] ?? '';
        bool forceUpdate = data['forceUpdate'] ?? false;

        // 3. Compare Versions
        if (_isUpdateAvailable(currentVersion, latestVersion)) {
          if (context.mounted) {
            _showUpdateDialog(context, latestVersion, updateUrl, forceUpdate);
          }
        }
      }
    } catch (e) {
      debugPrint('Version check failed: $e');
    }
  }

  static bool _isUpdateAvailable(String current, String latest) {
    try {
      List<int> currentParts = current.split('.').map(int.parse).toList();
      List<int> latestParts = latest.split('.').map(int.parse).toList();

      for (int i = 0; i < 3; i++) {
        int c = i < currentParts.length ? currentParts[i] : 0;
        int l = i < latestParts.length ? latestParts[i] : 0;
        if (l > c) return true;
        if (l < c) return false;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  static void _showUpdateDialog(
    BuildContext context,
    String version,
    String url,
    bool forceUpdate,
  ) {
    showDialog(
      context: context,
      barrierDismissible: !forceUpdate,
      builder: (context) => WillPopScope(
        onWillPop: () async => !forceUpdate,
        child: AlertDialog(
          title: const Text('Yeni Güncelleme Mevcut!'),
          content: Text(
            forceUpdate
                ? 'Lütfen devam etmek için uygulamanızı $version sürümüne güncelleyin.'
                : 'Uygulamanın yeni bir sürümü ($version) mevcut. İndirmek ister misiniz?',
          ),
          actions: [
            if (!forceUpdate)
              TextButton(
                onPressed: () => Navigator.pop(context),
                child: const Text('Daha Sonra'),
              ),
            FilledButton(
              onPressed: () {
                _launchURL(url);
              },
              child: const Text('Güncelle'),
            ),
          ],
        ),
      ),
    );
  }

  static Future<void> _launchURL(String urlString) async {
    if (urlString.isEmpty) return;
    final Uri url = Uri.parse(urlString);
    if (!await launchUrl(url, mode: LaunchMode.externalApplication)) {
      debugPrint('Could not launch $url');
    }
  }
}
