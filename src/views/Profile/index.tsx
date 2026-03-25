import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store';
import { Switch, List, Toast, Modal, ActionSheet, Dialog } from 'antd-mobile';
import { Shield, User, QrCode, FileText, ChevronRight, LogOut, HeartPulse, Settings, Users, Plus, Activity, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import NeuroPassModal from '../../components/NeuroPassModal';
import FamilyBindingModal from './components/FamilyBindingModal';
import { DeviceManagerModal } from '../../components/DeviceManagerModal';
import { UserIdentity } from '../../interfaces/user';
import { showComingSoon } from '../../utils/ui';
import { ProfileSkeleton } from '../../components/ProfileSkeleton';

export default function ProfileView() {
  const { hasSignedAgreement, signAgreement, revokeAgreement, clearAuth, identity, setAuth, userToken, familyId, boundPatients, currentPatientId, switchPatient, connectedDevices } = useAppStore();
  const navigate = useNavigate();
  const [isNeuroPassOpen, setIsNeuroPassOpen] = useState(false);
  const [isIdentitySheetVisible, setIsIdentitySheetVisible] = useState(false);
  const [isBindingModalVisible, setIsBindingModalVisible] = useState(false);
  const [isDeviceManagerVisible, setIsDeviceManagerVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleDeviceClick = () => {
    if (connectedDevices.length > 0) {
      setIsDeviceManagerVisible(true);
    } else {
      navigate('/device-connect');
    }
  };

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
        <div className="h-64 overflow-y-auto text-[13px] text-slate-600 leading-relaxed font-medium">
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

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="bg-[#FAFAFA] flex flex-col relative overflow-x-hidden min-h-full pb-[calc(env(safe-area-inset-bottom)+20px)]">
      {/* Soft Diffuse Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-5%] left-[-10%] w-[70%] h-[40%] bg-blue-200/40 rounded-full blur-[80px]" />
        <div className="absolute top-[15%] right-[-10%] w-[60%] h-[40%] bg-indigo-200/30 rounded-full blur-[80px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[40%] bg-blue-100/40 rounded-full blur-[80px]" />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="px-5 pt-6 relative z-10"
      >
        {/* Module A: Header */}
        <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-xl rounded-[32px] p-6 mb-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-400/5 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none" />
          
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
                className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full shadow-md border border-slate-100 flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
              >
                <Users className="w-3.5 h-3.5 text-blue-600" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2.5 mb-1.5">
                <h2 className="text-[20px] font-bold text-slate-900 tracking-tight">
                  {identity === UserIdentity.FAMILY && currentPatient ? currentPatient.name : '138****5920'}
                </h2>
                <span className="px-2.5 py-0.5 bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 text-[11px] font-bold rounded-full border border-amber-200/50 shadow-sm">VIP</span>
              </div>
              <p className="text-[13px] text-slate-500 font-medium flex items-center gap-1.5">
                当前视角: <span className="text-blue-600 font-bold">{identity === UserIdentity.PATIENT ? '患者本人' : '家属/照护者'}</span>
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-300 relative z-10" />
        </motion.div>

        {/* Quick Actions Grid - High Density */}
        <motion.div variants={itemVariants} className="grid grid-cols-4 gap-3 mb-6">
          <button 
            onClick={() => setIsNeuroPassOpen(true)}
            className="bg-white/80 backdrop-blur-xl rounded-[24px] p-3 flex flex-col items-center justify-center gap-2 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-white active:scale-95 transition-transform"
          >
            <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100/50">
              <QrCode className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-[12px] font-bold text-slate-700">就诊码</span>
          </button>
          <button 
            onClick={() => navigate('/ehr-timeline')}
            className="bg-white/80 backdrop-blur-xl rounded-[24px] p-3 flex flex-col items-center justify-center gap-2 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-white active:scale-95 transition-transform"
          >
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100/50">
              <FileText className="w-5 h-5 text-indigo-600" />
            </div>
            <span className="text-[12px] font-bold text-slate-700">健康档案</span>
          </button>
          <button 
            onClick={handleDeviceClick}
            className="bg-white/80 backdrop-blur-xl rounded-[24px] p-3 flex flex-col items-center justify-center gap-2 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-white active:scale-95 transition-transform"
          >
            <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center border border-rose-100/50">
              <HeartPulse className="w-5 h-5 text-rose-500" />
            </div>
            <span className="text-[12px] font-bold text-slate-700">智能穿戴</span>
          </button>
          <button 
            onClick={() => navigate('/clinic-report')}
            className="bg-white/80 backdrop-blur-xl rounded-[24px] p-3 flex flex-col items-center justify-center gap-2 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-white active:scale-95 transition-transform"
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center border border-emerald-100/50">
              <Activity className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-[12px] font-bold text-slate-700">全景档案</span>
          </button>
        </motion.div>

        {/* Module A.1: Family Management (Only visible if identity is FAMILY) */}
        {identity === UserIdentity.FAMILY && (
          <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-xl rounded-[32px] p-5 mb-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
            <div className="flex items-center justify-between mb-4 relative z-10">
              <h3 className="font-bold text-slate-900 text-[16px] tracking-tight">照护对象管理</h3>
              <button 
                onClick={() => setIsBindingModalVisible(true)}
                className="text-blue-600 text-[13px] font-bold flex items-center gap-1.5 bg-blue-50/80 px-3.5 py-1.5 rounded-full active:bg-blue-100/80 transition-colors border border-blue-100/50"
              >
                <Plus className="w-3.5 h-3.5" /> 绑定长辈
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 snap-x relative z-10">
              {boundPatients?.map(patient => (
                <div 
                  key={patient.id}
                  onClick={() => switchPatient(patient.id)}
                  className={`flex-shrink-0 w-24 p-3 rounded-[24px] border flex flex-col items-center gap-2 snap-center transition-all ${
                    currentPatientId === patient.id 
                      ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-sm' 
                      : 'bg-white/50 border-slate-100 opacity-70 active:opacity-100'
                  }`}
                >
                  <img src={patient.avatarUrl} alt={patient.name} className="w-12 h-12 rounded-full bg-white shadow-sm border border-slate-100/50" />
                  <div className="text-center">
                    <div className="text-[13px] font-bold text-slate-900 leading-tight mb-0.5">{patient.name}</div>
                    <div className="text-[11px] text-slate-500 font-medium">{patient.relation}</div>
                  </div>
                </div>
              ))}
              {(!boundPatients || boundPatients.length === 0) && (
                <div className="w-full py-6 text-center text-slate-400 text-[13px] font-medium bg-slate-50/50 rounded-[24px] border border-slate-100/50">
                  暂无绑定的照护对象
                </div>
              )}
            </div>
            
            {boundPatients && boundPatients.length > 0 && (
              <div className="mt-4 relative z-10">
                <button
                  onClick={() => navigate('/clinic-report')}
                  className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100/50 rounded-[24px] p-4 flex items-center justify-between active:scale-[0.98] transition-transform shadow-sm"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-blue-100/50">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <div className="text-[15px] font-bold text-slate-800 mb-0.5">全景数字病历</div>
                      <div className="text-[12px] text-slate-500 font-medium">查看长辈全维度健康数据</div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-blue-300" />
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* Module A.2: My Caregivers (Only visible if identity is PATIENT) */}
        {identity === UserIdentity.PATIENT && (
          <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-xl rounded-[32px] p-5 mb-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
            <div className="flex items-center justify-between mb-4 relative z-10">
              <h3 className="font-bold text-slate-900 text-[16px] tracking-tight">我的照护者</h3>
              <button 
                onClick={() => setIsNeuroPassOpen(true)}
                className="text-blue-600 text-[13px] font-bold flex items-center gap-1.5 bg-blue-50/80 px-3.5 py-1.5 rounded-full active:bg-blue-100/80 transition-colors border border-blue-100/50"
              >
                <QrCode className="w-3.5 h-3.5" /> 邀请家属
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 snap-x relative z-10">
              {/* Mocking a bound caregiver if we have boundPatients (just for simulation) */}
              {boundPatients && boundPatients.length > 0 ? (
                <div className="flex-shrink-0 w-24 p-3 rounded-[24px] border border-blue-100/50 bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center gap-2 snap-center shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-blue-600 shadow-sm border border-blue-100/50">
                    <User className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <div className="text-[13px] font-bold text-slate-900 leading-tight mb-0.5">李阿姨</div>
                    <div className="text-[11px] text-slate-500 font-medium">女儿</div>
                  </div>
                </div>
              ) : (
                <div className="w-full py-6 text-center text-slate-400 text-[13px] font-medium bg-slate-50/50 rounded-[24px] border border-slate-100/50">
                  暂无绑定的照护者，点击右上角邀请
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Module C: Privacy & Settings */}
        <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-xl rounded-[32px] p-2 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white overflow-hidden mb-6 relative z-10">
          <List className="border-none" style={{ '--border-inner': 'none', '--border-top': 'none', '--border-bottom': 'none' }}>
            <List.Item 
              prefix={
                <div className="w-12 h-12 rounded-[20px] bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center border border-emerald-100/50 shadow-sm">
                  <Shield className="w-6 h-6 text-emerald-600" />
                </div>
              }
              extra={
                <Switch 
                  checked={hasSignedAgreement} 
                  onChange={handleAuthChange}
                  style={{ '--checked-color': '#10b981', '--width': '40px', '--height': '24px' }}
                />
              }
              className="active:bg-slate-50/50 transition-colors"
            >
              <div className="py-2">
                <div className="font-bold text-slate-900 text-[16px] tracking-tight mb-0.5">数据资产与隐私安全</div>
                <div 
                  className="text-[13px] text-blue-600 font-medium active:opacity-70 inline-flex items-center gap-1"
                  onClick={(e) => { e.stopPropagation(); showAgreement(); }}
                >
                  查看《授权协议》 <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            </List.Item>
            <div className="h-[1px] bg-slate-100/80 mx-5" />
            <List.Item 
              prefix={
                <div className="w-12 h-12 rounded-[20px] bg-gradient-to-br from-slate-50 to-gray-50 flex items-center justify-center border border-slate-200/50 shadow-sm">
                  <Settings className="w-6 h-6 text-slate-600" />
                </div>
              }
              onClick={() => showComingSoon('通用设置', '通知、账号与通用设置功能即将开放。')}
              arrow={<ChevronRight className="w-5 h-5 text-slate-300" />}
              className="active:bg-slate-50/50 transition-colors"
            >
              <div className="py-2">
                <div className="font-bold text-slate-900 text-[16px] tracking-tight mb-0.5">通用设置</div>
                <div className="text-[13px] text-slate-500 font-medium">通知、账号与通用设置</div>
              </div>
            </List.Item>
          </List>
        </motion.div>

        {/* Module D: Logout */}
        <motion.div variants={itemVariants} className="relative z-10">
          <button 
            onClick={handleLogout}
            className="w-full bg-white/80 backdrop-blur-xl rounded-full p-4 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white flex items-center justify-center gap-2 text-rose-500 font-bold active:bg-rose-50 transition-colors tracking-wide text-[15px]"
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

      <DeviceManagerModal 
        visible={isDeviceManagerVisible} 
        onClose={() => setIsDeviceManagerVisible(false)} 
      />
    </div>
  );
}
