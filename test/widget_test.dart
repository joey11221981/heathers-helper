import 'package:flutter_test/flutter_test.dart';
import 'package:heathers_helper/main.dart';

void main() {
  testWidgets('shows app title and start button', (WidgetTester tester) async {
    await tester.pumpWidget(const HeathersHelperApp());

    expect(find.text("Heather's Helper"), findsOneWidget);
    expect(find.text('Start'), findsOneWidget);
  });
}
