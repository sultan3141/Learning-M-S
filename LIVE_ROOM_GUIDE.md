# Live Room Creation Guide

## How to Create a Live Room in Mobile App

### Step 1: Navigate to Create Room
In the mobile app, go to the "Live" tab and tap "Create Room"

### Step 2: Login as Teacher
You'll see a login form. Use these credentials:

```
Email: teacher@test.com
Password: password123
```

**Important**: Only teachers can create live rooms. Students can only join existing rooms.

### Step 3: Select a Course
After logging in, you'll see a list of your courses. Select the course you want to create a live session for.

**Note**: If you don't see any courses, you need to create one first:
1. Login to the teacher portal at http://localhost:5174
2. Create a course
3. Then return to the mobile app

### Step 4: Create the Room
Tap "Create Live Room" and you'll get a room code (e.g., "43261X")

### Step 5: Share the Room Code
Share this code with your students so they can join the session.

## How Students Join a Live Room

### Option 1: Using Room Code
1. Go to "Live" tab in mobile app
2. Tap "Join Room"
3. Enter the room code provided by the teacher
4. Tap "Join Room"

### Option 2: From Active Sessions List
1. Go to "Live" tab
2. See list of active sessions
3. Tap on a session to join

## Teacher Credentials

```
Email: teacher@test.com
Password: password123
```

These credentials work for:
- Mobile app (Create Room feature)
- Teacher web portal (http://localhost:5174)
- Backend API

## Student Credentials

```
Email: student@test.com
Password: student123
```

These credentials work for:
- Mobile app (Join Room feature)
- Backend API

## Troubleshooting

### "Invalid Credentials" Error

**Cause**: Wrong email or password

**Solution**: 
- Make sure you're using `teacher@test.com` and `password123`
- Check for typos (password is all lowercase)
- Ensure backend is running on port 4000

### "Access Denied" Error

**Cause**: Trying to create room with student account

**Solution**: 
- Only teachers can create rooms
- Use teacher credentials: teacher@test.com / password123
- Students should use "Join Room" instead

### "No Courses Found" Error

**Cause**: Teacher doesn't have any courses yet

**Solution**:
1. Login to teacher portal: http://localhost:5174
2. Create a course
3. Return to mobile app and try again

Or use the backend script:
```bash
cd backend
node setup-test-data.js
```

### Backend Not Responding

**Cause**: Backend not running or wrong IP address

**Solution**:
1. Check backend is running: `cd backend && npm run dev`
2. Verify IP in `mobile-student/src/config/api.ts`
3. Ensure devices are on same network

## API Endpoints Used

### Create Live Session
```
POST /live-sessions
Authorization: Bearer <teacher_token>
Body: { "courseId": "uuid" }
```

### Join Live Session
```
POST /live-sessions/:id/join
Authorization: Bearer <token>
```

### List Active Sessions
```
GET /live-sessions
Authorization: Bearer <token>
```

## Testing the Feature

### Quick Test:
```bash
cd backend
node test-livekit-simple.js
```

This will:
1. Login as teacher
2. Create a live session
3. Get join token
4. Verify LiveKit integration

### Manual Test:
1. Open mobile app
2. Go to Live → Create Room
3. Login with teacher@test.com / password123
4. Select a course
5. Create room
6. Note the room code
7. Open another device/emulator
8. Login as student
9. Join room with the code

## Current Status

✅ Backend API - Fully functional
✅ LiveKit Integration - Working
✅ Teacher Login - Fixed and working
✅ Room Creation - Working
✅ Token Generation - Working
⚠️ Video UI - Not implemented yet (SDK installed)

## Next Steps (Optional)

To implement the actual video calling UI:

1. Update `mobile-student/src/features/live/LiveRoomScreen.tsx`
2. Use LiveKit React Native SDK
3. Add video/audio controls
4. Implement participant list

The backend is ready - you just need to build the UI!

## Summary

The live room creation feature is now working correctly. Teachers can:
- Login in the mobile app
- Create live sessions
- Get room codes
- Share with students

Students can:
- Join rooms with codes
- See active sessions
- Get join tokens

All backend functionality is complete and tested! ✅
