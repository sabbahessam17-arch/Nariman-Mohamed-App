import JSZip from 'jszip';

import pubspecYaml from '../../pubspec.yaml?raw';
import analysisOptionsYaml from '../../analysis_options.yaml?raw';
import readmeMd from '../../README.md?raw';
import mainDart from '../../lib/main.dart?raw';
import stationModelDart from '../../lib/models/station_model.dart?raw';
import stationsDataDart from '../../lib/data/stations_data.dart?raw';
import appStateProviderDart from '../../lib/providers/app_state_provider.dart?raw';
import soundServiceDart from '../../lib/services/sound_service.dart?raw';
import loginScreenDart from '../../lib/screens/login_screen.dart?raw';
import mapScreenDart from '../../lib/screens/map_screen.dart?raw';
import stationIntroScreenDart from '../../lib/screens/station_intro_screen.dart?raw';
import cardsScreenDart from '../../lib/screens/cards_screen.dart?raw';
import activityDragDropScreenDart from '../../lib/screens/activity_drag_drop_screen.dart?raw';
import stationDoneScreenDart from '../../lib/screens/station_done_screen.dart?raw';
import certificateScreenDart from '../../lib/screens/certificate_screen.dart?raw';
import widgetTestDart from '../../test/widget_test.dart?raw';

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
    description: 'ملف الحزم والاعتماديات لتطبيق فلاتر مع دعم الخطوط العربية والأنيميشن والطباعة',
    content: pubspecYaml,
  },
  {
    filename: 'analysis_options.yaml',
    path: 'analysis_options.yaml',
    language: 'yaml',
    description: 'قواعد فحص الكود البرمجي (Flutter Lints)',
    content: analysisOptionsYaml,
  },
  {
    filename: 'main.dart',
    path: 'lib/main.dart',
    language: 'dart',
    description: 'نقطة الانطلاق لتطبيق فلاتر مع ضبط الثيم Material 3 ودعم اللغة العربية RTL',
    content: mainDart,
  },
  {
    filename: 'station_model.dart',
    path: 'lib/models/station_model.dart',
    language: 'dart',
    description: 'نماذج البيانات لمحطات التعلّم، البطاقات، والتحديات التفاعلية',
    content: stationModelDart,
  },
  {
    filename: 'stations_data.dart',
    path: 'lib/data/stations_data.dart',
    language: 'dart',
    description: 'بيانات المحطات الـ 5 الكاملة (الهندسة حولنا، التفكير الهندسي، الأدوات، المهارات، الاستدامة)',
    content: stationsDataDart,
  },
  {
    filename: 'app_state_provider.dart',
    path: 'lib/providers/app_state_provider.dart',
    language: 'dart',
    description: 'إدارة حالة التطبيق وحفظ التقدم والنجوم باستخدام Riverpod و SharedPreferences',
    content: appStateProviderDart,
  },
  {
    filename: 'sound_service.dart',
    path: 'lib/services/sound_service.dart',
    language: 'dart',
    description: 'خدمة المؤثرات الصوتية والاهتزاز التفاعلي (HapticFeedback)',
    content: soundServiceDart,
  },
  {
    filename: 'login_screen.dart',
    path: 'lib/screens/login_screen.dart',
    language: 'dart',
    description: 'شاشة تسجيل الدخول واختيار الشخصية الرمزية للمهندس الصغير',
    content: loginScreenDart,
  },
  {
    filename: 'map_screen.dart',
    path: 'lib/screens/map_screen.dart',
    language: 'dart',
    description: 'شاشة خريطة الرحلة الهندسية التفاعلية ومؤشر النجوم',
    content: mapScreenDart,
  },
  {
    filename: 'station_intro_screen.dart',
    path: 'lib/screens/station_intro_screen.dart',
    language: 'dart',
    description: 'شاشة تقديم المحطة والهدف التعليمي',
    content: stationIntroScreenDart,
  },
  {
    filename: 'cards_screen.dart',
    path: 'lib/screens/cards_screen.dart',
    language: 'dart',
    description: 'شاشة البطاقات التفاعلية وكسب النجوم مع احتفالية Confetti',
    content: cardsScreenDart,
  },
  {
    filename: 'activity_drag_drop_screen.dart',
    path: 'lib/screens/activity_drag_drop_screen.dart',
    language: 'dart',
    description: 'شاشة التحدي التفاعلي للسحب والإفلات والترتيب الهندسي',
    content: activityDragDropScreenDart,
  },
  {
    filename: 'station_done_screen.dart',
    path: 'lib/screens/station_done_screen.dart',
    language: 'dart',
    description: 'شاشة إتمام المحطة وملخص الإنجاز',
    content: stationDoneScreenDart,
  },
  {
    filename: 'certificate_screen.dart',
    path: 'lib/screens/certificate_screen.dart',
    language: 'dart',
    description: 'شاشة شهادة مهندس المستقبل مع دعم الطباعة وتصدير PDF',
    content: certificateScreenDart,
  },
  {
    filename: 'widget_test.dart',
    path: 'test/widget_test.dart',
    language: 'dart',
    description: 'اختبارات الويدجت الأساسية للمشروع',
    content: widgetTestDart,
  },
  {
    filename: 'README.md',
    path: 'README.md',
    language: 'markdown',
    description: 'دليل تشغيل مشروع فلاتر وهيكلة الملفات',
    content: readmeMd,
  },
];

export async function downloadFlutterProjectZip(): Promise<void> {
  const zip = new JSZip();

  for (const file of FLUTTER_PROJECT_FILES) {
    zip.file(file.path, file.content);
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'future_engineer_flutter_project.zip';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
