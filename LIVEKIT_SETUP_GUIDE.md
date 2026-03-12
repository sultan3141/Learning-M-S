# 🎥 LiveKit Integration Guide

## Overview

LiveKit has been integrated into your learning management system for real-time video calling and live sessions!

---

## 🚀 Quick Setup

### Step 1: Get LiveKit Credentials

You have two options:

#### Option A: Use LiveKit Cloud (Recommended - Free Tier Available)

1. Go to https://cloud.livekit.io
2. Sign up for a free account
3. Create a new project
4. Copy your credentials:
   - API Key
   - API Secret
   - WebSocket URL (wss://your-project.livekit.cloud)

#### Option B: Self-Host LiveKit Server

Follow the guide at: https://docs.livekit.io/deploy/

---

### Step 2: Configure Backend

Update `backend/.env` with your LiveKit credentials:

```env
# LiveKit Configuration
LIVEKIT_API_KEY=your-api-key-here
LIVEKIT_API_SECRET=your-api-secret-here
LIVEKIT_URL=wss://your-project.livekit.cloud
```

---

### Step 3: Restart Backend

```bash
# Stop current backend (Ctrl+C)
cd backend
npm run dev
```

---

## 📱 How It Works

### For Teachers:

1. **Create a Live Session**
   - POST `/live-sessions`
   - Provide `courseId` and optional `subjectId`
   - System creates a LiveKit room automatically
   - Returns room code and session details

2. **Get Join Token**
   - POST `/live-sessions/:id/join`
   - Returns LiveKit token with teacher permissions
   - Can publish video/audio, control room, record

3. **End Session**
   - PATCH `/live-sessions/:id/end`
   - Closes the LiveKit room

### For Students:

1. **Browse Live Sessions**
   - GET `/live-sessions`
   - See all active live sessions

2. **Join Session**
   - POST `/live-sessions/:id/join`
   - Returns LiveKit token with student permissions
   - Can publish and subscribe to video/audio

---

## 🔧 API Endpoints

### Create Live Session (Teacher Only)
```http
POST /live-sessions
Authorization: Bearer {teacher-token}
Content-Type: application/json

{
  "courseId": "course-id",
  "subjectId": "subject-id" // optional
}
```

**Response:**
```json
{
  "id": "session-id",
  "roomCode": "ABC123",
  "status": "LIVE",
  "livekitUrl": "wss://your-project.livekit.cloud",
  "livekitConfigured": true,
  "courseId": "course-id",
  "teacherId": "teacher-id",
  "startedAt": "2026-03-05T..."
}
```

### Get Join Token
```http
POST /live-sessions/:id/join
Authorization: Bearer {token}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "url": "wss://your-project.livekit.cloud",
  "roomName": "ABC123",
  "session": {
    "id": "session-id",
    "courseTitle": "Mathematics 101",
    "teacherName": "John Doe"
  }
}
```

### List Live Sessions
```http
GET /live-sessions
Authorization: Bearer {token}
```

### End Session (Teacher Only)
```http
PATCH /live-sessions/:id/end
Authorization: Bearer {teacher-token}
```

---

## 📦 What's Included

### Backend:

1. **LiveKit Service** (`backend/src/livekit/livekit.service.ts`)
   - Create/delete rooms
   - Generate access tokens
   - List participants
   - Room management

2. **Updated Live Sessions Service**
   - Automatically creates LiveKit rooms
   - Generates tokens for participants
   - Manages room lifecycle

3. **New Endpoints**
   - `/live-sessions/:id/join` - Get token to join session

### Mobile App:

- LiveKit React Native SDK installed
- Ready for video calling implementation

---

## 🎯 Features

### Teacher Permissions:
- ✅ Create and delete rooms
- ✅ Publish video/audio
- ✅ Subscribe to all participants
- ✅ Room admin controls
- ✅ Recording capabilities
- ✅ Remove participants

### Student Permissions:
- ✅ Join rooms
- ✅ Publish video/audio
- ✅ Subscribe to other participants
- ✅ Send/receive data messages

---

## 🔒 Security

- **JWT-based authentication** - All endpoints require valid JWT
- **Role-based access** - Teachers have admin permissions
- **Unique room codes** - 6-character codes for easy joining
- **Token expiration** - LiveKit tokens expire automatically
- **Room cleanup** - Rooms auto-close after 10 minutes of inactivity

---

## 💡 Usage Examples

### Example 1: Teacher Creates Live Session

```typescript
// Teacher creates a session
const response = await axios.post(
  'http://localhost:4000/live-sessions',
  {
    courseId: 'course-123',
    subjectId: 'subject-456'
  },
  {
    headers: { Authorization: `Bearer ${teacherToken}` }
  }
);

console.log('Room Code:', response.data.roomCode); // ABC123
console.log('LiveKit URL:', response.data.livekitUrl);
```

### Example 2: Student Joins Session

```typescript
// Student gets join token
const response = await axios.post(
  `http://localhost:4000/live-sessions/${sessionId}/join`,
  {},
  {
    headers: { Authorization: `Bearer ${studentToken}` }
  }
);

const { token, url, roomName } = response.data;

// Use token to connect to LiveKit room
// (Implementation in mobile app)
```

---

## 📱 Mobile App Integration

The LiveKit React Native SDK is installed. To implement video calling:

1. **Import LiveKit components:**
```typescript
import { LiveKitRoom, VideoTrack, AudioTrack } from '@livekit/react-native';
```

2. **Connect to room:**
```typescript
<LiveKitRoom
  serverUrl={livekitUrl}
  token={joinToken}
  connect={true}
  options={{
    adaptiveStream: true,
    dynacast: true,
  }}
>
  {/* Your video UI components */}
</LiveKitRoom>
```

3. **Display video tracks:**
```typescript
<VideoTrack
  trackRef={participantTrack}
  style={{ width: '100%', height: 300 }}
/>
```

Full documentation: https://docs.livekit.io/client-sdk-js/react-native/

---

## 🧪 Testing

### Test Without LiveKit:

The system works even without LiveKit configured:
- Sessions are created in database
- Room codes are generated
- `livekitConfigured: false` in response
- Video calling won't work, but session management does

### Test With LiveKit:

1. Configure credentials in `.env`
2. Restart backend
3. Create a session
4. Check response has `livekitConfigured: true`
5. Use join token to connect

---

## 🔍 Troubleshooting

### "LiveKit not configured" error

**Solution:** Add credentials to `backend/.env` and restart backend

### "Failed to create LiveKit room" error

**Possible causes:**
- Invalid API credentials
- Network connectivity issues
- LiveKit server down

**Solution:** Check credentials, test network, verify LiveKit status

### Token generation fails

**Solution:** Ensure API key and secret are correct in `.env`

---

## 📊 LiveKit Features

### Included:
- ✅ Video calling
- ✅ Audio calling
- ✅ Screen sharing
- ✅ Chat/data messages
- ✅ Recording
- ✅ Participant management
- ✅ Adaptive bitrate
- ✅ Simulcast
- ✅ End-to-end encryption

### Free Tier Limits (LiveKit Cloud):
- 10,000 participant minutes/month
- Unlimited rooms
- Unlimited participants per room
- All features included

---

## 🚀 Next Steps

1. **Get LiveKit credentials** from cloud.livekit.io
2. **Update `.env`** with your credentials
3. **Restart backend**
4. **Test creating a session** via API
5. **Implement mobile UI** for video calling
6. **Add recording features** (optional)
7. **Customize permissions** as needed

---

## 📚 Resources

- **LiveKit Docs:** https://docs.livekit.io
- **React Native SDK:** https://docs.livekit.io/client-sdk-js/react-native/
- **Cloud Dashboard:** https://cloud.livekit.io
- **GitHub:** https://github.com/livekit
- **Discord Community:** https://livekit.io/discord

---

## ✅ Summary

- ✅ LiveKit SDK installed (backend & mobile)
- ✅ Service layer created
- ✅ API endpoints added
- ✅ Room management implemented
- ✅ Token generation working
- ✅ Ready for video calling!

**Just add your LiveKit credentials and restart the backend!** 🎉
