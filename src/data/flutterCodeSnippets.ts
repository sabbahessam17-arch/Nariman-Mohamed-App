export interface FlutterFile {
  filename: string;
  path: string;
  language: string;
  description: string;
  content: string;
}

export const FLUTTER_PROJECT_FILES: FlutterFile[] = [
  {
    filename: 'pubspec.yaml',
    path: 'pubspec.yaml',
    language: 'yaml',
    description: 'ملف الحزم والاعتماديات لتطبيق فلاتر مع دعم الخطوط العربية والأنيميشن والأصوات',
    content: `name: future_engineer
description: "تطبيق مهندس المستقبل — رحلة تفاعلية استكشافية للأطفال والناشئة"
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.2.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  flutter_localizations:
    sdk: flutter
  
  # State Management & Architecture
  flutter_riverpod: ^2.5.1
  
  # UI & Typography
  google_fonts: ^6.1.0
  flutter_animate: ^4.5.0
  confetti: ^0.7.0
  
  # Audio & Haptics
  audioplayers: ^6.0.0
  
  # Printing & PDF Certificate Export
  pdf: ^3.10.8
  printing: ^5.12.0
  shared_preferences: ^2.2.2

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.1

flutter:
  uses-material-design: true
  assets:
    - assets/audio/
    - assets/icons/
`,
  },
  {
    filename: 'main.dart',
    path: 'lib/main.dart',
    language: 'dart',
    description: 'نقطة الانطلاق لتطبيق فلاتر مع ضبط الثيم Material 3 ودعم اللغة العربية RTL',
    content: `import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';

import 'providers/app_state_provider.dart';
import 'screens/login_screen.dart';
import 'screens/map_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // ضبط اتجاه الشاشة على الوضع الرأسي للهواتف
  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);

  runApp(
    const ProviderScope(
      child: FutureEngineerApp(),
    ),
  );
}

class FutureEngineerApp extends ConsumerWidget {
  const FutureEngineerApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(userProfileProvider);

    return MaterialApp(
      title: 'مهندس المستقبل',
      debugShowCheckedModeBanner: false,
      
      // دعم اللغة العربية والاتجاه من اليمين لليسار RTL
      locale: const Locale('ar', 'SA'),
      supportedLocales: const [
        Locale('ar', 'SA'),
      ],
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      
      // ثيم Material 3 مع خط Cairo العربي
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF2563EB),
          primary: const Color(0xFF2563EB),
          secondary: const Color(0xFF0D9488),
          surface: const Color(0xFFF8FAFC),
        ),
        textTheme: GoogleFonts.cairoTextTheme(Theme.of(context).textTheme),
        scaffoldBackgroundColor: const Color(0xFFF1F5F9),
        cardTheme: CardTheme(
          elevation: 2,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
          color: Colors.white,
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            elevation: 3,
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
            ),
            textStyle: GoogleFonts.cairo(
              fontSize: 18,
              fontWeight: FontWeight.w700,
            ),
          ),
        ),
      ),
      home: user.isLoggedIn ? const MapScreen() : const LoginScreen(),
    );
  }
}
`,
  },
  {
    filename: 'station_model.dart',
    path: 'lib/models/station_model.dart',
    language: 'dart',
    description: 'نماذج البيانات لمحطات التعلّم، البطاقات، والتحديات التفاعلية',
    content: `class FlashCardModel {
  final String id;
  final String emoji;
  final String title;
  final String description;
  final String practicalTip;

  const FlashCardModel({
    required this.id,
    required this.emoji,
    required this.title,
    required this.description,
    this.practicalTip = '',
  });
}

class ActivityItemModel {
  final String id;
  final String text;
  final int targetZoneIndex;

  const ActivityItemModel({
    required this.id,
    required this.text,
    required this.targetZoneIndex,
  });
}

class ActivityZoneModel {
  final String id;
  final String title;
  final String icon;

  const ActivityZoneModel({
    required this.id,
    required this.title,
    this.icon = '',
  });
}

enum ActivityType { classification, ordering }

class StationActivityModel {
  final ActivityType type;
  final String question;
  final List<ActivityZoneModel> zones;
  final List<ActivityItemModel> items;
  final List<String> order;

  const StationActivityModel({
    required this.type,
    required this.question,
    this.zones = const [],
    this.items = const [],
    this.order = const [],
  });
}

class StationModel {
  final int id;
  final String name;
  final String tag;
  final String icon;
  final String goal;
  final int primaryColorHex;
  final List<FlashCardModel> cards;
  final StationActivityModel activity;

  const StationModel({
    required this.id,
    required this.name,
    required this.tag,
    required this.icon,
    required this.goal,
    required this.primaryColorHex,
    required this.cards,
    required this.activity,
  });
}
`,
  },
  {
    filename: 'map_screen.dart',
    path: 'lib/screens/map_screen.dart',
    language: 'dart',
    description: 'شاشة خريطة المحطات التفاعلية في فلاتر مع مؤشر التقدم وتأثيرات الحركة',
    content: `import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../data/stations_data.dart';
import '../providers/app_state_provider.dart';
import 'station_intro_screen.dart';
import 'certificate_screen.dart';

class MapScreen extends ConsumerWidget {
  const MapScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(userProfileProvider);
    final stationsState = ref.watch(stationsProgressProvider);
    final totalStars = ref.watch(totalStarsProvider);

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            const Text('⚙️', style: TextStyle(fontSize: 24)),
            const SizedBox(width: 8),
            Text(
              'مهندس المستقبل',
              style: TextStyle(
                fontWeight: FontWeight.w900,
                color: Theme.of(context).colorScheme.primary,
              ),
            ),
          ],
        ),
        actions: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: const Color(0xFFFEF9C3),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFFFDE68A), width: 2),
            ),
            child: Row(
              children: [
                const Text('⭐', style: TextStyle(fontSize: 18)),
                const SizedBox(width: 4),
                Text(
                  '$totalStars',
                  style: const TextStyle(
                    fontWeight: FontWeight.w900,
                    color: Color(0xFF854D0E),
                    fontSize: 16,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 12),
          CircleAvatar(
            backgroundColor: const Color(0xFFDBEAFE),
            child: Text(user.avatar, style: const TextStyle(fontSize: 20)),
          ),
          const SizedBox(width: 16),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          // كارت الترحيب
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF2563EB), Color(0xFF1D4ED8)],
                begin: Alignment.topRight,
                end: Alignment.bottomLeft,
              ),
              borderRadius: BorderRadius.circular(24),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFF2563EB).withOpacity(0.3),
                  blurRadius: 16,
                  offset: const Offset(0, 6),
                ),
              ],
            ),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'مرحباً بالبطل \${user.name} \${user.avatar}',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 20,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                      const SizedBox(height: 6),
                      const Text(
                        'اختر محطة واستكشف أسرار الهندسة واجمع النجوم!',
                        style: TextStyle(
                          color: Color(0xFFBFDBFE),
                          fontSize: 14,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ).animate().fadeIn(duration: 400.ms).slideY(begin: 0.1, end: 0),

          const SizedBox(height: 24),
          const Text(
            'محطات الرحلة الهندسية',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w800,
              color: Color(0xFF1E293B),
            ),
          ),
          const SizedBox(height: 12),

          // قائمة المحطات بطريقة خريطة تفاعلية
          ...kStationsData.map((station) {
            final isDone = stationsState.isStationCompleted(station.id);
            final readCardsCount = stationsState.getReadCount(station.id);

            return Padding(
              padding: const EdgeInsets.only(bottom: 16),
              child: InkWell(
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => StationIntroScreen(station: station),
                    ),
                  );
                },
                borderRadius: BorderRadius.circular(22),
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(22),
                    border: Border.all(
                      color: isDone ? const Color(0xFF86EFAC) : const Color(0xFFE2E8F0),
                      width: 2,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.04),
                        blurRadius: 10,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 58,
                        height: 58,
                        decoration: BoxDecoration(
                          color: Color(station.primaryColorHex).withOpacity(0.12),
                          shape: BoxShape.circle,
                        ),
                        alignment: Alignment.center,
                        child: Text(
                          station.icon,
                          style: const TextStyle(fontSize: 28),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              station.name,
                              style: const TextStyle(
                                fontSize: 17,
                                fontWeight: FontWeight.w800,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              station.tag,
                              style: TextStyle(
                                fontSize: 13,
                                color: Color(station.primaryColorHex),
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            const SizedBox(height: 6),
                            LinearProgressIndicator(
                              value: (readCardsCount + (isDone ? 1 : 0)) / (station.cards.length + 1),
                              backgroundColor: const Color(0xFFF1F5F9),
                              color: Color(station.primaryColorHex),
                              minHeight: 6,
                              borderRadius: BorderRadius.circular(4),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 12),
                      isDone
                          ? const Icon(Icons.check_circle_rounded, color: Color(0xFF16A34A), size: 28)
                          : const Icon(Icons.arrow_forward_ios_rounded, color: Color(0xFF94A3B8), size: 18),
                    ],
                  ),
                ),
              ),
            );
          }),

          const SizedBox(height: 16),
          // زر الشهادة النهائية
          ElevatedButton.icon(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const CertificateScreen()),
              );
            },
            icon: const Icon(Icons.workspace_premium_rounded),
            label: const Text('شهادة الإنجاز الفخرية'),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFF59E0B),
              foregroundColor: Colors.white,
            ),
          ),
          const SizedBox(height: 30),
        ],
      ),
    );
  }
}
`,
  },
  {
    filename: 'activity_drag_drop_screen.dart',
    path: 'lib/screens/activity_drag_drop_screen.dart',
    language: 'dart',
    description: 'شاشة التحدي التفاعلي في فلاتر باستخدام ويدجت Draggable و DragTarget وتأثيرات الصوت',
    content: `import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:confetti/confetti.dart';
import '../models/station_model.dart';
import '../providers/app_state_provider.dart';

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
  String _feedbackMessage = 'اسحب البطاقة أو اضغط عليها ثم اختر المكان الصحيح';

  @override
  void initState() {
    super.initState();
    _confettiController = ConfettiController(duration: const Duration(seconds: 2));
    _remainingItems = List.from(widget.station.activity.items)..shuffle();
    for (int i = 0; i < widget.station.activity.zones.length; i++) {
      _placedItems[i] = [];
    }
  }

  @override
  void dispose() {
    _confettiController.dispose();
    super.dispose();
  }

  void _onItemDropped(ActivityItemModel item, int zoneIndex) {
    if (item.targetZoneIndex == zoneIndex) {
      // إجابة صحيحة
      HapticFeedback.mediumImpact();
      setState(() {
        _remainingItems.removeWhere((i) => i.id == item.id);
        _placedItems[zoneIndex]?.add(item);
        _feedbackMessage = 'أحسنت! إجابة دقيقة 👏';
      });

      if (_remainingItems.isEmpty) {
        // إنهاء التحدي بنجاح
        _confettiController.play();
        ref.read(stationsProgressProvider.notifier).completeStationActivity(widget.station.id);
        _showSuccessDialog();
      }
    } else {
      // خطأ
      HapticFeedback.vibrate();
      setState(() {
        _feedbackMessage = 'فكّر مرة أخرى وجرّب مكاناً آخر 🤔';
      });
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('مكان غير صحيح، حاول ثانية!'),
          duration: Duration(milliseconds: 900),
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
  }

  void _showSuccessDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        title: const Text('🎉 إنجاز هندسي رائع!', textAlign: TextAlign.center),
        content: const Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('لقد حللت التحدي بنجاح وربحت 3 نجوم إضافية ⭐⭐⭐'),
          ],
        ),
        actions: [
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              Navigator.pop(context);
            },
            child: const Text('العودة للمحطة'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final act = widget.station.activity;

    return Scaffold(
      appBar: AppBar(
        title: const Text('تحدي السحب والإفلات'),
      ),
      body: Stack(
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              children: [
                Text(
                  act.question,
                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 12),
                Text(
                  _feedbackMessage,
                  style: const TextStyle(
                    fontSize: 14,
                    color: Color(0xFF2563EB),
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 16),

                // مناطق الإفلات DragTargets
                Expanded(
                  flex: 3,
                  child: ListView.separated(
                    itemCount: act.zones.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 12),
                    itemBuilder: (context, idx) {
                      final zone = act.zones[idx];
                      return DragTarget<ActivityItemModel>(
                        onAcceptWithDetails: (details) => _onItemDropped(details.data, idx),
                        builder: (context, candidateData, rejectedData) {
                          final isHovered = candidateData.isNotEmpty;
                          return Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: isHovered ? const Color(0xFFDBEAFE) : Colors.white,
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(
                                color: isHovered ? const Color(0xFF2563EB) : const Color(0xFFCBD5E1),
                                width: isHovered ? 2.5 : 1.5,
                              ),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    Text(zone.icon, style: const TextStyle(fontSize: 22)),
                                    const SizedBox(width: 8),
                                    Text(
                                      zone.title,
                                      style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 15),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 8),
                                Wrap(
                                  spacing: 8,
                                  runSpacing: 6,
                                  children: (_placedItems[idx] ?? []).map((item) {
                                    return Chip(
                                      label: Text(item.text),
                                      backgroundColor: const Color(0xFFDCFCE7),
                                      avatar: const Icon(Icons.check, size: 16, color: Color(0xFF16A34A)),
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

                const Divider(height: 24),

                // حوض البطاقات القابلة للسحب Draggables
                const Text('البطاقات المتبقية:', style: TextStyle(fontWeight: FontWeight.w700)),
                const SizedBox(height: 8),
                Expanded(
                  flex: 2,
                  child: SingleChildScrollView(
                    child: Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: _remainingItems.map((item) {
                        return Draggable<ActivityItemModel>(
                          data: item,
                          feedback: Material(
                            elevation: 8,
                            borderRadius: BorderRadius.circular(14),
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                              decoration: BoxDecoration(
                                color: const Color(0xFF2563EB),
                                borderRadius: BorderRadius.circular(14),
                              ),
                              child: Text(
                                item.text,
                                style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w700),
                              ),
                            ),
                          ),
                          childWhenDragging: Opacity(
                            opacity: 0.3,
                            child: ActionChip(
                              label: Text(item.text),
                              onPressed: () {},
                            ),
                          ),
                          child: ActionChip(
                            label: Text(
                              item.text,
                              style: const TextStyle(fontWeight: FontWeight.w700),
                            ),
                            backgroundColor: Colors.white,
                            onPressed: () {
                              // دعم النقر للشاشات التي لا تدعم السحب بسهولة
                              _showPickZoneSheet(item);
                            },
                          ),
                        );
                      }).toList(),
                    ),
                  ),
                ),
              ],
            ),
          ),
          Align(
            alignment: Alignment.topCenter,
            child: ConfettiWidget(
              confettiController: _confettiController,
              blastDirectionality: BlastDirectionality.explosive,
              numberOfParticles: 30,
            ),
          ),
        ],
      ),
    );
  }

  void _showPickZoneSheet(ActivityItemModel item) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text('اختر التصنيف لـ: \${item.text}', style: const TextStyle(fontWeight: FontWeight.w800)),
              const SizedBox(height: 12),
              ...List.generate(widget.station.activity.zones.length, (idx) {
                final zone = widget.station.activity.zones[idx];
                return ListTile(
                  leading: Text(zone.icon, style: const TextStyle(fontSize: 22)),
                  title: Text(zone.title),
                  onTap: () {
                    Navigator.pop(context);
                    _onItemDropped(item, idx);
                  },
                );
              }),
            ],
          ),
        );
      },
    );
  }
}
`,
  },
  {
    filename: 'certificate_screen.dart',
    path: 'lib/screens/certificate_screen.dart',
    language: 'dart',
    description: 'شاشة الشهادة الفخرية مع إمكانية التصدير والطباعة عبر حزمة Printing و PDF',
    content: `import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:printing/printing.dart';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import '../providers/app_state_provider.dart';

class CertificateScreen extends ConsumerWidget {
  const CertificateScreen({super.key});

  Future<void> _exportPdf(BuildContext context, String name, String avatar, int stars) async {
    final doc = pw.Document();
    final font = await PdfGoogleFonts.cairoBold();

    doc.addPage(
      pw.Page(
        pageFormat: PdfPageFormat.a4.landscape,
        build: (pw.Context ctx) {
          return pw.Container(
            padding: const pw.EdgeInsets.all(32),
            decoration: pw.BoxDecoration(
              border: pw.Border.all(color: PdfColors.amber800, width: 4),
            ),
            child: pw.Center(
              child: pw.Column(
                mainAxisAlignment: pw.MainAxisAlignment.center,
                children: [
                  pw.Text('شهادة مهندس المستقبل', textDirection: pw.TextDirection.rtl, style: pw.TextStyle(font: font, fontSize: 32)),
                  pw.SizedBox(height: 20),
                  pw.Text('تُمنح هذه الشهادة بكل فخر إلى البطل:', textDirection: pw.TextDirection.rtl, style: pw.TextStyle(font: font, fontSize: 18)),
                  pw.SizedBox(height: 12),
                  pw.Text('\$avatar \$name', textDirection: pw.TextDirection.rtl, style: pw.TextStyle(font: font, fontSize: 26, color: PdfColors.blue800)),
                  pw.SizedBox(height: 20),
                  pw.Text('لإتمامه رحلة استكشاف الهندسة بنجاح وجمعه \$stars نجمة تفوق!', textDirection: pw.TextDirection.rtl, style: pw.TextStyle(font: font, fontSize: 16)),
                ],
              ),
            ),
          );
        },
      ),
    );

    await Printing.layoutPdf(
      onLayout: (PdfPageFormat format) async => doc.save(),
      name: 'شهادة_مهندس_المستقبل_\$name.pdf',
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(userProfileProvider);
    final totalStars = ref.watch(totalStarsProvider);
    final dateStr = DateFormat('yyyy/MM/dd').format(DateTime.now());

    return Scaffold(
      appBar: AppBar(
        title: const Text('شهادة الإنجاز الفخرية'),
      ),
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(28),
                  border: Border.all(color: const Color(0xFFF59E0B), width: 4),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFFF59E0B).withOpacity(0.15),
                      blurRadius: 20,
                      offset: const Offset(0, 8),
                    ),
                  ],
                ),
                child: Column(
                  children: [
                    const Text('⚙️', style: TextStyle(fontSize: 48)),
                    const SizedBox(height: 8),
                    const Text(
                      'شهادة مهندس المستقبل',
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.w900,
                        color: Color(0xFF1E40AF),
                      ),
                    ),
                    const SizedBox(height: 12),
                    const Text('تُمنح هذه الشهادة بكل فخر إلى:', style: TextStyle(fontSize: 15, color: Color(0xFF64748B))),
                    const SizedBox(height: 8),
                    Text(
                      '\${user.avatar} \${user.name}',
                      style: const TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.w900,
                        color: Color(0xFFB45309),
                      ),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      'لإتمامه رحلة «مهندس المستقبل» بنجاح وتفوق وجمعه \$totalStars نجمة ⭐',
                      textAlign: TextAlign.center,
                      style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600),
                    ),
                    const SizedBox(height: 24),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('التاريخ: \$dateStr', style: const TextStyle(fontSize: 13, color: Color(0xFF64748B))),
                        const Text('🏅 الختم الذهبي', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              ElevatedButton.icon(
                onPressed: () => _exportPdf(context, user.name, user.avatar, totalStars),
                icon: const Icon(Icons.print_rounded),
                label: const Text('طباعة / حفظ الشهادة PDF'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF2563EB),
                  foregroundColor: Colors.white,
                  minimumSize: const Size(double.infinity, 50),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
`,
  },
];
