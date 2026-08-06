import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import DashboardApp from './pages/DashboardApp';
import MobileSplash from './pages/MobileSplash';

const isNative = Capacitor.isNativePlatform();

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: isNative ? <MobileSplash /> : <LandingPage />,
    },
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/dashboard',
      element: <DashboardApp />,
    },
    {
      path: '*',
      element: <Navigate to="/" replace />,
    },
  ],
  {
    basename: Capacitor.isNativePlatform()
      ? '/'
      : '/GameZone-frontend',
  }
);

export default function App() {
  return <RouterProvider router={router} />;
}