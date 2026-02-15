import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../core/theme/colors.dart';
import '../../services/auth_service.dart';
import '../../services/notification_service.dart';
import 'package:provider/provider.dart';

class MenuScreen extends StatefulWidget {
  const MenuScreen({super.key});

  @override
  State<MenuScreen> createState() => _MenuScreenState();
}

class _MenuScreenState extends State<MenuScreen> {
  bool _notificationsEnabled = true;

  @override
  void initState() {
    super.initState();
    _loadNotificationPreference();
  }

  Future<void> _loadNotificationPreference() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _notificationsEnabled = prefs.getBool('notifications_enabled') ?? true;
    });
  }

  Future<void> _toggleNotifications(bool value) async {
    setState(() {
      _notificationsEnabled = value;
    });

    await NotificationService().toggleNotifications(value);

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(value ? 'Bildirimler açıldı' : 'Bildirimler kapatıldı'),
          duration: const Duration(seconds: 1),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Menü'), centerTitle: true),
      body: ListView(
        children: [
          const SizedBox(height: 16),
          // Profile Section
          _buildMenuItem(
            context,
            icon: Icons.person_outline,
            title: 'Profilim',
            subtitle: 'Kişisel bilgilerinizi düzenleyin',
            onTap: () {
              Navigator.pushNamed(context, '/profile');
            },
          ),
          const Divider(),

          // Settings Section
          _buildMenuItem(
            context,
            icon: Icons.notifications_outlined,
            title: 'Bildirim Ayarları',
            subtitle: 'Bildirimleri açıp kapatın',
            trailing: Switch(
              value: _notificationsEnabled,
              onChanged: _toggleNotifications,
              activeColor: AppColors.primary,
            ),
            onTap: () {},
          ),
          _buildMenuItem(
            context,
            icon: Icons.lock_outline,
            title: 'Şifre Değiştir',
            onTap: () {
              Navigator.pushNamed(context, '/change-password');
            },
          ),
          const Divider(),

          // Logout Section
          _buildMenuItem(
            context,
            icon: Icons.exit_to_app,
            title: 'Çıkış Yap',
            textColor: Colors.red,
            iconColor: Colors.red,
            onTap: () {
              _showLogoutDialog(context);
            },
          ),
        ],
      ),
    );
  }

  Widget _buildMenuItem(
    BuildContext context, {
    required IconData icon,
    required String title,
    String? subtitle,
    Widget? trailing,
    Color? textColor,
    Color? iconColor,
    required VoidCallback onTap,
  }) {
    return ListTile(
      leading: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: (iconColor ?? AppColors.primary).withOpacity(0.1),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Icon(icon, color: iconColor ?? AppColors.primary),
      ),
      title: Text(
        title,
        style: TextStyle(
          fontWeight: FontWeight.w600,
          color: textColor ?? AppColors.text,
        ),
      ),
      subtitle: subtitle != null
          ? Text(
              subtitle,
              style: TextStyle(fontSize: 12, color: Colors.grey[600]),
            )
          : null,
      trailing: trailing ?? const Icon(Icons.chevron_right, color: Colors.grey),
      onTap: onTap,
    );
  }

  void _showLogoutDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Çıkış Yap'),
        content: const Text(
          'Hesabınızdan çıkış yapmak istediğinize emin misiniz?',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('İptal'),
          ),
          TextButton(
            onPressed: () async {
              Navigator.pop(ctx);
              // Use listen: false to avoid rebuilding dialogue
              final authService = Provider.of<AuthService>(
                context,
                listen: false,
              );
              await authService.logout();
              if (context.mounted) {
                // Exit the app completely
                SystemNavigator.pop();
              }
            },
            child: const Text('Çıkış Yap', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
  }
}
