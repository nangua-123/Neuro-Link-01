import React from 'react';
import { useAppStore } from '../../store';
import { Switch, List, Toast } from 'antd-mobile';
import { Shield, User, QrCode, FileText, ChevronRight } from 'lucide-react';

export default function ArchiveView() {
  const { hasSignedAgreement, signAgreement, revokeAgreement } = useAppStore();

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
    <div className="min-h-screen bg-[#FAFAFA] p-5 pb-24">
      {/* Module A: Header */}
      <div className="bg-white rounded-[32px] p-6 mb-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100/50 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
          <User className="w-8 h-8 opacity-80" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-[20px] font-semibold text-slate-900 tracking-tight">138****5920</h2>
            <span className="px-2 py-0.5 bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 text-[11px] font-bold rounded-[8px] border border-amber-200/50">VIP</span>
          </div>
          <p className="text-[13px] text-slate-500 font-medium">Neuro-Link 脑健康守护者</p>
        </div>
      </div>

      {/* Module B: Data Privacy */}
      <div className="bg-white rounded-[28px] p-6 mb-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-[16px]">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 text-[16px]">数据资产与隐私安全</h3>
          </div>
          <Switch 
            checked={hasSignedAgreement} 
            onChange={handleAuthChange}
            style={{ '--checked-color': '#2563eb' }}
          />
        </div>
        <p className="text-[13px] text-slate-500 leading-relaxed mb-4">
          您的授权将帮助医学界攻克脑神经难题。
        </p>
        <button className="text-[13px] text-blue-600 font-medium flex items-center gap-1 active:opacity-70 transition-opacity">
          查看《三方电子联合数据授权协议》 <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Module C: Asset List */}
      <div className="bg-white rounded-[28px] p-2 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100/50 overflow-hidden">
        <List className="border-none" style={{ '--border-inner': 'none', '--border-top': 'none', '--border-bottom': 'none' }}>
          <List.Item 
            prefix={
              <div className="w-10 h-10 rounded-[16px] bg-blue-50 flex items-center justify-center">
                <QrCode className="w-5 h-5 text-blue-600" />
              </div>
            }
            onClick={() => Toast.show('建设中...')}
            arrow={<ChevronRight className="w-5 h-5 text-slate-300" />}
            className="active:bg-slate-50 transition-colors"
          >
            <div className="py-1">
              <div className="font-medium text-slate-900 text-[15px]">我的 Neuro-Pass 专属码</div>
              <div className="text-[12px] text-slate-400 mt-1">线下就诊扫码，免除口述病史</div>
            </div>
          </List.Item>
          <div className="h-[1px] bg-slate-100/50 mx-4" />
          <List.Item 
            prefix={
              <div className="w-10 h-10 rounded-[16px] bg-indigo-50 flex items-center justify-center">
                <FileText className="w-5 h-5 text-indigo-600" />
              </div>
            }
            onClick={() => Toast.show('建设中...')}
            arrow={<ChevronRight className="w-5 h-5 text-slate-300" />}
            className="active:bg-slate-50 transition-colors"
          >
            <div className="py-1">
              <div className="font-medium text-slate-900 text-[15px]">我的完整健康档案 (EHR)</div>
              <div className="text-[12px] text-slate-400 mt-1">查看历史测评与打卡记录</div>
            </div>
          </List.Item>
        </List>
      </div>
    </div>
  );
}
