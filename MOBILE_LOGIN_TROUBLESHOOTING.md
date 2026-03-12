# 📱 Mobile App Login - Troubleshooting Guide

## ✅ Issue Fixed!

The mobile app login has been updated to work correctly with the backend API.

---

## 🔄 IMPORTANT: Reload the App

The code has been updated. You MUST reload the app for changes to take effect:

### Method 1: Terminal Command (Recommended)
In the mobile app terminal, press **`r`**

### Method 2: Device Shake
Shake your device and tap "Reload"

### Method 3: Restart
1. Press `Ctrl+C` in terminal
2. Run `npm start` again
3. Scan QR code

---

## 🔐 Login Credentials

```
Email:    student@test.com
Password: Student123
```

**Important:** 
- Email is case-sensitive
- Password is case-sensitive
- Make sure there are no extra spaces

---

## 🧪 Test the Connection First

Before trying to login, test if the app can reach the backend:

### Check 1: Backend is Running
The backend terminal should show:
```
Backend running on http://localhost:4000
```

### Check 2: Network Connection
Open your phone's browser and go to:
```
http://10.232.100.55:4000
```

You should see SOMETHING (even an error page means it's reachable).

### Check 3: API Endpoint
Try this in your phone's browser:
```
http://10.232.100.55:4000/auth/login
```

Should show: `{"statusCode":400,"message":"Bad Request"}`

If all these work, the login should work!

---

## 🔧 What Was Fixed

### Problem 1: API URL
- **Before:** `http://localhost:4000` (doesn't work on devices)
- **After:** `http://10.232.100.55:4000` (uses computer IP)

### Problem 2: Response Format
- **Before:** Expected `{ accessToken, user }` from backend
- **After:** Decodes token to extract user info
- **Now:** Works with backend's actual response format

### Problem 3: Role Validation
- **Added:** Check that user is STUDENT role
- **Prevents:** Admin/Teacher from logging into student app

---

## 📱 Step-by-Step Login

1. **Make sure app is reloaded** (press `r` in terminal)

2. **Open the app** on your device

3. **Enter credentials:**
   - Email: `student@test.com`
   - Password: `Student123`

4. **Tap "Sign In"**

5. **Should navigate to home screen** ✅

---

## ❌ Common Errors & Solutions

### Error: "Login failed. Please check your credentials."

**Possible Causes:**
1. App not reloaded with new code
2. Wrong credentials
3. Network issue

**Solutions:**
1. Press `r` in terminal to reload
2. Double-check credentials (case-sensitive!)
3. Test network connection (see above)

---

### Error: "Network request failed"

**Cause:** App can't reach backend

**Solutions:**

1. **Check same WiFi:**
   - Phone and computer must be on same network
   - Corporate/school WiFi may block connections

2. **Check firewall:**
   ```powershell
   # Run as Administrator
   New-NetFirewallRule -DisplayName "Node Backend" -Direction Inbound -Program "C:\Program Files\nodejs\node.exe" -Action Allow
   ```

3. **Verify IP address:**
   - Check Expo terminal for current IP
   - Update `mobile-student/src/config/api.ts` if changed

4. **Try tunnel mode:**
   ```bash
   cd mobile-student
   npx expo start --tunnel
   ```

---

### Error: "Access denied. This app is for students only."

**Cause:** Trying to login with admin or teacher account

**Solution:** Use student credentials:
- Email: `student@test.com`
- Password: `Student123`

---

### Error: "Invalid credentials"

**Possible Issues:**

1. **Typo in email/password**
   - Check for extra spaces
   - Verify case (Student123, not student123)

2. **Student not created**
   ```bash
   cd backend
   node create-test-student.js
   ```

3. **Backend not running**
   - Check backend terminal
   - Should show "Backend running on http://localhost:4000"

---

## 🔍 Debug Mode

To see what's happening:

1. **Check mobile app terminal** for console.log output
2. **Check backend terminal** for API requests
3. **Look for error messages** in both terminals

The mobile app now logs:
- API Base URL on startup
- Login errors with details

---

## 🧪 Test Backend Directly

Test if backend login works:

```powershell
Invoke-RestMethod -Uri "http://localhost:4000/auth/login" -Method Post -ContentType "application/json" -Body '{"email":"student@test.com","password":"Student123"}'
```

Should return:
```
accessToken
-----------
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

If this works but mobile app doesn't, it's a network/connection issue.

---

## 📊 Checklist

Before reporting issues, verify:

- [ ] Backend is running (http://localhost:4000)
- [ ] Mobile app is running (Expo terminal shows QR code)
- [ ] App has been reloaded (pressed `r` in terminal)
- [ ] Using correct credentials (student@test.com / Student123)
- [ ] Phone and computer on same WiFi
- [ ] Can access http://10.232.100.55:4000 from phone browser
- [ ] No typos in email/password
- [ ] No extra spaces in credentials

---

## ✅ Success Indicators

When login works correctly:

1. **No error message** appears
2. **App navigates** to home screen
3. **You see** the main tabs at bottom
4. **Backend terminal** shows: `POST /auth/login 201`

---

## 🆘 Still Not Working?

### Option 1: Create New Student

Maybe the test student has an issue. Create a new one:

1. Go to admin portal: http://localhost:5173
2. Login as admin (admin@school.com / Admin@123)
3. Go to "Students" section
4. Click "Register New Student"
5. Fill in details
6. Copy the generated credentials
7. Use those in mobile app

### Option 2: Use Expo Tunnel

Bypass network issues:

```bash
cd mobile-student
npx expo start --tunnel
```

This creates a public URL that works anywhere.

### Option 3: Check Logs

Look at both terminals for error messages:
- Mobile app terminal: Shows app errors
- Backend terminal: Shows API errors

---

## 📞 Quick Reference

**Reload App:** Press `r` in terminal  
**Student Email:** student@test.com  
**Student Password:** Student123  
**Backend URL:** http://10.232.100.55:4000  
**Test URL:** http://10.232.100.55:4000/auth/login

---

## 🎯 Next Steps After Login

Once logged in successfully:

1. Explore the home screen
2. Browse available courses
3. Check your profile
4. Try enrolling in a course
5. Watch video lessons

---

Remember: **Press `r` in the terminal to reload the app!** This is the most important step! 🚀
