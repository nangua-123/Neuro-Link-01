// File: src/router/index.tsx
import React from 'react';
import { createBrowserRouter, Navigate, useLocation } from 'react-router-dom';
import Layout from '../views/Layout';
import HomeView from '../views/Home';
import ManagerView from '../views/Manager';
import MallView from '../views/Mall';
import ProfileView from '../views/Profile';
import LoginView from '../views/Login';
import AssessmentView from '../views/Assessment';
import { RequireAgreement } from '../components/AuthGuard';
import { useAppStore } from '../store';

// 登录态守卫：未登录时重定向至 /login
const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAppStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginView />,
  },
  {
    path: '/assessment',
    element: <RequireAuth><RequireAgreement><AssessmentView /></RequireAgreement></RequireAuth>,
  },
  {
    path: '/',
    element: <RequireAuth><Layout /></RequireAuth>,
    children: [
      {
        index: true,
        element: <HomeView />, // 预问诊免费开放，不强制拦截协议，但需要登录态
      },
      {
        path: 'manager',
        element: <RequireAgreement><ManagerView /></RequireAgreement>, // 核心履约区，强制拦截
      },
      {
        path: 'mall',
        element: <RequireAgreement><MallView /></RequireAgreement>, // 交易区，强制拦截
      },
      {
        path: 'profile',
        element: <RequireAgreement><ProfileView /></RequireAgreement>, // 数据资产区，强制拦截
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      }
    ],
  },
]);
