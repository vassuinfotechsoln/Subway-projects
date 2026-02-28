import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

// Layouts
import DashboardLayout from "./layouts/DashboardLayout";

// Pages
import Dashboard from "./pages/Dashboard";
import Assets from "./pages/Assets";
import Maintenance from "./pages/Maintenance";
import Users from "./pages/Users";
import ActivityMonitor from "./pages/ActivityMonitor";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route
                path="assets"
                element={
                  <ProtectedRoute>
                    <Assets />
                  </ProtectedRoute>
                }
              />
              <Route path="maintenance" element={<Maintenance />} />
              <Route
                path="users"
                element={
                  <ProtectedRoute requireAdmin>
                    <Users />
                  </ProtectedRoute>
                }
              />
              <Route path="activity" element={<ActivityMonitor />} />
            </Route>

            {/* Catch All */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
