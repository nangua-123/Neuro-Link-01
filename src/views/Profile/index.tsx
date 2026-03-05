import React, { useState } from 'react';
import { useAppStore } from '../../store';
import { Switch, List, Toast, Popup } from 'antd-mobile';
import { Shield, User, QrCode, FileText, ChevronRight, ScanLine, RefreshCw, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

export default function ProfileView() {
  const { hasSignedAgreement, signAgreement, revokeAgreement } = useAppStore();
  const navigate = useNavigate();
  const [isNeuroPassOpen, setIsNeuroPassOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleAuthChange = (checked: boolean) => {
    if (checked) {
      signAgreement();
      Toast.show({ content: '已开启数据授权，感谢您的贡献', icon: 'success' });
    } else {
      revokeAgreement();
      Toast.show({ content: '已关闭数据授权', icon: 'info' });
    }
  };

  const handleRefreshQR = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
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

      {/* Neuro-Pass Modal */}
      <Popup
        visible={isNeuroPassOpen}
        onMaskClick={() => setIsNeuroPassOpen(false)}
        bodyStyle={{
          borderTopLeftRadius: '32px',
          borderTopRightRadius: '32px',
          minHeight: '60vh',
          backgroundColor: '#F8FAFC',
        }}
      >
        <div className="p-8 flex flex-col items-center relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none" />
          
          <div className="w-12 h-1.5 bg-slate-200 rounded-full mb-8" />
          
          <h2 className="text-2xl font-semibold text-slate-900 mb-2 tracking-tight">Neuro-Pass 专属就诊码</h2>
          <p className="text-sm text-slate-500 mb-8 text-center px-4 leading-relaxed">
            凭此码前往协作医院，医生扫码即可读取华西 AI 评估报告，免去您反复口述病史的烦恼。
          </p>

          <div className="relative bg-white p-8 rounded-[40px] shadow-[0_20px_40px_rgb(22,119,255,0.1)] border border-blue-100 mb-8">
            {/* Scanning animation overlay */}
            <motion.div 
              animate={{ y: [0, 200, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 right-0 h-0.5 bg-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.8)] z-10"
              style={{ top: '24px' }}
            />
            
            <motion.div
              animate={{ rotate: isRefreshing ? 360 : 0, scale: isRefreshing ? 0.9 : 1 }}
              transition={{ duration: 0.5 }}
              className="relative w-48 h-48 flex items-center justify-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200"
            >
              <QrCode className="w-32 h-32 text-slate-800" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </motion.div>
            
            {/* Corner brackets */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-4 border-l-4 border-blue-500 rounded-tl-xl" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-4 border-r-4 border-blue-500 rounded-tr-xl" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-4 border-l-4 border-blue-500 rounded-bl-xl" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-4 border-r-4 border-blue-500 rounded-br-xl" />
          </div>

          <div className="flex items-center gap-4 w-full max-w-xs">
            <button 
              onClick={handleRefreshQR}
              className="flex-1 py-3.5 bg-blue-50 text-blue-600 rounded-2xl font-medium flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              刷新动态码
            </button>
            <button 
              onClick={() => Toast.show('已保存到相册')}
              className="flex-1 py-3.5 bg-slate-900 text-white rounded-2xl font-medium flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <Download className="w-4 h-4" />
              保存到相册
            </button>
          </div>
        </div>
      </Popup>
    </div>
  );
}
