# 🚀 Quick Start Guide

## ✅ Applications Running

### Backend Server
- **Status:** ✅ Running
- **URL:** http://localhost:4000
- **Purpose:** API server for all portals

### Admin Portal
- **Status:** ✅ Running  
- **URL:** http://localhost:5173
- **Purpose:** Administrator dashboard

### Mobile Student App
- **Status:** ✅ Running
- **Access:** Scan QR code with Expo Go
- **Purpose:** Student learning app

---

## 📱 Access Mobile App

### Quick Steps:
1. **Install Expo Go** on your phone (Android/iOS)
2. **Scan the QR code** shown in the terminal
3. **App will load** on your device

See `MOBILE_APP_GUIDE.md` for detailed instructions.

---

## 🔐 Login to Admin Portal

1. **Open your browser** and go to: **http://localhost:5173**

2. **Login with admin credentials:**
   ```
   Email:    admin@school.com
   Password: Admin@123
   ```

3. **You should see:** "Admin Portal - Administrator access only"

4. **After login:** You'll be redirected to `/admin/dashboard`

---

## 📊 Admin Dashboard Features

Once logged in, you can access:

- **Dashboard** - System statistics and overview
- **Teachers** - Approve, suspend, or delete teachers
- **Students** - View and manage all students
- **Videos** - Manage all video content
- **Recordings** - Manage all recordings

---

## ⚠️ Important Notes

### If you see "Teacher Portal" instead of "Admin Portal":
- You're on the wrong application
- Make sure you're accessing **http://localhost:5173** (not 5174)
- The admin portal should say "Admin Portal" at the top

### If you get "Access denied" error:
- Make sure you're using admin credentials: `admin@school.com` / `Admin@123`
- Admin credentials only work on the admin portal (port 5173)
- Teacher credentials only work on the teacher portal (port 5174)

### If login doesn't work:
1. Check that backend is running (http://localhost:4000)
2. Clear browser cache/localStorage
3. Try logging in again

---

## 🛑 Stop Applications

To stop the running applications, use Ctrl+C in the terminals or close them.

---

## 📱 Other Portals

### Teacher Portal (Not Started)
To start the teacher portal:
```bash
cd teacher-web
npm run dev
```
It will run on http://localhost:5174

### Student Mobile App (Not Started)
To start the student app:
```bash
cd mobile-student
npm start
```

---

## 🔄 Restart Applications

If you need to restart:

**Backend:**
```bash
cd backend
npm run dev
```

**Admin Portal:**
```bash
cd admin-web
npm run dev
```

---

## 📞 Need Help?

Check these files for more information:
- `ADMIN_CREDENTIALS.md` - Admin login details
- `PORTAL_SEPARATION_GUIDE.md` - Detailed portal information
- `ADMIN_DASHBOARD.md` - Admin features documentation
