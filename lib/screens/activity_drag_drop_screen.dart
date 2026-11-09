import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:confetti/confetti.dart';
import '../models/station_model.dart';
import '../providers/app_state_provider.dart';
import '../services/sound_service.dart';
import 'station_done_screen.dart';

class ActivityDragDropScreen extends ConsumerStatefulWidget {
  final StationModel station;

  const ActivityDragDropScreen({super.key, required this.station});

  @override
  ConsumerState<ActivityDragDropScreen> createState() => _ActivityDragDropScreenState();
}

class _ActivityDragDropScreenState extends ConsumerState<ActivityDragDropScreen> {
  late ConfettiController _confettiController;
  late List<ActivityItemModel> _remainingItems;
  final Map<int, List<ActivityItemModel>> _placedItems = {};

  late List<String> _remainingOrder;
  final List<String> _placedOrder = [];

  String _feedbackMessage = 'اسحب البطاقات إلى مكانها الصحيح أو اضغط عليها 👆';

  @override
  void initState() {
    super.initState();
    _confettiController = ConfettiController(duration: const Duration(seconds: 2));
    _resetActivity();
  }

  void _resetActivity() {
    final act = widget.station.activity;
    if (act.type == ActivityType.ordering) {
      _remainingOrder = List.from(act.order)..shuffle();
      _placedOrder.clear();
    } else {
      _remainingItems = List.from(act.items)..shuffle();
      _placedItems.clear();
      for (int i = 0; i < act.zones.length; i++) {
        _placedItems[i] = [];
      }
    }
    setState(() {
      _feedbackMessage = 'اسحب البطاقات إلى مكانها الصحيح 👆';
    });
  }

  @override
  void dispose() {
    _confettiController.dispose();
    super.dispose();
  }

  void _onClassificationDrop(ActivityItemModel item, int zoneIndex) {
    if (item.targetZoneIndex == zoneIndex) {
      SoundService.instance.playSuccess();
      setState(() {
        _remainingItems.removeWhere((x) => x.id == item.id);
        _placedItems[zoneIndex]?.add(item);
        _feedbackMessage = _remainingItems.isEmpty
            ? '🎉 رائع! أنهيت التحدّي'
            : 'أحسنت! ✔️';
      });
      if (_remainingItems.isEmpty) {
        _finishChallenge();
      }
    } else {
      SoundService.instance.playError();
      setState(() {
        _feedbackMessage = 'جرّب مكانًا آخر 🤔';
      });
    }
  }

  void _onOrderStepTap(String step) {
    final expected = widget.station.activity.order[_placedOrder.length];
    if (step == expected) {
      SoundService.instance.playSuccess();
      setState(() {
        _remainingOrder.remove(step);
        _placedOrder.add(step);
        _feedbackMessage = _remainingOrder.isEmpty
            ? '🎉 رائع! أنهيت التحدّي'
            : 'أحسنت! ✔️';
      });
      if (_remainingOrder.isEmpty) {
        _finishChallenge();
      }
    } else {
      SoundService.instance.playError();
      setState(() {
        _feedbackMessage = 'جرّب مكانًا آخر 🤔';
      });
    }
  }

  void _finishChallenge() {
    _confettiController.play();
    ref.read(appStateProvider.notifier).completeStationActivity(widget.station.id);
    Future.delayed(const Duration(milliseconds: 1200), () {
      if (!mounted) return;
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder: (_) => StationDoneScreen(station: widget.station),
        ),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    final station = widget.station;
    final act = station.activity;
    final isOrdering = act.type == ActivityType.ordering;

    return Scaffold(
      appBar: AppBar(
        title: const Text('🎮 تحدّي السحب والإفلات'),
        actions: [
          IconButton(
            onPressed: _resetActivity,
            icon: const Icon(Icons.refresh_rounded),
          ),
        ],
      ),
      body: Stack(
        children: [
          Padding(
            padding: const EdgeInsets.all(18),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Text(
                  act.question,
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.w800,
                    color: Color(0xFF0F2A47),
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  _feedbackMessage,
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w800,
                    color: station.theme.dark,
                  ),
                ),
                const SizedBox(height: 16),

                if (isOrdering) ...[
                  Expanded(
                    child: ListView.separated(
                      itemCount: act.order.length,
                      separatorBuilder: (_, __) => const SizedBox(height: 10),
                      itemBuilder: (context, idx) {
                        final placed = idx < _placedOrder.length ? _placedOrder[idx] : null;
                        return Container(
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                          decoration: BoxDecoration(
                            color: placed != null ? station.theme.light : Colors.white,
                            borderRadius: BorderRadius.circular(18),
                            border: Border.all(
                              color: placed != null
                                  ? station.theme.primary
                                  : station.theme.border,
                              width: 2.5,
                            ),
                          ),
                          child: Row(
                            children: [
                              CircleAvatar(
                                radius: 16,
                                backgroundColor: station.theme.primary,
                                child: Text(
                                  '${idx + 1}',
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontWeight: FontWeight.w900,
                                  ),
                                ),
                              ),
                              const SizedBox(width: 12),
                              Text(
                                placed ?? 'الخطوة رقم ${idx + 1}',
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w800,
                                  color: placed != null
                                      ? station.theme.dark
                                      : const Color(0xFF94A3B8),
                                ),
                              ),
                            ],
                          ),
                        );
                      },
                    ),
                  ),
                  const SizedBox(height: 12),
                  Wrap(
                    alignment: WrapAlignment.center,
                    spacing: 10,
                    runSpacing: 10,
                    children: _remainingOrder.map((step) {
                      return ActionChip(
                        onPressed: () => _onOrderStepTap(step),
                        backgroundColor: Colors.white,
                        side: BorderSide(color: station.theme.border, width: 2),
                        label: Text(
                          step,
                          style: const TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                ] else ...[
                  Expanded(
                    flex: 3,
                    child: ListView.separated(
                      itemCount: act.zones.length,
                      separatorBuilder: (_, __) => const SizedBox(height: 12),
                      itemBuilder: (context, zIdx) {
                        final zone = act.zones[zIdx];
                        final placedInZone = _placedItems[zIdx] ?? [];

                        return DragTarget<ActivityItemModel>(
                          onAcceptWithDetails: (details) =>
                              _onClassificationDrop(details.data, zIdx),
                          builder: (context, candidateData, rejectedData) {
                            final isHot = candidateData.isNotEmpty;
                            return Container(
                              padding: const EdgeInsets.all(14),
                              decoration: BoxDecoration(
                                color: isHot ? station.theme.light : Colors.white,
                                borderRadius: BorderRadius.circular(20),
                                border: Border.all(
                                  color: isHot
                                      ? station.theme.primary
                                      : station.theme.border,
                                  width: 2.5,
                                ),
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    '${zone.icon} ${zone.title}',
                                    style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w900,
                                      color: station.theme.dark,
                                    ),
                                  ),
                                  const SizedBox(height: 8),
                                  Wrap(
                                    spacing: 8,
                                    runSpacing: 6,
                                    children: placedInZone.map((item) {
                                      return Chip(
                                        backgroundColor: station.theme.light,
                                        side: BorderSide(color: station.theme.primary),
                                        label: Text(
                                          item.text,
                                          style: TextStyle(
                                            fontWeight: FontWeight.w800,
                                            color: station.theme.dark,
                                          ),
                                        ),
                                      );
                                    }).toList(),
                                  ),
                                ],
                              ),
                            );
                          },
                        );
                      },
                    ),
                  ),
                  const SizedBox(height: 12),
                  Wrap(
                    alignment: WrapAlignment.center,
                    spacing: 10,
                    runSpacing: 10,
                    children: _remainingItems.map((item) {
                      return Draggable<ActivityItemModel>(
                        data: item,
                        feedback: Material(
                          color: Colors.transparent,
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 18,
                              vertical: 10,
                            ),
                            decoration: BoxDecoration(
                              color: station.theme.primary,
                              borderRadius: BorderRadius.circular(16),
                            ),
                            child: Text(
                              item.text,
                              style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.w800,
                                fontSize: 15,
                              ),
                            ),
                          ),
                        ),
                        childWhenDragging: Opacity(
                          opacity: 0.25,
                          child: Chip(label: Text(item.text)),
                        ),
                        child: ActionChip(
                          backgroundColor: Colors.white,
                          side: BorderSide(color: station.theme.border, width: 2),
                          label: Text(
                            item.text,
                            style: const TextStyle(
                              fontWeight: FontWeight.w800,
                              fontSize: 14,
                            ),
                          ),
                          onPressed: () => _showZonePickerSheet(item),
                        ),
                      );
                    }).toList(),
                  ),
                ],
                const SizedBox(height: 16),
              ],
            ),
          ),
          Align(
            alignment: Alignment.topCenter,
            child: ConfettiWidget(
              confettiController: _confettiController,
              blastDirectionality: BlastDirectionality.explosive,
              numberOfParticles: 35,
            ),
          ),
        ],
      ),
    );
  }

  void _showZonePickerSheet(ActivityItemModel item) {
    final zones = widget.station.activity.zones;
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  'اختر المكان الصحيح لـ: "${item.text}"',
                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900),
                ),
                const SizedBox(height: 12),
                ...List.generate(zones.length, (zIdx) {
                  final z = zones[zIdx];
                  return ListTile(
                    leading: Text(z.icon, style: const TextStyle(fontSize: 24)),
                    title: Text(
                      z.title,
                      style: const TextStyle(fontWeight: FontWeight.w800),
                    ),
                    onTap: () {
                      Navigator.pop(ctx);
                      _onClassificationDrop(item, zIdx);
                    },
                  );
                }),
              ],
            ),
          ),
        );
      },
    );
  }
}
