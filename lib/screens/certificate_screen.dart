import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart' as intl;
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';
import '../providers/app_state_provider.dart';

class CertificateScreen extends ConsumerWidget {
  const CertificateScreen({super.key});

  Future<void> _printCertificate(
    String name,
    String avatar,
    int stars,
    int maxStars,
    String dateStr,
  ) async {
    final doc = pw.Document();
    final font = await PdfGoogleFonts.cairoBold();

    doc.addPage(
      pw.Page(
        pageFormat: PdfPageFormat.a4.landscape,
        build: (pw.Context ctx) {
          return pw.Container(
            padding: const pw.EdgeInsets.all(32),
            decoration: pw.BoxDecoration(
              border: pw.Border.all(color: PdfColors.amber700, width: 4),
              borderRadius: pw.BorderRadius.circular(16),
            ),
            child: pw.Center(
              child: pw.Column(
                mainAxisAlignment: pw.MainAxisAlignment.center,
                children: [
                  pw.Text(
                    'شهادة مهندس المستقبل',
                    textDirection: pw.TextDirection.rtl,
                    style: pw.TextStyle(font: font, fontSize: 32, color: PdfColors.blue900),
                  ),
                  pw.SizedBox(height: 16),
                  pw.Text(
                    'تُمنح هذه الشهادة إلى',
                    textDirection: pw.TextDirection.rtl,
                    style: pw.TextStyle(font: font, fontSize: 18),
                  ),
                  pw.SizedBox(height: 10),
                  pw.Text(
                    '$name',
                    textDirection: pw.TextDirection.rtl,
                    style: pw.TextStyle(font: font, fontSize: 34, color: PdfColors.amber900),
                  ),
                  pw.SizedBox(height: 16),
                  pw.Text(
                    'لإتمامه رحلة «مهندس المستقبل» وجمعه $stars / $maxStars نجمة',
                    textDirection: pw.TextDirection.rtl,
                    style: pw.TextStyle(font: font, fontSize: 16),
                  ),
                  pw.SizedBox(height: 24),
                  pw.Text(
                    dateStr,
                    textDirection: pw.TextDirection.rtl,
                    style: pw.TextStyle(font: font, fontSize: 14, color: PdfColors.grey700),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );

    await Printing.layoutPdf(
      onLayout: (PdfPageFormat format) async => doc.save(),
      name: 'future_engineer_certificate.pdf',
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final appState = ref.watch(appStateProvider);
    final dateStr = intl.DateFormat('yyyy/MM/dd').format(DateTime.now());

    return Scaffold(
      appBar: AppBar(
        title: const Text('شهادة مهندس المستقبل'),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(28),
                  boxShadow: const [
                    BoxShadow(
                      color: Color(0xFF93C5FD),
                      offset: Offset(0, 8),
                      blurRadius: 0,
                    ),
                  ],
                ),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 28),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: const Color(0xFFF59E0B), width: 3.5),
                    gradient: const RadialGradient(
                      colors: [Color(0xFFEFF6FF), Colors.white],
                      radius: 1.1,
                    ),
                  ),
                  child: Column(
                    children: [
                      const Text(
                        '⚙️ شهادة مهندس المستقبل',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.w900,
                          color: Color(0xFF1E40AF),
                        ),
                      ),
                      const SizedBox(height: 10),
                      const Text(
                        'تُمنح هذه الشهادة إلى',
                        style: TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFF49617E),
                        ),
                      ),
                      const SizedBox(height: 10),
                      Text(
                        '${appState.avatar} ${appState.name.isEmpty ? "مهندس صغير" : appState.name}',
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                          fontSize: 28,
                          fontWeight: FontWeight.w900,
                          color: Color(0xFFB45309),
                        ),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        'لإتمامه رحلة «مهندس المستقبل» وجمعه ${appState.totalStars} / ${appState.maxStars} نجمة ⭐',
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFF49617E),
                        ),
                      ),
                      const SizedBox(height: 22),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            dateStr,
                            style: const TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.w800,
                              color: Color(0xFF7B8FA8),
                            ),
                          ),
                          const Text('🏅', style: TextStyle(fontSize: 34)),
                          const Text(
                            'مهندس المستقبل',
                            style: TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.w800,
                              color: Color(0xFF7B8FA8),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),
              ElevatedButton.icon(
                onPressed: () => _printCertificate(
                  appState.name.isEmpty ? 'مهندس صغير' : appState.name,
                  appState.avatar,
                  appState.totalStars,
                  appState.maxStars,
                  dateStr,
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF2563EB),
                  foregroundColor: Colors.white,
                  minimumSize: const Size(double.infinity, 54),
                ),
                icon: const Icon(Icons.picture_as_pdf_rounded),
                label: const Text('طباعة / حفظ الشهادة PDF'),
              ),
              const SizedBox(height: 10),
              OutlinedButton.icon(
                onPressed: () {
                  ref.read(appStateProvider.notifier).resetProgress();
                  Navigator.popUntil(context, (route) => route.isFirst);
                },
                style: OutlinedButton.styleFrom(
                  minimumSize: const Size(double.infinity, 50),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(18),
                  ),
                ),
                icon: const Icon(Icons.replay_rounded),
                label: const Text('ابدأ من جديد'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
