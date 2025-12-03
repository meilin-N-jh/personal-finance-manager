import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Layout Components
import Layout from './components/Layout';

// Page Components
import WorkingLogin from './pages/WorkingLogin';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Accounts from './pages/Accounts';
import Budgets from './pages/Budgets';
import Categories from './pages/Categories';
import Profile from './pages/Profile';

// Loading component
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="App">
      <Routes>
        {/* Public routes */}
        <Route
            index
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <WorkingLogin />}
          />
          <Route
            path="login"
            element={<WorkingLogin />}
          />
          <Route
            path="register"
            element={<WorkingLogin />}
          />

        {/* Protected routes */}
        <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} />
          <Route path="transactions" element={isAuthenticated ? <Transactions /> : <Navigate to="/login" replace />} />
          <Route path="accounts" element={isAuthenticated ? <Accounts /> : <Navigate to="/login" replace />} />
          <Route path="budgets" element={isAuthenticated ? <Budgets /> : <Navigate to="/login" replace />} />
          <Route path="categories" element={isAuthenticated ? <Categories /> : <Navigate to="/login" replace />} />
          <Route path="profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" replace />} />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;