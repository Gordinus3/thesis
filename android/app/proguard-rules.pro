# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# --- WebRTC ---
-keep class org.webrtc.** { *; }              # Keep all WebRTC classes
-keep class com.oney.WebRTCModule.** { *; }  # Keep react-native-webrtc module
-dontwarn org.webrtc.**                      # Suppress WebRTC warnings

# --- Firebase Firestore/Auth ---
-keep class com.google.firebase.** { *; }    # Keep Firebase classes
-dontwarn com.google.firebase.**             # Ignore Firebase warnings

# --- React Native bridge annotations ---
-keepclassmembers class * {
    @com.facebook.react.bridge.ReactMethod <methods>;
}

# --- mDNS (react-native-zeroconf / jmdns) ---
-keep class javax.jmdns.** { *; }
-dontwarn javax.jmdns.**

# Keep all React Native classes
-keep class com.facebook.react.** { *; }

# Keep your own modules if accessed via reflection
-keep class com.myapp.modules.** { *; }

# Keep generated R classes (images, layouts, drawables)
-keep class **.R$* { *; }
