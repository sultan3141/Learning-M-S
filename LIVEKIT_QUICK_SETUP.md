# 🎥 LiveKit Quick Setup - 3 Steps

## ✅ Step 1: Get Your Credentials from Dashboard

You're already in the LiveKit dashboard! Now:

1. **Click on "Project API keys"** (in the "Get started" section)
2. You'll see:
   - **API Key** - Starts with `API...`
   - **API Secret** - Long string of characters
   - **WebSocket URL** - Starts with `wss://`

3. **Copy these three values**

---

## ✅ Step 2: Update Backend Configuration

Open `backend/.env` file and replace these lines:

```env
# Replace these with your actual credentials:
LIVEKIT_API_KEY=APIxxxxxxxxxxxxxxxxx
LIVEKIT_API_SECRET=your-long-secret-string-here
LIVEKIT_URL=wss://your-project-name.livekit.cloud
```

**Example:**
```env
LIVEKIT_API_KEY=APIabcd1234efgh5678
LIVEKIT_API_SECRET=xK9mP2nQ5rT8vW1yZ4bC7dF0gH3jL6mN9pR2sU5xA8
LIVEKIT_URL=wss://mobile-app-abc123.livekit.cloud
```

---

## ✅ Step 3: Restart Backend

The backend needs to reload the new configuration:

### Option 1: If backend is running in terminal
1. Press `Ctrl+C` to stop
2. Run `npm run dev` to start again

### Option 2: If backend is running as background process
The backend should automatically restart when you save the `.env` file.

---

## 🧪 Test It Works

After restarting, test by creating a live session:

```bash
# Test endpoint (replace with your teacher token)
curl -X POST http://localhost:4000/live-sessions \
  -H "Authorization: Bearer YOUR_TEACHER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"courseId":"test-course-id"}'
```

If configured correctly, you'll see:
```json
{
  "livekitConfigured": true,
  "livekitUrl": "wss://your-project.livekit.cloud",
  ...
}
```

---

## 📱 What You Can Do Now

### Teachers Can:
- ✅ Create live video sessions
- ✅ Get video call tokens
- ✅ Start video classes
- ✅ Record sessions
- ✅ Control participants

### Students Can:
- ✅ Join live sessions
- ✅ Video call with teacher
- ✅ See other students
- ✅ Share audio/video
- ✅ Interactive learning

---

## 🎯 Next Steps

1. **Update `.env`** with your credentials
2. **Restart backend**
3. **Test creating a session** via API or mobile app
4. **Implement video UI** in mobile app (optional)

---

## 📊 Your Free Tier Includes:

- ✅ 10,000 participant minutes/month
- ✅ Unlimited rooms
- ✅ Unlimited participants
- ✅ HD video quality
- ✅ Recording
- ✅ Screen sharing
- ✅ All features

---

## 🆘 Need Help?

- **Configuration issues?** Run `node backend/configure-livekit.js`
- **Detailed guide?** See `LIVEKIT_SETUP_GUIDE.md`
- **API docs?** Check LiveKit dashboard → Documentation
- **Support?** https://livekit.io/discord

---

## ✅ Quick Checklist

- [ ] Got API Key from dashboard
- [ ] Got API Secret from dashboard
- [ ] Got WebSocket URL from dashboard
- [ ] Updated `backend/.env` file
- [ ] Saved the file
- [ ] Restarted backend
- [ ] Tested creating a session

---

**That's it! Your video calling system is ready!** 🎉
