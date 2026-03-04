# Unified Login System - Admin & Teacher Portal

## Overview
The admin-web application now serves as a unified portal for both administrators and teachers. Users log in through a single interface, and the system automatically redirects them to the appropriate dashboard based on their role.

## How It Works

### 1. Single Login Screen
- Located at `/login`
- Accepts email and password
- Works for both ADMIN and TEACHER roles
- Automatically decodes JWT token to determine user role
- Redirects to appropriate dashboard after successful login

### 2. Role-Based Routing

#### Admin Routes (Role: ADMIN)
```
/admin/dashboard     - Dashboard with statistics
/admin/teachers      - Teacher management
/admin/students      - Student management (all students)
/admin/videos        - Video management (all videos)
/admin/recordings    - Recording management (all recordings)
```

#### Teacher Routes (Role: TEACHER)
```
/teacher/students    - Student management (teacher's students only)
/teacher/recordings  - Upload and manage recordings
/teacher/videos      - Manage video content
```

### 3. Automatic Redirection
- After login, users are redirected based on their role:
  - ADMIN → `/admin/dashboard`
  - TEACHER → `/teacher/students`
- If a user tries to access a route they don't have permission for, they're redirected to their appropriate dashboard
- Unauthenticated users are redirected to `/login`

## Technical Implementation

### JWT Token Decoding
The login screen decodes the JWT token to extract the user's role:
```typescript
const decodeToken = (token: string): { role: string; userId: string } | null => {
    // Decodes JWT payload to get role and userId
    // Returns null if decoding fails
}
```

### Protected Routes
Routes are protected using a `ProtectedRoute` component that:
1. Checks if user is authenticated
2. Verifies user has the required role
3. Redirects unauthorized users appropriately

### Role-Based API Endpoints
Components automatically use the correct API endpoints based on user role:

**Students Screen:**
- Admin: `GET /admin/students` (all students)
- Teacher: `GET /courses/teacher/students` (teacher's students only)

**Videos Screen:**
- Admin: `GET /admin/recordings` (all recordings)
- Teacher: `GET /recordings` (teacher's recordings only)

**Delete Operations:**
- Admin: `DELETE /admin/recordings/:id`
- Teacher: `DELETE /recordings/:id`

### Dynamic UI
The dashboard layout adapts based on user role:
- **Portal Name:** AdminHub (admin) / TeacherHub (teacher)
- **Navigation Menu:** Different menu items for each role
- **User Avatar:** "A" for admin, "T" for teacher
- **Account Label:** Shows appropriate role name

## User Experience

### For Administrators
1. Login at `/login`
2. Redirected to `/admin/dashboard`
3. See full dashboard with statistics
4. Access all management features:
   - Approve/suspend teachers
   - View all students
   - Manage all videos and recordings
   - System-wide oversight

### For Teachers
1. Login at `/login`
2. Redirected to `/teacher/students`
3. See their students and content
4. Access teaching features:
   - Register and manage their students
   - Upload recordings
   - Manage their video content
   - No access to admin features

## Security Features

1. **JWT-based Authentication:** Secure token-based auth
2. **Role Verification:** Backend validates user role on every request
3. **Frontend Route Protection:** Prevents unauthorized access to routes
4. **Automatic Logout:** Clears auth state on logout
5. **Token Persistence:** Uses Zustand persist for session management

## Access Control Matrix

| Feature | Admin | Teacher |
|---------|-------|---------|
| Dashboard Statistics | ✅ | ❌ |
| Teacher Management | ✅ | ❌ |
| All Students | ✅ | ❌ |
| Own Students | ✅ | ✅ |
| All Videos | ✅ | ❌ |
| Own Videos | ✅ | ✅ |
| Upload Content | ✅ | ✅ |
| System Settings | ✅ | ❌ |

## Running the Application

```bash
cd admin-web
npm install
npm run dev
```

The application will be available at `http://localhost:5173`

## Test Credentials

### Admin Account
- Email: `admin@example.com`
- Password: (set in your backend)
- Role: ADMIN

### Teacher Account
- Email: `teacher@example.com`
- Password: (set in your backend)
- Role: TEACHER

## Migration Notes

### From Separate Portals
If you previously had separate admin-web and teacher-web:
1. The admin-web now handles both roles
2. teacher-web can be deprecated or kept as a separate deployment
3. All shared components work for both roles
4. API endpoints are role-aware

### Database Requirements
Ensure your database has:
- Users with role field (ADMIN, TEACHER, STUDENT)
- Proper relationships between teachers and their content
- Admin users created with ADMIN role

## Future Enhancements

1. **Role-based permissions:** More granular permissions within roles
2. **Multi-role support:** Users with multiple roles
3. **Custom dashboards:** Personalized dashboard per user
4. **Activity logs:** Track user actions by role
5. **Role switching:** Allow users with multiple roles to switch
6. **SSO integration:** Single sign-on for enterprise
7. **2FA:** Two-factor authentication for enhanced security

## Troubleshooting

### Issue: Redirected to wrong dashboard
- Check JWT token payload contains correct role
- Verify backend is setting role correctly in token
- Clear browser storage and login again

### Issue: Can't access certain routes
- Verify user role in auth store
- Check route protection configuration
- Ensure backend endpoints match role

### Issue: Login fails
- Check backend is running
- Verify credentials are correct
- Check network tab for API errors
- Ensure JWT secret is configured

## Support

For issues or questions:
1. Check backend logs for authentication errors
2. Verify JWT token structure
3. Test API endpoints directly
4. Review browser console for errors
