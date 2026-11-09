import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/stations_data.dart';
import '../models/station_model.dart';
import '../providers/app_state_provider.dart';
import 'station_intro_screen.dart';
import 'certificate_screen.dart';

class StationDoneScreen extends ConsumerWidget {
  final StationModel station;

  const StationDoneScreen({super.key, required this.station});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final appState = ref.watch(appStateProvider);
    final isFull = appState.isStationCompleted(station.id);
    final readCount = appState.getReadCount(station.id);
    final actDone = appState.isActivityDone(station.id);
    final isLast = station.id == kStationsData.length - 1;

    return Scaffold(
      appBar: AppBar(
        title: Text(station.name),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Spacer(),
              Center(
                child: Stack(
                  clipBehavior: Clip.none,
                  children: [
                    Container(
                      width: 140,
                      height: 140,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: station.theme.light,
                        border: Border.all(color: station.theme.primary, width: 6),
                      ),
                      alignment: Alignment.center,
                      child: Text(station.icon, style: const TextStyle(fontSize: 68)),
                    ),
                    if (isFull)
                      Positioned(
                        bottom: 0,
                        right: -4,
                        child: Container(
                          width: 44,
                          height: 44,
                          decoration: BoxDecoration(
                            color: const Color(0xFF22C55E),
                            shape: BoxShape.circle,
                            border: Border.all(color: Colors.white, width: 4),
                          ),
                          child: const Icon(Icons.check, color: Colors.white, size: 24),
                        ),
                      ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              Text(
                isFull ? 'أحسنت!' : 'استمر!',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 36,
                  fontWeight: FontWeight.w900,
                  color: station.theme.dark,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                isFull
                    ? 'أنهيت محطة «${station.name}» بنجاح.'
                    : 'أكمل كل البطاقات والتحدّي لتحصل على علامة الإنجاز.',
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: Color(0xFF49617E),
                ),
              ),
              const SizedBox(height: 24),
              Row(
                children: [
                  Expanded(
                    child: Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(22),
                        border: Border.all(color: station.theme.border, width: 2),
                      ),
                      child: Column(
                        children: [
                          Text(
                            '$readCount/${station.cards.length}',
                            style: TextStyle(
                              fontSize: 28,
                              fontWeight: FontWeight.w900,
                              color: station.theme.dark,
                            ),
                          ),
                          const Text(
                            'بطاقات',
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w800,
                              color: Color(0xFF49617E),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(22),
                        border: Border.all(color: station.theme.border, width: 2),
                      ),
                      child: Column(
                        children: [
                          Text(
                            actDone ? '✓' : '—',
                            style: TextStyle(
                              fontSize: 28,
                              fontWeight: FontWeight.w900,
                              color: station.theme.dark,
                            ),
                          ),
                          const Text(
                            'التحدّي',
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w800,
                              color: Color(0xFF49617E),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
              const Spacer(),
              ElevatedButton(
                onPressed: () {
                  if (isLast) {
                    Navigator.pushReplacement(
                      context,
                      MaterialPageRoute(builder: (_) => const CertificateScreen()),
                    );
                  } else {
                    Navigator.pushReplacement(
                      context,
                      MaterialPageRoute(
                        builder: (_) => StationIntroScreen(
                          station: kStationsData[station.id + 1],
                        ),
                      ),
                    );
                  }
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: station.theme.primary,
                  foregroundColor: Colors.white,
                  minimumSize: const Size(double.infinity, 56),
                ),
                child: Text(isLast ? 'احصل على شهادتك 🏅' : 'المحطة التالية'),
              ),
              const SizedBox(height: 10),
              OutlinedButton(
                onPressed: () => Navigator.popUntil(context, (route) => route.isFirst),
                style: OutlinedButton.styleFrom(
                  minimumSize: const Size(double.infinity, 50),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(18),
                  ),
                ),
                child: const Text('الخريطة'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
