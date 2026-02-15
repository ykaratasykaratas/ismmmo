import 'package:flutter/material.dart';
import '../../services/auth_service.dart';
import '../../core/theme/colors.dart';
import 'package:intl/intl.dart';

class RegisterScreenContent extends StatefulWidget {
  const RegisterScreenContent({super.key});

  @override
  State<RegisterScreenContent> createState() => _RegisterScreenContentState();
}

class _RegisterScreenContentState extends State<RegisterScreenContent> {
  final _formKey = GlobalKey<FormState>();
  final _fullNameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _passwordController = TextEditingController();
  final _emailController = TextEditingController();
  final _roomNumberController = TextEditingController();
  DateTime? _birthDate;
  bool _isLoading = false;

  Future<void> _register() async {
    if (!_formKey.currentState!.validate()) return;
    if (_birthDate == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Lütfen doğum tarihinizi seçiniz')),
      );
      return;
    }

    setState(() => _isLoading = true);

    try {
      final authService = AuthService();
      await authService.register(
        fullName: _fullNameController.text,
        phone: _phoneController.text,
        password: _passwordController.text,
        email: _emailController.text,
        roomNumber: _roomNumberController.text,
        birthDate: _birthDate!,
      );
      if (!mounted) return;

      await showDialog(
        context: context,
        barrierDismissible: false,
        builder: (ctx) => AlertDialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          title: const Column(
            children: [
              Icon(Icons.check_circle, color: AppColors.success, size: 48),
              SizedBox(height: 16),
              Text(
                'Kayıt Başarılı!',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
            ],
          ),
          content: const Text(
            'Üyelik başvurunuz başarıyla iletildi. Hesabınız yönetici onayı sonrasında aktifleşecektir.',
            textAlign: TextAlign.center,
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(ctx);
                // In a tabbed view, we might want to switch tabs, but for now just closing dialog is fine.
              },
              child: const Text(
                'TAMAM',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
            ),
          ],
        ),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(e.toString()),
          backgroundColor: AppColors.warning,
        ),
      );
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 0,
      color: Colors.white,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: const BorderSide(color: Color(0xFFE0E0E0)),
      ),
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              _buildTextField(
                _fullNameController,
                'Ad Soyad',
                Icons.person_outline,
                capitalize: true,
              ),
              const SizedBox(height: 16),
              InkWell(
                onTap: () async {
                  final date = await showDatePicker(
                    context: context,
                    initialDate: DateTime(1990),
                    firstDate: DateTime(1950),
                    lastDate: DateTime.now(),
                    locale: const Locale('tr', 'TR'),
                  );
                  if (date != null) setState(() => _birthDate = date);
                },
                child: InputDecorator(
                  decoration: InputDecoration(
                    labelText: 'Doğum Tarihi',
                    prefixIcon: const Icon(
                      Icons.calendar_today_outlined,
                      color: Colors.grey,
                    ),
                    filled: true,
                    fillColor: AppColors.background,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide.none,
                    ),
                    contentPadding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 12,
                    ),
                  ),
                  child: Text(
                    _birthDate != null
                        ? DateFormat('dd.MM.yyyy').format(_birthDate!)
                        : 'Seçiniz',
                    style: TextStyle(
                      color: _birthDate != null
                          ? AppColors.text
                          : Colors.grey[600],
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 16),
              _buildTextField(
                _phoneController,
                'Cep Telefonu',
                Icons.phone_android,
                type: TextInputType.phone,
              ),
              const SizedBox(height: 16),
              _buildTextField(
                _emailController,
                'E-posta',
                Icons.alternate_email,
                type: TextInputType.emailAddress,
              ),
              const SizedBox(height: 16),
              _buildTextField(
                _roomNumberController,
                'Oda Sicil No',
                Icons.badge_outlined,
                type: TextInputType.number,
              ),

              const SizedBox(height: 16),
              _buildTextField(
                _passwordController,
                'Şifre Belirleyin',
                Icons.lock_outline,
                obscure: true,
              ),

              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    elevation: 4,
                  ),
                  onPressed: _isLoading ? null : _register,
                  child: _isLoading
                      ? const SizedBox(
                          height: 20,
                          width: 20,
                          child: CircularProgressIndicator(
                            color: Colors.white,
                            strokeWidth: 2,
                          ),
                        )
                      : const Text(
                          'KAYIT OL',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                          ),
                        ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTextField(
    TextEditingController controller,
    String label,
    IconData icon, {
    TextInputType? type,
    bool obscure = false,
    bool capitalize = false,
  }) {
    return TextFormField(
      controller: controller,
      decoration: InputDecoration(
        labelText: label,
        prefixIcon: Icon(icon, color: Colors.grey),
        filled: true,
        fillColor: AppColors.background,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
        contentPadding: const EdgeInsets.all(16),
      ),
      keyboardType: type,
      obscureText: obscure,
      textCapitalization: capitalize
          ? TextCapitalization.words
          : TextCapitalization.none,
      validator: (v) => v!.isEmpty ? 'Gerekli alan' : null,
    );
  }
}

class RegisterScreen extends StatelessWidget {
  const RegisterScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Yeni Üye Kaydı')),
      body: const SingleChildScrollView(
        padding: EdgeInsets.all(24),
        child: RegisterScreenContent(),
      ),
    );
  }
}
