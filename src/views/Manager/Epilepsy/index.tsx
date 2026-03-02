// File: src/views/Manager/Epilepsy/index.tsx
import React, { useState, useEffect } from 'react';
import { Button, Popup, Radio, Space } from 'antd-mobile';
import { useRecallStore, DangerLevel, RecallReason } from '../../../store/recall';

export default function EpilepsyManager() {
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [showQuestion, setShowQuestion] = useState(false);
  const [duration, setDuration] = useState<string>('');
  const { triggerRecall } = useRecallStore();

  const startRecording = () => {
    setIsRecording(true);
    setCountdown(3);
  };

  // 模拟录像倒计时
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording && countdown > 0) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    } else if (isRecording && countdown === 0) {
      setIsRecording(false);
      setShowQuestion(true); // 录像结束，强制弹出必选项卡片
    }
    return () => clearTimeout(timer);
  }, [isRecording, countdown]);

  const handleSubmit = () => {
    setShowQuestion(false);
    // 触发红线逻辑
    if (duration === 'OVER_5_MIN') {
      triggerRecall({
        level: DangerLevel.CRITICAL,
        reason: RecallReason.EPILEPSY_STATUS,
        message: '患者癫痫发作已超过 5 分钟，极可能进入癫痫持续状态！',
        patientId: 'current_user',
        timestamp: Date.now()
      });
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 relative pb-safe">
      <div className="p-5">
        <h2 className="text-2xl font-black text-gray-900 mb-4">护航管家</h2>
        <div className="bg-white p-5 rounded-2xl shadow-sm mb-4 border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-2">今日状态</h3>
          <p className="text-sm text-gray-500">脑电波监测正常，未发现异常放电。</p>
        </div>
      </div>

      {/* 底部悬浮紧急录像按钮 (救命级防呆) */}
      <div className="absolute bottom-12 left-0 right-0 flex justify-center px-6 z-10">
        <div 
          className="w-36 h-36 bg-[#FF3141] rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(255,49,65,0.4)] active:scale-95 transition-transform"
          onClick={startRecording}
        >
          <div className="w-32 h-32 border-4 border-white/30 rounded-full flex flex-col items-center justify-center">
            <div className="w-10 h-10 bg-white rounded-md mb-2"></div>
            <span className="text-white font-black text-base tracking-widest">紧急录像</span>
          </div>
        </div>
      </div>

      {/* 模拟录像全屏遮罩 */}
      {isRecording && (
        <div className="fixed inset-0 z-[9000] bg-black flex flex-col items-center justify-center" style={{ touchAction: 'none' }}>
          <div className="absolute top-12 right-6 flex items-center gap-2 bg-red-600/20 px-3 py-1 rounded-full">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-red-500 font-mono text-lg font-bold">00:0{3 - countdown}</span>
          </div>
          <div className="w-24 h-24 border-2 border-white/20 rounded-xl mb-6 flex items-center justify-center">
            <span className="text-white/50 text-sm">Camera</span>
          </div>
          <span className="text-white text-2xl font-bold">正在录像...</span>
        </div>
      )}

      {/* 录像结束后的必选项卡片 */}
      <Popup visible={showQuestion} maskStyle={{ backgroundColor: 'rgba(0,0,0,0.8)' }} closeOnMaskClick={false}>
        <div className="p-6 bg-white rounded-t-3xl">
          <h3 className="text-2xl font-black text-gray-900 mb-6 text-center">发作了多久？</h3>
          <Radio.Group value={duration} onChange={val => setDuration(val as string)}>
            <Space direction="vertical" block className="gap-4">
              <Radio value="UNDER_1_MIN" className="w-full bg-gray-50 p-5 rounded-2xl font-bold text-lg">1分钟内</Radio>
              <Radio value="UNDER_5_MIN" className="w-full bg-gray-50 p-5 rounded-2xl font-bold text-lg">不到5分钟</Radio>
              <Radio value="OVER_5_MIN" className="w-full bg-red-50 p-5 rounded-2xl font-bold text-lg text-[#FF3141] border border-red-200">
                超过5分钟了！
              </Radio>
            </Space>
          </Radio.Group>
          <Button 
            block 
            color="primary" 
            size="large" 
            className="mt-8 rounded-2xl font-bold text-xl h-14" 
            disabled={!duration}
            onClick={handleSubmit}
          >
            保存记录
          </Button>
        </div>
      </Popup>
    </div>
  );
}
