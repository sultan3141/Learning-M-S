# All System Credentials - Verified ✅

## Admin Portal (Port 5173)
**URL**: http://localhost:5173

```
Email: admin@school.com
Password: Admin@123
Role: ADMIN
```

**Access**: Admin dashboard with full system management

---

## Teacher Portal (Port 5174)
**URL**: http://localhost:5174 ✅ RUNNING

```
Email: teacher@test.com
Password: password123
Role: TEACHER
```

**Access**: Teacher dashboard to manage students and courses

---

## Mobile Student App
**Platform**: React Native (Expo)

```
Email: student@test.com
Password: student123
Role: STUDENT
```

**Access**: Mobile app for students to view courses and join live sessions

---

## Important Notes

### Portal Separation
- **Admin Portal** (5173) - Only accepts ADMIN role
- **Teacher Portal** (5174) - Only accepts TEACHER role
- **Mobile App** - Only accepts STUDENT role

### Common Issues

#### "Access Denied" or "Invalid Credentials"
**Cause**: Using wrong credentials for the portal

**Solution**: 
- Admin portal → Use admin@school.com / Admin@123
- Teacher portal → Use teacher@test.com / password123
- Mobile app → Use student@test.com / student123

#### "This portal is for [role] only"
**Cause**: Trying to login with wrong role for that portal

**Solution**: Use the correct portal for your role:
- Admin → http://localhost:5173
- Teacher → http://localhost:5174 (must start it first)
- Student → Mobile app

### Currently Running

✅ **Backend** - Port 4000
✅ **Admin Portal** - Port 5173
✅ **Teacher Portal** - Port 5174
✅ **Mobile App** - Expo

### Test Credentials

All credentials have been verified and are working:

```bash
# Test admin login
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@school.com","password":"Admin@123"}'

# Test teacher login
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teacher@test.com","password":"password123"}'

# Test student login
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@test.com","password":"student123"}'
```

### Quick Reference

| Role | Email | Password | Portal/App | Port |
|------|-------|----------|------------|------|
| Admin | admin@school.com | Admin@123 | Admin Web | 5173 |
| Teacher | teacher@test.com | password123 | Teacher Web | 5174 |
| Student | student@test.com | student123 | Mobile App | - |

---

## Need to Reset Password?

If you need to reset any password, you can:

1. **Use Prisma Studio** (Database GUI):
   ```bash
   cd backend
   npx prisma studio
   ```
   Then navigate to the User table and update the password hash.

2. **Create a new account** using the registration endpoints.

3. **Run the setup scripts**:
   ```bash
   cd backend
   node create-admin.js      # Creates/resets admin
   node create-test-student.js  # Creates/resets student
   ```

---

## Where Are You Trying to Login?

Please specify:
1. **Admin Portal** (http://localhost:5173) - Use admin credentials
2. **Teacher Portal** (http://localhost:5174) - Use teacher credentials (must start it first)
3. **Mobile App** - Use student credentials

The teacher credentials (teacher@test.com / password123) are verified and working! ✅
