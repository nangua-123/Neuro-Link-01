import React, { useState, useEffect } from 'react';
import { NavBar, Button, Toast, SafeArea } from 'antd-mobile';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronLeft, CheckCircle2, ShieldCheck, Lock } from 'lucide-react';

export default function DeviceAuthView() {
  const navigate = useNavigate();
  const { appId } = useParams();
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const appNames: Record<string, string> = {
    apple: 'Apple Health',
    huawei: '华为运动健康',
    xiaomi: '小米健康',
    oppo: 'OPPO 健康',
  };

  const appName = appNames[appId || ''] || '健康应用';

  const handleAuthorize = () => {
    setIsAuthorizing(true);
    setTimeout(() => {
      setIsAuthorizing(false);
      setIsSuccess(true);
      Toast.show({ icon: 'success', content: '授权成功' });
      setTimeout(() => {
        navigate('/device');
      }, 1500);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <NavBar 
        onBack={() => navigate(-1)}
        backArrow={<ChevronLeft className="w-6 h-6 text-slate-700" />}
        className="border-b border-slate-50"
      >
        <span className="font-medium text-slate-900">应用授权</span>
      </NavBar>

      <div className="flex-1 flex flex-col items-center p-8 pt-16">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center gap-6 mb-12"
        >
          <div className="w-20 h-20 rounded-[24px] bg-blue-600 shadow-lg shadow-blue-200 flex items-center justify-center text-white">
            <span className="text-2xl font-bold italic">N</span>
          </div>
          <div className="w-4 h-4 flex items-center justify-center">
            <div className="w-full h-[2px] bg-slate-200 relative">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-300" />
            </div>
          </div>
          <div className="w-20 h-20 rounded-[24px] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
            <ShieldCheck className="w-10 h-10" />
          </div>
        </motion.div>

        <h1 className="text-[22px] font-bold text-slate-900 mb-4 text-center">
          同意将数据授权给【Neuro-Link】
        </h1>
        
        <p className="text-[14px] text-slate-500 text-center mb-12 leading-relaxed px-4">
          授权后，我们将同步您的步数、心率、睡眠等基础体征数据，为您提供更精准的脑健康干预建议。
        </p>

        <div className="w-full space-y-6 mb-12">
          <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-[20px] border border-slate-100">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="text-[14px] font-bold text-slate-900 mb-1">隐私安全保障</h3>
              <p className="text-[12px] text-slate-500 leading-relaxed">
                您的数据将经过金融级加密处理，仅用于医疗科研与个人健康管理。
              </p>
            </div>
          </div>
          
          <div className="space-y-3 px-2">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span className="text-[13px] text-slate-600 font-medium">同步每日活动步数与热量消耗</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span className="text-[13px] text-slate-600 font-medium">同步睡眠时长与深度分期数据</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span className="text-[13px] text-slate-600 font-medium">同步实时心率与静息心率趋势</span>
            </div>
          </div>
        </div>

        <div className="w-full mt-auto">
          <Button
            block
            color="primary"
            loading={isAuthorizing}
            onClick={handleAuthorize}
            className="h-14 rounded-[28px] text-[16px] font-bold shadow-lg shadow-blue-200"
          >
            {isSuccess ? '授权成功' : '同意并授权'}
          </Button>
          <button 
            onClick={() => navigate(-1)}
            className="w-full py-4 text-slate-400 text-[14px] font-medium active:text-slate-600 transition-colors"
          >
            拒绝授权
          </button>
        </div>
      </div>
      <SafeArea position="bottom" />
    </div>
  );
}
