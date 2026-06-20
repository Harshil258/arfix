import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';

import '../core/theme/app_theme.dart';
import '../core/theme/theme_controller.dart';
import 'bindings/initial_binding.dart';
import 'routes/app_pages.dart';
import 'routes/app_routes.dart';
import 'translations/app_translations.dart';

class ArfixApp extends StatelessWidget {
  const ArfixApp({super.key});

  @override
  Widget build(BuildContext context) {
    // Initialize theme controller early
    final themeController = Get.put(ThemeController(), permanent: true);

    // Read persisted locale from GetStorage
    final storage = GetStorage();
    final String? langCode = storage.read<String>('language_code');
    final String? countryCode = storage.read<String>('country_code');
    final locale = langCode != null ? Locale(langCode, countryCode) : const Locale('en', 'US');

    return Obx(
      () => GetMaterialApp(
        title: 'Arfix Rewards',
        debugShowCheckedModeBanner: false,

        // Theme
        theme: AppTheme.lightTheme,
        darkTheme: AppTheme.darkTheme,
        themeMode: themeController.themeMode,

        // Routing
        initialRoute: AppRoutes.splash,
        getPages: AppPages.pages,
        initialBinding: InitialBinding(),

        // Translations
        translations: AppTranslations(),
        locale: locale,
        fallbackLocale: const Locale('en', 'US'),

        // Transitions
        defaultTransition: Transition.cupertino,
        transitionDuration: const Duration(milliseconds: 300),

        // Builder for global overlays
        builder: (context, child) {
          return MediaQuery(
            data: MediaQuery.of(context).copyWith(
              textScaler: TextScaler.noScaling,
            ),
            child: child!,
          );
        },
      ),
    );
  }
}
