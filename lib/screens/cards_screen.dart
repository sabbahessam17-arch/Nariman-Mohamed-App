import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:confetti/confetti.dart';
import '../models/station_model.dart';
import '../providers/app_state_provider.dart';
import 'activity_drag_drop_screen.dart';

class CardsScreen extends ConsumerStatefulWidget {
  final StationModel station;

  const CardsScreen({super.key, required this.station});

  @override
  ConsumerState<CardsScreen> createState() => _CardsScreenState();
}

class _CardsScreenState extends ConsumerState<CardsScreen> {
  late ConfettiController _confettiController;
  int _activeIndex = 0;

  @override
  void initState() {
    super.initState();
    _confettiController = ConfettiController(duration: const Duration(seconds: 1));
  }

  @override
  void dispose() {
    _confettiController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final appState = ref.watch(appStateProvider);
    final station = widget.station;
    final card = station.cards[_activeIndex];
    final isRead = appState.isCardRead(station.id, _activeIndex);
    final allRead = appState.getReadCount(station.id) == station.cards.length;

    return Scaffold(
      appBar: AppBar(
        title: Text(station.name),
        actions: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Center(
              child: Text(
                '${_activeIndex + 1} / ${station.cards.length}',
                style: const TextStyle(
                  fontWeight: FontWeight.w900,
                  color: Color(0xFF49617E),
                ),
              ),
            ),
          ),
        ],
      ),
      body: Stack(
        children: [
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(999),
                    child: LinearProgressIndicator(
                      value: (_activeIndex + 1) / station.cards.length,
                      minHeight: 8,
                      backgroundColor: const Color(0xFFDCE7F5),
                      color: station.theme.primary,
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Flashcard
                  Expanded(
                    child: Container(
                      padding: const EdgeInsets.all(24),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(28),
                        border: Border.all(
                          color: isRead ? const Color(0xFF86EFAC) : station.theme.border,
                          width: 3,
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: isRead ? const Color(0xFF86EFAC) : station.theme.border,
                            offset: const Offset(0, 8),
                            blurRadius: 0,
                          ),
                        ],
                      ),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Container(
                            width: 100,
                            height: 100,
                            decoration: BoxDecoration(
                              color: station.theme.light,
                              borderRadius: BorderRadius.circular(28),
                              border: Border.all(color: station.theme.border, width: 2),
                            ),
                            alignment: Alignment.center,
                            child: Text(card.emoji, style: const TextStyle(fontSize: 56)),
                          ),
                          const SizedBox(height: 18),
                          Text(
                            card.title,
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              fontSize: 26,
                              fontWeight: FontWeight.w900,
                              color: station.theme.dark,
                            ),
                          ),
                          const SizedBox(height: 12),
                          Text(
                            card.description,
                            textAlign: TextAlign.center,
                            style: const TextStyle(
                              fontSize: 17,
                              fontWeight: FontWeight.w700,
                              color: Color(0xFF49617E),
                              height: 1.5,
                            ),
                          ),
                          if (card.practicalTip.isNotEmpty) ...[
                            const SizedBox(height: 18),
                            Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: const Color(0xFFF8FAFC),
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(color: const Color(0xFFE2E8F0)),
                              ),
                              child: Text(
                                '💡 ${card.practicalTip}',
                                textAlign: TextAlign.center,
                                style: const TextStyle(
                                  fontSize: 13,
                                  fontWeight: FontWeight.w600,
                                  color: Color(0xFF49617E),
                                ),
                              ),
                            ),
                          ],
                          const SizedBox(height: 24),
                          ElevatedButton(
                            onPressed: () {
                              final earned = ref
                                  .read(appStateProvider.notifier)
                                  .toggleCardRead(station.id, _activeIndex);
                              if (earned) {
                                _confettiController.play();
                              }
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: isRead
                                  ? const Color(0xFF4ADE80)
                                  : const Color(0xFFFEF3C7),
                              foregroundColor: isRead
                                  ? const Color(0xFF14532D)
                                  : const Color(0xFF92400E),
                              minimumSize: const Size(double.infinity, 54),
                            ),
                            child: Text(
                              isRead ? '✓ تعلّمت' : '⭐ تعلّمت! (+1 نجمة)',
                              style: const TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.w900,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 18),

                  // Prev / Next Card Controls
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton.icon(
                          onPressed: () {
                            setState(() {
                              _activeIndex =
                                  (_activeIndex - 1 + station.cards.length) % station.cards.length;
                            });
                          },
                          icon: const Icon(Icons.chevron_left_rounded),
                          label: const Text('السابق'),
                          style: OutlinedButton.styleFrom(
                            minimumSize: const Size(0, 48),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(16),
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: OutlinedButton.icon(
                          onPressed: () {
                            setState(() {
                              _activeIndex = (_activeIndex + 1) % station.cards.length;
                            });
                          },
                          icon: const Icon(Icons.chevron_right_rounded),
                          label: const Text('التالي'),
                          style: OutlinedButton.styleFrom(
                            minimumSize: const Size(0, 48),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(16),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),

                  // Proceed to Activity Challenge
                  ElevatedButton.icon(
                    onPressed: () {
                      Navigator.pushReplacement(
                        context,
                        MaterialPageRoute(
                          builder: (_) => ActivityDragDropScreen(station: station),
                        ),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: allRead
                          ? const Color(0xFF16A34A)
                          : station.theme.primary,
                      foregroundColor: Colors.white,
                      minimumSize: const Size(double.infinity, 54),
                    ),
                    icon: const Icon(Icons.sports_esports_rounded),
                    label: Text(
                      allRead
                          ? '🎉 انطلق إلى التحدي العملي!'
                          : 'الانتقال إلى تحدي السحب والإفلات',
                    ),
                  ),
                ],
              ),
            ),
          ),
          Align(
            alignment: Alignment.topCenter,
            child: ConfettiWidget(
              confettiController: _confettiController,
              blastDirectionality: BlastDirectionality.explosive,
              numberOfParticles: 25,
            ),
          ),
        ],
      ),
    );
  }
}
