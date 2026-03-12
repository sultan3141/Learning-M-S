# Student App - Web Version Running

## Status: ✅ Running on Web

The student mobile app is now running in the browser at:
**http://localhost:8081** (or check the Expo output for the exact URL)

## Why Web Instead of Mobile?

LiveKit video calling requires native modules that don't work in Expo Go. Running on web allows us to test the full video calling functionality without needing to build a native app.

## Current Running Services

1. **Backend**: http://localhost:4000
2. **Admin Portal**: http://localhost:5173
3. **Teacher Portal**: http://localhost:5174
4. **Student App (Web)**: http://localhost:8081 (check Expo output)

## How to Access Student App

1. Open your browser
2. Go to the URL shown in the Expo terminal (usually http://localhost:8081)
3. Login with student credentials:
   - Email: `student@test.com`
   - Password: `student123`

## Features Available on Web

✅ Student login
✅ View enrolled courses
✅ Browse course content
✅ Join live rooms
✅ Video calling with LiveKit (works on web!)
✅ Live chat
✅ Teacher can create rooms

## Testing Live Video Calls

### Step 1: Teacher Creates Room
1. In the student app web, go to "Create Live Room"
2. Login as teacher: `teacher@test.com` / `password123`
3. Select a course
4. Create room - you'll get a room code

### Step 2: Student Joins Room
1. Open another browser tab/window
2. Go to student app: http://localhost:8081
3. Login as student: `student@test.com` / `student123`
4. Go to "Join Live Room"
5. Enter the room code from step 1
6. Click Join

### Step 3: Video Call
- Both teacher and student will see each other's video
- Can toggle mic/camera
- Can send chat messages
- Can leave the room

## Credentials

### Student
- Email: `student@test.com`
- Password: `student123`

### Teacher (for creating rooms)
- Email: `teacher@test.com`
- Password: `password123`

### Admin
- Email: `admin@school.com`
- Password: `Admin@123`

## Troubleshooting

### Can't Access Student App
- Check the Expo terminal for the exact URL
- Make sure port 8081 is not blocked by firewall
- Try http://localhost:8081 or http://127.0.0.1:8081

### Video Not Working
- Allow camera/microphone permissions in browser
- Use Chrome or Firefox (best WebRTC support)
- Check that LiveKit server is configured in backend/.env

### Network Errors
- Make sure backend is running on port 4000
- Check that API_BASE_URL in mobile-student/src/config/api.ts is correct
- For web, it should use `http://localhost:4000`

## Next Steps

1. Open student app in browser
2. Test login
3. Create a live room as teacher
4. Join the room as student
5. Test video calling

## Alternative: Run on Physical Device

If you want to run on a physical device with cable:

1. Stop the web version
2. Connect your phone via USB
3. Enable USB debugging (Android) or trust computer (iOS)
4. Run: `npx expo run:android` or `npx expo run:ios`
5. This will build and install the native app

Note: This requires Android Studio (Android) or Xcode (iOS) to be installed.
