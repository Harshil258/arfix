import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:get/get.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import '../../core/constants/color_constants.dart';
import 'controller.dart';

class ScannerView extends GetView<ScannerController> {
  const ScannerView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.black,
        iconTheme: const IconThemeData(color: Colors.white),
        title: Text('Scan QR Code'.tr, style: const TextStyle(color: Colors.white)),
      ),
      body: Obx(() {
        if (controller.scanResult.value != null) {
          return _buildSuccessState(context);
        }
        return Stack(
          children: [
            // Camera
            MobileScanner(
              onDetect: (capture) {
                final barcodes = capture.barcodes;
                if (barcodes.isNotEmpty && barcodes.first.rawValue != null) {
                  controller.processScan(barcodes.first.rawValue!);
                }
              },
            ),
            // Overlay
            Container(
              decoration: BoxDecoration(
                color: Colors.black.withValues(alpha: 0.5),
              ),
            ),
            // Scanner frame
            Center(
              child: Container(
                width: 280, height: 280,
                decoration: BoxDecoration(
                  border: Border.all(color: AppColors.primary, width: 3),
                  borderRadius: BorderRadius.circular(24),
                ),
              ).animate(onPlay: (c) => c.repeat(reverse: true))
                  .shimmer(duration: 2000.ms, color: AppColors.accent.withValues(alpha: 0.3)),
            ),
            // Instructions
            Positioned(
              bottom: 120, left: 0, right: 0,
              child: Column(
                children: [
                  if (controller.isProcessing.value)
                    const CircularProgressIndicator(color: Colors.white)
                  else
                    Column(
                      children: [
                        const Icon(Icons.qr_code_2, color: Colors.white54, size: 40),
                        const SizedBox(height: 12),
                        Text('Point your camera at the QR code'.tr,
                          style: Theme.of(context).textTheme.bodyLarge?.copyWith(color: Colors.white70),
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 4),
                        Text('on your ARFIX product'.tr,
                          style: Theme.of(context).textTheme.bodySmall?.copyWith(color: Colors.white54),
                          textAlign: TextAlign.center,
                        ),
                      ],
                    ),
                ],
              ),
            ),
          ],
        );
      }),
    );
  }

  Widget _buildSuccessState(BuildContext context) {
    final result = controller.scanResult.value!;
    return Container(
      width: double.infinity,
      decoration: const BoxDecoration(gradient: AppColors.primaryGradient),
      child: SafeArea(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 120, height: 120,
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.2),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.check_circle, color: Colors.white, size: 64),
            ).animate().scale(duration: 600.ms, curve: Curves.elasticOut),
            const SizedBox(height: 32),
            Text('Scan Successful!'.tr,
              style: const TextStyle(color: Colors.white, fontSize: 28, fontWeight: FontWeight.w700)),
            const SizedBox(height: 24),
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 40),
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Column(
                children: [
                  Text('Coins Earned'.tr, style: const TextStyle(color: Colors.white70, fontSize: 14)),
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.monetization_on, color: AppColors.coinGold, size: 36),
                      const SizedBox(width: 8),
                      Text('+${result.coupon.price}',
                        style: const TextStyle(color: Colors.white, fontSize: 48, fontWeight: FontWeight.w800)),
                    ],
                  ).animate().scale(delay: 300.ms, duration: 600.ms, curve: Curves.elasticOut),
                  const SizedBox(height: 16),
                  const Divider(color: Colors.white24),
                  const SizedBox(height: 12),
                  _infoRow('Code'.tr, result.coupon.code),
                  const SizedBox(height: 8),
                  _infoRow('New Balance'.tr, '${result.newBalance} ${'coins'.tr}'),
                ],
              ),
            ).animate().fadeIn(delay: 200.ms).slideY(begin: 0.2),
            const SizedBox(height: 40),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                OutlinedButton(
                  onPressed: () {
                    controller.resetScanner();
                  },
                  style: OutlinedButton.styleFrom(
                    foregroundColor: Colors.white,
                    side: const BorderSide(color: Colors.white54),
                    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
                  ),
                  child: Text('Scan Another'.tr),
                ),
                const SizedBox(width: 16),
                ElevatedButton(
                  onPressed: () => Get.back(),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.white,
                    foregroundColor: AppColors.primary,
                    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
                  ),
                  child: Text('Done'.tr),
                ),
              ],
            ).animate().fadeIn(delay: 500.ms),
          ],
        ),
      ),
    );
  }

  Widget _infoRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: const TextStyle(color: Colors.white60, fontSize: 14)),
        Text(value, style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.w600)),
      ],
    );
  }
}
