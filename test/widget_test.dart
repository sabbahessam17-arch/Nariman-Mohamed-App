import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:future_engineer/main.dart';
import 'package:future_engineer/providers/app_state_provider.dart';

void main() {
  testWidgets('Future Engineer app renders login screen initially', (WidgetTester tester) async {
    SharedPreferences.setMockInitialValues({});
    final prefs = await SharedPreferences.getInstance();

    await tester.pumpWidget(
      ProviderScope(
        overrides: [
          sharedPreferencesProvider.overrideWithValue(prefs),
        ],
        child: const FutureEngineerApp(),
      ),
    );

    expect(find.text('مهندس المستقبل'), findsWidgets);
    expect(find.text('ادخل الآن'), findsOneWidget);
  });
}
