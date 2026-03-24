import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, ChevronRight, CheckCircle2, ShoppingBag, Sparkles, BellRing, FileText, Users, MapPin, BrainCircuit, Activity, Wind } from 'lucide-react';
import { EQUIPMENTS_MOCK } from '../../mocks/equipments';
import { useAppStore } from '../../store';
import { useNavigate } from 'react-router-dom';
import { DeviceIllustration } from '../../components/DeviceIllustration';

const IconMap: Record<string, any> = {
  BellRing, FileText, Users, MapPin, BrainCircuit, Activity, Wind
};

const getDeviceType = (id: string) => {
  if (id.includes('band') || id.includes('tracker')) return 'watch';
  if (id.includes('patch') || id.includes('sense')) return 'patch';
  if (id.includes('monitor')) return 'monitor';
  return 'watch';
};

export default function EquipmentsView() {
  const { ownedEquipments, selectedDiseaseTag } = useAppStore();
  const navigate = useNavigate();

  // Sort equipments to show the one matching the user's disease tag first
  const sortedEquipments = [...EQUIPMENTS_MOCK].sort((a, b) => {
    if (a.targetDisease === selectedDiseaseTag) return -1;
    if (b.targetDisease === selectedDiseaseTag) return 1;
    return 0;
  });

  return (
    <div className="bg-[#F7F9FC] relative overflow-x-hidden min-h-screen pb-[calc(env(safe-area-inset-bottom)+80px)]">
      {/* Soft Diffuse Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-5%] left-[-10%] w-[60%] h-[30%] bg-blue-200/40 rounded-full blur-[80px]" />
        <div className="absolute top-[10%] right-[-10%] w-[50%] h-[40%] bg-indigo-200/30 rounded-full blur-[80px]" />
        <div className="absolute bottom-[20%] left-[10%] w-[40%] h-[30%] bg-purple-200/20 rounded-full blur-[80px]" />
      </div>

      <div className="px-4 pt-5 pb-2 flex items-center gap-2.5 relative z-10">
        <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-blue-600">
          <ShoppingBag className="w-4 h-4" />
        </div>
        <h1 className="text-[18px] font-bold text-slate-800 tracking-tight">专属装备</h1>
      </div>

      <div className="px-4 mb-4 relative z-10">
        <div className="bg-white/90 backdrop-blur-xl rounded-[24px] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/50 to-indigo-100/20 rounded-bl-[100px] -z-10" />
          <div className="relative z-10">
            <h2 className="text-[18px] font-bold text-slate-800 tracking-tight mb-1.5">购机即解锁高阶管家服务</h2>
            <p className="text-slate-500 text-[12px] leading-relaxed mb-3">
              告别纯软件订阅。绑定专属医疗硬件，终身享有全景健康档案、专属复诊一页纸等核心权益。
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 rounded-full text-[12px] font-bold text-blue-600">
              <Sparkles className="w-3 h-3" /> 软硬一体
            </div>
          </div>
        </div>
      </div>

      {/* Equipment List */}
      <div className="px-4 space-y-4 relative z-10">
        {sortedEquipments.map((item, index) => {
          const isOwned = ownedEquipments.includes(item.id);
          const deviceType = getDeviceType(item.id);
          const isRecommended = item.targetDisease === selectedDiseaseTag;

          return (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate(`/equipments/${item.id}`)}
              className="bg-white/90 backdrop-blur-xl rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-white overflow-hidden cursor-pointer active:scale-[0.98] transition-transform relative"
            >
              {/* Recommended Badge */}
              {isRecommended && (
                <div className="absolute top-3 left-3 z-30 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {selectedDiseaseTag}专属推荐
                </div>
              )}

              {/* Product Image Area */}
              <div className={`relative h-48 bg-gradient-to-br ${item.gradient} overflow-hidden flex items-center justify-center border-b border-slate-100/50`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl -mr-10 -mt-10" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-400/5 rounded-full blur-3xl -ml-10 -mb-10" />
                
                <DeviceIllustration type={deviceType as any} className="relative z-10 scale-110" />
                
                <div className="absolute bottom-3 right-3 flex items-end justify-end z-20">
                  <div className="flex flex-wrap justify-end gap-1.5">
                    {item.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-white/80 backdrop-blur-md text-blue-600 text-[11px] font-bold rounded-md border border-blue-100/50 shadow-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-1.5">
                  <div>
                    <h3 className="text-[16px] font-bold text-slate-800 leading-tight mb-1">{item.name}</h3>
                    <div className="flex items-center gap-1 text-[12px] text-slate-500 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      {item.certification}
                    </div>
                  </div>
                </div>
                <p className="text-[13px] text-slate-500 leading-relaxed mb-4 line-clamp-2">
                  {item.subtitle}
                </p>

                {/* Bundled Privileges Vertical List */}
                <div className="mt-2 pt-4 border-t border-slate-50/80">
                  <div className="flex items-center gap-1.5 mb-3">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span className="text-[13px] font-bold text-slate-800">购机解锁特权</span>
                  </div>
                  <div className="space-y-3">
                    {item.bundledPrivileges.slice(0, 2).map((privilege) => {
                      const Icon = IconMap[privilege.icon] || Sparkles;
                      return (
                        <div key={privilege.id} className="flex items-start gap-3">
                          <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                            <Icon className="w-3.5 h-3.5 text-blue-600" />
                          </div>
                          <div>
                            <div className="text-[13px] font-bold text-slate-700">{privilege.title}</div>
                            <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{privilege.desc}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Action Button & Price */}
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-50/80">
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-[14px] font-bold text-blue-600">¥</span>
                    <span className="text-[22px] font-extrabold text-blue-600 tracking-tight">{item.price}</span>
                  </div>
                  <div className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-bold transition-colors ${
                    isOwned 
                      ? 'bg-emerald-50 text-emerald-600' 
                      : 'bg-blue-600 text-white shadow-[0_4px_12px_rgba(37,99,235,0.2)]'
                  }`}>
                    {isOwned ? '已拥有' : '查看详情'}
                    {isOwned ? <CheckCircle2 className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
