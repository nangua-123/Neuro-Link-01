import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, ChevronRight, CheckCircle2 } from 'lucide-react';
import { EQUIPMENTS_MOCK } from '../../mocks/equipments';
import { useAppStore } from '../../store';
import { useNavigate } from 'react-router-dom';

export default function EquipmentsView() {
  const { ownedEquipments } = useAppStore();
  const navigate = useNavigate();

  return (
    <div className="bg-slate-50">
      {/* Header */}
      <div className="pt-12 pb-6 px-5 bg-white sticky top-0 z-30 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-[28px] font-extrabold text-slate-900 tracking-tight">专属装备</h1>
          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-slate-600" />
          </div>
        </div>
        <p className="text-[14px] text-slate-500 font-medium">
          华西脑健康官方指定数字医疗装备库
        </p>
      </div>

      {/* Hero Banner */}
      <div className="px-5 mt-6 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[24px] p-6 text-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-bold tracking-wider uppercase text-slate-200">软硬一体</span>
            </div>
            <h2 className="text-[22px] font-bold leading-tight mb-2">
              购机即解锁<br />高阶专病管家服务
            </h2>
            <p className="text-[13px] text-slate-300/90 leading-relaxed mb-5 max-w-[80%]">
              告别纯软件订阅。绑定专属医疗硬件，终身享有复诊一页纸、诱因热力图等核心权益。
            </p>
          </div>
        </motion.div>
      </div>

      {/* Equipment List */}
      <div className="px-5 space-y-6">
        {EQUIPMENTS_MOCK.map((item, index) => {
          const isOwned = ownedEquipments.includes(item.id);

          return (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate(`/equipments/${item.id}`)}
              className="bg-white rounded-[28px] shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-slate-100/60 overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
            >
              {/* Product Image Area */}
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                <img 
                  src={item.imageUrl} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-medium rounded-md border border-white/20">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="text-white font-bold text-[20px] tracking-tight">
                    ¥{item.price}
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-[18px] font-bold text-slate-900 leading-tight mb-1">{item.name}</h3>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      {item.certification}
                    </div>
                  </div>
                </div>
                <p className="text-[13px] text-slate-500 leading-relaxed mb-5 line-clamp-2">
                  {item.subtitle}
                </p>

                {/* Bundled Privileges Preview */}
                <div className="flex items-center gap-2 mb-5 overflow-x-auto hide-scrollbar">
                  <div className="shrink-0 bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-1 rounded-full border border-blue-100">
                    赠送特权
                  </div>
                  {item.bundledPrivileges.slice(0, 2).map(privilege => (
                    <div key={privilege.id} className="shrink-0 text-[11px] text-slate-600 bg-slate-50 px-2 py-1 rounded-full border border-slate-100">
                      {privilege.title}
                    </div>
                  ))}
                  {item.bundledPrivileges.length > 2 && (
                    <div className="shrink-0 text-[11px] text-slate-400">
                      +{item.bundledPrivileges.length - 2}
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-[13px] font-bold text-slate-400">
                    {isOwned ? '已拥有此设备' : '查看详情与权益'}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isOwned ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-900 text-white'}`}>
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
