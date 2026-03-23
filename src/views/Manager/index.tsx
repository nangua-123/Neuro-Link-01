import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store';
import { 
  Sparkles, FileText, Activity, Zap, BrainCircuit, 
  ChevronRight, Pill, MapPin, HeartHandshake, ShieldAlert, BarChart2, Lock, CheckCircle2,
  Stethoscope, Smile
} from 'lucide-react';
import { Toast, Modal } from 'antd-mobile';

import { VitalsGrid } from '../../components/Charts/VitalsGrid';
import { DailyTaskManager } from '../../components/DailyTaskManager';
import { SeizureDiarySheet } from '../../components/SeizureDiarySheet';
import { MigraineDiarySheet } from '../../components/MigraineDiarySheet';
import { CDRDiarySheet } from '../../components/CDRDiarySheet';
import { AudioTherapySheet } from '../../components/AudioTherapySheet';
import { Task } from '../../interfaces/task';
import { UserIdentity } from '../../interfaces/user';
import { DiseaseTag } from '../../configs/constants';
import { showComingSoon } from '../../utils/ui';
import { ManagerSkeleton } from '../../components/ManagerSkeleton';

export default function ManagerView() {
  const { userStage, completeTask, toggleMedication, recordPainkiller } = useAppStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  // Sheet visibility states
  const [isSeizureDiaryVisible, setIsSeizureDiaryVisible] = useState(false);
  const [isMigraineDiaryVisible, setIsMigraineDiaryVisible] = useState(false);
  const [isCDRDiaryVisible, setIsCDRDiaryVisible] = useState(false);
  const [isAudioTherapyVisible, setIsAudioTherapyVisible] = useState(false);

  // Task tracking states
  const [activeTaskId, setActiveTaskId] = useState<string | undefined>(undefined);
  const [selectedMedTask, setSelectedMedTask] = useState<Task | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleTaskAction = (task: Task) => {
    if (task.type === 'DIARY') {
      setActiveTaskId(task.id);
      if (task.title.includes('头痛')) setIsMigraineDiaryVisible(true);
      else if (task.title.includes('行为')) setIsCDRDiaryVisible(true);
      else setIsSeizureDiaryVisible(true);
    } else if (task.type === 'MEDICATION') {
      setSelectedMedTask(task);
    } else if (task.type === 'TRAINING') {
      if (task.title.includes('音频')) {
        setActiveTaskId(task.id);
        setIsAudioTherapyVisible(true);
      } else {
        Toast.show({ content: '即将进入训练模式...', icon: 'loading' });
        setTimeout(() => {
          completeTask(task.id);
          Toast.show({ content: '训练完成', icon: 'success' });
        }, 1500);
      }
    } else {
      showComingSoon(task.title, '该功能即将开放');
      completeTask(task.id);
    }
  };

  const handleTaskCompleted = (taskId: string) => {
    completeTask(taskId);
    setActiveTaskId(undefined);
  };

  const handleConfirmMedication = () => {
    if (selectedMedTask) {
      if (selectedMedTask.id.startsWith('med_')) {
        const planId = selectedMedTask.id.replace('med_', '');
        toggleMedication(planId);
      } else if (selectedMedTask.title.includes('止痛药')) {
        recordPainkiller();
      } else {
        completeTask(selectedMedTask.id);
      }
      Toast.show({ content: '打卡成功', icon: 'success' });
      setSelectedMedTask(null);
    }
  };

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

  if (isLoading) return (
    <div className="bg-[#FAFAFA] pt-4 px-4 pb-24">
      <ManagerSkeleton />
    </div>
  );

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="bg-[#FAFAFA] font-sans selection:bg-blue-100 pt-4 px-4 space-y-4 overflow-x-hidden"
    >
      {/* Module 1: AI Health Briefing */}
      <motion.div variants={itemVariants}>
        <AIHealthBriefing userStage={userStage} navigate={navigate} />
      </motion.div>

      {/* Module 2: Today's Tasks */}
      <motion.div variants={itemVariants}>
        <DailyTaskManager onTaskAction={handleTaskAction} />
      </motion.div>

      {/* Module 3: Vitals */}
      <motion.div variants={itemVariants} className="space-y-2.5">
        <h3 className="text-[17px] font-bold text-slate-800 px-1 tracking-tight">体征监测</h3>
        <VitalsGrid />
      </motion.div>

      {/* Module 4: Universal Toolbox */}
      <motion.div variants={itemVariants} className="space-y-2.5">
        <h3 className="text-[17px] font-bold text-slate-800 px-1 tracking-tight">健康工具箱</h3>
        <UniversalToolbox 
          userStage={userStage}
          navigate={navigate}
          onOpenCDR={() => { setActiveTaskId(undefined); setIsCDRDiaryVisible(true); }}
        />
      </motion.div>

      {/* Module 5: Premium Services */}
      <motion.div variants={itemVariants} className="space-y-2.5">
        <h3 className="text-[17px] font-bold text-slate-800 px-1 tracking-tight flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-500" />
          高阶特权服务
        </h3>
        <PremiumServices navigate={navigate} />
      </motion.div>

      <SeizureDiarySheet 
        visible={isSeizureDiaryVisible} 
        onClose={() => { setIsSeizureDiaryVisible(false); setActiveTaskId(undefined); }} 
        activeTaskId={activeTaskId}
        onTaskCompleted={handleTaskCompleted}
      />
      <MigraineDiarySheet 
        visible={isMigraineDiaryVisible} 
        onClose={() => { setIsMigraineDiaryVisible(false); setActiveTaskId(undefined); }} 
        activeTaskId={activeTaskId}
        onTaskCompleted={handleTaskCompleted}
      />
      <CDRDiarySheet 
        visible={isCDRDiaryVisible} 
        onClose={() => { setIsCDRDiaryVisible(false); setActiveTaskId(undefined); }} 
        activeTaskId={activeTaskId}
        onTaskCompleted={handleTaskCompleted}
      />
      
      <AudioTherapySheet
        visible={isAudioTherapyVisible}
        onClose={() => { setIsAudioTherapyVisible(false); setActiveTaskId(undefined); }}
        activeTaskId={activeTaskId}
        onTaskCompleted={handleTaskCompleted}
      />

      {/* Medication Confirmation Modal */}
      <Modal
        visible={!!selectedMedTask}
        content={
          <div className="flex flex-col items-center pt-2 pb-1">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
              <Pill className="w-6 h-6 text-emerald-500" />
            </div>
            <h3 className="text-[18px] font-bold text-slate-800 mb-2">确认服药</h3>
            <p className="text-[14px] text-slate-500 text-center leading-relaxed">
              您确认已完成 <span className="font-bold text-slate-700">{selectedMedTask?.title}</span> 吗？<br/>
              <span className="text-[12px]">{selectedMedTask?.description}</span>
            </p>
          </div>
        }
        closeOnAction
        onClose={() => setSelectedMedTask(null)}
        actions={[
          {
            key: 'cancel',
            text: '取消',
            className: 'text-slate-500 font-medium',
            onClick: () => setSelectedMedTask(null),
          },
          {
            key: 'confirm',
            text: '确认已服药',
            className: 'text-emerald-600 font-bold',
            onClick: handleConfirmMedication,
          },
        ]}
      />
    </motion.div>
  );
}

function AIHealthBriefing({ userStage, navigate }: any) {
  const { identity } = useAppStore();
  const isFamily = identity === UserIdentity.FAMILY;

  if (userStage === 'NEW') {
    return (
      <div className="relative bg-gradient-to-br from-blue-50 to-blue-50/80 rounded-[24px] p-5 border border-blue-100/50 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col gap-4">
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles className="w-5 h-5 text-blue-500" />
              <h2 className="text-[18px] font-bold text-slate-800">欢迎来到 Neuro-Link</h2>
            </div>
            <p className="text-[13px] text-slate-500 leading-relaxed">
              完成首次专业测评，AI 将为{isFamily ? '长辈' : '您'}生成专属的健康报告与个性化干预方案。
            </p>
          </div>
          <button onClick={() => navigate('/assessment')} className="w-full bg-gradient-to-r from-blue-500 to-blue-500 text-white text-[15px] py-3.5 rounded-[16px] font-bold shadow-[0_4px_12px_rgba(59,130,246,0.25)] active:scale-95 transition-transform flex items-center justify-center gap-1.5">
            开启专属测评
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-br from-blue-50/80 to-blue-50/50 rounded-[24px] p-5 border border-blue-100/50 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-5 h-5 text-blue-500" />
          <span className="text-[16px] font-bold text-slate-800">{isFamily ? '长辈 AI 健康简报' : 'AI 脑健康简报'}</span>
        </div>
        <span onClick={() => navigate('/health-report')} className="text-[12px] text-blue-600 flex items-center active:opacity-70 cursor-pointer font-medium">详细报告 <ChevronRight className="w-3.5 h-3.5"/></span>
      </div>
      <p className="text-[13px] text-slate-600 leading-relaxed mb-4">
        本周脑电波形平稳，用药依从性达 <span className="font-bold text-emerald-600">95%</span>，偏头痛发作频次下降。
      </p>
      <div className="flex gap-3">
        <div className="flex-1 bg-white/80 rounded-[16px] p-3 border border-white flex flex-col items-center justify-center shadow-sm">
           <div className="text-[11px] text-slate-500 mb-1 font-medium">癫痫控制</div>
           <div className="text-[18px] font-bold text-slate-800 leading-none">95<span className="text-[12px] font-normal text-slate-500 ml-0.5">%</span></div>
        </div>
        <div className="flex-1 bg-white/80 rounded-[16px] p-3 border border-white flex flex-col items-center justify-center shadow-sm">
           <div className="text-[11px] text-slate-500 mb-1 font-medium">头痛发作</div>
           <div className="text-[18px] font-bold text-slate-800 leading-none">2<span className="text-[12px] font-normal text-slate-500 ml-0.5">次</span></div>
        </div>
        <div className="flex-1 bg-white/80 rounded-[16px] p-3 border border-white flex flex-col items-center justify-center shadow-sm">
           <div className="text-[11px] text-slate-500 mb-1 font-medium">脑力训练</div>
           <div className="text-[18px] font-bold text-slate-800 leading-none">2/5<span className="text-[12px] font-normal text-slate-500 ml-0.5">天</span></div>
        </div>
      </div>
    </div>
  );
}

function UniversalToolbox({ userStage, navigate, onOpenCDR }: any) {
  const { identity } = useAppStore();
  const isFamily = identity === UserIdentity.FAMILY;

  return (
    <div className="bg-white rounded-[24px] p-3.5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100/80 space-y-3">
      {/* Section A: 日常记录 */}
      <div>
        <div className="text-[12px] font-bold text-slate-400 mb-2 px-1 tracking-wider">日常记录</div>
        <div className="grid grid-cols-4 gap-y-3">
           <ToolItem icon={<Pill/>} label={isFamily ? "长辈用药" : "智能用药"} onClick={() => navigate('/medications')} color="emerald" userStage={userStage} />
           <ToolItem icon={<Activity/>} label={isFamily ? "长辈发作" : "发作日记"} onClick={() => navigate('/diary', { state: { defaultTab: 'EPILEPSY' } })} color="blue" userStage={userStage} />
           <ToolItem icon={<Zap/>} label={isFamily ? "长辈头痛" : "头痛闪记"} onClick={() => navigate('/diary', { state: { defaultTab: 'MIGRAINE' } })} color="rose" userStage={userStage} />
           <ToolItem icon={<HeartHandshake/>} label="照护日记" onClick={onOpenCDR} color="blue" userStage={userStage} />
        </div>
      </div>
      
      <div className="h-[1px] bg-slate-50 mx-1" />
      
      {/* Section B: 测评与洞察 */}
      <div>
        <div className="text-[12px] font-bold text-slate-400 mb-2 px-1 tracking-wider">测评与洞察</div>
        <div className="grid grid-cols-4 gap-y-3">
           <ToolItem icon={<FileText/>} label="专业量表" onClick={() => navigate('/assessment')} color="blue" userStage={userStage} />
           <ToolItem icon={<BarChart2/>} label="数据大屏" onClick={() => navigate('/health-report')} color="blue" userStage={userStage} requiresAssessment />
        </div>
      </div>

      <div className="h-[1px] bg-slate-50 mx-1" />
      
      {/* Section C: 干预与守护 */}
      <div>
        <div className="text-[12px] font-bold text-slate-400 mb-2 px-1 tracking-wider">干预与守护</div>
        <div className="grid grid-cols-4 gap-y-3">
           <ToolItem icon={<BrainCircuit/>} label="脑力训练" onClick={() => navigate('/feature/brain-training')} color="blue" userStage={userStage} requiresAssessment />
           <ToolItem icon={<MapPin/>} label="安全围栏" onClick={() => navigate('/feature/lbs-fence')} color="orange" userStage={userStage} requiresAssessment />
           <ToolItem icon={<ShieldAlert/>} label="紧急录像" onClick={() => Toast.show({ content: '已触发紧急录像', icon: 'success' })} color="red" userStage={userStage} />
        </div>
      </div>

      <div className="h-[1px] bg-slate-50 mx-1" />
      
      {/* Section D: 医疗服务 */}
      <div>
        <div className="text-[12px] font-bold text-slate-400 mb-2 px-1 tracking-wider">医疗服务</div>
        <div className="grid grid-cols-4 gap-y-3">
           <ToolItem icon={<Stethoscope/>} label="专家复诊" onClick={() => showComingSoon('专家在线复诊', '华西神经内科专家团队即将入驻，为您提供线上复诊与处方调整服务。')} color="blue" userStage={userStage} />
           <ToolItem icon={<Smile/>} label="心理支持" onClick={() => showComingSoon('心理支持', '专业的心理咨询师团队即将上线，为您和家属提供情绪疏导与心理支持。')} color="emerald" userStage={userStage} />
        </div>
      </div>
    </div>
  );
}

function PremiumServices({ navigate }: any) {
  const { unlockedPrivileges } = useAppStore();
  
  const services = [
    {
      id: 'trigger_analysis',
      icon: <Zap className="w-5 h-5" />,
      label: '诱发因素分析',
      desc: '精准识别发作诱因',
      path: '/analysis/trigger',
      color: 'bg-amber-50 text-amber-600',
    },
    {
      id: 'visit_summary',
      icon: <FileText className="w-5 h-5" />,
      label: '就诊总结生成',
      desc: '一键生成医生专属报告',
      path: '/analysis/visit-summary',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      id: 'progression_analysis',
      icon: <Activity className="w-5 h-5" />,
      label: '疾病进展分析',
      desc: '长期趋势深度洞察',
      path: '/analysis/progression',
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      id: 'family_care',
      icon: <HeartHandshake className="w-5 h-5" />,
      label: '家属异地共管',
      desc: '随时查看长辈状态',
      path: '/caregiver-report',
      color: 'bg-rose-50 text-rose-600',
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {services.map(service => {
        const isUnlocked = unlockedPrivileges.includes(service.id);
        return (
          <div 
            key={service.id}
            onClick={() => navigate(service.path)}
            className={`bg-white rounded-[20px] p-4 shadow-[0_4px_16px_rgba(0,0,0,0.03)] border border-slate-100/80 active:scale-95 transition-transform cursor-pointer relative overflow-hidden ${!isUnlocked ? 'opacity-80 grayscale-[0.3]' : ''}`}
          >
            <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center mb-3 ${service.color}`}>
              {service.icon}
            </div>
            <h3 className="text-[14px] font-bold text-slate-800 mb-1">{service.label}</h3>
            <p className="text-[11px] text-slate-500">{service.desc}</p>
            
            {!isUnlocked && (
              <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center shadow-sm">
                <Lock className="w-3 h-3 text-slate-400" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ToolItem({ icon, label, onClick, color, requiresAssessment, userStage }: any) {
  const colorMap: any = {
    emerald: 'bg-emerald-50 text-emerald-500',
    blue: 'bg-blue-50 text-blue-500',
    rose: 'bg-rose-50 text-rose-500',
    orange: 'bg-orange-50 text-orange-500',
    red: 'bg-red-50 text-red-500',
  };
  
  const isLocked = requiresAssessment && userStage === 'NEW';

  const handleClick = () => {
    if (isLocked) {
      Toast.show({ content: '该功能将根据您的测评结果量身定制，请先完成测评', icon: 'info' });
    } else {
      onClick();
    }
  };

  return (
    <div onClick={handleClick} className={`flex flex-col items-center gap-1.5 active:scale-95 transition-transform cursor-pointer ${isLocked ? 'opacity-50' : ''}`}>
      <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center relative ${isLocked ? 'bg-slate-100 text-slate-400' : colorMap[color]}`}>
        {React.cloneElement(icon, { className: 'w-5 h-5' })}
        {isLocked && (
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white flex items-center justify-center shadow-sm">
            <Lock className="w-2.5 h-2.5 text-slate-400" />
          </div>
        )}
      </div>
      <span className="text-[11px] text-slate-600 font-medium">{label}</span>
    </div>
  );
}
