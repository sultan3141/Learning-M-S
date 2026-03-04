import { BrowserRouter, Routes, Route, Navigate, useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { DashboardLayout } from './layouts/DashboardLayout';
import { AdminDashboard } from './features/dashboard/AdminDashboard';
import { TeachersManagement } from './features/teachers/TeachersManagement';
import { StudentsScreen } from './features/students/StudentsScreen';
import { RecordingsScreen } from './features/recordings/RecordingsScreen';
import { ManageVideosScreen } from './features/videos/ManageVideosScreen';
import { LoginScreen } from './features/auth/LoginScreen';
import { useAuthStore } from './store/useAuthStore';

// Handles auto-login when redirected from teacher-web with ?token=...
const TokenHandler = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const token = params.get('token');
    const email = params.get('email');
    if (token && !isAuthenticated) {
      // Decode role from token
      try {
        const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')));
        login(token, { email: email || payload.email || '', role: payload.role, userId: payload.sub });
        // Remove token from URL and redirect cleanly
        if (payload.role === 'ADMIN') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/teacher/students', { replace: true });
        }
      } catch {
        navigate('/login', { replace: true });
      }
    }
  }, []);

  return null;
};

// Protected route wrapper that checks role
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user?.role)) {
    // Redirect to appropriate dashboard based on role
    if (user?.role === 'ADMIN') {
      return <Navigate to="/admin/dashboard" />;
    } else if (user?.role === 'TEACHER') {
      return <Navigate to="/teacher/students" />;
    }
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

function App() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            !isAuthenticated ? <LoginScreen /> :
              user?.role === 'ADMIN' ? <Navigate to="/admin/dashboard" /> :
                <Navigate to="/teacher/students" />
          }
        />

        {/* Admin Routes */}
        <Route element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <DashboardLayout userRole="ADMIN" />
          </ProtectedRoute>
        }>
          <Route path="/admin/dashboard" element={<><TokenHandler /><AdminDashboard /></>} />
          <Route path="/admin/teachers" element={<TeachersManagement />} />
          <Route path="/admin/students" element={<StudentsScreen />} />
          <Route path="/admin/videos" element={<ManageVideosScreen />} />
          <Route path="/admin/recordings" element={<RecordingsScreen />} />
        </Route>

        {/* Teacher Routes */}
        <Route element={
          <ProtectedRoute allowedRoles={['TEACHER']}>
            <DashboardLayout userRole="TEACHER" />
          </ProtectedRoute>
        }>
          <Route path="/teacher/students" element={<><TokenHandler /><StudentsScreen /></>} />
          <Route path="/teacher/videos" element={<ManageVideosScreen />} />
          <Route path="/teacher/recordings" element={<RecordingsScreen />} />
        </Route>

        {/* Default redirect */}
        <Route
          path="/"
          element={
            !isAuthenticated ? <Navigate to="/login" /> :
              user?.role === 'ADMIN' ? <Navigate to="/admin/dashboard" /> :
                <Navigate to="/teacher/students" />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
