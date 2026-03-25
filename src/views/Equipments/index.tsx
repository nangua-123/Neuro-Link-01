import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, ChevronRight, CheckCircle2, ShoppingBag, Sparkles, BellRing, FileText, Users, MapPin, BrainCircuit, Activity, Wind, Cpu, Wifi } from 'lucide-react';
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
    <div className="bg-[#FAFAFA] relative overflow-x-hidden min-h-full pb-[calc(env(safe-area-inset-bottom)+20px)]">
      {/* Soft Diffuse Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-5%] left-[-10%] w-[70%] h-[40%] bg-blue-200/40 rounded-full blur-[80px]" />
        <div className="absolute top-[15%] right-[-10%] w-[60%] h-[40%] bg-indigo-200/30 rounded-full blur-[80px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[40%] bg-blue-100/40 rounded-full blur-[80px]" />
      </div>

      <div className="px-5 pt-6 pb-4 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md shadow-sm border border-white flex items-center justify-center text-blue-600">
            <Cpu className="w-5 h-5" />
          </div>
          <h1 className="text-[22px] font-bold text-slate-800 tracking-tight">设备物联大厅</h1>
        </div>
      </div>

      <div className="px-5 mb-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 rounded-[28px] p-5 text-white shadow-[0_12px_32px_rgba(37,99,235,0.25)] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles className="w-4 h-4 text-blue-200" />
              <span className="text-[12px] font-bold text-blue-100 tracking-wider uppercase">Neuro-Link IoT</span>
            </div>
            <h2 className="text-[20px] font-bold tracking-tight leading-tight mb-2">软硬一体，高阶管家</h2>
            <p className="text-blue-50/90 text-[13px] leading-relaxed mb-4 font-medium">
              告别纯软件订阅。绑定专属医疗硬件，终身享有全景健康档案、专属复诊一页纸等核心权益。
            </p>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                <Wifi className="w-3.5 h-3.5 text-blue-200" />
                <span className="text-[11px] font-bold text-blue-50">无感直连</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-200" />
                <span className="text-[11px] font-bold text-blue-50">医疗级认证</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Equipment List */}
      <div className="px-5 space-y-5 relative z-10">
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
              className="bg-white/80 backdrop-blur-xl rounded-[32px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white overflow-hidden cursor-pointer active:scale-[0.98] transition-transform relative"
            >
              {/* Recommended Badge */}
              {isRecommended && (
                <div className="absolute top-4 left-4 z-30 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  {selectedDiseaseTag}专属推荐
                </div>
              )}

              {/* Product Image Area */}
              <div className={`relative h-56 bg-gradient-to-br ${item.gradient} overflow-hidden flex items-center justify-center border-b border-slate-100/50`}>
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/30 rounded-full blur-3xl -mr-10 -mt-10" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/20 rounded-full blur-3xl -ml-10 -mb-10" />
                
                <DeviceIllustration type={deviceType as any} className="relative z-10 scale-125 drop-shadow-2xl" />
                
                <div className="absolute bottom-4 right-4 flex items-end justify-end z-20">
                  <div className="flex flex-wrap justify-end gap-2">
                    {item.tags.map(tag => (
                      <span key={tag} className="px-2.5 py-1 bg-white/80 backdrop-blur-md text-blue-600 text-[11px] font-bold rounded-lg border border-white shadow-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-[18px] font-bold text-slate-800 leading-tight mb-1.5 tracking-tight">{item.name}</h3>
                    <div className="flex items-center gap-1.5 text-[12px] text-slate-500 font-medium bg-slate-50 inline-flex px-2 py-1 rounded-md border border-slate-100">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      {item.certification}
                    </div>
                  </div>
                </div>
                <p className="text-[13px] text-slate-500 leading-relaxed mb-5 line-clamp-2 font-medium">
                  {item.subtitle}
                </p>

                {/* Bundled Privileges Vertical List */}
                <div className="mt-2 pt-4 border-t border-slate-100/80">
                  <div className="flex items-center gap-1.5 mb-4">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span className="text-[14px] font-bold text-slate-800">购机解锁特权</span>
                  </div>
                  <div className="space-y-4">
                    {item.bundledPrivileges.slice(0, 2).map((privilege) => {
                      const Icon = IconMap[privilege.icon] || Sparkles;
                      return (
                        <div key={privilege.id} className="flex items-start gap-3.5">
                          <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100/50 shadow-sm">
                            <Icon className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="pt-0.5">
                            <div className="text-[14px] font-bold text-slate-800 mb-0.5">{privilege.title}</div>
                            <div className="text-[12px] text-slate-500 leading-relaxed font-medium">{privilege.desc}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Action Button & Price */}
                <div className="flex items-center justify-between pt-5 mt-5 border-t border-slate-100/80">
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-[16px] font-bold text-blue-600">¥</span>
                    <span className="text-[26px] font-extrabold text-blue-600 tracking-tight">{item.price}</span>
                  </div>
                  <div className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full text-[14px] font-bold transition-all duration-300 ${
                    isOwned 
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_8px_20px_rgba(37,99,235,0.25)]'
                  }`}>
                    {isOwned ? (
                      <>
                        <span className="relative flex h-2 w-2 mr-1">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        已连接
                      </>
                    ) : (
                      <>
                        查看详情 <ChevronRight className="w-4 h-4" />
                      </>
                    )}
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
