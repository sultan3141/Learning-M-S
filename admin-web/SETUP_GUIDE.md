# Quick Setup Guide - Unified Admin & Teacher Portal

## Prerequisites
- Node.js 18+ installed
- Backend API running
- Database with users (ADMIN and TEACHER roles)

## Installation

```bash
cd admin-web
npm install
```

## Configuration

1. **Environment Variables** (if needed)
   Create `.env` file:
   ```
   VITE_API_URL=http://localhost:3000
   ```

2. **Backend Setup**
   Ensure your backend has:
   - JWT authentication configured
   - User roles (ADMIN, TEACHER, STUDENT)
   - Required API endpoints

## Running the Application

### Development Mode
```bash
npm run dev
```
Access at: `http://localhost:5173`

### Production Build
```bash
npm run build
npm run preview
```

## First Login

### Create Admin User (Backend)
Run this in your backend to create an admin:
```typescript
// Example using Prisma
await prisma.user.create({
  data: {
    email: 'admin@example.com',
    passwordHash: await bcrypt.hash('admin123', 10),
    fullName: 'System Administrator',
    role: 'ADMIN',
    isTeacherApproved: false,
  }
});
```

### Create Teacher User (Backend)
```typescript
await prisma.user.create({
  data: {
    email: 'teacher@example.com',
    passwordHash: await bcrypt.hash('teacher123', 10),
    fullName: 'John Teacher',
    role: 'TEACHER',
    isTeacherApproved: true,
  }
});
```

## Testing the Login

1. **Test Admin Login:**
   - Go to `http://localhost:5173/login`
   - Email: `admin@example.com`
   - Password: `admin123`
   - Should redirect to `/admin/dashboard`

2. **Test Teacher Login:**
   - Go to `http://localhost:5173/login`
   - Email: `teacher@example.com`
   - Password: `teacher123`
   - Should redirect to `/teacher/students`

## Verifying Role-Based Access

### As Admin
- ✅ Can access `/admin/dashboard`
- ✅ Can access `/admin/teachers`
- ✅ Can access `/admin/students`
- ✅ Can access `/admin/videos`
- ✅ Can access `/admin/recordings`
- ❌ Cannot access `/teacher/*` routes (will redirect to admin dashboard)

### As Teacher
- ✅ Can access `/teacher/students`
- ✅ Can access `/teacher/recordings`
- ✅ Can access `/teacher/videos`
- ❌ Cannot access `/admin/*` routes (will redirect to teacher dashboard)

## Common Issues

### Issue: "Login failed"
**Solution:**
- Check backend is running
- Verify API URL in axios config
- Check browser console for errors
- Verify credentials in database

### Issue: "Redirected to login after successful login"
**Solution:**
- Check JWT token is being stored
- Verify token format is correct
- Check browser localStorage for auth data
- Clear browser cache and try again

### Issue: "Can't access certain pages"
**Solution:**
- Verify user role in database
- Check JWT payload contains role field
- Ensure backend is setting role correctly
- Try logging out and back in

### Issue: "API calls failing"
**Solution:**
- Check CORS configuration on backend
- Verify API endpoints exist
- Check network tab for error details
- Ensure JWT token is being sent in headers

## Project Structure

```
admin-web/
├── src/
│   ├── features/
│   │   ├── auth/
│   │   │   └── LoginScreen.tsx          # Unified login
│   │   ├── dashboard/
│   │   │   └── AdminDashboard.tsx       # Admin dashboard
│   │   ├── teachers/
│   │   │   └── TeachersManagement.tsx   # Admin only
│   │   ├── students/
│   │   │   └── StudentsScreen.tsx       # Both roles
│   │   ├── videos/
│   │   │   └── ManageVideosScreen.tsx   # Both roles
│   │   └── recordings/
│   │       └── RecordingsScreen.tsx     # Both roles
│   ├── layouts/
│   │   └── DashboardLayout.tsx          # Role-aware layout
│   ├── lib/
│   │   ├── axios.ts                     # API client
│   │   └── roleHelper.ts                # Role utilities
│   ├── store/
│   │   └── useAuthStore.ts              # Auth state
│   └── App.tsx                          # Route configuration
```

## Key Features

1. **Single Login Portal** - One login for both admin and teacher
2. **Automatic Role Detection** - JWT token decoded to determine role
3. **Smart Redirects** - Users sent to appropriate dashboard
4. **Role-Based UI** - Different menus and features per role
5. **Protected Routes** - Unauthorized access prevented
6. **Shared Components** - Same components work for both roles

## Next Steps

1. **Customize Branding** - Update colors, logos, text
2. **Add More Features** - Extend functionality as needed
3. **Configure Production** - Set up production environment
4. **Add Analytics** - Track usage and performance
5. **Implement Monitoring** - Set up error tracking

## Support

For detailed documentation:
- See `UNIFIED_LOGIN.md` for login system details
- See `ADMIN_DASHBOARD.md` for admin features
- Check backend API documentation for endpoints

## Development Tips

1. **Hot Reload** - Changes auto-reload in dev mode
2. **TypeScript** - Full type safety throughout
3. **Zustand DevTools** - Install browser extension for state debugging
4. **React DevTools** - Use for component inspection
5. **Network Tab** - Monitor API calls and responses

## Production Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to your hosting:
   - Vercel
   - Netlify
   - AWS S3 + CloudFront
   - Your own server

3. Configure environment variables in hosting platform

4. Set up proper CORS on backend for production domain

5. Enable HTTPS for security

## Security Checklist

- ✅ JWT tokens stored securely
- ✅ HTTPS in production
- ✅ CORS properly configured
- ✅ Role verification on backend
- ✅ Protected routes on frontend
- ✅ Secure password hashing
- ✅ Token expiration handled
- ✅ Logout clears all auth data

## Performance Tips

1. **Code Splitting** - Already configured with Vite
2. **Lazy Loading** - Consider for large components
3. **Image Optimization** - Compress images
4. **API Caching** - Implement where appropriate
5. **Bundle Analysis** - Use `npm run build -- --analyze`

Happy coding! 🚀
