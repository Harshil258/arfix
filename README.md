# ARFIX - Android Release Build Guide

This guide describes how to build the signed release APK and App Bundle (AAB) for the ARFIX Flutter application.

## 1. Release Signing Keystore Configuration

A Java Keystore (JKS) has been generated and configured for release builds.

*   **Keystore File**: [android/app/key.jks](file:///Volumes/ALLPROJECTS/smitproject/arfix/android/app/key.jks)
*   **Properties File**: [android/key.properties](file:///Volumes/ALLPROJECTS/smitproject/arfix/android/key.properties)
*   **Keystore Credentials**:
    *   **Store Password**: `arfix@123`
    *   **Key Password**: `arfix@123`
    *   **Key Alias**: `arfix@123`

### Build Configuration Files
*   The credentials are configuration-driven via [key.properties](file:///Volumes/ALLPROJECTS/smitproject/arfix/android/key.properties).
*   The Android application build script at [android/app/build.gradle.kts](file:///Volumes/ALLPROJECTS/smitproject/arfix/android/app/build.gradle.kts) automatically loads the credentials from `key.properties` and assigns them to the `release` signing configuration.

---

## 2. Build Commands

Before running the builds, clean the project to make sure no cached files interfere:

```bash
flutter clean
flutter pub get
```

### Build Release APK
The APK (Android Package) is ideal for testing the production build directly on physical Android devices.

```bash
flutter build apk --release
```
*   **Output Path**: `build/app/outputs/flutter-apk/app-release.apk`

### Build Release App Bundle (AAB)
The AAB (Android App Bundle) is the publishing format required by Google Play Console for store deployment.

```bash
flutter build appbundle --release
```
*   **Output Path**: `build/app/outputs/bundle/release/app-release.aab`

---

## 3. Troubleshooting

*   **Missing `key.properties`**: If `android/key.properties` is missing, the build will fallback to using the `debug` signing configuration. Ensure the file contains:
    ```properties
    storePassword=arfix@123
    keyPassword=arfix@123
    keyAlias=arfix@123
    storeFile=key.jks
    ```
*   **Keystore File Location**: Ensure that `key.jks` resides inside the [android/app/](file:///Volumes/ALLPROJECTS/smitproject/arfix/android/app) directory, as referenced relatively by the build script.
