# Install App on Phone via USB - Step by Step

## What You Need to Do

Since building requires cloud services or Android Studio, here's the simplest way:

### Option 1: Use Expo Go (Easiest - Works Now!)

Your phone is already connected via USB. Let's use Expo Go:

1. **On your phone:**
   - Install "Expo Go" app from Google Play Store
   - Open Expo Go

2. **On your computer:**
   ```bash
   cd mobile-student
   npm start
   ```

3. **Connect:**
   - In the terminal, press `a` to open on Android device
   - Or scan the QR code with Expo Go app

**Note:** Video calling won't work in Expo Go (needs native build)

---

### Option 2: Build APK with EAS (Recommended for Video)

This builds a real APK you can install:

1. **Start the build:**
   ```bash
   cd mobile-student
   eas build --platform android --profile preview
   ```

2. **Login to Expo:**
   - Create free account at expo.dev
   - Follow the prompts

3. **Wait for build:**
   - Takes 10-15 minutes
   - You'll get a download link

4. **Download APK:**
   - Click the link
   - Save APK file

5. **Transfer to phone:**
   - Connect phone via USB
   - Enable "File Transfer" mode
   - Copy APK to Downloads folder

6. **Install:**
   - Open APK on phone
   - Allow "Install unknown apps"
   - Install and open

---

### Option 3: Direct Install via USB (Requires Android Studio)

If you have Android Studio:

1. **Enable USB Debugging on phone:**
   - Settings → About Phone
   - Tap "Build Number" 7 times
   - Go back → Developer Options
   - Enable "USB Debugging"

2. **Connect phone:**
   - Connect via USB
   - Allow USB debugging on phone

3. **Build and install:**
   ```bash
   cd mobile-student
   npx expo run:android
   ```

This builds and installs directly to your phone.

---

## What Works in Each Option

### Expo Go (Option 1)
- ✅ Login
- ✅ View courses
- ✅ Navigation
- ❌ Video calling (needs native)

### Native APK (Option 2 & 3)
- ✅ Login
- ✅ View courses
- ✅ Navigation
- ✅ Video calling with LiveKit
- ✅ Camera access
- ✅ Microphone access
- ✅ All features

---

## Recommended: Use Option 2 (EAS Build)

This is the easiest way to get a working APK with video calling:

```bash
cd mobile-student
eas build --platform android --profile preview
```

Then download and install the APK on your phone.

---

## Quick Commands

```bash
# Option 1: Expo Go
cd mobile-student
npm start
# Press 'a' for Android

# Option 2: EAS Build
cd mobile-student
eas build --platform android --profile preview

# Option 3: Direct install (needs Android Studio)
cd mobile-student
npx expo run:android
```

---

## After Installation

Test the app:
1. Login as student: `student@test.com` / `student123`
2. Or create room as teacher: `teacher@test.com` / `password123`
3. Test video calling!
