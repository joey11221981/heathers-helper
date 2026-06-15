import 'package:flutter/material.dart';

class AppTheme {
  static const Color teal = Color(0xFF1B4D4A);
  static const Color tealLight = Color(0xFF2A6B66);
  static const Color geckoGreen = Color(0xFF4CAF7A);
  static const Color surface = Color(0xFFF4F8F7);
  static const Color onSurface = Color(0xFF1A2E2C);

  static ThemeData get light {
    final base = ColorScheme.fromSeed(
      seedColor: teal,
      brightness: Brightness.light,
      primary: teal,
      secondary: geckoGreen,
      surface: surface,
      onSurface: onSurface,
    );

    return ThemeData(
      useMaterial3: true,
      colorScheme: base,
      scaffoldBackgroundColor: surface,
      appBarTheme: const AppBarTheme(
        backgroundColor: teal,
        foregroundColor: Colors.white,
        centerTitle: true,
        elevation: 0,
      ),
      cardTheme: CardThemeData(
        color: Colors.white,
        elevation: 2,
        shadowColor: teal.withValues(alpha: 0.12),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      ),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          backgroundColor: teal,
          foregroundColor: Colors.white,
          padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 14),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(14),
          ),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: teal,
          side: const BorderSide(color: tealLight),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(14),
          ),
        ),
      ),
      chipTheme: ChipThemeData(
        backgroundColor: Colors.white,
        selectedColor: geckoGreen.withValues(alpha: 0.2),
        labelStyle: const TextStyle(
          color: onSurface,
          fontWeight: FontWeight.w600,
        ),
        side: BorderSide(color: teal.withValues(alpha: 0.2)),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      ),
      textTheme: const TextTheme(
        headlineLarge: TextStyle(
          fontSize: 56,
          fontWeight: FontWeight.w700,
          letterSpacing: 2,
          color: onSurface,
        ),
        titleLarge: TextStyle(
          fontSize: 22,
          fontWeight: FontWeight.w600,
          color: onSurface,
        ),
        bodyMedium: TextStyle(
          fontSize: 15,
          color: Color(0xFF4A6360),
        ),
      ),
    );
  }
}
