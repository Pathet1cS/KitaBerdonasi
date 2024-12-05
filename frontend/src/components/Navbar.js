import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { token, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Function untuk menentukan link dashboard berdasarkan role
  const getDashboardLink = () => {
    switch (role) {
      case 'association_admin':
        return '/association/dashboard';
      default:
        return '/dashboard';
    }
  };

  return (
    <nav className="bg-blue-600 text-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">
            DonasiBersama
          </Link>
          <div className="space-x-4">
            {token ? (
              <>
                <Link to={getDashboardLink()}>Dashboard</Link>
                {role !== 'association_admin' && (
                  <Link to="/create-donation">Donasi Baru</Link>
                )}
                <button onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <div className="relative inline-block group">
                  <button className="hover:text-gray-200">
                    Register ▼
                  </button>
                  <div className="absolute hidden group-hover:block right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                    <Link 
                      to="/register" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Register as User
                    </Link>
                    <Link 
                      to="/register/association-admin" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Register as Association
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;