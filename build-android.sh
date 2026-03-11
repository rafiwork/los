#!/bin/bash

# Script for building Android APK using Capacitor

# Clean previous builds
npx capacitor clean android

# Sync Capacitor with the latest changes
npx capacitor sync android

# Build the Android project
npx capacitor build android

# Navigate to the android directory
cd android

# Build the APK
./gradlew assembleDebug

echo "APK build completed. Check the output in the android/app/build/outputs/apk/debug directory."