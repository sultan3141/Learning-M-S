# 📱 Mobile Student App Guide

## ✅ App Status

**Status:** ✅ Running  
**Metro Bundler:** Active  
**Connection URL:** exp://10.232.100.55:8081

---

## 🚀 How to Access the Mobile App

### Option 1: Using Expo Go (Recommended for Testing)

#### For Android:
1. **Install Expo Go** from Google Play Store
2. **Open Expo Go** app
3. **Scan the QR code** shown in the terminal
4. The app will load on your phone

#### For iOS:
1. **Install Expo Go** from App Store
2. **Open Camera app** (built-in)
3. **Scan the QR code** shown in the terminal
4. Tap the notification to open in Expo Go

### Option 2: Using Android Emulator
1. Make sure Android Studio is installed
2. Start an Android emulator
3. In the terminal, press **`a`** to open on Android

### Option 3: Using Web Browser (Limited Features)
1. In the terminal, press **`w`** to open in web browser
2. Note: Some native features may not work in web mode

---

## 🎮 Terminal Commands

While the app is running, you can use these commands:

| Key | Action |
|-----|--------|
| `a` | Open on Android emulator |
| `w` | Open in web browser |
| `r` | Reload the app |
| `m` | Toggle developer menu |
| `j` | Open debugger |
| `s` | Switch to development build |
| `?` | Show all commands |
| `Ctrl+C` | Stop the app |

---

## 🔐 Student Login

### Test Student Credentials

You need to create a student account first. Here's how:

#### Method 1: Using Teacher Portal
1. Start teacher portal (if not running):
   ```bash
   cd teacher-web
   npm run dev
   ```
2. Login as a teacher
3. Go to "Students" section
4. Click "Register New Student"
5. Fill in student details
6. Copy the generated username and password

#### Method 2: Using Admin Portal
1. Go to admin portal (http://localhost:5173)
2. Login as admin
3. Navigate to Students section
4. View existing students or create new ones

### Login to Mobile App
Once you have student credentials:
1. Open the app on your device
2. Enter the username (email)
3. Enter the password
4. Tap "Sign In"

---

## 📱 Mobile App Features

### For Students:

1. **Home Dashboard**
   - View enrolled courses
   - See progress
   - Quick access to lessons

2. **Discover Courses**
   - Browse available courses
   - Search by category
   - Enroll in new courses

3. **Video Lessons**
   - Watch course videos
   - Track progress
   - Resume where you left off

4. **Live Sessions**
   - Join live classes
   - Request to join sessions
   - Interactive learning

5. **Profile**
   - View personal information
   - Change password
   - Update settings
   - Logout

---

## 🔧 Troubleshooting

### QR Code Not Scanning
- Make sure your phone and computer are on the same WiFi network
- Try typing the URL manually in Expo Go: `exp://10.232.100.55:8081`
- Check if your firewall is blocking the connection

### "Network Error" or "Cannot Connect"
1. Check that backend is running (http://localhost:4000)
2. Update the API URL in the mobile app if needed
3. Make sure your phone can reach your computer's IP

### App Crashes or Won't Load
1. Press `r` in terminal to reload
2. Clear Expo cache: `expo start -c`
3. Reinstall dependencies: `npm install`

### Package Version Warnings
The terminal shows some package version mismatches. To fix:
```bash
cd mobile-student
npx expo install --fix
```

---

## 📊 Current Running Applications

| Application | Status | URL/Access |
|-------------|--------|------------|
| Backend | ✅ Running | http://localhost:4000 |
| Admin Portal | ✅ Running | http://localhost:5173 |
| Mobile App | ✅ Running | Scan QR code |

---

## 🛑 Stop the Mobile App

To stop the mobile app:
1. Press `Ctrl+C` in the terminal
2. Or close the terminal window

---

## 🔄 Restart the Mobile App

If you need to restart:
```bash
cd mobile-student
npm start
```

To clear cache and restart:
```bash
cd mobile-student
npx expo start -c
```

---

## 📝 API Configuration

The mobile app connects to the backend at:
- **Development:** http://localhost:4000
- **Your Network:** http://10.232.100.55:4000

If you need to change the API URL, edit:
```
mobile-student/src/lib/axios.ts
```

---

## 🎯 Next Steps

1. **Create a student account** using teacher or admin portal
2. **Scan the QR code** with Expo Go
3. **Login** with student credentials
4. **Explore** the app features
5. **Enroll** in courses
6. **Watch** video lessons

---

## 📞 Need Help?

- Check terminal output for errors
- Press `?` in terminal for all commands
- Review `mobile-student/README.md` for more details
- Check Expo documentation: https://docs.expo.dev
