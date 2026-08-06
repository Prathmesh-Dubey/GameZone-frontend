import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginView from '../components/LoginView';
import { User } from '../api/api';

export default function Login() {
  const navigate = useNavigate();

  // If already logged in, redirect to dashboard
  useEffect(() => {
    const saved = localStorage.getItem("gamezone_user");
    if (saved) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleLoginSuccess = (user: User) => {
    localStorage.setItem("gamezone_user", JSON.stringify(user));
    // DashboardApp component expects to find this in localStorage on mount.
    // DashboardApp handles setting state inside its own boot process.
    navigate('/dashboard');
  };

  return <LoginView onLoginSuccess={handleLoginSuccess} />;
}
