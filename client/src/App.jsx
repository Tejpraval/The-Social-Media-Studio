import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { useAuth } from './context/useAuth.js';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Studio from './pages/Studio.jsx';
import BrandSettings from './pages/BrandSettings.jsx';
import DemoExperience from './pages/DemoExperience.jsx';
import Shell from './components/Shell.jsx';

function Protected({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/demo" element={<DemoExperience />} />
        <Route
          path="/"
          element={
            <Protected>
              <Shell />
            </Protected>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="studio/:projectId" element={<Studio />} />
          <Route path="brand" element={<BrandSettings />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
