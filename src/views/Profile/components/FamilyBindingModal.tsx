import React, { useState } from 'react';
import { Modal, Input, Button, Toast } from 'antd-mobile';
import { Scan, KeyRound } from 'lucide-react';
import { useAppStore } from '../../../store';
import { DiseaseTag } from '../../../configs/constants';

interface FamilyBindingModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function FamilyBindingModal({ visible, onClose }: FamilyBindingModalProps) {
  const { bindPatient } = useAppStore();
  const [passCode, setPassCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBind = async () => {
    if (!passCode || passCode.length < 6) {
      Toast.show({ content: '请输入有效的 6 位 Neuro-Pass 专属码' });
      return;
    }

    setIsSubmitting(true);
    
    // 模拟网络请求
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 模拟绑定成功，生成一个假的患者画像
    const mockPatient = {
      id: `patient_${Date.now()}`,
      name: '张建国',
      relation: '父亲',
      diseaseTag: DiseaseTag.AD,
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
    };

    bindPatient(mockPatient);
    setIsSubmitting(false);
    Toast.show({ content: '绑定成功！已切换至长辈视角', icon: 'success' });
    onClose();
    setPassCode('');
  };

  const handleScan = () => {
    Toast.show({ content: '正在调用摄像头扫码...', icon: 'loading' });
    setTimeout(() => {
      setPassCode('NL8829'); // 模拟扫码填入
      Toast.show({ content: '扫码成功' });
    }, 1500);
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      closeOnMaskClick
      content={
        <div className="flex flex-col items-center pt-4 pb-2">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 border border-blue-100/50 shadow-sm">
            <KeyRound className="w-8 h-8 text-blue-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">绑定长辈账号</h3>
          <p className="text-[13px] text-slate-500 text-center mb-6 leading-relaxed">
            输入长辈手机上的 Neuro-Pass 专属码，或直接扫描二维码进行绑定，开启全天候照护。
          </p>

          <div className="w-full space-y-4">
            <div className="relative">
              <Input
                placeholder="请输入 6 位专属码"
                value={passCode}
                onChange={val => setPassCode(val.toUpperCase())}
                maxLength={6}
                clearable
                className="bg-slate-50/80 border border-slate-200 rounded-[16px] px-4 py-3 text-[16px] text-center tracking-widest font-mono focus:bg-white focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="flex gap-3">
              <Button 
                block 
                className="flex-1 bg-slate-50 text-slate-700 border-slate-200 rounded-[16px] font-medium"
                onClick={handleScan}
              >
                <div className="flex items-center justify-center gap-2">
                  <Scan className="w-4 h-4" />
                  扫码绑定
                </div>
              </Button>
              <Button 
                block 
                color="primary" 
                className="flex-1 rounded-[16px] font-medium shadow-[0_4px_12px_rgba(37,99,235,0.2)]"
                onClick={handleBind}
                loading={isSubmitting}
              >
                确认绑定
              </Button>
            </div>
          </div>
        </div>
      }
    />
  );
}
