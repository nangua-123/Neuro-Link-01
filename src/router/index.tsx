// File: src/router/index.tsx
import React from 'react';
import { createBrowserRouter, Navigate, useLocation, useOutlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Layout from '../views/Layout';
import HomeView from '../views/Home';
import ManagerView from '../views/Manager';
import MallView from '../views/Mall';
import ProfileView from '../views/Profile';
import EHRTimelineView from '../views/Profile/EHRTimeline';
import DeviceView from '../views/Device';
import LoginView from '../views/Login';
import AssessmentView from '../views/Assessment';
import CRFAssessmentView from '../views/CRFAssessment';
import ReportView from '../views/Report';
import GlobalError from '../components/GlobalError';
import { RequireAgreement } from '../components/AuthGuard';
import { useAppStore } from '../store';

// 安全的重定向组件，防止在退出动画中重复触发导航
const SafeNavigate: React.FC<{ to: string; replace?: boolean; state?: any }> = ({ to, replace, state }) => {
  const location = useLocation();
  if (location.pathname === to) {
    return null;
  }
  return <Navigate to={to} replace={replace} state={state} />;
};

// 登录态守卫：未登录时重定向至 /login
const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAppStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <SafeNavigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// 全局根布局：处理跨顶级路由的页面转场动画
const RootLayout: React.FC = () => {
  const location = useLocation();
  const outlet = useOutlet();

  // 判断是否为底部导航栏的路由，如果是，则共用一个 key，避免 Layout 卸载
  const isTabRoute = ['/', '/manager', '/mall', '/profile'].includes(location.pathname);
  const animationKey = isTabRoute ? 'tabs' : location.pathname.split('/')[1] || '/';

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={animationKey}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.02 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="h-full w-full"
      >
        {outlet}
      </motion.div>
    </AnimatePresence>
  );
};

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <GlobalError />,
    children: [
      {
        path: '/login',
        element: <LoginView />,
      },
      {
        path: '/assessment',
        element: <RequireAuth><RequireAgreement><AssessmentView /></RequireAgreement></RequireAuth>,
      },
      {
        path: '/crf-assessment',
        element: <RequireAuth><RequireAgreement><CRFAssessmentView /></RequireAgreement></RequireAuth>,
      },
      {
        path: '/report',
        element: <RequireAuth><RequireAgreement><ReportView /></RequireAgreement></RequireAuth>,
      },
      {
        path: '/ehr-timeline',
        element: <RequireAuth><RequireAgreement><EHRTimelineView /></RequireAgreement></RequireAuth>,
      },
      {
        path: '/device',
        element: <RequireAuth><RequireAgreement><DeviceView /></RequireAgreement></RequireAuth>,
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
            element: <SafeNavigate to="/" replace />,
          }
        ],
      },
    ]
  }
]);
