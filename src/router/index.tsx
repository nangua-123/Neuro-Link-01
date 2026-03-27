// File: src/router/index.tsx
import React, { Suspense } from 'react';
import { createBrowserRouter, Navigate, useLocation, useOutlet, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { RequireAgreement } from '../components/AuthGuard';
import { useAppStore } from '../store';
import GlobalError from '../components/GlobalError';

// Lazy loaded views
const Layout = React.lazy(() => import('../views/Layout'));
const HomeView = React.lazy(() => import('../views/Home'));
const ManagerView = React.lazy(() => import('../views/Manager'));
const EquipmentsView = React.lazy(() => import('../views/Equipments'));
const EquipmentDetailView = React.lazy(() => import('../views/Equipments/Detail'));
const ProfileView = React.lazy(() => import('../views/Profile'));
const EHRTimelineView = React.lazy(() => import('../views/Profile/EHRTimeline'));
const DeviceConnectView = React.lazy(() => import('../views/Profile/DeviceConnect'));
const DeviceAuthView = React.lazy(() => import('../views/Profile/DeviceAuth'));
const LoginView = React.lazy(() => import('../views/Login'));
const AssessmentView = React.lazy(() => import('../views/Assessment'));
const CRFAssessmentView = React.lazy(() => import('../views/CRFAssessment'));
const ReportView = React.lazy(() => import('../views/Report'));
const ClinicReportView = React.lazy(() => import('../views/ClinicReport'));
const MedicationsView = React.lazy(() => import('../views/Medications'));
const DiaryView = React.lazy(() => import('../views/Diary'));
const CareDiary = React.lazy(() => import('../views/CareDiary').then(m => ({ default: m.CareDiary })));
const CognitiveCareView = React.lazy(() => import('../views/CognitiveCare'));
const FeatureView = React.lazy(() => import('../views/Feature'));
const BrainTrainingView = React.lazy(() => import('../views/BrainTraining'));
const DTxRunnerView = React.lazy(() => import('../views/DTxRunner'));
const LBSFenceView = React.lazy(() => import('../views/LBSFence'));

// Loading fallback
const PageLoader = () => (
  <div className="flex items-center justify-center h-full bg-slate-50 overflow-y-auto hide-scrollbar">
    <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
  </div>
);

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
  const isTabRoute = ['/', '/manager', '/equipments', '/profile'].includes(location.pathname);
  const animationKey = isTabRoute ? 'tabs' : location.pathname;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={animationKey}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="h-full w-full absolute inset-0 overflow-y-auto overflow-x-hidden"
      >
        <Suspense fallback={<PageLoader />}>
          {outlet}
        </Suspense>
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
        path: '/medications',
        element: <RequireAuth><RequireAgreement><MedicationsView /></RequireAgreement></RequireAuth>,
      },
      {
        path: '/diary',
        element: <RequireAuth><RequireAgreement><DiaryView /></RequireAgreement></RequireAuth>,
      },
      {
        path: '/care-diary',
        element: <RequireAuth><RequireAgreement><CareDiary /></RequireAgreement></RequireAuth>,
      },
      {
        path: '/cdr',
        element: <RequireAuth><RequireAgreement><CognitiveCareView /></RequireAgreement></RequireAuth>,
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
        path: '/clinic-report',
        element: <RequireAuth><RequireAgreement><ClinicReportView /></RequireAgreement></RequireAuth>,
      },
      {
        path: '/ehr-timeline',
        element: <RequireAuth><RequireAgreement><EHRTimelineView /></RequireAgreement></RequireAuth>,
      },
      {
        path: '/device-connect',
        element: <RequireAuth><RequireAgreement><DeviceConnectView /></RequireAgreement></RequireAuth>,
      },
      {
        path: '/device-auth/:appId',
        element: <RequireAuth><RequireAgreement><DeviceAuthView /></RequireAgreement></RequireAuth>,
      },
      {
        path: '/feature/:id',
        element: <RequireAuth><RequireAgreement><FeatureView /></RequireAgreement></RequireAuth>,
      },
      {
        path: '/dtx',
        element: <RequireAuth><RequireAgreement><BrainTrainingView /></RequireAgreement></RequireAuth>,
      },
      {
        path: '/dtx/runner/:taskId',
        element: <RequireAuth><RequireAgreement><DTxRunnerView /></RequireAgreement></RequireAuth>,
      },
      {
        path: '/feature/lbs-fence',
        element: <RequireAuth><RequireAgreement><LBSFenceView /></RequireAgreement></RequireAuth>,
      },
      {
        path: '/equipments/:id',
        element: <RequireAuth><RequireAgreement><EquipmentDetailView /></RequireAgreement></RequireAuth>,
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
            path: 'equipments',
            element: <RequireAgreement><EquipmentsView /></RequireAgreement>, // 交易区，强制拦截
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
