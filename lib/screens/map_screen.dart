import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/stations_data.dart';
import '../providers/app_state_provider.dart';
import 'station_intro_screen.dart';
import 'certificate_screen.dart';

class MapScreen extends ConsumerWidget {
  const MapScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final appState = ref.watch(appStateProvider);

    int firstOpenIndex = -1;
    for (int i = 0; i < kStationsData.length; i++) {
      if (!appState.isStationCompleted(i)) {
        firstOpenIndex = i;
        break;
      }
    }

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                color: const Color(0xFF2563EB),
                borderRadius: BorderRadius.circular(10),
              ),
              alignment: Alignment.center,
              child: const Text('⚙️', style: TextStyle(fontSize: 18)),
            ),
            const SizedBox(width: 10),
            const Text('مهندس المستقبل'),
          ],
        ),
        actions: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
            decoration: BoxDecoration(
              color: const Color(0xFFFEF9C3),
              borderRadius: BorderRadius.circular(999),
              border: Border.all(color: const Color(0xFFFDE68A), width: 2),
            ),
            child: Row(
              children: [
                const Text('⭐', style: TextStyle(fontSize: 16)),
                const SizedBox(width: 4),
                Text(
                  '${appState.totalStars}',
                  style: const TextStyle(
                    fontWeight: FontWeight.w900,
                    color: Color(0xFFA16207),
                    fontSize: 15,
                  ),
                ),
              ],
            ),
          ),
          IconButton(
            onPressed: () => ref.read(appStateProvider.notifier).toggleMute(),
            icon: Icon(
              appState.isMuted ? Icons.volume_off_rounded : Icons.volume_up_rounded,
              color: const Color(0xFF1E40AF),
            ),
          ),
          const SizedBox(width: 6),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          // Welcome Banner
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF2563EB), Color(0xFF1E40AF)],
                begin: Alignment.topRight,
                end: Alignment.bottomLeft,
              ),
              borderRadius: BorderRadius.circular(24),
            ),
            child: Row(
              children: [
                Container(
                  width: 56,
                  height: 56,
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(18),
                  ),
                  alignment: Alignment.center,
                  child: Text(appState.avatar, style: const TextStyle(fontSize: 32)),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'خريطة الرحلة',
                        style: TextStyle(
                          color: Color(0xFFBFDBFE),
                          fontSize: 13,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      Text(
                        'أهلًا يا ${appState.name}، اختر محطتك',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 18,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 22),

          // Stations List
          ...List.generate(kStationsData.length, (i) {
            final station = kStationsData[i];
            final isDone = appState.isStationCompleted(i);
            final isHere = firstOpenIndex == i;
            final progressCount =
                appState.getReadCount(i) + (appState.isActivityDone(i) ? 1 : 0);
            final totalSteps = station.cards.length + 1;

            return Padding(
              padding: const EdgeInsets.only(bottom: 14),
              child: InkWell(
                borderRadius: BorderRadius.circular(24),
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => StationIntroScreen(station: station),
                    ),
                  );
                },
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(
                      color: isDone
                          ? const Color(0xFF22C55E)
                          : isHere
                              ? station.theme.primary
                              : station.theme.border,
                      width: 2.5,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: station.theme.border.withValues(alpha: 0.5),
                        offset: const Offset(0, 5),
                        blurRadius: 0,
                      ),
                    ],
                  ),
                  child: Row(
                    children: [
                      Stack(
                        clipBehavior: Clip.none,
                        children: [
                          Container(
                            width: 64,
                            height: 64,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: station.theme.light,
                              border: Border.all(color: station.theme.primary, width: 3),
                            ),
                            alignment: Alignment.center,
                            child: Text(station.icon, style: const TextStyle(fontSize: 30)),
                          ),
                          if (isDone)
                            Positioned(
                              top: -4,
                              right: -4,
                              child: Container(
                                width: 24,
                                height: 24,
                                decoration: BoxDecoration(
                                  color: const Color(0xFF22C55E),
                                  shape: BoxShape.circle,
                                  border: Border.all(color: Colors.white, width: 2),
                                ),
                                child: const Icon(Icons.check, size: 14, color: Colors.white),
                              ),
                            ),
                        ],
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  station.name,
                                  style: const TextStyle(
                                    fontSize: 17,
                                    fontWeight: FontWeight.w900,
                                    color: Color(0xFF0F2A47),
                                  ),
                                ),
                                if (isHere)
                                  Container(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 10,
                                      vertical: 2,
                                    ),
                                    decoration: BoxDecoration(
                                      color: const Color(0xFFF59E0B),
                                      borderRadius: BorderRadius.circular(999),
                                    ),
                                    child: Text(
                                      appState.totalStars > 0 ? 'تابع هنا' : 'ابدأ هنا',
                                      style: const TextStyle(
                                        color: Colors.white,
                                        fontSize: 11,
                                        fontWeight: FontWeight.w800,
                                      ),
                                    ),
                                  ),
                              ],
                            ),
                            Text(
                              station.tag,
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w700,
                                color: station.theme.dark,
                              ),
                            ),
                            const SizedBox(height: 8),
                            Row(
                              children: [
                                Expanded(
                                  child: ClipRRect(
                                    borderRadius: BorderRadius.circular(999),
                                    child: LinearProgressIndicator(
                                      value: progressCount / totalSteps,
                                      minHeight: 7,
                                      backgroundColor: const Color(0xFFE2E8F0),
                                      color: station.theme.primary,
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 10),
                                Text(
                                  '$progressCount / $totalSteps',
                                  style: TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w800,
                                    color: station.theme.dark,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            );
          }),

          const SizedBox(height: 12),
          ElevatedButton.icon(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const CertificateScreen()),
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFF59E0B),
              foregroundColor: Colors.white,
              minimumSize: const Size(double.infinity, 54),
            ),
            icon: const Icon(Icons.workspace_premium_rounded),
            label: const Text('شهادة مهندس المستقبل'),
          ),
        ],
      ),
    );
  }
}
