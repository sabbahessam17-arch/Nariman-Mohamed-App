import 'package:flutter/services.dart';

class SoundService {
  SoundService._();
  static final SoundService instance = SoundService._();

  bool _muted = false;

  void setMuted(bool muted) {
    _muted = muted;
  }

  Future<void> playTap() async {
    if (_muted) return;
    await HapticFeedback.lightImpact();
    await SystemSound.play(SystemSoundType.click);
  }

  Future<void> playPick() async {
    if (_muted) return;
    await HapticFeedback.selectionClick();
  }

  Future<void> playSuccess() async {
    if (_muted) return;
    await HapticFeedback.mediumImpact();
    await SystemSound.play(SystemSoundType.click);
  }

  Future<void> playError() async {
    if (_muted) return;
    await HapticFeedback.heavyImpact();
  }

  Future<void> playStar() async {
    if (_muted) return;
    await HapticFeedback.mediumImpact();
    await SystemSound.play(SystemSoundType.click);
  }

  Future<void> playCelebration() async {
    if (_muted) return;
    await HapticFeedback.heavyImpact();
  }
}
