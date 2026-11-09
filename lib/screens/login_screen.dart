import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/stations_data.dart';
import '../providers/app_state_provider.dart';
import '../services/sound_service.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final TextEditingController _nameController = TextEditingController();
  String _selectedAvatar = kAvatars.first;
  bool _hasError = false;

  @override
  void dispose() {
    _nameController.dispose();
    super.dispose();
  }

  void _submitLogin() {
    final name = _nameController.text.trim();
    if (name.isEmpty) {
      setState(() => _hasError = true);
      SoundService.instance.playError();
      return;
    }
    ref.read(appStateProvider.notifier).login(name, _selectedAvatar);
  }

  @override
  Widget build(BuildContext context) {
    final appState = ref.watch(appStateProvider);

    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFFEFF6FF), Color(0xFFF8FAFC), Color(0xFFDBEAFE)],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Top Bar
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        Container(
                          width: 40,
                          height: 40,
                          decoration: BoxDecoration(
                            color: const Color(0xFF2563EB),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          alignment: Alignment.center,
                          child: const Text('⚙️', style: TextStyle(fontSize: 22)),
                        ),
                        const SizedBox(width: 10),
                        const Text(
                          'مهندس المستقبل',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.w900,
                            color: Color(0xFF1E40AF),
                          ),
                        ),
                      ],
                    ),
                    IconButton.filledTonal(
                      onPressed: () => ref.read(appStateProvider.notifier).toggleMute(),
                      icon: Icon(
                        appState.isMuted ? Icons.volume_off_rounded : Icons.volume_up_rounded,
                        color: appState.isMuted ? Colors.redAccent : const Color(0xFF2563EB),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 28),

                // Hero Tag
                Center(
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                    decoration: BoxDecoration(
                      color: const Color(0xFFDBEAFE),
                      borderRadius: BorderRadius.circular(999),
                    ),
                    child: const Text(
                      '🚀 رحلة تفاعلية للمهندسين الصغار',
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w800,
                        color: Color(0xFF1E40AF),
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 20),

                // Avatar Preview
                Center(
                  child: Container(
                    width: 104,
                    height: 104,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      shape: BoxShape.circle,
                      border: Border.all(color: const Color(0xFFDBEAFE), width: 5),
                      boxShadow: const [
                        BoxShadow(
                          color: Color(0xFF93C5FD),
                          offset: Offset(0, 6),
                          blurRadius: 0,
                        ),
                      ],
                    ),
                    alignment: Alignment.center,
                    child: Text(_selectedAvatar, style: const TextStyle(fontSize: 52)),
                  ),
                ),
                const SizedBox(height: 20),

                const Text(
                  'مهندس المستقبل',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 32,
                    fontWeight: FontWeight.w900,
                    color: Color(0xFF0F2A47),
                  ),
                ),
                const Text(
                  'ابنِ أفكارك.. وغيّر العالم!',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w800,
                    color: Color(0xFFB45309),
                  ),
                ),
                const SizedBox(height: 24),

                // Card Form
                Container(
                  padding: const EdgeInsets.all(22),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(28),
                    boxShadow: const [
                      BoxShadow(
                        color: Color(0xFF93C5FD),
                        offset: Offset(0, 7),
                        blurRadius: 0,
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      const Text(
                        'سجّل دخولك',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.w900,
                          color: Color(0xFF0F2A47),
                        ),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        'اكتب اسمك واختر شخصيتك لتبدأ',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFF7B8FA8),
                        ),
                      ),
                      const SizedBox(height: 16),

                      TextField(
                        controller: _nameController,
                        maxLength: 18,
                        textAlign: TextAlign.center,
                        onChanged: (_) {
                          if (_hasError) setState(() => _hasError = false);
                        },
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w800,
                          color: Color(0xFF0F2A47),
                        ),
                        decoration: InputDecoration(
                          counterText: '',
                          hintText: 'اسمك هنا',
                          filled: true,
                          fillColor: const Color(0xFFF8FBFF),
                          errorText: _hasError ? 'يرجى كتابة اسمك للبدء' : null,
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(18),
                            borderSide: BorderSide(
                              color: _hasError ? Colors.red : const Color(0xFFDCE7F5),
                              width: 2.5,
                            ),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(18),
                            borderSide: const BorderSide(
                              color: Color(0xFF2563EB),
                              width: 2.5,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),

                      // Avatar Picker
                      Wrap(
                        alignment: WrapAlignment.center,
                        spacing: 10,
                        runSpacing: 10,
                        children: kAvatars.map((av) {
                          final isSelected = av == _selectedAvatar;
                          return GestureDetector(
                            onTap: () {
                              SoundService.instance.playPick();
                              setState(() => _selectedAvatar = av);
                            },
                            child: AnimatedContainer(
                              duration: const Duration(milliseconds: 200),
                              width: 52,
                              height: 52,
                              decoration: BoxDecoration(
                                color: isSelected
                                    ? const Color(0xFFDBEAFE)
                                    : const Color(0xFFF1F6FD),
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(
                                  color: isSelected
                                      ? const Color(0xFF2563EB)
                                      : const Color(0xFFDCE7F5),
                                  width: 2.5,
                                ),
                              ),
                              alignment: Alignment.center,
                              child: Text(av, style: const TextStyle(fontSize: 28)),
                            ),
                          );
                        }).toList(),
                      ),
                      const SizedBox(height: 22),

                      ElevatedButton(
                        onPressed: _submitLogin,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF2563EB),
                          foregroundColor: Colors.white,
                          minimumSize: const Size(double.infinity, 56),
                        ),
                        child: const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text('ادخل الآن'),
                            SizedBox(width: 8),
                            Icon(Icons.arrow_forward_rounded),
                          ],
                        ),
                      ),
                      const SizedBox(height: 8),
                      TextButton(
                        onPressed: () => ref.read(appStateProvider.notifier).guestLogin(),
                        child: const Text(
                          'الدخول كضيف',
                          style: TextStyle(
                            fontWeight: FontWeight.w700,
                            color: Color(0xFF7B8FA8),
                            decoration: TextDecoration.underline,
                          ),
                        ),
                      ),
                    ],
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
