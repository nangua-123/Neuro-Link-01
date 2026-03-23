import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, ChevronRight, CheckCircle2, ShoppingBag, Watch, Activity, Moon, Sparkles } from 'lucide-react';
import { EQUIPMENTS_MOCK } from '../../mocks/equipments';
import { useAppStore } from '../../store';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/PageHeader';
import { HeroBanner } from '../../components/HeroBanner';

const iconMap: Record<string, React.ElementType> = {
  Watch,
  Activity,
  Moon
};

export default function EquipmentsView() {
  const { ownedEquipments } = useAppStore();
  const navigate = useNavigate();

  return (
    <div className="bg-[#F7F9FC] pb-24 relative overflow-x-hidden">
      {/* Soft Diffuse Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-5%] left-[-10%] w-[60%] h-[30%] bg-blue-200/40 rounded-full blur-[80px]" />
        <div className="absolute top-[10%] right-[-10%] w-[50%] h-[40%] bg-indigo-200/30 rounded-full blur-[80px]" />
        <div className="absolute bottom-[20%] left-[10%] w-[40%] h-[30%] bg-purple-200/20 rounded-full blur-[80px]" />
      </div>

      <div className="px-4 pt-10 pb-2 flex items-center gap-2.5 relative z-10">
        <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-blue-600">
          <ShoppingBag className="w-4 h-4" />
        </div>
        <h1 className="text-[20px] font-bold text-slate-800 tracking-tight">专属装备</h1>
      </div>

      <div className="px-4 mb-4 relative z-10">
        <div className="bg-white/90 backdrop-blur-xl rounded-[24px] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/50 to-indigo-100/20 rounded-bl-[100px] -z-10" />
          <div className="relative z-10">
            <h2 className="text-[18px] font-bold text-slate-800 tracking-tight mb-1.5">购机即解锁高阶管家服务</h2>
            <p className="text-slate-500 text-[12px] leading-relaxed mb-3">
              告别纯软件订阅。绑定专属医疗硬件，终身享有复诊一页纸、诱因热力图等核心权益。
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 rounded-full text-[11px] font-bold text-blue-600">
              <Sparkles className="w-3 h-3" /> 软硬一体
            </div>
          </div>
        </div>
      </div>

      {/* Equipment List */}
      <div className="px-4 space-y-4 relative z-10">
        {EQUIPMENTS_MOCK.map((item, index) => {
          const isOwned = ownedEquipments.includes(item.id);
          const IconComponent = iconMap[item.icon] || Watch;

          return (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate(`/equipments/${item.id}`)}
              className="bg-white/90 backdrop-blur-xl rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-white overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
            >
              {/* Product Image Area */}
              <div className={`relative h-40 bg-gradient-to-br ${item.gradient} overflow-hidden flex items-center justify-center border-b border-slate-100/50`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl -mr-10 -mt-10" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-400/5 rounded-full blur-3xl -ml-10 -mb-10" />
                
                <IconComponent className="w-20 h-20 text-blue-500/80 drop-shadow-sm relative z-10" strokeWidth={1.5} />
                
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between z-20">
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-white/80 backdrop-blur-md text-blue-600 text-[10px] font-bold rounded-md border border-blue-100/50 shadow-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="text-blue-600 font-extrabold text-[18px] tracking-tight">
                    ¥{item.price}
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-1.5">
                  <div>
                    <h3 className="text-[16px] font-bold text-slate-800 leading-tight mb-1">{item.name}</h3>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      {item.certification}
                    </div>
                  </div>
                </div>
                <p className="text-[12px] text-slate-500 leading-relaxed mb-4 line-clamp-2">
                  {item.subtitle}
                </p>

                {/* Bundled Privileges Preview */}
                <div className="flex items-center gap-1.5 mb-4 overflow-x-auto hide-scrollbar">
                  <div className="shrink-0 bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-1 rounded-full">
                    赠送特权
                  </div>
                  {item.bundledPrivileges.slice(0, 2).map(privilege => (
                    <div key={privilege.id} className="shrink-0 text-[10px] text-slate-600 bg-slate-50 px-2 py-1 rounded-full">
                      {privilege.title}
                    </div>
                  ))}
                  {item.bundledPrivileges.length > 2 && (
                    <div className="shrink-0 text-[10px] text-slate-400">
                      +{item.bundledPrivileges.length - 2}
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-50/80">
                  <span className="text-[12px] font-bold text-slate-400">
                    {isOwned ? '已拥有此设备' : '查看详情与权益'}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isOwned ? 'bg-emerald-50 text-emerald-500' : 'bg-blue-600 text-white shadow-[0_4px_12px_rgba(37,99,235,0.2)]'}`}>
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
