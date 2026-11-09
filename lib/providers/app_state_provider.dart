import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../data/stations_data.dart';
import '../services/sound_service.dart';

final sharedPreferencesProvider = Provider<SharedPreferences>((ref) {
  throw UnimplementedError('SharedPreferences must be overridden in main()');
});

class AppState {
  final String name;
  final String avatar;
  final bool isLoggedIn;
  final Map<String, bool> readCards;
  final Map<int, bool> completedActivities;
  final bool isMuted;

  const AppState({
    required this.name,
    required this.avatar,
    required this.isLoggedIn,
    required this.readCards,
    required this.completedActivities,
    required this.isMuted,
  });

  int get totalStars {
    final cardsStars = readCards.values.where((v) => v).length;
    final actsStars = completedActivities.values.where((v) => v).length * 3;
    return cardsStars + actsStars;
  }

  int get maxStars {
    return kStationsData.fold(0, (sum, s) => sum + s.cards.length + 3);
  }

  int getReadCount(int stationId) {
    final station = kStationsData[stationId];
    int count = 0;
    for (int i = 0; i < station.cards.length; i++) {
      if (readCards['$stationId-$i'] == true) {
        count++;
      }
    }
    return count;
  }

  bool isCardRead(int stationId, int cardIndex) {
    return readCards['$stationId-$cardIndex'] == true;
  }

  bool isActivityDone(int stationId) {
    return completedActivities[stationId] == true;
  }

  bool isStationCompleted(int stationId) {
    final station = kStationsData[stationId];
    return getReadCount(stationId) == station.cards.length && isActivityDone(stationId);
  }

  AppState copyWith({
    String? name,
    String? avatar,
    bool? isLoggedIn,
    Map<String, bool>? readCards,
    Map<int, bool>? completedActivities,
    bool? isMuted,
  }) {
    return AppState(
      name: name ?? this.name,
      avatar: avatar ?? this.avatar,
      isLoggedIn: isLoggedIn ?? this.isLoggedIn,
      readCards: readCards ?? this.readCards,
      completedActivities: completedActivities ?? this.completedActivities,
      isMuted: isMuted ?? this.isMuted,
    );
  }
}

class AppStateNotifier extends StateNotifier<AppState> {
  final SharedPreferences _prefs;
  static const String _storageKey = 'future_engineer_state_v1';

  AppStateNotifier(this._prefs)
      : super(const AppState(
          name: '',
          avatar: '👷‍♀️',
          isLoggedIn: false,
          readCards: {},
          completedActivities: {},
          isMuted: false,
        )) {
    _loadFromStorage();
  }

  void _loadFromStorage() {
    final raw = _prefs.getString(_storageKey);
    if (raw == null) return;
    try {
      final data = jsonDecode(raw) as Map<String, dynamic>;
      final readMap = <String, bool>{};
      if (data['readCards'] is Map) {
        (data['readCards'] as Map).forEach((k, v) {
          readMap[k.toString()] = v == true;
        });
      }
      final actMap = <int, bool>{};
      if (data['completedActivities'] is Map) {
        (data['completedActivities'] as Map).forEach((k, v) {
          final parsedKey = int.tryParse(k.toString());
          if (parsedKey != null) {
            actMap[parsedKey] = v == true;
          }
        });
      }
      state = AppState(
        name: (data['name'] as String?) ?? '',
        avatar: (data['avatar'] as String?) ?? '👷‍♀️',
        isLoggedIn: data['isLoggedIn'] == true,
        readCards: readMap,
        completedActivities: actMap,
        isMuted: data['isMuted'] == true,
      );
      SoundService.instance.setMuted(state.isMuted);
    } catch (_) {}
  }

  Future<void> _saveToStorage() async {
    final payload = {
      'name': state.name,
      'avatar': state.avatar,
      'isLoggedIn': state.isLoggedIn,
      'readCards': state.readCards,
      'completedActivities': state.completedActivities.map((k, v) => MapEntry(k.toString(), v)),
      'isMuted': state.isMuted,
    };
    await _prefs.setString(_storageKey, jsonEncode(payload));
  }

  void login(String name, String avatar) {
    final cleanName = name.trim().isEmpty ? 'مهندس صغير' : name.trim();
    state = state.copyWith(
      name: cleanName,
      avatar: avatar,
      isLoggedIn: true,
    );
    SoundService.instance.playSuccess();
    _saveToStorage();
  }

  void guestLogin() {
    login('مهندس صغير', state.avatar);
  }

  bool toggleCardRead(int stationId, int cardIndex) {
    final key = '$stationId-$cardIndex';
    final nextVal = !(state.readCards[key] ?? false);
    final updated = Map<String, bool>.from(state.readCards);
    if (nextVal) {
      updated[key] = true;
      SoundService.instance.playStar();
    } else {
      updated.remove(key);
      SoundService.instance.playTap();
    }
    state = state.copyWith(readCards: updated);
    _saveToStorage();
    return nextVal;
  }

  void completeStationActivity(int stationId) {
    final updated = Map<int, bool>.from(state.completedActivities);
    updated[stationId] = true;
    state = state.copyWith(completedActivities: updated);
    SoundService.instance.playCelebration();
    _saveToStorage();
  }

  void toggleMute() {
    final nextMuted = !state.isMuted;
    state = state.copyWith(isMuted: nextMuted);
    SoundService.instance.setMuted(nextMuted);
    if (!nextMuted) {
      SoundService.instance.playTap();
    }
    _saveToStorage();
  }

  void resetProgress() {
    state = state.copyWith(
      readCards: {},
      completedActivities: {},
    );
    SoundService.instance.playTap();
    _saveToStorage();
  }
}

final appStateProvider = StateNotifierProvider<AppStateNotifier, AppState>((ref) {
  final prefs = ref.watch(sharedPreferencesProvider);
  return AppStateNotifier(prefs);
});
