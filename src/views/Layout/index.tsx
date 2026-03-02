// File: src/views/Layout/index.tsx
import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { TabBar } from 'antd-mobile';
import {
  MessageOutline,
  HeartOutline,
  ShopbagOutline,
  UserOutline,
} from 'antd-mobile-icons';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    {
      key: '/',
      title: '预问诊',
      icon: <MessageOutline />,
    },
    {
      key: '/manager',
      title: '居家管家',
      icon: <HeartOutline />,
    },
    {
      key: '/mall',
      title: '商城',
      icon: <ShopbagOutline />,
    },
    {
      key: '/profile',
      title: '档案',
      icon: <UserOutline />,
    },
  ];

  return (
    <div className="flex flex-col h-screen w-full max-w-md mx-auto bg-gray-50 relative overflow-hidden shadow-2xl">
      <div className="flex-1 overflow-y-auto pb-safe">
        <Outlet />
      </div>
      <div className="bg-white border-t border-gray-100 pb-safe">
        <TabBar activeKey={location.pathname} onChange={value => navigate(value)}>
          {tabs.map(item => (
            <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
          ))}
        </TabBar>
      </div>
    </div>
  );
}
