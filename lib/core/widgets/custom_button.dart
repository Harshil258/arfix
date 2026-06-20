import 'package:flutter/material.dart';
import '../constants/color_constants.dart';

class CustomButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final bool isLoading;
  final bool isOutlined;
  final IconData? icon;
  final double? width;
  final Gradient? gradient;

  const CustomButton({
    super.key, required this.text, this.onPressed,
    this.isLoading = false, this.isOutlined = false,
    this.icon, this.width, this.gradient,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final primaryColor = theme.colorScheme.primary;
    final defaultGradient = isDark ? AppColors.goldGradient : AppColors.primaryGradient;

    if (isOutlined) {
      return SizedBox(
        width: width ?? double.infinity,
        height: 56,
        child: OutlinedButton(
          onPressed: isLoading ? null : onPressed,
          child: _buildChild(context, isDark, primaryColor, isOutlined: true),
        ),
      );
    }

    return Container(
      width: width ?? double.infinity,
      height: 56,
      decoration: BoxDecoration(
        gradient: gradient ?? defaultGradient,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: primaryColor.withValues(alpha: 0.3),
            blurRadius: 12, offset: const Offset(0, 4),
          ),
        ],
      ),
      child: ElevatedButton(
        onPressed: isLoading ? null : onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.transparent,
          shadowColor: Colors.transparent,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        ),
        child: _buildChild(context, isDark, primaryColor),
      ),
    );
  }

  Widget _buildChild(BuildContext context, bool isDark, Color primaryColor, {bool isOutlined = false}) {
    if (isLoading) {
      return SizedBox(
        height: 24, width: 24,
        child: CircularProgressIndicator(
          strokeWidth: 2.5,
          valueColor: AlwaysStoppedAnimation(
            isOutlined ? primaryColor : (isDark ? Colors.black : Colors.white),
          ),
        ),
      );
    }
    final textStyle = TextStyle(
      color: isOutlined ? primaryColor : (isDark ? Colors.black : Colors.white),
      fontWeight: FontWeight.w600,
    );
    if (icon != null) {
      return Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, size: 20, color: isOutlined ? primaryColor : (isDark ? Colors.black : Colors.white)),
          const SizedBox(width: 8),
          Text(text, style: textStyle),
        ],
      );
    }
    return Text(text, style: textStyle);
  }
}
