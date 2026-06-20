import java.io.FileInputStream
import java.util.Properties

plugins {
    id("com.android.application")
    id("kotlin-android")
    // The Flutter Gradle Plugin must be applied after the Android and Kotlin Gradle plugins.
    id("dev.flutter.flutter-gradle-plugin")
}

val keystorePropertiesFile = rootProject.file("key.properties")
val keystoreProperties = Properties()
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(FileInputStream(keystorePropertiesFile))
}

val keyAliasProp = if (keystorePropertiesFile.exists()) {
    keystoreProperties["keyAlias"] as String
} else {
    System.getenv("KEY_ALIAS") ?: ""
}

val keyPasswordProp = if (keystorePropertiesFile.exists()) {
    keystoreProperties["keyPassword"] as String
} else {
    System.getenv("KEY_PASSWORD") ?: ""
}

val storeFileProp = if (keystorePropertiesFile.exists()) {
    keystoreProperties["storeFile"] as String
} else {
    System.getenv("KEYSTORE_PATH") ?: ""
}

val storePasswordProp = if (keystorePropertiesFile.exists()) {
    keystoreProperties["storePassword"] as String
} else {
    System.getenv("STORE_PASSWORD") ?: ""
}

android {
    namespace = "com.arfix.arfixapp.arfix"
    compileSdk = flutter.compileSdkVersion
    ndkVersion = flutter.ndkVersion

    compileOptions {
        isCoreLibraryDesugaringEnabled = true
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }

    kotlinOptions {
        jvmTarget = JavaVersion.VERSION_11.toString()
    }

    defaultConfig {
        applicationId = "com.arfix.arfixapp.arfix"
        minSdk = flutter.minSdkVersion
        targetSdk = flutter.targetSdkVersion
        versionCode = flutter.versionCode
        versionName = flutter.versionName
        multiDexEnabled = true
    }

    signingConfigs {
        create("release") {
            keyAlias = keyAliasProp
            keyPassword = keyPasswordProp
            storeFile = if (storeFileProp.isNotEmpty()) file(storeFileProp) else null
            storePassword = storePasswordProp
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            signingConfig = if (keystorePropertiesFile.exists() || keyAliasProp.isNotEmpty()) {
                signingConfigs.getByName("release")
            } else {
                signingConfigs.getByName("debug")
            }
        }
    }
}

flutter {
    source = "../.."
}

dependencies {
    coreLibraryDesugaring("com.android.tools:desugar_jdk_libs:2.1.4")
}
