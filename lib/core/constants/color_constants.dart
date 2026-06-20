import 'package:flutter/material.dart';

class AppColors {
  AppColors._();

  // ─── Primary Brand Palette (Deep Teal/Navy) ───
  static const Color primary = Color(0xFF0B3547);
  static const Color primaryLight = Color(0xFF1E526B);
  static const Color primaryDark = Color(0xFF06222F);
  static const Color primarySurface = Color(0xFFE6EFF2);

  // ─── Accent / Secondary (Brand Gold) ───
  static const Color accent = Color(0xFFEAB126);
  static const Color accentLight = Color(0xFFFFD466);
  static const Color accentDark = Color(0xFFC79213);

  // ─── Gradient Pairs ───
  static const Color gradientStart = Color(0xFF0B3547);
  static const Color gradientEnd = Color(0xFF1E526B);
  static const Color gradientWarm = Color(0xFFE57373);
  static const Color gradientGold = Color(0xFFEAB126);

  // ─── Semantic Colors ───
  static const Color success = Color(0xFF00C48C);
  static const Color successLight = Color(0xFFE6FFF6);
  static const Color warning = Color(0xFFFFAA33);
  static const Color warningLight = Color(0xFFFFF5E6);
  static const Color error = Color(0xFFFF4757);
  static const Color errorLight = Color(0xFFFFEBEE);
  static const Color info = Color(0xFF3498DB);
  static const Color infoLight = Color(0xFFE8F4FD);

  // ─── Dark Theme ───
  static const Color darkBg = Color(0xFF030D12); // Deep dark slate-black (high contrast)
  static const Color darkSurface = Color(0xFF091E27); // Surface/NavBar color
  static const Color darkCard = Color(0xFF10303D); // Card container color (stands out clearly against darkBg)
  static const Color darkBorder = Color(0xFF1B4E63); // Border color for card edges
  static const Color darkText = Color(0xFFEBF4F7);
  static const Color darkTextSecondary = Color(0xFF7CA1B3);

  // ─── Light Theme ───
  static const Color lightBg = Color(0xFFF0F5F7);
  static const Color lightSurface = Color(0xFFFFFFFF);
  static const Color lightCard = Color(0xFFFFFFFF);
  static const Color lightBorder = Color(0xFFD1DFE4);
  static const Color lightText = Color(0xFF0B202A);
  static const Color lightTextSecondary = Color(0xFF55707D);

  // ─── Coin / Reward ───
  static const Color coinGold = Color(0xFFEAB126);
  static const Color coinGlow = Color(0xFFFFF5D6);

  // ─── Gradients ───
  static const LinearGradient primaryGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [gradientStart, gradientEnd],
  );

  static const LinearGradient warmGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFFE57373), Color(0xFFFF8E53)],
  );

  static const LinearGradient goldGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFFEAB126), Color(0xFFFFD466)],
  );

  static const LinearGradient darkCardGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFF0D2C3A), Color(0xFF0A232E)],
  );

  static const LinearGradient successGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFF00C48C), Color(0xFFEAB126)],
  );
}
