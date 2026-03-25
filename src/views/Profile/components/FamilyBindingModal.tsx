import React, { useState } from 'react';
import { Modal, Input, Button, Toast } from 'antd-mobile';
import { Scan, KeyRound, Sparkles } from 'lucide-react';
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
      bodyClassName="rounded-[32px] overflow-hidden p-0"
      content={
        <div className="relative overflow-hidden bg-white">
          {/* Soft Diffuse Background */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
            <div className="absolute -top-[20%] -right-[20%] w-[140%] h-[60%] bg-gradient-to-b from-blue-100/60 to-transparent opacity-80 blur-3xl" />
            <div className="absolute bottom-[0%] -left-[20%] w-[100%] h-[50%] bg-gradient-to-tr from-indigo-50/40 to-transparent opacity-60 blur-2xl" />
          </div>

          <div className="flex flex-col items-center pt-8 pb-6 px-6 relative z-10">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-[24px] flex items-center justify-center mb-5 border border-blue-100/50 shadow-sm relative">
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm border border-blue-100/50">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <KeyRound className="w-10 h-10 text-blue-600" />
            </div>
            
            <h3 className="text-[22px] font-bold text-slate-900 mb-2.5 tracking-tight">绑定长辈账号</h3>
            <p className="text-[14px] text-slate-500 text-center mb-8 leading-relaxed font-medium px-2">
              输入长辈手机上的 Neuro-Pass 专属码，或直接扫描二维码进行绑定，开启全天候照护。
            </p>

            <div className="w-full space-y-5">
              <div className="relative">
                <Input
                  placeholder="请输入 6 位专属码"
                  value={passCode}
                  onChange={val => setPassCode(val.toUpperCase())}
                  maxLength={6}
                  clearable
                  className="bg-slate-50/80 border border-slate-200/80 rounded-[20px] px-5 py-4 text-[18px] text-center tracking-[0.2em] font-mono font-bold focus:bg-white focus:border-blue-400 transition-colors shadow-inner"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button 
                  block 
                  className="flex-1 bg-white text-slate-700 border border-slate-200/80 rounded-[20px] font-bold h-12 shadow-sm active:bg-slate-50 transition-colors"
                  onClick={handleScan}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Scan className="w-4.5 h-4.5" />
                    扫码绑定
                  </div>
                </Button>
                <Button 
                  block 
                  className="flex-1 rounded-[20px] font-bold h-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-none shadow-[0_8px_20px_rgba(37,99,235,0.25)] active:scale-[0.98] transition-transform"
                  onClick={handleBind}
                  loading={isSubmitting}
                >
                  确认绑定
                </Button>
              </div>
            </div>
          </div>
        </div>
      }
    />
  );
}
