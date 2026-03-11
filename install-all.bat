@echo off

REM Install Java JDK 11
set JAVA_JDK_URL=https://download.oracle.com/java/11/archive/jdk-11.0.12_windows-x64_bin.exe
set JAVA_JDK_INSTALLER=java-jdk.exe

echo Downloading Java JDK...

curl -o %JAVA_JDK_INSTALLER% %JAVA_JDK_URL%
echo Installing Java JDK...

start /wait %JAVA_JDK_INSTALLER% /s

echo Java JDK installed successfully.

REM Install Android Studio
set ANDROID_STUDIO_URL=https://r1---sn-uxaxjvh4.googlevideo.com/videoplayback?expire=1647043185&h=2209b64800cc562ed0528a53eb708839&l=1681569888&bp=ugw&mime=application/octet-stream&mm=31%2C26&mn=sn-uxaxjvh4&ms=au%2Crdu&mt=1647011391&mv=m&q=208a37ba8c0fecfc&uhc=1&ip=0.0.0.0&fexp=24001373&requiressl=yes
set ANDROID_STUDIO_INSTALLER=android-studio.exe

echo Downloading Android Studio...

curl -o %ANDROID_STUDIO_INSTALLER% %ANDROID_STUDIO_URL%
echo Installing Android Studio...

start /wait %ANDROID_STUDIO_INSTALLER% /S

echo Android Studio installed successfully.

REM Install Node.js
set NODE_JS_URL=https://nodejs.org/dist/v14.17.0/node-v14.17.0-x64.msi
set NODE_JS_INSTALLER=nodejs.msi

echo Downloading Node.js...

curl -o %NODE_JS_INSTALLER% %NODE_JS_URL%
echo Installing Node.js...

start /wait msiexec /i %NODE_JS_INSTALLER% /quiet

echo Node.js installed successfully.

REM Set up the project and build APK
cd path\to\your\project
call gradlew assembleDebug

echo APK built successfully!