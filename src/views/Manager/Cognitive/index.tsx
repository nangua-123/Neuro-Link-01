import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAppStore } from '../../../store';
import { UserIdentity } from '../../../interfaces/user';
import { Brain, MapPin, Play, Moon, Sun, Coffee, ChevronRight, FileText, HeartHandshake, CheckCircle2 } from 'lucide-react';

export default function CognitiveManager() {
  const { identity } = useAppStore();
  const isFamily = identity === UserIdentity.FAMILY;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-10"
    >
      <StatusOverview isFamily={isFamily} />
      <DailyActions isFamily={isFamily} />
      <MedicalServices />
    </motion.div>
  );
}

function StatusOverview({ isFamily }: { isFamily: boolean }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-xl font-semibold text-slate-800 tracking-tight">
          {isFamily ? '长辈今日认知状态' : '我的脑力状态'}
        </h2>
        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
          <Brain className="w-5 h-5 text-blue-500" />
        </div>
      </div>

      {/* LBS Security Fence Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[32px] p-6 shadow-xl shadow-blue-500/20">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-6">
            <div className="p-2 bg-white/20 rounded-2xl backdrop-blur-md">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="text-blue-50 text-sm font-medium tracking-wide">LBS 实时安全围栏</span>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
                <span className="text-white text-2xl font-semibold tracking-tight">当前位于安全区</span>
              </div>
              <p className="text-blue-100/80 text-sm mt-1">
                {isFamily ? '长辈正在家中，一切安好' : '您当前处于设定的安全活动范围内'}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
              <CheckCircle2 className="w-6 h-6 text-emerald-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DailyActions({ isFamily }: { isFamily: boolean }) {
  const [sleepRating, setSleepRating] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="px-2">
        <h3 className="text-lg font-semibold text-slate-800 tracking-tight">今日干预</h3>
        <p className="text-sm text-slate-500 mt-1">
          {isFamily ? '协助长辈完成今日的认知训练' : '完成今日的脑力挑战，保持大脑活力'}
        </p>
      </div>

      {/* DTx Training Card */}
      <div className="bg-white rounded-[32px] p-6 shadow-sm shadow-slate-200/50 border border-slate-100/50 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500">
              <Brain className="w-6 h-6" />
            </div>
            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-full">
              数字疗法 (DTx)
            </span>
          </div>
          <h4 className="text-lg font-semibold text-slate-800 mb-2">空间记忆连连看</h4>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            通过趣味连线游戏，锻炼短期记忆与空间感知能力，建议每日完成 15 分钟。
          </p>
          <button className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-medium transition-colors flex items-center justify-center space-x-2 shadow-lg shadow-slate-900/20">
            <Play className="w-4 h-4 fill-current" />
            <span>开始今日训练</span>
          </button>
        </div>
      </div>

      {/* Caregiver Micro-Follow-up (Only for Family) */}
      {isFamily && (
        <div className="bg-gradient-to-br from-slate-50 to-white rounded-[32px] p-6 shadow-sm shadow-slate-200/50 border border-slate-100/50">
          <div className="flex items-center space-x-3 mb-5">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-semibold text-slate-800">照护微随访</h4>
              <p className="text-xs text-slate-500">长辈昨晚睡眠质量如何？</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            {[
              { id: 'good', icon: Sun, label: '安稳', color: 'text-emerald-600', bg: 'bg-emerald-50', activeBg: 'bg-emerald-500', activeText: 'text-white' },
              { id: 'normal', icon: Coffee, label: '一般', color: 'text-amber-600', bg: 'bg-amber-50', activeBg: 'bg-amber-500', activeText: 'text-white' },
              { id: 'bad', icon: Moon, label: '易醒', color: 'text-rose-600', bg: 'bg-rose-50', activeBg: 'bg-rose-500', activeText: 'text-white' },
            ].map((option) => {
              const isActive = sleepRating === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => setSleepRating(option.id)}
                  className={`flex-1 py-3 rounded-2xl flex flex-col items-center justify-center space-y-2 transition-all duration-300 ${
                    isActive ? `${option.activeBg} shadow-md` : `${option.bg} hover:bg-slate-100`
                  }`}
                >
                  <option.icon className={`w-5 h-5 ${isActive ? option.activeText : option.color}`} />
                  <span className={`text-xs font-medium ${isActive ? option.activeText : option.color}`}>
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function MedicalServices() {
  return (
    <div className="space-y-4">
      <div className="px-2">
        <h3 className="text-lg font-semibold text-slate-800 tracking-tight">医疗服务</h3>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <ServiceCard 
          icon={FileText}
          title="复查动态量表"
          desc="CDR 临床痴呆评定量表"
          color="blue"
        />
        <ServiceCard 
          icon={HeartHandshake}
          title="照护者心理支持"
          desc="家属减负与专业心理疏导"
          color="indigo"
        />
      </div>
    </div>
  );
}

function ServiceCard({ icon: Icon, title, desc, color }: { icon: any, title: string, desc: string, color: 'blue' | 'indigo' }) {
  const colorStyles = {
    blue: 'bg-blue-50 text-blue-600',
    indigo: 'bg-indigo-50 text-indigo-600',
  };

  return (
    <div className="bg-white rounded-[28px] p-5 shadow-sm shadow-slate-200/50 border border-slate-100/50 flex items-center justify-between group cursor-pointer hover:shadow-md transition-all duration-300">
      <div className="flex items-center space-x-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colorStyles[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-base font-semibold text-slate-800">{title}</h4>
          <p className="text-sm text-slate-500 mt-0.5">{desc}</p>
        </div>
      </div>
      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-slate-100 transition-colors">
        <ChevronRight className="w-4 h-4 text-slate-400" />
      </div>
    </div>
  );
}
