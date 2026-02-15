import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/auth_service.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    _checkLogin();
  }

  Future<void> _checkLogin() async {
    await Future.delayed(const Duration(seconds: 2)); // Simulate loading
    if (!mounted) return;

    final authService = Provider.of<AuthService>(context, listen: false);
    final user = await authService.getUser();
    debugPrint('SplashScreen: User found: ${user?.fullName}');

    if (user != null) {
      debugPrint('SplashScreen: Navigate to /main');
      Navigator.pushReplacementNamed(context, '/main');
    } else {
      debugPrint('SplashScreen: Navigate to /auth');
      Navigator.pushReplacementNamed(
        context,
        '/auth',
      ); // Navigate to AuthScreen (which contains Login)
    }
  }

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.business, size: 80, color: Color(0xFF1A237E)),
            SizedBox(height: 16),
            Text(
              'İSMMMO\nKartal Temsilciliği',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Color(0xFF1A237E),
              ),
            ),
            SizedBox(height: 24),
            CircularProgressIndicator(),
          ],
        ),
      ),
    );
  }
}
