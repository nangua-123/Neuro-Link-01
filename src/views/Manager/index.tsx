import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store';
import { 
  Sparkles, FileText, Activity, Zap, BrainCircuit, 
  ChevronRight, Pill, MapPin, HeartHandshake, ShieldAlert, Lock, CheckCircle2,
  Stethoscope, Smile, HeartPulse, QrCode, Watch, AlertCircle
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
import { showComingSoon } from '../../utils/ui';
import { ManagerSkeleton } from '../../components/ManagerSkeleton';
import { HeroBanner } from '../../components/HeroBanner';

const getDynamicInsight = (stage: string, tag: string, identity: string, hasDevice: boolean) => {
  const isFamily = identity === UserIdentity.FAMILY;
  const prefix = isFamily ? '长辈' : '您';
  
  if (stage === 'NEW') return `${prefix}的专属健康管家尚未激活。只需 3 分钟完成专业量表测评，AI 将为${prefix}量身定制康复与干预方案。`;
  
  if (!hasDevice) return `✨ AI 档案已建立。我是您的专属管家，请尽快连接监测设备或设置用药计划，以便我为您提供精准守护。`;

  if (tag === 'EPILEPSY') return `✨ AI 状态评估：良好。${prefix}已连续 14 天无异常发作，近期深睡比例提升 12%，请继续保持当前的用药规律。`;
  if (tag === 'MIGRAINE') return `✨ AI 预警：未来 48 小时气压变化剧烈，偏头痛发作风险轻微上升，请提醒${prefix}注意防寒保暖并随身携带备用药。`;
  if (tag === 'AD') return `✨ AI 洞察：本周脑力训练达标率为 80%，建议今日增加 15 分钟的记忆力强化训练，以巩固康复效果。`;
  
  return `✨ AI 守护中：今日各项体征平稳，未见异常波动。保持好心情，继续享受美好的一天。`;
};

export default function ManagerView() {
  const { userStage, completeTask, toggleMedication, recordPainkiller, selectedDiseaseTag, medicationPlans, connectedDevices, identity, purchasedAssets } = useAppStore();
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
    if (task.type === 'MEDICATION') {
      setSelectedMedTask(task);
      return;
    }
    
    if (task.actionRoute) {
      navigate(task.actionRoute, { state: { taskId: task.id } });
      return;
    }

    // Fallback for tasks without actionRoute
    if (task.type === 'DIARY') {
      setActiveTaskId(task.id);
      if (task.title.includes('头痛')) setIsMigraineDiaryVisible(true);
      else if (task.title.includes('行为')) setIsCDRDiaryVisible(true);
      else setIsSeizureDiaryVisible(true);
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
      transition: { staggerChildren: 0.08, delayChildren: 0.05 }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 24, scale: 0.98 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: 'spring', stiffness: 400, damping: 30 } 
    }
  };

  if (isLoading) return (
    <div className="bg-[#F4F7FB] pt-4 px-4">
      <ManagerSkeleton />
    </div>
  );

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="bg-[#FAFAFA] font-sans selection:bg-blue-100 relative h-full flex flex-col"
    >
      {/* Soft Diffuse Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-5%] left-[-10%] w-[60%] h-[30%] bg-blue-200/40 rounded-full blur-[80px]" />
        <div className="absolute top-[10%] right-[-10%] w-[50%] h-[40%] bg-indigo-200/30 rounded-full blur-[80px]" />
        <div className="absolute bottom-[20%] left-[10%] w-[40%] h-[30%] bg-purple-200/20 rounded-full blur-[80px]" />
      </div>
      
      <div className="flex-1 overflow-y-auto px-4 pt-5 pb-[120px] relative z-10 hide-scrollbar">
        <motion.h1 variants={itemVariants} className="text-[18px] font-bold text-slate-800 tracking-tight flex items-center gap-2 mb-2.5">
          下午好，张建国
        </motion.h1>
        <motion.div variants={itemVariants} className="flex items-start gap-2.5 bg-white/60 backdrop-blur-md px-4 py-3 rounded-[16px] shadow-[0_4px_16px_rgba(0,0,0,0.03)] border border-white/80 mb-5">
          <Sparkles className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-[13px] text-slate-700 leading-relaxed font-medium">
            {getDynamicInsight(userStage, selectedDiseaseTag, identity, connectedDevices.length > 0)}
          </p>
        </motion.div>

        <div className="space-y-5">
          {/* Module 1: AI Health Summary (Dynamic) */}
          <motion.div variants={itemVariants}>
            <AIHealthSummaryCard 
              userStage={userStage} 
              navigate={navigate} 
              diseaseTag={selectedDiseaseTag}
              hasMed={medicationPlans.length > 0}
              hasDevice={connectedDevices.length > 0}
              purchasedAssets={purchasedAssets}
            />
          </motion.div>

          {/* Module 2: Today's Tasks */}
          {userStage !== 'NEW' && (
            <motion.div variants={itemVariants}>
              <DailyTaskManager onTaskAction={handleTaskAction} />
            </motion.div>
          )}

          {/* Module 3: Vitals */}
          {userStage !== 'NEW' && (
            <motion.div variants={itemVariants} className="space-y-2.5">
              <h3 className="text-[18px] font-bold text-slate-800 px-1 tracking-tight">体征监测</h3>
              <VitalsGrid />
            </motion.div>
          )}

          {/* Module 4: Universal Toolbox */}
          <motion.div variants={itemVariants} className="space-y-2.5">
            <h3 className="text-[18px] font-bold text-slate-800 px-1 tracking-tight">健康工具箱</h3>
            <UniversalToolbox 
              userStage={userStage}
              navigate={navigate}
              onOpenCDR={() => { setActiveTaskId(undefined); setIsCDRDiaryVisible(true); }}
            />
          </motion.div>
        </div>
      </div>

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
          <div className="flex flex-col items-center pt-2 pb-1 w-full">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center mb-5 shadow-[0_4px_12px_rgba(16,185,129,0.3)]">
              <Pill className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-[20px] font-bold text-slate-800 mb-1">用药打卡</h3>
            <p className="text-[14px] text-slate-500 text-center mb-6">请确认您已按时服用以下药物</p>
            
            <div className="w-full bg-slate-50 rounded-[16px] p-4 mb-6 border border-slate-100">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[13px] font-medium text-slate-500">服药时间</span>
                <span className="text-[14px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">{selectedMedTask?.title.replace('服药', '')}</span>
              </div>
              <div className="h-[1px] w-full bg-slate-200/60 mb-3" />
              <div className="flex justify-between items-center">
                <span className="text-[13px] font-medium text-slate-500">药物名称与剂量</span>
                <span className="text-[15px] font-bold text-slate-800 text-right max-w-[60%]">{selectedMedTask?.description}</span>
              </div>
            </div>

            <div className="w-full flex flex-col gap-3">
              <button 
                onClick={handleConfirmMedication}
                className="w-full bg-emerald-500 text-white font-bold text-[16px] py-3.5 rounded-[16px] shadow-[0_4px_12px_rgba(16,185,129,0.2)] active:scale-95 transition-transform flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                一键打卡
              </button>
              <button 
                onClick={() => setSelectedMedTask(null)}
                className="w-full bg-slate-50 text-slate-500 font-medium text-[15px] py-3.5 rounded-[16px] active:scale-95 transition-transform"
              >
                稍后提醒
              </button>
            </div>
          </div>
        }
        closeOnAction
        onClose={() => setSelectedMedTask(null)}
      />
    </motion.div>
  );
}

function AIHealthSummaryCard({ userStage, navigate, diseaseTag, hasMed, hasDevice, purchasedAssets = [] }: any) {
  const { identity } = useAppStore();
  const isFamily = identity === UserIdentity.FAMILY;
  const hasPurchased = purchasedAssets.length > 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.05 }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 400, damping: 25 } }
  };

  if (userStage === 'NEW') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="bg-white/90 backdrop-blur-xl rounded-[24px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/30 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
        <div className="relative z-10">
          <h2 className="text-[18px] font-bold text-slate-800 mb-2">专属健康管家尚未激活</h2>
          <p className="text-[13px] text-slate-500 leading-relaxed mb-4">
            完成首次专业量表测评，AI 将为{isFamily ? '长辈' : '您'}量身定制康复与干预方案，并开启全景数据追踪。
          </p>
          <button onClick={() => navigate('/assessment')} className="w-full bg-blue-600 text-white text-[14px] py-3 rounded-[16px] font-bold shadow-[0_4px_12px_rgba(37,99,235,0.2)] active:scale-95 transition-transform flex items-center justify-center gap-1.5">
            立即开启测评
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
      className="bg-white/90 backdrop-blur-xl rounded-[24px] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-white relative overflow-hidden"
    >
      <motion.div variants={itemVariants} className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-1.5">
          <h2 className="text-[18px] font-bold text-slate-800 tracking-tight">AI 阶段健康摘要</h2>
        </div>
        <div onClick={() => navigate('/clinic-report')} className="flex items-center gap-0.5 text-[12px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full cursor-pointer active:scale-95 transition-transform">
          全景病历 <ChevronRight className="w-3 h-3" />
        </div>
      </motion.div>
      
      <div className="grid grid-cols-2 gap-2.5">
        {/* Metric 1: Medication */}
        <motion.div variants={itemVariants}
          onClick={hasMed ? undefined : () => navigate('/medications')}
          className={`flex flex-col items-center text-center rounded-[16px] p-3 border ${hasMed ? 'bg-emerald-50/50 border-emerald-100/50' : 'bg-slate-50/80 border-slate-100/80 cursor-pointer active:scale-95 transition-transform'}`}
        >
          <div className="flex items-center justify-center gap-1.5 mb-1.5">
            <Pill className={`w-4 h-4 ${hasMed ? 'text-emerald-500' : 'text-slate-400'}`} />
            <span className="text-[12px] font-medium text-slate-500">用药依从性</span>
          </div>
          <div className="flex items-baseline justify-center gap-1">
            <span className={`text-[18px] font-bold leading-none ${hasMed ? 'text-slate-800' : 'text-slate-400'}`}>{hasMed ? '98%' : '未设置'}</span>
          </div>
          <div className={`text-[12px] mt-1.5 ${hasMed ? 'text-emerald-600' : 'text-blue-500'}`}>
            {hasMed ? '本周表现极佳' : '去添加计划 ➔'}
          </div>
        </motion.div>

        {/* Metric 2: Device */}
        <motion.div variants={itemVariants}
          onClick={hasDevice ? undefined : () => navigate('/device-connect')}
          className={`flex flex-col items-center text-center rounded-[16px] p-3 border ${
            hasDevice ? 'bg-blue-50/50 border-blue-100/50' : 
            hasPurchased ? 'bg-indigo-50/50 border-indigo-100/50 cursor-pointer active:scale-95 transition-transform' : 
            'bg-slate-50/80 border-slate-100/80 cursor-pointer active:scale-95 transition-transform'
          }`}
        >
          <div className="flex items-center justify-center gap-1.5 mb-1.5">
            {hasPurchased && !hasDevice ? (
              <span className="text-[14px]">📦</span>
            ) : (
              <Watch className={`w-4 h-4 ${hasDevice ? 'text-blue-500' : 'text-slate-400'}`} />
            )}
            <span className="text-[12px] font-medium text-slate-500">体征监测</span>
          </div>
          <div className="flex items-baseline justify-center gap-1">
            <span className={`font-bold leading-none ${hasDevice ? 'text-[18px] text-slate-800' : hasPurchased ? 'text-[15px] text-indigo-600' : 'text-[15px] text-slate-400'}`}>
              {hasDevice ? '守护中' : hasPurchased ? '新设备待连接' : '未绑定设备'}
            </span>
          </div>
          <div className={`text-[12px] mt-1.5 ${hasDevice ? 'text-blue-600' : hasPurchased ? 'text-indigo-500' : 'text-slate-500'}`}>
            {hasDevice ? '心率 72bpm' : hasPurchased ? '收到后点击激活' : '去连接手表/手环 ➔'}
          </div>
        </motion.div>

        {/* Metric 3: Diary/Control */}
        <motion.div variants={itemVariants}
          onClick={() => navigate('/diary')}
          className="flex flex-col items-center text-center rounded-[16px] p-3 border bg-rose-50/50 border-rose-100/50 cursor-pointer active:scale-95 transition-transform"
        >
          <div className="flex items-center justify-center gap-1.5 mb-1.5">
            <Activity className="w-4 h-4 text-rose-500" />
            <span className="text-[12px] font-medium text-slate-500">发作控制</span>
          </div>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-[18px] font-bold text-slate-800 leading-none">0 <span className="text-[13px] font-normal text-slate-500 ml-0.5">次</span></span>
          </div>
          <div className="text-[12px] mt-1.5 text-rose-600">
            本周无异常记录
          </div>
        </motion.div>

        {/* Metric 4: Training (Dynamic based on disease) */}
        <motion.div variants={itemVariants}
          onClick={() => navigate('/feature/brain-training')}
          className={`flex flex-col items-center text-center rounded-[16px] p-3 border ${diseaseTag === 'AD' ? 'bg-indigo-50/50 border-indigo-100/50' : 'bg-slate-50/80 border-slate-100/80'} cursor-pointer active:scale-95 transition-transform`}
        >
          <div className="flex items-center justify-center gap-1.5 mb-1.5">
            <BrainCircuit className={`w-4 h-4 ${diseaseTag === 'AD' ? 'text-indigo-500' : 'text-slate-400'}`} />
            <span className="text-[12px] font-medium text-slate-500">脑力训练</span>
          </div>
          <div className="flex items-baseline justify-center gap-1">
            <span className={`text-[18px] font-bold leading-none ${diseaseTag === 'AD' ? 'text-slate-800' : 'text-slate-400'}`}>{diseaseTag === 'AD' ? '80%' : '待激活'}</span>
          </div>
          <div className={`text-[12px] mt-1.5 ${diseaseTag === 'AD' ? 'text-indigo-600' : 'text-blue-500'}`}>
            {diseaseTag === 'AD' ? '达标率良好' : '开启专属训练 ➔'}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function UniversalToolbox({ userStage, navigate, onOpenCDR }: any) {
  const { identity } = useAppStore();
  const isFamily = identity === UserIdentity.FAMILY;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 400, damping: 25 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
      className="bg-white/90 backdrop-blur-xl rounded-[24px] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-white space-y-4"
    >
      {/* Section A: 日常记录 */}
      <div>
        <motion.div variants={itemVariants} className="text-[14px] font-bold text-slate-800 mb-3 px-1">日常记录</motion.div>
        <div className="grid grid-cols-4 gap-y-4">
           <motion.div variants={itemVariants}><ToolItem icon={<Pill/>} label={isFamily ? "长辈用药" : "智能用药"} onClick={() => navigate('/medications')} color="emerald" userStage={userStage} /></motion.div>
           <motion.div variants={itemVariants}><ToolItem icon={<Activity/>} label={isFamily ? "长辈发作" : "发作日记"} onClick={() => navigate('/diary', { state: { defaultTab: 'EPILEPSY' } })} color="blue" userStage={userStage} /></motion.div>
           <motion.div variants={itemVariants}><ToolItem icon={<Zap/>} label={isFamily ? "长辈头痛" : "头痛闪记"} onClick={() => navigate('/diary', { state: { defaultTab: 'MIGRAINE' } })} color="rose" userStage={userStage} /></motion.div>
           <motion.div variants={itemVariants}><ToolItem icon={<HeartHandshake/>} label="照护日记" onClick={onOpenCDR} color="blue" userStage={userStage} /></motion.div>
        </div>
      </div>
      
      <motion.div variants={itemVariants} className="h-[1px] bg-slate-100/40 mx-2" />
      
      {/* Section B: 测评与洞察 */}
      <div>
        <motion.div variants={itemVariants} className="text-[14px] font-bold text-slate-800 mb-3 px-1">测评与洞察</motion.div>
        <div className="grid grid-cols-4 gap-y-4">
           <motion.div variants={itemVariants}><ToolItem icon={<FileText/>} label="专业量表" onClick={() => navigate('/assessment')} color="blue" userStage={userStage} /></motion.div>
           <motion.div variants={itemVariants}><ToolItem icon={<FileText/>} label="全景档案" onClick={() => navigate('/clinic-report')} color="blue" userStage={userStage} requiresAssessment /></motion.div>
        </div>
      </div>

      <motion.div variants={itemVariants} className="h-[1px] bg-slate-100/40 mx-2" />
      
      {/* Section C: 干预与守护 */}
      <div>
        <motion.div variants={itemVariants} className="text-[14px] font-bold text-slate-800 mb-3 px-1">干预与守护</motion.div>
        <div className="grid grid-cols-4 gap-y-4">
           <motion.div variants={itemVariants}><ToolItem icon={<BrainCircuit/>} label="脑力训练" onClick={() => navigate('/feature/brain-training')} color="blue" userStage={userStage} requiresAssessment /></motion.div>
           <motion.div variants={itemVariants}><ToolItem icon={<MapPin/>} label="安全围栏" onClick={() => navigate('/feature/lbs-fence')} color="orange" userStage={userStage} requiresAssessment /></motion.div>
           <motion.div variants={itemVariants}><ToolItem icon={<ShieldAlert/>} label="紧急录像" onClick={() => Toast.show({ content: '已触发紧急录像', icon: 'success' })} color="red" userStage={userStage} /></motion.div>
        </div>
      </div>

      <motion.div variants={itemVariants} className="h-[1px] bg-slate-100/40 mx-2" />
      
      {/* Section D: 医疗服务 */}
      <div>
        <motion.div variants={itemVariants} className="text-[14px] font-bold text-slate-800 mb-3 px-1">医疗服务</motion.div>
        <div className="grid grid-cols-4 gap-y-4">
           <motion.div variants={itemVariants}><ToolItem icon={<Stethoscope/>} label="专家复诊" onClick={() => showComingSoon('专家在线复诊', '华西神经内科专家团队即将入驻，为您提供线上复诊与处方调整服务。')} color="blue" userStage={userStage} /></motion.div>
           <motion.div variants={itemVariants}><ToolItem icon={<Smile/>} label="心理支持" onClick={() => showComingSoon('心理支持', '专业的心理咨询师团队即将上线，为您和家属提供情绪疏导与心理支持。')} color="emerald" userStage={userStage} /></motion.div>
        </div>
      </div>
    </motion.div>
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
    <div onClick={handleClick} className={`flex flex-col items-center gap-2 active:scale-95 transition-transform cursor-pointer ${isLocked ? 'opacity-50' : ''}`}>
      <div className={`w-12 h-12 rounded-[16px] flex items-center justify-center relative ${isLocked ? 'bg-slate-100 text-slate-400' : colorMap[color]}`}>
        {React.cloneElement(icon, { className: 'w-6 h-6' })}
        {isLocked && (
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white flex items-center justify-center shadow-sm">
            <Lock className="w-2.5 h-2.5 text-slate-400" />
          </div>
        )}
      </div>
      <span className="text-[12px] text-slate-700 font-medium">{label}</span>
    </div>
  );
}
