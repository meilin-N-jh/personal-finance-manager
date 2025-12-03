import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Layout Components
import Layout from './components/Layout';

// Page Components
import WorkingLogin from './pages/WorkingLogin';
import ApiTest from './pages/ApiTest';
import SimpleApiTest from './pages/SimpleApiTest';
import NetworkTest from './pages/NetworkTest';
import BrowserDiagnostics from './pages/BrowserDiagnostics';
import ConnectionTest from './pages/ConnectionTest';
import ProxyTest from './pages/ProxyTest';
// import FinalTest from './pages/FinalTest';
// import DirectTest from './pages/DirectTest';
// import ButtonTest from './pages/ButtonTest';
// import SimpleTest from './pages/SimpleTest';
// import TestLogin from './pages/TestLogin';
// import LoginSimple from './pages/LoginSimple';
// import Login from './pages/Login';
// import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Accounts from './pages/Accounts';
import Budgets from './pages/Budgets';
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
        {/* Public routes - 使用WorkingLogin */}
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
          <Route
            path="test"
            element={<ApiTest />}
          />
          <Route
            path="simple-test"
            element={<SimpleApiTest />}
          />
          <Route
            path="network-test"
            element={<NetworkTest />}
          />
          <Route
            path="browser-diagnostics"
            element={<BrowserDiagnostics />}
          />
          <Route
            path="connection-test"
            element={<ConnectionTest />}
          />
          <Route
            path="proxy-test"
            element={<ProxyTest />}
          />

        {/* Protected routes */}
        <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} />
          <Route path="transactions" element={isAuthenticated ? <Transactions /> : <Navigate to="/login" replace />} />
          <Route path="accounts" element={isAuthenticated ? <Accounts /> : <Navigate to="/login" replace />} />
          <Route path="budgets" element={isAuthenticated ? <Budgets /> : <Navigate to="/login" replace />} />
          <Route path="profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" replace />} />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;