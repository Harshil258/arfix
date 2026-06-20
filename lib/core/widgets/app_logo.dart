import 'package:flutter/material.dart';

class AppLogo extends StatelessWidget {
  final double size;
  final bool showBackground;
  final Color? color;

  const AppLogo({
    super.key,
    this.size = 120,
    this.showBackground = true,
    this.color,
  });

  @override
  Widget build(BuildContext context) {
    Widget imageWidget = Image.asset(
      'assets/images/logo.png',
      fit: BoxFit.contain,
    );

    // If color filter is specified, apply it to the logo image
    if (color != null) {
      imageWidget = ColorFiltered(
        colorFilter: ColorFilter.mode(color!, BlendMode.srcIn),
        child: imageWidget,
      );
    }

    if (!showBackground) {
      return SizedBox(
        width: size,
        height: size,
        child: imageWidget,
      );
    }

    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        color: const Color(0xFF07232F), // Exact dark background color from brand logo
        borderRadius: BorderRadius.circular(size * 0.18),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.15),
            blurRadius: size * 0.15,
            offset: Offset(0, size * 0.06),
          ),
        ],
      ),
      padding: EdgeInsets.all(size * 0.15),
      child: imageWidget,
    );
  }
}
