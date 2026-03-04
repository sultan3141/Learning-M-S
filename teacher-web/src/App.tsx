import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { StudentsScreen } from './features/students/StudentsScreen';
import { RecordingsScreen } from './features/recordings/RecordingsScreen';
import { ManageVideosScreen } from './features/videos/ManageVideosScreen';
import { LoginScreen } from './features/auth/LoginScreen';
import { useAuthStore } from './store/useAuthStore';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <LoginScreen /> : <Navigate to="/" />} />

        <Route element={isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" />}>
          <Route path="/" element={<Navigate to="/students" />} />
          <Route path="/students" element={<StudentsScreen />} />
          <Route path="/recordings" element={<RecordingsScreen />} />
          <Route path="/manage-videos" element={<ManageVideosScreen />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
