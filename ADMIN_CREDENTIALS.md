# Admin Dashboard Credentials

## ⚠️ Important: Separate Portals

This system has **THREE SEPARATE PORTALS**:

1. **Admin Portal** (admin-web) - Port 5173 - ADMIN users only
2. **Teacher Portal** (teacher-web) - Port 5174 - TEACHER users only  
3. **Student App** (mobile-student) - Expo - STUDENT users only

**Each portal only accepts its designated role!**

---

## Default Admin Account

The admin account has been created with the following credentials:

### Login Details

```
Email:    admin@school.com
Password: Admin@123
Role:     ADMIN
```

## Access the Admin Dashboard

1. Start the backend server:
   ```bash
   cd backend
   npm run start:dev
   ```

2. Start the **ADMIN** web application:
   ```bash
   cd admin-web
   npm run dev
   ```

3. Open your browser and navigate to: `http://localhost:5173`

4. Login with the admin credentials above

⚠️ **Note:** If you try to login with admin credentials on the teacher portal (port 5174), you will get "Access denied" error. Admin credentials ONLY work on the admin portal (port 5173).

---

## Teacher Portal Access

If you need to access the teacher portal:

1. Start the teacher portal:
   ```bash
   cd teacher-web
   npm run dev
   ```

2. Navigate to: `http://localhost:5174` (or the port shown in terminal)

3. Login with TEACHER credentials (not admin credentials)

---

## Port Reference

| Portal | Port | Role Required | URL |
|--------|------|---------------|-----|
| Admin | 5173 | ADMIN | http://localhost:5173 |
| Teacher | 5174 | TEACHER | http://localhost:5174 |
| Student | Expo | STUDENT | Mobile app |

## Security Notes

⚠️ **IMPORTANT**: 
- This is a default admin account for development purposes
- Change the password immediately after first login
- Never use these credentials in production
- For production, create a secure admin account with a strong password

## Creating Additional Admin Users

If you need to create more admin users, you can run:

```bash
cd backend
node create-admin.js
```

Or modify the script to create users with different credentials.

## Admin Capabilities

The admin dashboard provides full access to:

- ✅ View system statistics and analytics
- ✅ Manage teachers (approve, suspend, delete)
- ✅ Manage students (view, edit, delete)
- ✅ Manage all video content
- ✅ Manage all recordings
- ✅ Oversee all courses
- ✅ Monitor system activity

## Troubleshooting

If you can't login:

1. Verify the backend is running on port 4000
2. Check the database connection
3. Ensure the admin user exists by running `node create-admin.js` again
4. Check browser console for any errors
5. Verify JWT secrets are configured in `.env` file

## API Endpoints

The admin has access to these protected endpoints:

- `GET /admin/dashboard/stats` - Dashboard statistics
- `GET /admin/teachers` - List all teachers
- `PATCH /admin/teachers/:id/approve` - Approve teacher
- `PATCH /admin/teachers/:id/suspend` - Suspend teacher
- `DELETE /admin/teachers/:id` - Delete teacher
- `GET /admin/students` - List all students
- `GET /admin/courses` - List all courses
- `DELETE /admin/courses/:id` - Delete course
- `GET /admin/recordings` - List all recordings
- `DELETE /admin/recordings/:id` - Delete recording

All endpoints require JWT authentication with ADMIN role.
