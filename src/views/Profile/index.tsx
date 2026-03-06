import React, { useState } from 'react';
import { useAppStore } from '../../store';
import { Switch, List, Toast } from 'antd-mobile';
import { Shield, User, QrCode, FileText, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NeuroPassModal from '../../components/NeuroPassModal';

export default function ProfileView() {
  const { hasSignedAgreement, signAgreement, revokeAgreement } = useAppStore();
  const navigate = useNavigate();
  const [isNeuroPassOpen, setIsNeuroPassOpen] = useState(false);

  const handleAuthChange = (checked: boolean) => {
    if (checked) {
      signAgreement();
      Toast.show({ content: '已开启数据授权，感谢您的贡献', icon: 'success' });
    } else {
      revokeAgreement();
      Toast.show({ content: '已关闭数据授权', icon: 'info' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 pb-24">
      {/* Module A: Header */}
      <div className="bg-white rounded-[32px] p-8 mb-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100/80 flex items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
          <User className="w-8 h-8" />
        </div>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-xl font-semibold text-slate-900">138****5920</h2>
            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">VIP</span>
          </div>
          <p className="text-sm text-slate-500">Neuro-Link 脑健康守护者</p>
        </div>
      </div>

      {/* Module B: Data Privacy */}
      <div className="bg-white rounded-[32px] p-6 mb-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100/80">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900">数据资产与隐私安全</h3>
          </div>
          <Switch 
            checked={hasSignedAgreement} 
            onChange={handleAuthChange}
            style={{ '--checked-color': '#1677FF' }}
          />
        </div>
        <p className="text-sm text-slate-500 leading-relaxed mb-3">
          您的授权将帮助医学界攻克脑神经难题。
        </p>
        <button className="text-sm text-blue-600 font-medium flex items-center gap-1">
          查看《三方电子联合数据授权协议》 <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Module C: Asset List */}
      <div className="bg-white rounded-[32px] p-2 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100/80">
        <List className="border-none">
          <List.Item 
            prefix={<QrCode className="w-6 h-6 text-blue-500" />}
            onClick={() => setIsNeuroPassOpen(true)}
            arrow={<ChevronRight className="w-5 h-5 text-slate-400" />}
          >
            <div className="py-2">
              <div className="font-medium text-slate-900">我的 Neuro-Pass 专属码</div>
              <div className="text-xs text-slate-400 mt-0.5">线下就诊扫码，免除口述病史</div>
            </div>
          </List.Item>
          <List.Item 
            prefix={<FileText className="w-6 h-6 text-purple-500" />}
            onClick={() => navigate('/ehr-timeline')}
            arrow={<ChevronRight className="w-5 h-5 text-slate-400" />}
          >
            <div className="py-2">
              <div className="font-medium text-slate-900">我的完整健康档案 (EHR)</div>
              <div className="text-xs text-slate-400 mt-0.5">查看历史测评与打卡记录</div>
            </div>
          </List.Item>
        </List>
      </div>

      <NeuroPassModal 
        visible={isNeuroPassOpen} 
        onClose={() => setIsNeuroPassOpen(false)} 
      />
    </div>
  );
}
