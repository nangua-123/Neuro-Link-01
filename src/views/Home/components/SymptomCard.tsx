// File: src/views/Home/components/SymptomCard.tsx
import React, { useState } from 'react';
import { Button, Toast } from 'antd-mobile';
import { useAppStore } from '../../../store';
import { AgreementPopup } from '../../../components/AgreementPopup';
import { useNavigate } from 'react-router-dom';

export const SymptomCard: React.FC = () => {
  const { hasSignedAgreement } = useAppStore();
  const [showAgreement, setShowAgreement] = useState(false);
  const navigate = useNavigate();

  // 核心流转逻辑：点击 1 元支付按钮时的 JIT 拦截
  const handlePayClick = () => {
    if (!hasSignedAgreement) {
      // 未签署，弹出协议抽屉
      setShowAgreement(true);
    } else {
      // 已签署，直接进入支付流
      proceedToPay();
    }
  };

  const proceedToPay = () => {
    Toast.show({
      icon: 'loading',
      content: '调起微信支付...',
      duration: 1000,
      afterClose: () => {
        Toast.show({ icon: 'success', content: '支付成功，即将下发量表' });
        // 支付成功后，跳转至深度测评页
        navigate('/assessment');
      }
    });
  };

  return (
    <>
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-red-100 mx-4 my-2 animate-fade-in">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-gray-900">初步症状提取图谱</h3>
          <span className="bg-red-50 text-red-500 text-xs px-2 py-1 rounded-md font-medium">高危预警</span>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5"></div>
            <p className="text-sm text-gray-700">症状库匹配到 <span className="font-bold text-red-500">3</span> 个高度疑似偏头痛标签</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5"></div>
            <p className="text-sm text-gray-700">伴随畏光、恶心等典型特征</p>
          </div>
        </div>

        <div className="bg-gray-50 p-3 rounded-xl mb-4">
          <p className="text-xs text-gray-500 leading-relaxed">
            您的症状指向偏头痛高风险，建议立即获取华西标准的深度医学测评与 AI 风险解析。
          </p>
        </div>

        <Button 
          block 
          color="primary" 
          className="rounded-xl font-bold shadow-md shadow-blue-500/20"
          onClick={handlePayClick}
        >
          支付 1 元获取深度测评与解析
        </Button>
      </div>

      <AgreementPopup 
        visible={showAgreement} 
        onClose={() => setShowAgreement(false)} 
        onConfirm={() => {
          setShowAgreement(false);
          proceedToPay();
        }} 
      />
    </>
  );
};
