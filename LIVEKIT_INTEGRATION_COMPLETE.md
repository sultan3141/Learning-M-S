# LiveKit Integration - Complete ✅

## Overview

LiveKit has been successfully integrated into the backend API for real-time video calling functionality. The system creates LiveKit rooms automatically when teachers start live sessions and generates secure access tokens for participants.

## What Was Done

### 1. Backend Integration

#### Files Created/Modified:
- `backend/src/livekit/livekit.service.ts` - Core LiveKit service
- `backend/src/livekit/livekit.module.ts` - LiveKit module
- `backend/src/live-sessions/live-sessions.service.ts` - Updated to use LiveKit
- `backend/src/live-sessions/live-sessions.controller.ts` - Added join endpoint
- `backend/src/app.module.ts` - Imported LiveKit module
- `backend/.env` - Configured LiveKit credentials

#### LiveKit Configuration:
```env
LIVEKIT_URL=wss://mobile-app-33hhe29i.livekit.cloud
LIVEKIT_API_KEY=APIvRdV9JDawKkb
LIVEKIT_API_SECRET=PeJk91BtPItuzVf5o45iWPYPwgArpqqU9vtes9fwLEQD
```

### 2. API Endpoints

#### Create Live Session
```
POST /live-sessions
Authorization: Bearer <teacher_token>
Body: { "courseId": "uuid" }

Response:
{
  "id": "session-uuid",
  "roomCode": "43261X",
  "status": "LIVE",
  "livekitConfigured": true,
  "livekitUrl": "wss://mobile-app-33hhe29i.livekit.cloud",
  ...
}
```

#### Join Live Session (Get Video Token)
```
POST /live-sessions/:id/join
Authorization: Bearer <token>

Response:
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "url": "wss://mobile-app-33hhe29i.livekit.cloud",
  "roomName": "43261X",
  "session": {
    "id": "session-uuid",
    "courseTitle": "Course Name",
    "teacherName": "Teacher Name"
  }
}
```

#### List Active Sessions
```
GET /live-sessions
Authorization: Bearer <token>

Response: [
  {
    "id": "session-uuid",
    "roomCode": "43261X",
    "status": "LIVE",
    "course": { "title": "..." },
    ...
  }
]
```

#### End Session
```
PATCH /live-sessions/:id/end
Authorization: Bearer <teacher_token>
```

### 3. Features Implemented

✅ **Automatic Room Creation**: When a teacher creates a live session, a LiveKit room is automatically created
✅ **Secure Token Generation**: Different permissions for teachers (admin) and students (participants)
✅ **Teacher Permissions**: Teachers can publish, subscribe, control room, and record
✅ **Student Permissions**: Students can publish, subscribe, and send data
✅ **Room Management**: List, get details, and delete rooms
✅ **Participant Management**: List and remove participants
✅ **Graceful Degradation**: System works even if LiveKit is not configured

### 4. Testing

#### Test Scripts Created:
- `backend/test-livekit-simple.js` - Complete integration test
- `backend/setup-test-data.js` - Creates test course for testing

#### Run Tests:
```bash
# Setup test data (creates a test course)
cd backend
node setup-test-data.js

# Test LiveKit integration
node test-livekit-simple.js
```

#### Test Results:
```
✅ All tests passed! LiveKit integration is working.
```

## How to Use

### For Teachers (Create Live Session):

1. **Login as teacher**
   ```bash
   POST /auth/login
   { "email": "teacher@test.com", "password": "password123" }
   ```

2. **Create a live session**
   ```bash
   POST /live-sessions
   { "courseId": "your-course-id" }
   ```

3. **Get join token**
   ```bash
   POST /live-sessions/:sessionId/join
   ```

4. **Use token in mobile app** with LiveKit React Native SDK

### For Students (Join Live Session):

1. **Login as student**
   ```bash
   POST /auth/login
   { "email": "student@test.com", "password": "student123" }
   ```

2. **List active sessions**
   ```bash
   GET /live-sessions
   ```

3. **Get join token**
   ```bash
   POST /live-sessions/:sessionId/join
   ```

4. **Use token in mobile app** with LiveKit React Native SDK

## Mobile App Integration

### Packages Already Installed:
- `@livekit/react-native` - LiveKit React Native SDK
- `@livekit/react-native-webrtc` - WebRTC implementation

### Next Steps for Mobile UI:

1. **Update LiveRoomScreen.tsx** to use LiveKit SDK:
   ```typescript
   import { LiveKitRoom, VideoTrack, AudioTrack } from '@livekit/react-native';
   
   // Use the token and URL from the API
   <LiveKitRoom
     serverUrl={joinData.url}
     token={joinData.token}
     connect={true}
   >
     {/* Video and audio components */}
   </LiveKitRoom>
   ```

2. **Implement video calling UI** with:
   - Camera toggle
   - Microphone toggle
   - Screen sharing (optional)
   - Participant list
   - Leave button

## LiveKit Dashboard

Access your LiveKit dashboard at: https://cloud.livekit.io/

Features:
- Monitor active rooms
- View participants
- Check usage statistics
- Manage recordings (if enabled)
- View logs and analytics

## Free Tier Limits

- 10,000 participant minutes per month
- Unlimited rooms
- Up to 100 participants per room
- 10 minutes empty room timeout

## Troubleshooting

### Issue: "LiveKit not configured"
**Solution**: Check that all three environment variables are set in `backend/.env`:
- LIVEKIT_URL
- LIVEKIT_API_KEY
- LIVEKIT_API_SECRET

### Issue: Token generation fails
**Solution**: Verify your API key and secret are correct in the LiveKit dashboard

### Issue: Cannot join room
**Solution**: 
1. Check that the session status is "LIVE"
2. Verify the token is not expired
3. Ensure the room exists in LiveKit dashboard

## Architecture

```
Teacher Creates Session
        ↓
Backend creates LiveKit room
        ↓
Backend stores session in database
        ↓
Teacher/Student requests join token
        ↓
Backend generates JWT token with permissions
        ↓
Mobile app connects to LiveKit with token
        ↓
Real-time video/audio streaming via LiveKit
```

## Security

- ✅ JWT tokens are signed with API secret
- ✅ Tokens include user identity and metadata
- ✅ Teachers have admin permissions
- ✅ Students have participant permissions
- ✅ Tokens are short-lived (default: 6 hours)
- ✅ Room access is controlled by token validation

## Status

🟢 **FULLY OPERATIONAL**

All backend endpoints are working correctly. Mobile app UI implementation is the next step.

## Quick Test

```bash
cd backend
node test-livekit-simple.js
```

Expected output:
```
✅ All tests passed! LiveKit integration is working.
```
