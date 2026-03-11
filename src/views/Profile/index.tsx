import React, { useState } from 'react';
import { useAppStore } from '../../store';
import { Switch, List, Toast, Modal, ActionSheet, Dialog } from 'antd-mobile';
import { Shield, User, QrCode, FileText, ChevronRight, LogOut, HeartPulse, Settings, Users, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import NeuroPassModal from '../../components/NeuroPassModal';
import FamilyBindingModal from './components/FamilyBindingModal';
import { UserIdentity } from '../../interfaces/user';
import { showComingSoon } from '../../utils/ui';

export default function ProfileView() {
  const { hasSignedAgreement, signAgreement, revokeAgreement, clearAuth, identity, setAuth, userToken, familyId, boundPatients, currentPatientId, switchPatient } = useAppStore();
  const navigate = useNavigate();
  const [isNeuroPassOpen, setIsNeuroPassOpen] = useState(false);
  const [isIdentitySheetVisible, setIsIdentitySheetVisible] = useState(false);
  const [isBindingModalVisible, setIsBindingModalVisible] = useState(false);

  const handleAuthChange = (checked: boolean) => {
    if (checked) {
      signAgreement();
      Toast.show({ content: '已开启数据授权，感谢您的贡献', icon: 'success' });
    } else {
      Dialog.confirm({
        title: '撤销授权确认',
        content: '撤销授权后，您将无法使用深度医学测评与专属管家服务，是否继续？',
        confirmText: '确认撤销',
        cancelText: '保持授权',
        onConfirm: () => {
          revokeAgreement();
          Toast.show({ content: '已关闭数据授权', icon: 'info' });
        },
      });
    }
  };

  const showAgreement = () => {
    Modal.alert({
      title: '三方电子联合数据授权协议',
      content: (
        <div className="h-64 overflow-y-auto text-sm text-slate-600 leading-relaxed font-medium">
          <p className="mb-2">尊敬的用户：</p>
          <p className="mb-2">感谢您使用华西脑健康（Neuro-Link）平台。为了给您提供更精准的 AI 疾病管家服务，我们需要收集并处理您的相关健康数据。</p>
          <p className="mb-2">1. 数据收集范围：包括但不限于您的基础体征数据（如心率、睡眠）、认知与行为测评结果、用药记录等。</p>
          <p className="mb-2">2. 数据使用目的：仅用于为您提供个性化的干预方案、风险预警以及华西专病团队的在线复诊参考。</p>
          <p className="mb-2">3. 数据保护：我们将采用金融级加密技术保障您的数据安全，绝不向任何未经授权的第三方泄露。</p>
          <p>您随时可以在“个人中心”撤销此授权。撤销后，相关深度服务将暂停提供。</p>
        </div>
      ),
      confirmText: '我已了解',
    });
  };

  const handleLogout = () => {
    Modal.confirm({
      content: '确定要退出登录吗？',
      onConfirm: () => {
        clearAuth();
        navigate('/login', { replace: true });
        Toast.show({ content: '已退出登录', icon: 'success' });
      },
    });
  };

  const handleIdentitySwitch = (newIdentity: UserIdentity) => {
    if (newIdentity === identity) return;
    
    if (newIdentity === UserIdentity.FAMILY && (!boundPatients || boundPatients.length === 0)) {
      setIsBindingModalVisible(true);
    } else {
      setAuth(userToken || 'mock_token', newIdentity, familyId || undefined);
      Toast.show({ content: `已切换至${newIdentity === UserIdentity.PATIENT ? '患者' : '家属'}视角`, icon: 'success' });
    }
    setIsIdentitySheetVisible(false);
  };

  const identityActions = [
    { text: '我是患者本人', key: UserIdentity.PATIENT, disabled: identity === UserIdentity.PATIENT },
    { text: '我是家属/照护者', key: UserIdentity.FAMILY, disabled: identity === UserIdentity.FAMILY },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  const currentPatient = boundPatients?.find(p => p.id === currentPatientId);

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col relative overflow-hidden pb-24">
      {/* 极浅弥散暖色渐变背景 */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -right-[10%] w-[120%] h-[50%] bg-gradient-to-b from-[#E8F3FF] to-transparent opacity-60 blur-3xl" />
        <div className="absolute top-[20%] -left-[20%] w-[80%] h-[60%] bg-gradient-to-tr from-[#FFF0E6] to-transparent opacity-30 blur-3xl" />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="p-5 relative z-10 pt-12"
      >
        {/* Module A: Header */}
        <motion.div variants={itemVariants} className="bg-white rounded-[32px] p-6 mb-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100/50 flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
          
          <div className="flex items-center gap-5 relative z-10">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center text-blue-600 shadow-inner border border-blue-100/50 overflow-hidden">
                {identity === UserIdentity.FAMILY && currentPatient?.avatarUrl ? (
                  <img src={currentPatient.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 opacity-80" />
                )}
              </div>
              <div 
                onClick={() => setIsIdentitySheetVisible(true)}
                className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full shadow-sm border border-slate-100 flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
              >
                <Users className="w-3.5 h-3.5 text-blue-600" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-[20px] font-bold text-slate-900 tracking-tight">
                  {identity === UserIdentity.FAMILY && currentPatient ? currentPatient.name : '138****5920'}
                </h2>
                <span className="px-2 py-0.5 bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 text-[10px] font-bold rounded-[8px] border border-amber-200/50 shadow-sm">VIP</span>
              </div>
              <p className="text-[13px] text-slate-500 font-medium flex items-center gap-1">
                当前视角: <span className="text-blue-600 font-semibold">{identity === UserIdentity.PATIENT ? '患者本人' : '家属/照护者'}</span>
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-300 relative z-10" />
        </motion.div>

        {/* Module A.1: Family Management (Only visible if identity is FAMILY) */}
        {identity === UserIdentity.FAMILY && (
          <motion.div variants={itemVariants} className="bg-white rounded-[28px] p-4 mb-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100/50">
            <div className="flex items-center justify-between mb-3 px-2">
              <h3 className="font-semibold text-slate-900 text-[15px] tracking-tight">照护对象管理</h3>
              <button 
                onClick={() => setIsBindingModalVisible(true)}
                className="text-blue-600 text-[13px] font-semibold flex items-center gap-1 bg-blue-50/50 px-3 py-1.5 rounded-full active:bg-blue-100/50 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> 绑定长辈
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 px-2 snap-x">
              {boundPatients?.map(patient => (
                <div 
                  key={patient.id}
                  onClick={() => switchPatient(patient.id)}
                  className={`flex-shrink-0 w-24 p-3 rounded-[20px] border flex flex-col items-center gap-2 snap-center transition-all ${
                    currentPatientId === patient.id 
                      ? 'bg-blue-50 border-blue-200 shadow-sm' 
                      : 'bg-slate-50 border-slate-100 opacity-70 active:opacity-100'
                  }`}
                >
                  <img src={patient.avatarUrl} alt={patient.name} className="w-10 h-10 rounded-full bg-white shadow-sm" />
                  <div className="text-center">
                    <div className="text-[13px] font-bold text-slate-900 leading-tight">{patient.name}</div>
                    <div className="text-[10px] text-slate-500 font-medium">{patient.relation}</div>
                  </div>
                </div>
              ))}
              {(!boundPatients || boundPatients.length === 0) && (
                <div className="w-full py-4 text-center text-slate-400 text-[13px]">
                  暂无绑定的照护对象
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Module B: Data Privacy */}
        <motion.div variants={itemVariants} className="bg-white rounded-[28px] p-6 mb-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-600 rounded-[16px] shadow-sm border border-emerald-100/50">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 text-[16px] tracking-tight">数据资产与隐私安全</h3>
            </div>
            <Switch 
              checked={hasSignedAgreement} 
              onChange={handleAuthChange}
              style={{ '--checked-color': '#2563eb' }}
            />
          </div>
          <p className="text-[13px] text-slate-500 leading-relaxed mb-4 font-medium relative z-10">
            您的授权将帮助医学界攻克脑神经难题，并为您提供更精准的 AI 管家服务。
          </p>
          <button 
            onClick={showAgreement}
            className="text-[13px] text-blue-600 font-semibold flex items-center gap-1 active:opacity-70 transition-opacity relative z-10 bg-blue-50/50 px-3 py-1.5 rounded-full"
          >
            查看《三方电子联合数据授权协议》 <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </motion.div>

        {/* Module C: Asset List */}
        <motion.div variants={itemVariants} className="bg-white rounded-[28px] p-2 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100/50 overflow-hidden mb-6">
          <List className="border-none" style={{ '--border-inner': 'none', '--border-top': 'none', '--border-bottom': 'none' }}>
            <List.Item 
              prefix={
                <div className="w-10 h-10 rounded-[16px] bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center border border-blue-100/50 shadow-sm">
                  <QrCode className="w-5 h-5 text-blue-600" />
                </div>
              }
              onClick={() => setIsNeuroPassOpen(true)}
              arrow={<ChevronRight className="w-5 h-5 text-slate-300" />}
              className="active:bg-slate-50 transition-colors"
            >
              <div className="py-1.5">
                <div className="font-semibold text-slate-900 text-[15px] tracking-tight">我的 Neuro-Pass 专属码</div>
                <div className="text-[12px] text-slate-400 mt-0.5 font-medium">线下就诊扫码，免除口述病史</div>
              </div>
            </List.Item>
            <div className="h-[1px] bg-slate-100/50 mx-4" />
            <List.Item 
              prefix={
                <div className="w-10 h-10 rounded-[16px] bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center border border-indigo-100/50 shadow-sm">
                  <FileText className="w-5 h-5 text-indigo-600" />
                </div>
              }
              onClick={() => navigate('/ehr-timeline')}
              arrow={<ChevronRight className="w-5 h-5 text-slate-300" />}
              className="active:bg-slate-50 transition-colors"
            >
              <div className="py-1.5">
                <div className="font-semibold text-slate-900 text-[15px] tracking-tight">我的完整健康档案 (EHR)</div>
                <div className="text-[12px] text-slate-400 mt-0.5 font-medium">查看历史测评与打卡记录</div>
              </div>
            </List.Item>
            <div className="h-[1px] bg-slate-100/50 mx-4" />
            <List.Item 
              prefix={
                <div className="w-10 h-10 rounded-[16px] bg-gradient-to-br from-rose-50 to-orange-50 flex items-center justify-center border border-rose-100/50 shadow-sm">
                  <HeartPulse className="w-5 h-5 text-rose-500" />
                </div>
              }
              onClick={() => navigate('/device')}
              arrow={<ChevronRight className="w-5 h-5 text-slate-300" />}
              className="active:bg-slate-50 transition-colors"
            >
              <div className="py-1.5">
                <div className="font-semibold text-slate-900 text-[15px] tracking-tight">设备管理</div>
                <div className="text-[12px] text-slate-400 mt-0.5 font-medium">管理 Neuro-Band 等智能穿戴设备</div>
              </div>
            </List.Item>
            <div className="h-[1px] bg-slate-100/50 mx-4" />
            <List.Item 
              prefix={
                <div className="w-10 h-10 rounded-[16px] bg-gradient-to-br from-slate-50 to-gray-50 flex items-center justify-center border border-slate-200/50 shadow-sm">
                  <Settings className="w-5 h-5 text-slate-600" />
                </div>
              }
              onClick={() => showComingSoon('系统设置', '通知、账号与通用设置功能即将开放。')}
              arrow={<ChevronRight className="w-5 h-5 text-slate-300" />}
              className="active:bg-slate-50 transition-colors"
            >
              <div className="py-1.5">
                <div className="font-semibold text-slate-900 text-[15px] tracking-tight">系统设置</div>
                <div className="text-[12px] text-slate-400 mt-0.5 font-medium">通知、账号与通用设置</div>
              </div>
            </List.Item>
          </List>
        </motion.div>

        {/* Module D: Logout */}
        <motion.div variants={itemVariants}>
          <button 
            onClick={handleLogout}
            className="w-full bg-white rounded-full p-4 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100/50 flex items-center justify-center gap-2 text-rose-500 font-semibold active:bg-rose-50 transition-colors tracking-wide"
          >
            <LogOut className="w-5 h-5" />
            退出登录
          </button>
        </motion.div>
      </motion.div>

      <NeuroPassModal 
        visible={isNeuroPassOpen} 
        onClose={() => setIsNeuroPassOpen(false)} 
      />

      <FamilyBindingModal
        visible={isBindingModalVisible}
        onClose={() => {
          setIsBindingModalVisible(false);
          // 如果绑定成功且身份还是 PATIENT，则切换到 FAMILY
          if (boundPatients && boundPatients.length > 0 && identity !== UserIdentity.FAMILY) {
            setAuth(userToken || 'mock_token', UserIdentity.FAMILY, familyId || undefined);
          }
        }}
      />

      <ActionSheet
        visible={isIdentitySheetVisible}
        actions={identityActions}
        onClose={() => setIsIdentitySheetVisible(false)}
        onAction={(action) => handleIdentitySwitch(action.key as UserIdentity)}
        cancelText="取消"
        className="font-medium"
      />
    </div>
  );
}
