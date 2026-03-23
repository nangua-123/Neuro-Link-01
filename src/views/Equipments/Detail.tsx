import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  ShieldCheck, 
  CheckCircle2, 
  Activity, 
  BellRing, 
  FileText, 
  BrainCircuit, 
  Users, 
  Wind,
  Info
} from 'lucide-react';
import { EQUIPMENTS_MOCK, Equipment } from '../../mocks/equipments';
import { useAppStore } from '../../store';
import { JITAgreementModal } from '../../components/JITAgreementModal';

const iconMap: Record<string, React.ElementType> = {
  Activity,
  BellRing,
  FileText,
  BrainCircuit,
  Users,
  Wind
};

export default function EquipmentDetailView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { ownedEquipments, buyEquipment, authorizeRwe, isRweAuthorized } = useAppStore();
  const [isJITModalVisible, setIsJITModalVisible] = useState(false);

  const equipment = EQUIPMENTS_MOCK.find(e => e.id === id);
  const isOwned = equipment ? ownedEquipments.includes(equipment.id) : false;

  if (!equipment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="text-slate-500 mb-4">未找到该装备信息</p>
          <button 
            onClick={() => navigate('/equipments')}
            className="px-6 py-2 bg-blue-600 text-white rounded-full font-medium"
          >
            返回装备库
          </button>
        </div>
      </div>
    );
  }

  const handleBuyClick = () => {
    if (isOwned) {
      navigate('/manager');
      return;
    }
    
    if (!isRweAuthorized) {
      setIsJITModalVisible(true);
    } else {
      executePurchase();
    }
  };

  const executePurchase = () => {
    const privileges = equipment.bundledPrivileges.map(p => p.id);
    buyEquipment(equipment.id, privileges);
    // Redirect to manager after successful purchase
    navigate('/manager', { replace: true });
  };

  const handleJITConfirm = () => {
    authorizeRwe();
    setIsJITModalVisible(false);
    executePurchase();
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100/50 pt-[env(safe-area-inset-top)]">
        <div className="flex items-center justify-between h-14 px-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center -ml-2 text-slate-600 active:bg-slate-100 rounded-full transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <span className="font-bold text-slate-800 text-[16px]">装备详情</span>
          <div className="w-10" /> {/* Placeholder for balance */}
        </div>
      </div>

      {/* Hero Image */}
      <div className="pt-14">
        <div className="relative w-full aspect-square bg-slate-100">
          <img 
            src={equipment.imageUrl} 
            alt={equipment.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-5 right-5">
            <div className="flex flex-wrap gap-2 mb-3">
              {equipment.tags.map(tag => (
                <span key={tag} className="px-2.5 py-1 bg-white/20 backdrop-blur-md text-white text-[11px] font-medium rounded-md border border-white/20">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-[28px] font-extrabold text-white leading-tight mb-1">
              {equipment.name}
            </h1>
            <div className="flex items-center gap-1.5 text-[12px] text-white/80 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              {equipment.certification}
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 mt-6 space-y-8">
        {/* Price & Subtitle */}
        <div>
          <div className="flex items-end gap-1 mb-3">
            <span className="text-[18px] font-bold text-blue-600">¥</span>
            <span className="text-[36px] font-extrabold text-blue-600 leading-none tracking-tight">{equipment.price}</span>
          </div>
          <p className="text-[15px] text-slate-600 leading-relaxed">
            {equipment.subtitle}
          </p>
        </div>

        {/* Bundled Privileges (Value Anchor) */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[18px] font-bold text-slate-900 flex items-center gap-2">
              购机赠送高阶特权
              <span className="bg-blue-100 text-blue-600 text-[10px] px-2 py-0.5 rounded-full">价值 ¥2999/年</span>
            </h2>
          </div>
          
          <div className="space-y-4">
            {equipment.bundledPrivileges.map((privilege, index) => {
              const Icon = iconMap[privilege.icon] || CheckCircle2;
              return (
                <motion.div 
                  key={privilege.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-[20px] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100/60 flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100/50">
                    <Icon className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-slate-800 mb-1">{privilege.title}</h3>
                    <p className="text-[13px] text-slate-500 leading-relaxed">{privilege.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Hardware Specs (Simplified) */}
        <div>
          <h2 className="text-[18px] font-bold text-slate-900 mb-4">硬件参数</h2>
          <div className="bg-white rounded-[20px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100/60">
            <ul className="space-y-3">
              <li className="flex items-start justify-between text-[13px]">
                <span className="text-slate-500">数据同步</span>
                <span className="text-slate-800 font-medium text-right">蓝牙 5.0 / Wi-Fi 直连</span>
              </li>
              <li className="flex items-start justify-between text-[13px]">
                <span className="text-slate-500">续航时间</span>
                <span className="text-slate-800 font-medium text-right">典型场景 7-14 天</span>
              </li>
              <li className="flex items-start justify-between text-[13px]">
                <span className="text-slate-500">医疗认证</span>
                <span className="text-slate-800 font-medium text-right">{equipment.certification}</span>
              </li>
              <li className="flex items-start justify-between text-[13px]">
                <span className="text-slate-500">适用人群</span>
                <span className="text-slate-800 font-medium text-right">神经专病高危及确诊患者</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Transparent placeholder for floating action bar */}
        <div className="h-[calc(env(safe-area-inset-bottom)+84px)]" />
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-t border-slate-100/80 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_30px_rgba(0,0,0,0.06)]">
        <div className="p-4 max-w-md mx-auto flex items-center gap-4">
          <div className="flex-1">
            <div className="text-[11px] text-slate-500 font-medium mb-0.5">合计金额</div>
            <div className="flex items-end gap-1">
              <span className="text-[16px] font-bold text-slate-900 leading-none">¥</span>
              <span className="text-[24px] font-extrabold text-slate-900 leading-none tracking-tight">{equipment.price}</span>
            </div>
          </div>
          <button 
            onClick={handleBuyClick}
            className={`flex-none w-[200px] h-[52px] rounded-full font-bold text-[16px] transition-all duration-300 flex items-center justify-center gap-2 ${
              isOwned 
                ? 'bg-slate-100 text-slate-500' 
                : 'bg-blue-600 text-white shadow-[0_8px_20px_rgba(37,99,235,0.25)] active:scale-[0.98]'
            }`}
          >
            {isOwned ? (
              <>
                <CheckCircle2 className="w-5 h-5" /> 已拥有
              </>
            ) : (
              '立即购买并绑定'
            )}
          </button>
        </div>
      </div>

      <JITAgreementModal 
        visible={isJITModalVisible}
        onClose={() => setIsJITModalVisible(false)}
        onConfirm={handleJITConfirm}
      />
    </div>
  );
}
