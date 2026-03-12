# Complete Testing Guide - All Features

## What's Working and How to Test

### ✅ 1. Admin Portal - Teacher Management with Reset Password

**URL:** http://localhost:5173

**Test Steps:**
1. Open http://localhost:5173
2. Login with:
   - Email: `admin@school.com`
   - Password: `Admin@123`
3. Click "Teachers" in the sidebar
4. You'll see all teachers with these buttons:
   - **Reset Password** (purple button with key icon)
   - **Approve/Suspend** (green/yellow button)
   - **Delete** (red button)
   - **View Students** (blue link)

**Test Reset Password:**
1. Click the "Reset Password" button for any teacher
2. Confirm the action
3. You'll see an alert with the new password
4. Copy the password and share it with the teacher

**Test Register Teacher:**
1. Click "Register Teacher" button (top right)
2. Fill in:
   - Full Name: `New Teacher`
   - Email: `newteacher@test.com`
   - Password: `password123`
3. Click "Register Teacher"
4. The new teacher appears in the list

---

### ✅ 2. Teacher Portal

**URL:** http://localhost:5174

**Test Steps:**
1. Open http://localhost:5174
2. Login with:
   - Email: `teacher@test.com`
   - Password: `password123`
3. You can:
   - View students
   - Manage videos
   - View recordings

---

### ✅ 3. Backend API - All Endpoints Working

**Base URL:** http://localhost:4000

**Test with Postman or curl:**

#### Login as Teacher
```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teacher@test.com","password":"password123"}'
```

#### Create Live Room (Teacher)
```bash
curl -X POST http://localhost:4000/live-sessions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"courseId":"YOUR_COURSE_ID"}'
```

#### Join Live Room (Student)
```bash
curl -X POST http://localhost:4000/live-sessions/ROOM_CODE/join \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### ✅ 4. Mobile App - Teacher Login for Room Creation

**How to Test:**
1. Open your mobile app (Expo Go)
2. Navigate to "Create Live Room"
3. Login as teacher:
   - Email: `teacher@test.com`
   - Password: `password123`
4. Select a course
5. Create room
6. You'll get a room code

**Note:** Video calling requires native build (not Expo Go)

---

### ✅ 5. Database - All Data Accessible

**Test with Prisma Studio:**
```bash
cd backend
npx prisma studio
```

This opens a web interface at http://localhost:5555 where you can:
- View all users
- View all courses
- View all live sessions
- Edit data directly

---

## What's NOT Working (Requires Native Build)

### ❌ Live Video Calling in Mobile App

**Why:** LiveKit requires native modules that don't work in Expo Go or web browser.

**To Make It Work:**
You need to build a native app:

#### Option 1: Build for Android (Requires Android Studio)
```bash
cd mobile-student
npx expo run:android
```

#### Option 2: Build for iOS (Requires Xcode + Mac)
```bash
cd mobile-student
npx expo run:ios
```

#### Option 3: Use EAS Build (Cloud Build)
```bash
cd mobile-student
npx eas build --platform android --profile development
```

---

## Complete Feature Checklist

### Admin Features ✅
- [x] Login as admin
- [x] View all teachers
- [x] Register new teacher
- [x] Reset teacher password
- [x] Approve teacher
- [x] Suspend teacher
- [x] Delete teacher
- [x] View teacher's students
- [x] View all students
- [x] View all courses
- [x] View all recordings

### Teacher Features ✅
- [x] Login as teacher
- [x] View students
- [x] Manage videos
- [x] View recordings
- [x] Create live room (via mobile app)

### Student Features ⚠️
- [x] Login as student
- [x] View enrolled courses
- [x] View course content
- [x] Join live room (API works)
- [ ] Video calling (needs native build)

### Backend Features ✅
- [x] Authentication (JWT)
- [x] User management
- [x] Course management
- [x] Live session creation
- [x] LiveKit integration
- [x] Token generation for video calls
- [x] Database (SQLite with Prisma)

---

## Quick Test Scenarios

### Scenario 1: Admin Resets Teacher Password
1. Go to http://localhost:5173
2. Login as admin
3. Go to Teachers page
4. Click "Reset Password" for teacher@test.com
5. Copy the new password
6. Logout
7. Try logging in as teacher with the new password

### Scenario 2: Teacher Creates Live Room
1. Open mobile app
2. Go to "Create Live Room"
3. Login as teacher@test.com
4. Select a course
5. Create room
6. Note the room code

### Scenario 3: Admin Registers New Teacher
1. Go to http://localhost:5173
2. Login as admin
3. Click "Register Teacher"
4. Fill in details
5. Submit
6. Logout
7. Login with the new teacher credentials

---

## All Credentials

### Admin
- Email: `admin@school.com`
- Password: `Admin@123`
- Portal: http://localhost:5173

### Teacher
- Email: `teacher@test.com`
- Password: `password123`
- Portal: http://localhost:5174

### Student
- Email: `student@test.com`
- Password: `student123`
- Mobile App only

---

## Troubleshooting

### Admin Portal Shows White Screen
- Hard refresh: Ctrl + Shift + R
- Clear browser cache
- Check browser console for errors

### Mobile App Network Errors
- Check IP address in `mobile-student/src/config/api.ts`
- Make sure backend is running
- Make sure phone and computer are on same WiFi

### LiveKit Video Not Working
- This is expected in Expo Go
- Need to build native app
- Or use web-based video solution

---

## Summary

**Fully Working:**
- ✅ Admin portal with all features
- ✅ Teacher portal
- ✅ Backend API with LiveKit
- ✅ Database management
- ✅ Teacher login in mobile app
- ✅ Room creation API

**Needs Native Build:**
- ⚠️ Live video calling in mobile app

**Recommended Next Steps:**
1. Test all admin features (Reset Password, Register Teacher, etc.)
2. Test teacher portal
3. Test backend APIs with Postman
4. If you need video calling, build native app with `npx expo run:android`
