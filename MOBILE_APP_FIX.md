# 📱 Mobile App Login Fix

## ✅ Issue Fixed!

The mobile app was trying to connect to `localhost:4000`, which doesn't work on physical devices. I've updated it to use your computer's IP address.

---

## 🔐 Test Student Credentials

A test student account has been created for you:

```
Email:    student@test.com
Password: Student123
```

---

## 🔄 How to Apply the Fix

### Option 1: Reload the App (Recommended)

1. **In the mobile app terminal**, press **`r`** to reload
2. Or shake your device and tap "Reload"
3. The app will now connect to: `http://10.232.100.55:4000`

### Option 2: Restart the App

1. Press `Ctrl+C` in the mobile app terminal
2. Run: `npm start` again
3. Scan the QR code again

---

## 📱 Login Steps

1. **Open the app** on your device (scan QR code if needed)
2. **Enter credentials:**
   - Email: `student@test.com`
   - Password: `Student123`
3. **Tap "Sign In"**
4. You should now be logged in! 🎉

---

## 🔧 What Was Changed

### Files Updated:

1. **Created:** `mobile-student/src/config/api.ts`
   - Centralized API configuration
   - Uses computer IP for physical devices
   - Uses localhost for web

2. **Updated:** All API calls to use the new config:
   - `LoginScreen.tsx`
   - `ChangePasswordScreen.tsx`
   - `DiscoverScreen.tsx`
   - `CreateRoomScreen.tsx`
   - `useCourseStore.ts`

### API Configuration:

```typescript
// Old (doesn't work on devices)
const API_BASE_URL = 'http://localhost:4000';

// New (works on devices)
const API_BASE_URL = 'http://10.232.100.55:4000';
```

---

## 🌐 Network Requirements

For the mobile app to work:

1. **Same WiFi Network**
   - Your phone and computer must be on the same WiFi
   - Corporate/school networks may block this

2. **Firewall Settings**
   - Windows Firewall may need to allow Node.js
   - Check if port 4000 is accessible

3. **IP Address**
   - Current IP: `10.232.100.55`
   - If this changes, update `mobile-student/src/config/api.ts`

---

## 🧪 Testing the Connection

### Test 1: Check Backend
Open in your phone's browser:
```
http://10.232.100.55:4000
```
You should see a response (even if it's an error page, it means it's reachable)

### Test 2: Check API Endpoint
Try this in your phone's browser:
```
http://10.232.100.55:4000/auth/login
```
Should show: `{"statusCode":400,"message":"Bad Request"}`

If these work, the mobile app should work too!

---

## ❌ Still Not Working?

### Error: "Network request failed"

**Solution 1: Check Firewall**
```powershell
# Run as Administrator
New-NetFirewallRule -DisplayName "Node.js Backend" -Direction Inbound -Program "C:\Program Files\nodejs\node.exe" -Action Allow
```

**Solution 2: Use Different IP**
1. Find your computer's IP:
   ```cmd
   ipconfig
   ```
2. Look for "IPv4 Address" under your WiFi adapter
3. Update `mobile-student/src/config/api.ts` with the new IP

**Solution 3: Use Expo Tunnel**
```bash
cd mobile-student
npx expo start --tunnel
```
This creates a public URL that works anywhere.

### Error: "Invalid credentials"

Make sure you're using:
- Email: `student@test.com`
- Password: `Student123`

Case-sensitive!

### Error: "Cannot connect to server"

1. Check backend is running (http://localhost:4000)
2. Check your phone is on the same WiFi
3. Try restarting the backend:
   - Stop: `Ctrl+C` in backend terminal
   - Start: `npm run dev`

---

## 📊 All Credentials

| Portal | Email | Password | Role |
|--------|-------|----------|------|
| Admin | admin@school.com | Admin@123 | ADMIN |
| Mobile | student@test.com | Student123 | STUDENT |

---

## 🎯 Next Steps

1. **Reload the mobile app** (press `r` in terminal)
2. **Login** with student credentials
3. **Explore** the app features:
   - Browse courses
   - Watch videos
   - Join live sessions
   - Update profile

---

## 📝 Creating More Students

To create more test students:

```bash
cd backend
node create-test-student.js
```

Or use the admin/teacher portal to create students with custom details.

---

## 🔄 If IP Address Changes

If your computer's IP changes (e.g., after reconnecting to WiFi):

1. Check new IP in Expo terminal (the QR code URL)
2. Update `mobile-student/src/config/api.ts`:
   ```typescript
   const COMPUTER_IP = 'YOUR_NEW_IP_HERE';
   ```
3. Reload the app

---

## ✅ Summary

- ✅ API configuration fixed
- ✅ Test student created
- ✅ App now uses computer IP instead of localhost
- ✅ Ready to login and test!

Just reload the app and login with the test credentials! 🚀
