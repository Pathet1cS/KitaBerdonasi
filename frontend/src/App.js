import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateDonation from './pages/CreateDonation';
import AssociationAdminRegister from './pages/AssociationAdminRegister.js';
import AssociationDashboard from './pages/AssociationDashboard.js';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/register/association-admin" element={<AssociationAdminRegister />} />
              <Route
                path="/association/dashboard"
                element={
                  <PrivateRoute requiredRole="association_admin">
                    <AssociationDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute requiredRole="user">
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/create-donation"
                element={
                  <PrivateRoute>
                    <CreateDonation />
                  </PrivateRoute>
                }
              />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;