import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'screens/timer_screen.dart';
import 'theme/app_theme.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);
  runApp(const HeathersHelperApp());
}

class HeathersHelperApp extends StatelessWidget {
  const HeathersHelperApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: "Heather's Helper",
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light,
      home: const TimerScreen(),
    );
  }
}
