# Portal Separation Guide

## Overview

The system has **three separate portals** for different user roles:

1. **Admin Portal** (`admin-web`) - For administrators only
2. **Teacher Portal** (`teacher-web`) - For teachers only  
3. **Student Mobile App** (`mobile-student`) - For students only

Each portal is a completely separate application with its own authentication and routing.

## Portal Details

### 1. Admin Portal (admin-web)

**Purpose:** System administration and oversight

**Access:** Administrators only (ADMIN role)

**URL:** `http://localhost:5173` (default Vite port)

**Login Credentials:**
```
Email:    admin@school.com
Password: Admin@123
```

**Features:**
- Dashboard with system statistics
- Teacher management (approve, suspend, delete)
- Student management (view, edit, delete)
- Video content management
- Recording management
- Course oversight

**Start Command:**
```bash
cd admin-web
npm run dev
```

---

### 2. Teacher Portal (teacher-web)

**Purpose:** Content management and student registration

**Access:** Teachers only (TEACHER role)

**URL:** `http://localhost:5174` (or next available port)

**Login:** Teachers must register first or be created by admin

**Features:**
- Student registration and management
- Video recording upload
- Content management
- Course management
- Student progress tracking

**Start Command:**
```bash
cd teacher-web
npm run dev
```

---

### 3. Student Mobile App (mobile-student)

**Purpose:** Learning and course access

**Access:** Students only (STUDENT role)

**Platform:** React Native (iOS/Android)

**Login:** Students receive credentials from teachers

**Features:**
- Course browsing and enrollment
- Video lessons
- Live sessions
- Progress tracking
- Profile management

**Start Command:**
```bash
cd mobile-student
npm start
```

---

## Authentication Flow

### Role-Based Access Control

Each portal validates the user's role from the JWT token:

```typescript
// Admin Portal - Only allows ADMIN
if (decoded.role !== 'ADMIN') {
    setError('Access denied. This portal is for administrators only.');
    return;
}

// Teacher Portal - Only allows TEACHER
if (decoded.role !== 'TEACHER') {
    setError('Access denied. This portal is for teachers only.');
    return;
}

// Student App - Only allows STUDENT
if (decoded.role !== 'STUDENT') {
    setError('Access denied. This app is for students only.');
    return;
}
```

### Storage Separation

Each portal uses a unique localStorage key to prevent conflicts:

- Admin: `admin-auth-storage`
- Teacher: `teacher-auth-storage`
- Student: `student-auth-storage`

This allows you to be logged into multiple portals simultaneously for testing.

---

## Common Issues & Solutions

### Issue: "I'm redirected to the wrong dashboard"

**Solution:** Make sure you're accessing the correct portal URL:
- Admin: Port 5173
- Teacher: Port 5174 (or check terminal for actual port)
- Student: Expo app

### Issue: "Access denied" error when logging in

**Solution:** Check that you're using the correct credentials for each portal:
- Admin credentials only work in admin portal
- Teacher credentials only work in teacher portal
- Student credentials only work in student app

### Issue: "Can't login to any portal"

**Solution:**
1. Verify backend is running: `cd backend && npm run start:dev`
2. Check backend is on port 4000
3. Clear browser localStorage
4. Try logging in again

### Issue: "Token expired" or authentication errors

**Solution:**
1. Logout from the portal
2. Clear browser cache/localStorage
3. Login again with fresh credentials

---

## Development Workflow

### Running All Portals Simultaneously

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
```

**Terminal 2 - Admin Portal:**
```bash
cd admin-web
npm run dev
```

**Terminal 3 - Teacher Portal:**
```bash
cd teacher-web
npm run dev
```

**Terminal 4 - Student App:**
```bash
cd mobile-student
npm start
```

### Testing Different Roles

1. **Test Admin:**
   - Open `http://localhost:5173`
   - Login with admin credentials
   - Verify admin features work

2. **Test Teacher:**
   - Open `http://localhost:5174`
   - Login with teacher credentials
   - Verify teacher features work

3. **Test Student:**
   - Open Expo app
   - Login with student credentials
   - Verify student features work

---

## Creating Test Users

### Create Admin User
```bash
cd backend
node create-admin.js
```

### Create Teacher User
Teachers can self-register through the teacher portal, or admin can approve them.

### Create Student User
Teachers create student accounts through their portal.

---

## Port Configuration

If ports conflict, you can change them:

### Admin Portal
Edit `admin-web/vite.config.ts`:
```typescript
export default defineConfig({
  server: {
    port: 5173, // Change this
  }
})
```

### Teacher Portal
Edit `teacher-web/vite.config.ts`:
```typescript
export default defineConfig({
  server: {
    port: 5174, // Change this
  }
})
```

### Backend
Edit `backend/.env`:
```
PORT=4000  # Change this
```

---

## Security Notes

⚠️ **Important:**

1. Each portal validates user roles on both frontend and backend
2. JWT tokens contain role information
3. Backend endpoints check roles before allowing access
4. Never share admin credentials
5. Change default passwords in production
6. Use HTTPS in production
7. Set secure JWT secrets in production

---

## Summary

| Portal | Role | Port | URL | Purpose |
|--------|------|------|-----|---------|
| Admin | ADMIN | 5173 | http://localhost:5173 | System administration |
| Teacher | TEACHER | 5174 | http://localhost:5174 | Content & student management |
| Student | STUDENT | Expo | Mobile app | Learning & courses |

Each portal is completely independent and enforces role-based access control.
