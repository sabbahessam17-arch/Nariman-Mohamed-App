# مهندس المستقبل — Future Engineer (Flutter Mobile Application)

تطبيق فلاتر تفاعلي للهواتف الذكية (Android / iOS / Web) مُحوّل بالكامل من تطبيق الويب التفاعلي، مبني باستخدام **Flutter 3.x** و **Material 3** و **Riverpod** مع دعم كامل للغة العربية (RTL) وخط **Cairo**.

## 📁 هيكل مشروع فلاتر (Flutter Project Structure)

```text
├── pubspec.yaml                             # إعدادات الحزم والاعتماديات
├── analysis_options.yaml                    # قواعد فحص الكود (Flutter Lints)
├── lib/
│   ├── main.dart                            # نقطة انطلاق التطبيق وضبط RTL والثيم
│   ├── models/
│   │   └── station_model.dart               # نماذج البيانات للمحطات والبطاقات والتحديات
│   ├── data/
│   │   └── stations_data.dart               # محتوى المحطات الهندسية الـ 5 بالكامل
│   ├── providers/
│   │   └── app_state_provider.dart          # إدارة الحالة وحفظ التقدم عبر Riverpod & SharedPreferences
│   ├── services/
│   │   └── sound_service.dart               # المؤثرات الصوتية والاهتزاز التفاعلي (HapticFeedback)
│   └── screens/
│       ├── login_screen.dart                # شاشة تسجيل الدخول واختيار الشخصية
│       ├── map_screen.dart                  # خريطة الرحلة الهندسية التفاعلية
│       ├── station_intro_screen.dart        # شاشة تقديم المحطة والهدف التعليمي
│       ├── cards_screen.dart                # شاشة البطاقات التفاعلية وكسب النجوم
│       ├── activity_drag_drop_screen.dart   # تحدي السحب والإفلات والترتيب التفاعلي
│       ├── station_done_screen.dart         # شاشة إنجاز المحطة وملخص النقاط
│       └── certificate_screen.dart          # شهادة مهندس المستقبل وتصدير PDF
└── test/
    └── widget_test.dart                     # اختبارات الويدجت الأساسية
```

## 🚀 طريقة التشغيل على جهازك (Run Locally with Flutter SDK)

1. تأكد من تثبيت [Flutter SDK](https://docs.flutter.dev/get-started/install).
2. داخل مجلد المشروع نفّذ الأوامر التالية:

```bash
# توليد ملفات المنصات (android, ios, web) إن لم تكن موجودة
flutter create . --project-name future_engineer

# تثبيت الحزم والاعتماديات
flutter pub get

# تشغيل التطبيق على المحاكي أو الهاتف المتصل
flutter run
```
