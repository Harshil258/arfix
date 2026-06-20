import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:intl/intl.dart';

import '../constants/api_constants.dart';
import '../constants/color_constants.dart';

class Helpers {
  Helpers._();

  static void showSnackbar({
    required String title,
    required String message,
    bool isError = false,
    bool isSuccess = false,
  }) {
    Get.snackbar(
      title,
      message,
      snackPosition: SnackPosition.BOTTOM,
      backgroundColor: isError
          ? AppColors.error.withValues(alpha: 0.9)
          : isSuccess
              ? AppColors.success.withValues(alpha: 0.9)
              : AppColors.primary.withValues(alpha: 0.9),
      colorText: Colors.white,
      borderRadius: 12,
      margin: const EdgeInsets.all(16),
      duration: const Duration(seconds: 3),
      icon: Icon(
        isError ? Icons.error_outline : isSuccess ? Icons.check_circle_outline : Icons.info_outline,
        color: Colors.white,
      ),
    );
  }

  static String formatCoins(int coins) {
    if (coins >= 1000000) return '${(coins / 1000000).toStringAsFixed(1)}M';
    if (coins >= 1000) return '${(coins / 1000).toStringAsFixed(1)}K';
    return coins.toString();
  }

  static String formatDate(String dateStr) {
    try {
      final date = DateTime.parse(dateStr);
      return DateFormat('dd MMM yyyy').format(date);
    } catch (_) {
      return dateStr;
    }
  }

  static String formatDateTime(String dateStr) {
    try {
      final date = DateTime.parse(dateStr);
      return DateFormat('dd MMM yyyy, hh:mm a').format(date);
    } catch (_) {
      return dateStr;
    }
  }

  static String timeAgo(String dateStr) {
    try {
      final date = DateTime.parse(dateStr);
      final now = DateTime.now();
      final diff = now.difference(date);
      if (diff.inDays > 365) return '${(diff.inDays / 365).floor()}y ago';
      if (diff.inDays > 30) return '${(diff.inDays / 30).floor()}mo ago';
      if (diff.inDays > 0) return '${diff.inDays}d ago';
      if (diff.inHours > 0) return '${diff.inHours}h ago';
      if (diff.inMinutes > 0) return '${diff.inMinutes}m ago';
      return 'Just now';
    } catch (_) {
      return '';
    }
  }

  static String buildImageUrl(String? relativePath) {
    if (relativePath == null || relativePath.isEmpty) return '';
    if (relativePath.startsWith('http')) return relativePath;
    return '${ApiConstants.baseUrl}$relativePath';
  }

  static Color getStatusColor(String status) {
    switch (status.toUpperCase()) {
      case 'OPEN':
        return AppColors.info;
      case 'IN_PROGRESS':
      case 'PROCESSING':
      case 'PENDING':
        return AppColors.warning;
      case 'RESOLVED':
      case 'COMPLETED':
      case 'APPROVED':
        return AppColors.success;
      case 'CLOSED':
        return AppColors.lightTextSecondary;
      case 'SCANNED':
        return AppColors.success;
      case 'ACTIVE':
        return AppColors.primary;
      case 'FAILED':
      case 'REJECTED':
      case 'CANCELLED':
        return AppColors.error;
      default:
        return AppColors.lightTextSecondary;
    }
  }
}
