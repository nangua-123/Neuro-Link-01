// File: src/views/Manager/Migraine/index.tsx
import React, { useState } from 'react';
import { Button, Popup, Slider, Toast, Modal } from 'antd-mobile';
import { useAppStore } from '../../../store';
import { captureEnvironment } from '../../../services/envCapture';
import { MigraineTrigger, MigraineDiaryPayload } from '../../../interfaces/manager';

export default function MigraineManager() {
  const { painkillerDays, recordPainkiller } = useAppStore();
  const [showDiary, setShowDiary] = useState(false);
  const [painLevel, setPainLevel] = useState<number>(5);
  const [selectedTriggers, setSelectedTriggers] = useState<MigraineTrigger[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const triggers = [
    { label: '☕️ 咖啡', value: MigraineTrigger.COFFEE },
    { label: '🧋 奶茶', value: MigraineTrigger.MILK_TEA },
    { label: '🤯 压力大', value: MigraineTrigger.STRESS },
    { label: '🌙 熬夜缺觉', value: MigraineTrigger.LACK_OF_SLEEP },
    { label: '🩸 生理期', value: MigraineTrigger.MENSTRUATION },
  ];

  const toggleTrigger = (val: MigraineTrigger) => {
    if (selectedTriggers.includes(val)) {
      setSelectedTriggers(selectedTriggers.filter(t => t !== val));
    } else {
      setSelectedTriggers([...selectedTriggers, val]);
    }
  };

  const handleSaveDiary = async () => {
    setIsSubmitting(true);
    Toast.show({ icon: 'loading', content: '静默抓取环境数据...', duration: 0 });
    
    try {
      const envData = await captureEnvironment();
      const payload: MigraineDiaryPayload = {
        patientId: 'current_user',
        timestamp: Date.now(),
        painLevel,
        triggers: selectedTriggers,
        medicationTaken: [],
        environment: envData,
      };
      
      console.log('【头痛日记已保存】', payload);
      Toast.show({ icon: 'success', content: '记录成功，已生成诱因分析' });
      setShowDiary(false);
      setPainLevel(5);
      setSelectedTriggers([]);
    } catch (e) {
      Toast.show({ icon: 'fail', content: '环境数据获取失败' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMedication = () => {
    if (painkillerDays >= 15) {
      // MOH 药物防火墙：防呆锁死逻辑
      Modal.alert({
        header: <div className="text-5xl mb-2">🚫</div>,
        title: 'MOH 药物过度使用警告',
        content: (
          <div className="text-gray-600 text-sm leading-relaxed text-justify">
            您本月吃止痛药已达 <span className="text-red-500 font-bold text-base">15</span> 天！继续服用将引发严重的<span className="font-bold text-gray-900">药物过度使用性头痛 (MOH)</span>！请立即停止自行服药并联系主治医生！
          </div>
        ),
        confirmText: '立即联系医生',
        onConfirm: () => {
          Toast.show({ content: '正在为您接通华西专科医生...' });
        },
        closeOnMaskClick: false,
      });
    } else {
      recordPainkiller();
      Toast.show({ icon: 'success', content: `服药打卡成功 (本月累计 ${painkillerDays + 1} 天)` });
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#F7F9FC] relative pb-safe">
      <div className="p-6">
        <h2 className="text-2xl font-black text-gray-900 mb-2">头痛管家</h2>
        <p className="text-sm text-gray-500 mb-6">精准记录，告别偏头痛困扰</p>
        
        {/* MOH 防火墙面板 */}
        <div className="bg-white p-6 rounded-3xl shadow-sm mb-6 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800 text-lg">本月止痛药天数</h3>
            <span className={`text-xl font-black ${painkillerDays >= 10 ? 'text-red-500' : 'text-primary'}`}>
              {painkillerDays} <span className="text-sm text-gray-400 font-normal">/ 15天红线</span>
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 mb-6 overflow-hidden">
            <div 
              className={`h-2 rounded-full transition-all ${painkillerDays >= 15 ? 'bg-red-500' : painkillerDays >= 10 ? 'bg-orange-400' : 'bg-primary'}`} 
              style={{ width: `${Math.min((painkillerDays / 15) * 100, 100)}%` }}
            ></div>
          </div>
          <Button block color="primary" fill="outline" className="rounded-2xl font-bold h-12 border-2" onClick={handleMedication}>
            💊 服药打卡
          </Button>
        </div>
      </div>

      {/* 核心UI 1：又头痛了 */}
      <div className="absolute bottom-12 left-0 right-0 flex justify-center px-6 z-10">
        <Button 
          block 
          color="primary" 
          className="h-16 rounded-3xl font-black text-xl shadow-[0_8px_24px_rgba(22,119,255,0.3)]"
          onClick={() => setShowDiary(true)}
        >
          + 又头痛了
        </Button>
      </div>

      {/* 极简记录抽屉 */}
      <Popup 
        visible={showDiary} 
        onMaskClick={() => !isSubmitting && setShowDiary(false)} 
        bodyStyle={{ borderTopLeftRadius: '24px', borderTopRightRadius: '24px', minHeight: '60vh' }}
      >
        <div className="p-6">
          <h3 className="text-xl font-black text-gray-900 mb-8 text-center">记录本次发作</h3>
          
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-gray-800">疼痛等级 (VAS)</span>
              <span className="text-primary font-black text-xl">{painLevel} <span className="text-xs text-gray-400 font-normal">分</span></span>
            </div>
            <div className="px-2">
              <Slider 
                value={painLevel} 
                onChange={(val) => setPainLevel(val as number)} 
                min={1} max={10} step={1}
                marks={{ 1: '轻微', 5: '中度', 10: '剧痛' }}
              />
            </div>
          </div>

          <div className="mb-10">
            <span className="font-bold text-gray-800 block mb-4">可能诱因 (多选)</span>
            <div className="flex flex-wrap gap-3">
              {triggers.map(t => {
                const isActive = selectedTriggers.includes(t.value);
                return (
                  <div 
                    key={t.value}
                    onClick={() => toggleTrigger(t.value)}
                    className={`px-4 py-2 rounded-2xl text-sm font-medium transition-colors ${
                      isActive ? 'bg-primary text-white shadow-md shadow-blue-500/20' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {t.label}
                  </div>
                );
              })}
            </div>
          </div>

          <Button block color="primary" size="large" className="rounded-2xl font-bold h-14" loading={isSubmitting} onClick={handleSaveDiary}>
            保存并分析环境诱因
          </Button>
        </div>
      </Popup>
    </div>
  );
}
