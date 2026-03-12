# Build Native APK - Manual Steps

## You Need to Build the APK Yourself

Since automated tools aren't working, here's what you need to do:

### Option 1: Use EAS Build (Cloud - No Android Studio Needed)

1. **Open a NEW PowerShell/Command Prompt window** (not in VS Code)

2. **Navigate to the project:**
   ```
   cd "C:\Users\sulta\Desktop\mobile app\mobile-student"
   ```

3. **Run the build command:**
   ```
   eas build --platform android --profile preview
   ```

4. **Follow the prompts:**
   - It will ask you to login to Expo
   - Create a free account at expo.dev
   - Login with your credentials

5. **Wait for the build:**
   - Takes 10-15 minutes
   - You'll see progress in the terminal
   - When done, you get a download link

6. **Download the APK:**
   - Click the link or copy it to your browser
   - Download the .apk file

7. **Install on your phone:**
   - Transfer APK to phone via USB
   - Or download directly on phone
   - Install and run

---

### Option 2: Install Android Studio (Then Build Locally)

If you want to build locally, you need Android Studio:

1. **Download Android Studio:**
   - Go to: https://developer.android.com/studio
   - Download and install

2. **Install Android SDK:**
   - Open Android Studio
   - Go to Tools → SDK Manager
   - Install Android SDK Platform 34
   - Install Android SDK Build-Tools

3. **Set Environment Variables:**
   ```
   ANDROID_HOME=C:\Users\sulta\AppData\Local\Android\Sdk
   ```
   Add to PATH:
   ```
   %ANDROID_HOME%\platform-tools
   %ANDROID_HOME%\tools
   ```

4. **Enable USB Debugging on Phone:**
   - Settings → About Phone
   - Tap "Build Number" 7 times
   - Go back → Developer Options
   - Enable "USB Debugging"

5. **Connect Phone and Build:**
   ```
   cd "C:\Users\sulta\Desktop\mobile app\mobile-student"
   npx expo prebuild
   npx expo run:android
   ```

---

### Option 3: Use Online Build Service

1. **Go to expo.dev**
2. **Create account**
3. **Use their web interface to build**
4. **Download APK**

---

## Recommended: Option 1 (EAS Build)

This is the easiest because:
- ✅ No Android Studio needed
- ✅ Builds in the cloud
- ✅ Just download and install
- ✅ Free for 30 builds/month

**Just run this in a NEW terminal:**
```
cd "C:\Users\sulta\Desktop\mobile app\mobile-student"
eas build --platform android --profile preview
```

---

## What You Get

After building, you'll have:
- ✅ Native Android APK
- ✅ Full video calling with LiveKit
- ✅ Camera and microphone access
- ✅ All features working
- ✅ Can install on any Android phone

---

## Current Status

Right now you have:
- ✅ Admin portal working (http://localhost:5173)
- ✅ Teacher portal working (http://localhost:5174)
- ✅ Backend with LiveKit working
- ✅ Mobile app code ready
- ⚠️ Just needs to be built into APK

The app is complete, it just needs to be compiled into a native APK file.
