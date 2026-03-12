import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { StudentsScreen } from './features/students/StudentsScreen';
import { RecordingsScreen } from './features/recordings/RecordingsScreen';
import { ManageVideosScreen } from './features/videos/ManageVideosScreen';
import { LoginScreen } from './features/auth/LoginScreen';
import { AdminDashboardScreen } from './features/admin/AdminDashboardScreen';
import { AdminTeachersScreen } from './features/admin/AdminTeachersScreen';
import { AdminStudentsScreen } from './features/admin/AdminStudentsScreen';
import { AdminCoursesScreen } from './features/admin/AdminCoursesScreen';
import { useAuthStore } from './store/useAuthStore';

function App() {
  const { isAuthenticated, user } = useAuthStore();
  const role = user?.role; // 'ADMIN' | 'TEACHER' | undefined

  // Where to send someone who IS authenticated but hits the wrong route
  const home = role === 'ADMIN' ? '/admin/dashboard' : '/students';

  return (
    <BrowserRouter>
      <Routes>
        {/* Login — if already logged in, go home */}
        <Route
          path="/login"
          element={!isAuthenticated ? <LoginScreen /> : <Navigate to={home} replace />}
        />

        {/* Admin routes — only ADMIN role */}
        <Route element={isAuthenticated && role === 'ADMIN' ? <AdminLayout /> : <Navigate to={isAuthenticated ? home : '/login'} replace />}>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<AdminDashboardScreen />} />
          <Route path="/admin/teachers" element={<AdminTeachersScreen />} />
          <Route path="/admin/students" element={<AdminStudentsScreen />} />
          <Route path="/admin/courses" element={<AdminCoursesScreen />} />
        </Route>

        {/* Teacher routes — TEACHER role (and any other non-admin authenticated) */}
        <Route element={isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" replace />}>
          <Route path="/" element={<Navigate to="/students" replace />} />
          <Route path="/students" element={<StudentsScreen />} />
          <Route path="/recordings" element={<RecordingsScreen />} />
          <Route path="/manage-videos" element={<ManageVideosScreen />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to={isAuthenticated ? home : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
