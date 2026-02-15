import 'package:flutter/material.dart';
import '../core/theme/colors.dart';
import 'home/home_screen.dart';

class MainScaffold extends StatefulWidget {
  const MainScaffold({super.key});

  @override
  State<MainScaffold> createState() => _MainScaffoldState();
}

class _MainScaffoldState extends State<MainScaffold> {
  int _selectedIndex = 0;

  final List<Widget> _pages = [
    const HomeScreen(),
    const Placeholder(
      child: Center(child: Text('Takvim')),
    ), // Calendar Placeholder
    const SizedBox(), // Placeholder for FAB
    const Placeholder(
      child: Center(child: Text('Profil')),
    ), // Profile Placeholder
    const Placeholder(child: Center(child: Text('Menü'))), // Menu Placeholder
  ];

  void _onItemTapped(int index) {
    if (index == 2) return; // Middle button is handled by FAB
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _pages[_selectedIndex],
      floatingActionButton: Container(
        height: 64,
        width: 64,
        margin: const EdgeInsets.only(top: 20),
        child: FloatingActionButton(
          onPressed: () {
            // Action for FAB
          },
          backgroundColor: AppColors.primary,
          elevation: 4,
          shape: const CircleBorder(),
          child: const Icon(Icons.add, size: 32, color: Colors.white),
        ),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
      bottomNavigationBar: BottomAppBar(
        shape: const CircularNotchedRectangle(),
        notchMargin: 8.0,
        color: Colors.white,
        child: SizedBox(
          height: 60,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildNavItem(icon: Icons.home, label: 'Ana Sayfa', index: 0),
              _buildNavItem(
                icon: Icons.calendar_today,
                label: 'Takvim',
                index: 1,
              ),
              const SizedBox(width: 48), // Space for FAB
              _buildNavItem(icon: Icons.person, label: 'Profil', index: 3),
              _buildNavItem(icon: Icons.menu, label: 'Menü', index: 4),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildNavItem({
    required IconData icon,
    required String label,
    required int index,
  }) {
    final isSelected = _selectedIndex == index;
    return InkWell(
      onTap: () => _onItemTapped(index),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            icon,
            color: isSelected ? AppColors.primary : Colors.grey,
            size: 26,
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: TextStyle(
              color: isSelected ? AppColors.primary : Colors.grey,
              fontSize: 10,
              fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
            ),
          ),
        ],
      ),
    );
  }
}
