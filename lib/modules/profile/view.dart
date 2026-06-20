import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:get/get.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../app/routes/app_routes.dart';
import '../../core/constants/color_constants.dart';
import '../../core/theme/theme_controller.dart';
import '../../core/utils/helpers.dart';
import 'controller.dart';

class ProfileView extends GetView<ProfileController> {
  const ProfileView({super.key});

  @override
  Widget build(BuildContext context) {
    final themeCtrl = Get.find<ThemeController>();

    return Scaffold(
      appBar: AppBar(title: Text('Profile'.tr)),
      body: Obx(() {
        final user = controller.user.value;
        return ListView(
          padding: const EdgeInsets.all(20),
          children: [
            // Avatar card
            Center(
              child: Column(
                children: [
                  Container(
                    width: 90, height: 90,
                    decoration: BoxDecoration(
                      gradient: AppColors.primaryGradient,
                      shape: BoxShape.circle,
                      boxShadow: [BoxShadow(
                        color: AppColors.primary.withValues(alpha: 0.3),
                        blurRadius: 20,
                      )],
                    ),
                    child: Center(
                      child: Text(
                        (user?.name ?? 'U').substring(0, 1).toUpperCase(),
                        style: const TextStyle(color: Colors.white, fontSize: 36, fontWeight: FontWeight.w700),
                      ),
                    ),
                  ).animate().scale(duration: 500.ms, curve: Curves.elasticOut),
                  const SizedBox(height: 16),
                  Text(user?.name ?? '', style: Theme.of(context).textTheme.headlineMedium),
                  const SizedBox(height: 4),
                  Text(user?.email ?? '', style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: Theme.of(context).textTheme.bodySmall?.color)),
                  const SizedBox(height: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                    decoration: BoxDecoration(
                      color: AppColors.coinGold.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.monetization_on, color: AppColors.coinGold, size: 18),
                        const SizedBox(width: 6),
                        Text('${user?.coins ?? 0} coins',
                          style: Theme.of(context).textTheme.titleSmall?.copyWith(color: AppColors.coinGold)),
                      ],
                    ),
                  ),
                ],
              ),
            ).animate().fadeIn(duration: 400.ms),
            const SizedBox(height: 32),

            // Settings
            _SectionTitle('Account'.tr),
            _SettingsTile(icon: Icons.person_outline, title: 'Edit Profile'.tr,
              onTap: () => Get.toNamed(AppRoutes.editProfile)),
            _SettingsTile(icon: Icons.lock_outline, title: 'Change Password'.tr,
              onTap: () => Get.toNamed(AppRoutes.changePassword)),
            const SizedBox(height: 20),

            _SectionTitle('Preferences'.tr),
            Obx(() => _SettingsTile(
              icon: Icons.dark_mode_outlined, title: 'Dark Mode'.tr,
              trailing: Switch.adaptive(
                value: themeCtrl.isDarkMode,
                onChanged: (_) => themeCtrl.toggleTheme(),
                activeTrackColor: Theme.of(context).colorScheme.primary,
              ),
            )),
            Obx(() => _SettingsTile(
              icon: Icons.language,
              title: 'Language'.tr,
              trailing: DropdownButton<String>(
                value: controller.currentLanguage.value,
                underline: const SizedBox(),
                items: ['English', 'Hindi'].map((String lang) {
                  return DropdownMenuItem<String>(
                    value: lang,
                    child: Text(lang, style: Theme.of(context).textTheme.bodyMedium),
                  );
                }).toList(),
                onChanged: (String? val) {
                  if (val != null) {
                    controller.changeLanguage(val);
                  }
                },
              ),
            )),
            const SizedBox(height: 20),

            _SectionTitle('General'.tr),
            _SettingsTile(icon: Icons.history, title: 'Scan History'.tr,
              onTap: () => Get.toNamed(AppRoutes.scanHistory)),
            _SettingsTile(icon: Icons.account_balance, title: 'Withdraw Funds'.tr,
              onTap: () => Get.toNamed(AppRoutes.withdraw)),
            _SettingsTile(icon: Icons.support_agent, title: 'Customer Support'.tr,
              onTap: () => Get.toNamed(AppRoutes.createTicket)),
            _SettingsTile(icon: Icons.info_outline, title: 'About App'.tr, onTap: () => Get.toNamed(AppRoutes.about)),
            _SettingsTile(
              icon: Icons.privacy_tip_outlined,
              title: 'Privacy Policy'.tr,
              onTap: () => _launchUrl('https://artilefix.com/privacy-policy'),
            ),
            _SettingsTile(
              icon: Icons.description_outlined,
              title: 'Terms & Conditions'.tr,
              onTap: () => _launchUrl('https://artilefix.com/terms-conditions'),
            ),
            const SizedBox(height: 20),

            _SectionTitle('Danger Zone'.tr),
            // Logout
            _SettingsTile(
              icon: Icons.logout, title: 'Logout'.tr,
              titleColor: AppColors.error, iconColor: AppColors.error,
              onTap: () => _showLogoutDialog(context),
            ),
            _SettingsTile(
              icon: Icons.delete_forever, title: 'Delete Account'.tr,
              titleColor: AppColors.error, iconColor: AppColors.error,
              onTap: () => _showDeleteAccountDialog(context),
            ),
            const SizedBox(height: 24),
            Center(
              child: Text(
                'Connect with us'.tr,
                style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
            ),
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _buildSocialButton(
                  icon: Icons.facebook,
                  color: const Color(0xFF1877F2),
                  tooltip: 'Facebook',
                  onTap: () => _launchUrl('https://facebook.com'),
                ),
                _buildSocialButton(
                  icon: Icons.camera_alt, // Represents Instagram
                  color: const Color(0xFFE1306C),
                  tooltip: 'Instagram',
                  onTap: () => _launchUrl('https://instagram.com'),
                ),
                _buildSocialButton(
                  icon: Icons.play_arrow_rounded, // Represents YouTube
                  color: const Color(0xFFFF0000),
                  tooltip: 'YouTube',
                  onTap: () => _launchUrl('https://youtube.com'),
                ),
              ],
            ).animate().fadeIn(delay: 150.ms),
            const SizedBox(height: 32),

            // Version
            Center(child: Text('${'Version'.tr} 1.0.0',
              style: Theme.of(context).textTheme.bodySmall)),
            const SizedBox(height: 16),
          ],
        );
      }),
    );
  }

  void _showLogoutDialog(BuildContext context) {
    Get.dialog(
      AlertDialog(
        title: Text('Logout'.tr),
        content: Text('Are you sure you want to logout?'.tr),
        actions: [
          TextButton(onPressed: () => Get.back(), child: Text('Cancel'.tr)),
          ElevatedButton(
            onPressed: () { Get.back(); controller.logout(); },
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.error),
            child: Text('Logout'.tr),
          ),
        ],
      ),
    );
  }

  void _showDeleteAccountDialog(BuildContext context) {
    final passwordController = controller.deletePasswordController;
    passwordController.clear();
    Get.dialog(
      AlertDialog(
        title: Text('Delete Account'.tr),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('This action cannot be undone. Enter your password to confirm.'.tr),
            const SizedBox(height: 16),
            TextField(
              controller: passwordController,
              obscureText: true,
              decoration: InputDecoration(
                hintText: 'Enter your password'.tr,
                border: const OutlineInputBorder(),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Get.back(), child: Text('Cancel'.tr)),
          ElevatedButton(
            onPressed: () {
              if (passwordController.text.isNotEmpty) {
                Get.back();
                controller.deleteAccount(passwordController.text);
              }
            },
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.error),
            child: Text('Delete'.tr),
          ),
        ],
      ),
    );
  }

  Future<void> _launchUrl(String url) async {
    final Uri uri = Uri.parse(url);
    try {
      if (!await launchUrl(uri, mode: LaunchMode.externalApplication)) {
        Helpers.showSnackbar(title: 'Error', message: 'Could not launch $url', isError: true);
      }
    } catch (e) {
      Helpers.showSnackbar(title: 'Error', message: 'Could not launch URL: $e', isError: true);
    }
  }

  Widget _buildSocialButton({
    required IconData icon,
    required Color color,
    required String tooltip,
    required VoidCallback onTap,
  }) {
    return Tooltip(
      message: tooltip,
      child: Material(
        color: color.withValues(alpha: 0.1),
        shape: const CircleBorder(),
        child: InkWell(
          onTap: onTap,
          customBorder: const CircleBorder(),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Icon(icon, color: color, size: 28),
          ),
        ),
      ),
    );
  }
}

class _SectionTitle extends StatelessWidget {
  final String title;
  const _SectionTitle(this.title);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Text(title, style: Theme.of(context).textTheme.labelLarge?.copyWith(
        color: Theme.of(context).textTheme.bodySmall?.color)),
    );
  }
}

class _SettingsTile extends StatelessWidget {
  final IconData icon;
  final String title;
  final VoidCallback? onTap;
  final Widget? trailing;
  final Color? titleColor;
  final Color? iconColor;

  const _SettingsTile({
    required this.icon, required this.title,
    this.onTap, this.trailing, this.titleColor, this.iconColor,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 4),
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(14),
      ),
      child: ListTile(
        leading: Icon(icon, color: iconColor ?? Theme.of(context).colorScheme.primary, size: 22),
        title: Text(title, style: Theme.of(context).textTheme.titleSmall?.copyWith(color: titleColor)),
        trailing: trailing ?? const Icon(Icons.chevron_right, size: 20),
        onTap: onTap,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      ),
    );
  }
}
