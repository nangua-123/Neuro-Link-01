// File: src/views/Mall/index.tsx
import React, { useState } from 'react';
import { NavBar, Card, Button, List, Toast, SafeArea } from 'antd-mobile';
import { CheckCircleFill, GiftOutline, LockOutline, HeartOutline } from 'antd-mobile-icons';
import { useNavigate } from 'react-router-dom';
import { ServicePackage } from '../../interfaces/mall_device';

export default function MallView() {
  const navigate = useNavigate();
  const [isSubscribing, setIsSubscribing] = useState(false);

  // Mock 软硬一体化服务包
  const mockPackage: ServicePackage = {
    packageId: 'pkg_epilepsy_pro',
    title: '癫痫生命守护包',
    price: 599,
    duration: '1年',
    includedHardware: 'Neuro-Band Pro (长虹医疗定制版)',
    privileges: [
      '7x24小时异常放电预警与自动呼救',
      '3次三甲医院专属绿通服务',
      '专属神经内科健康管家 1V1',
      'AI 脑电波趋势月度分析报告'
    ]
  };

  const handleSubscribe = () => {
    setIsSubscribing(true);
    setTimeout(() => {
      setIsSubscribing(false);
      Toast.show({
        icon: 'success',
        content: '支付成功，硬件已安排发货',
        duration: 2000,
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar onBack={() => navigate(-1)} className="bg-white border-b border-gray-100">
        Neuro-Link 服务订阅
      </NavBar>
      
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="mb-6 mt-2 text-center">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">全天候的脑健康守护</h1>
          <p className="text-sm text-gray-500 mt-2">不仅是硬件，更是专业的医疗级服务闭环</p>
        </div>

        <Card className="w-full shadow-md border-none rounded-2xl bg-white overflow-hidden p-0">
          {/* 头部高亮区 */}
          <div className="bg-gradient-to-br from-[#1677FF] to-[#0A52C6] p-6 text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="text-sm font-medium opacity-80 mb-1">PRO SUBSCRIPTION</div>
              <h2 className="text-2xl font-bold tracking-tight mb-4">{mockPackage.title}</h2>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold">¥{mockPackage.price}</span>
                <span className="text-sm opacity-80 ml-1">/{mockPackage.duration}</span>
              </div>
            </div>
            {/* 装饰性背景 */}
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl" />
          </div>

          {/* 硬件附赠区 */}
          <div className="p-5 bg-blue-50/50 border-b border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1677FF]/10 flex items-center justify-center text-[#1677FF]">
              <GiftOutline fontSize={20} />
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-0.5">订阅即免费配发</div>
              <div className="text-sm font-medium text-gray-900">{mockPackage.includedHardware}</div>
            </div>
          </div>

          {/* 特权列表区 */}
          <div className="p-2">
            <List className="border-none" style={{ '--border-inner': 'none', '--border-top': 'none', '--border-bottom': 'none' }}>
              {mockPackage.privileges.map((privilege, index) => (
                <List.Item 
                  key={index}
                  prefix={<CheckCircleFill className="text-[#1677FF] text-lg" />}
                  className="text-sm text-gray-700"
                >
                  {privilege}
                </List.Item>
              ))}
            </List>
          </div>
        </Card>

        <div className="mt-8 px-2">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mb-4">
            <LockOutline />
            <span>医疗级数据加密 · 随时可取消订阅</span>
          </div>
          <Button 
            block 
            color="primary" 
            size="large" 
            loading={isSubscribing}
            onClick={handleSubscribe}
            className="rounded-xl font-medium shadow-sm h-12"
          >
            立即订阅
          </Button>
        </div>
      </div>
      <SafeArea position="bottom" />
    </div>
  );
}
