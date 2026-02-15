import 'package:flutter/material.dart';
import '../../core/theme/colors.dart';
import 'login_screen.dart'; // We'll refactor or import content from here
import 'register_screen.dart'; // We'll refactor or import content from here

class AuthScreen extends StatefulWidget {
  const AuthScreen({super.key});

  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Logo Area
                Container(
                  width: 100,
                  height: 100,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.1),
                        blurRadius: 10,
                        offset: const Offset(0, 5),
                      ),
                    ],
                  ),
                  padding: const EdgeInsets.all(16),
                  child: Image.asset(
                    'assets/images/logo.png', // Fallback to icon if needed
                    errorBuilder: (context, error, stackTrace) => const Icon(
                      Icons.account_balance,
                      size: 50,
                      color: AppColors.primary,
                    ),
                  ),
                ),
                const SizedBox(height: 24),
                const Text(
                  'İSMMMO',
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                    color: AppColors.primary,
                    letterSpacing: 1.2,
                  ),
                ),
                const Text(
                  'KARTAL İLÇE TEMSİLCİLİĞİ',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textLight,
                    letterSpacing: 1.0,
                  ),
                ),
                const SizedBox(height: 32),

                // Tab Buttons
                Container(
                  padding: const EdgeInsets.all(6),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.grey.shade200),
                  ),
                  child: TabBar(
                    controller: _tabController,
                    indicator: BoxDecoration(
                      color: AppColors.primary.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(
                        color: AppColors.primary.withOpacity(0.2),
                      ),
                    ),
                    labelColor: AppColors.primary,
                    unselectedLabelColor: AppColors.textLight,
                    labelStyle: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                    ),
                    overlayColor: MaterialStateProperty.all(Colors.transparent),
                    tabs: const [
                      Tab(text: 'Giriş Yap'),
                      Tab(text: 'Kayıt Ol'),
                    ],
                  ),
                ),

                const SizedBox(height: 24),

                // Tab View
                SizedBox(
                  height:
                      500, // Fixed height for forms, or use ExpandablePageView
                  child: TabBarView(
                    controller: _tabController,
                    physics:
                        const NeverScrollableScrollPhysics(), // Disable swipe
                    children: const [LoginTab(), RegisterTab()],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

// Extract Login Form logic here (simplified for brevity, we will move logic from LoginScreen)
class LoginTab extends StatelessWidget {
  const LoginTab({super.key});
  @override
  Widget build(BuildContext context) {
    // We will reuse the LoginScreen logic here, but adapted for the tab
    // For now, I'll instantiate the LoginScreen but we should ideally refactor it
    // to be a widget that takes up space without its own Scaffold.
    // However, since LoginScreen has a Scaffold, we need to extract its body.
    // To save time and keep it clean, I will wrap the existing LoginScreen logic
    // into a widget in the next steps or modify LoginScreen to be a partial.
    return const LoginScreenContent();
  }
}

// Placeholder for Register Tab
class RegisterTab extends StatelessWidget {
  const RegisterTab({super.key});
  @override
  Widget build(BuildContext context) {
    return const RegisterScreenContent();
  }
}

// We need to modify LoginScreen and RegisterScreen to expose their content as widgets
// OR copy-paste the logic here. Given the prompt, I'll update LoginScreen and RegisterScreen
// to be usable as parts.
