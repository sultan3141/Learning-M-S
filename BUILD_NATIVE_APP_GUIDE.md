# Build Native App for Android Phone

## Quick Steps to Install on Your Phone

### Step 1: Build APK with EAS (Cloud Build)

Run this command in the mobile-student folder:

```bash
cd mobile-student
npx eas build --platform android --profile preview
```

**What happens:**
- EAS will ask you to login (create free account if needed)
- It builds the APK in the cloud (takes 10-15 minutes)
- You get a download link when done

### Step 2: Download APK to Your Computer

- Click the download link from EAS
- Save the APK file (e.g., `mobile-student.apk`)

### Step 3: Transfer APK to Your Phone

**Option A: USB Cable**
1. Connect your phone to PC with USB cable
2. Enable "File Transfer" mode on your phone
3. Copy the APK file to your phone's Downloads folder

**Option B: Direct Download**
1. Open the EAS download link on your phone's browser
2. Download the APK directly to your phone

### Step 4: Install APK on Your Phone

1. Open the APK file on your phone
2. Android will ask "Install unknown apps?"
3. Allow installation from this source
4. Tap "Install"
5. Wait for installation to complete
6. Tap "Open"

### Step 5: Enable Developer Options (If Needed)

If you want to use USB debugging:

1. Go to Settings → About Phone
2. Tap "Build Number" 7 times
3. Go back to Settings → Developer Options
4. Enable "USB Debugging"

---

## Alternative: Local Build (Requires Android Studio)

If you have Android Studio installed:

```bash
cd mobile-student
npx expo prebuild
npx expo run:android
```

This builds and installs directly to your connected phone.

---

## What You'll Be Able to Test

Once the native app is installed:

✅ Student login
✅ View courses
✅ Create live room (as teacher)
✅ Join live room
✅ **Video calling with LiveKit** (camera, mic, video)
✅ Live chat
✅ All native features

---

## Troubleshooting

### "App not installed" Error
- Make sure you have enough storage space
- Uninstall any previous version first
- Enable "Install unknown apps" for your browser/file manager

### Can't Find APK File
- Check Downloads folder
- Check browser downloads
- Re-download from EAS link

### Build Failed
- Make sure you're logged into EAS
- Check internet connection
- Try again with: `npx eas build --platform android --profile preview --clear-cache`

---

## Commands Summary

```bash
# Build APK (cloud build)
cd mobile-student
npx eas build --platform android --profile preview

# Check build status
npx eas build:list

# Download APK
# Use the link provided after build completes
```

---

## After Installation

1. Open the app on your phone
2. Login as student: `student@test.com` / `student123`
3. Or create live room as teacher: `teacher@test.com` / `password123`
4. Test video calling!

---

## Important Notes

- **First build takes 10-15 minutes** (cloud build)
- **Free tier:** 30 builds per month
- **APK file:** Can be shared with others
- **Updates:** Rebuild and reinstall APK for updates
- **No Google Play:** This is a development build, not for Play Store

---

## Quick Test After Install

1. Open app on phone
2. Go to "Create Live Room"
3. Login as teacher
4. Create a room
5. Get room code
6. Open app on another device (or web)
7. Join with room code
8. Test video calling!
