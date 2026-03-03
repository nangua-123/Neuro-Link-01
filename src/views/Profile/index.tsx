// File: src/views/Profile/index.tsx
import React, { useState } from 'react';
import { Card, List, Switch, Avatar, Toast } from 'antd-mobile';
import { SetOutline, RightOutline, LockOutline, FileOutline, ScanCodeOutline, AppOutline } from 'antd-mobile-icons';
import { useNavigate } from 'react-router-dom';

export default function ProfileView() {
  const navigate = useNavigate();
  const [isDataAuthorized, setIsDataAuthorized] = useState(true);

  const handleAuthChange = (checked: boolean) => {
    setIsDataAuthorized(checked);
    if (checked) {
      Toast.show({
        icon: 'success',
        content: '已开启数据授权',
      });
    } else {
      Toast.show({
        content: '已关闭数据授权',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-20">
      {/* 顶部用户信息区 */}
      <div className="bg-white px-6 pt-12 pb-8 shadow-sm mb-4">
        <div className="flex items-center">
          <Avatar 
            src="" 
            style={{ '--size': '64px', '--border-radius': '50%' }} 
            className="bg-gradient-to-br from-blue-100 to-blue-200 border-2 border-white shadow-sm"
          />
          <div className="ml-4 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">138****5920</h1>
              <span className="bg-[#1677FF] text-white text-[10px] px-2 py-0.5 rounded-full font-medium tracking-wider">
                VIP
              </span>
            </div>
            <p className="text-xs text-gray-500">Neuro-Link 脑健康守护者</p>
          </div>
          <SetOutline className="text-gray-400 text-xl" onClick={() => Toast.show('设置')} />
        </div>
      </div>

      <div className="px-4 flex-1 overflow-y-auto">
        {/* 数据资产与授权区（核心） */}
        <Card className="shadow-sm border-none rounded-2xl bg-white mb-4 overflow-hidden p-0">
          <div className="p-4 border-b border-gray-50 flex items-center gap-2 bg-gray-50/50">
            <LockOutline className="text-[#1677FF] text-lg" />
            <span className="text-sm font-semibold text-gray-900">数据资产与隐私安全</span>
          </div>
          <div className="p-5">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-800">授权脱敏数据用于医疗科研与新药研发</span>
              <Switch 
                checked={isDataAuthorized} 
                onChange={handleAuthChange}
                style={{
                  '--checked-color': '#00B578',
                  '--height': '24px',
                  '--width': '40px',
                }}
              />
            </div>
            <div 
              className={`text-xs leading-relaxed transition-colors ${isDataAuthorized ? 'text-emerald-600/80' : 'text-gray-400'}`}
            >
              您的授权将帮助医学界攻克脑神经难题，点击查看
              <span className="text-[#1677FF] ml-1 active:opacity-70" onClick={() => Toast.show('查看协议')}>
                《三方联合数据授权协议》
              </span>
            </div>
          </div>
        </Card>

        {/* 业务菜单列表 */}
        <List 
          className="shadow-sm rounded-2xl overflow-hidden" 
          style={{ '--border-inner': '1px solid #f3f4f6', '--border-top': 'none', '--border-bottom': 'none' }}
        >
          <List.Item 
            prefix={<FileOutline className="text-[#1677FF] text-xl mr-2" />}
            extra={<RightOutline className="text-gray-300" />}
            onClick={() => Toast.show('开发中')}
            className="text-sm font-medium text-gray-800 py-1"
          >
            我的完整健康档案 (EHR)
          </List.Item>
          <List.Item 
            prefix={<ScanCodeOutline className="text-indigo-500 text-xl mr-2" />}
            extra={<RightOutline className="text-gray-300" />}
            onClick={() => navigate('/neuropass')}
            className="text-sm font-medium text-gray-800 py-1"
          >
            我的 Neuro-Pass 专属码
          </List.Item>
          <List.Item 
            prefix={<AppOutline className="text-emerald-500 text-xl mr-2" />}
            extra={<RightOutline className="text-gray-300" />}
            onClick={() => navigate('/device')}
            className="text-sm font-medium text-gray-800 py-1"
          >
            设备与订单管理
          </List.Item>
        </List>
      </div>
    </div>
  );
}
