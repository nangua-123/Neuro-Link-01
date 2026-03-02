// File: src/components/AudioRecord/index.tsx
import React, { useState } from 'react';
import { Button, Space, Card } from 'antd-mobile';
import { AudioOutline } from 'antd-mobile-icons';
import { speechService } from '../../services/speech';

interface AudioRecordProps {
  onComplete: (text: string) => void;
}

export default function AudioRecord({ onComplete }: AudioRecordProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');

  const handleStart = async () => {
    setIsRecording(true);
    setTranscript('');
    try {
      const result = await speechService.startListening();
      setTranscript(result.text);
      onComplete(result.text); // 将识别出的文本抛出给上层表单
    } catch (error) {
      console.error('Speech recognition failed:', error);
    } finally {
      setIsRecording(false);
    }
  };

  const handleStop = () => {
    speechService.stopListening();
    setIsRecording(false);
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <Space direction="vertical" align="center" style={{ '--gap': '24px' }}>
        <div className="text-center text-gray-500 text-sm">
          {isRecording ? '正在聆听，请清晰朗读...' : '点击下方按钮开始录音'}
        </div>
        
        <Button
          color="primary"
          loading={isRecording}
          loadingText="正在聆听..."
          onClick={isRecording ? handleStop : handleStart}
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: isRecording ? '0 0 20px rgba(22, 119, 255, 0.4)' : '0 4px 12px rgba(0,0,0,0.05)',
            transition: 'all 0.3s ease',
            border: 'none'
          }}
        >
          {!isRecording && <AudioOutline fontSize={32} />}
        </Button>

        {transcript && (
          <Card className="w-full mt-4 bg-gray-50 border-none shadow-sm rounded-xl">
            <div className="text-gray-800 leading-relaxed min-h-[60px] text-sm">
              {transcript}
            </div>
          </Card>
        )}
      </Space>
    </div>
  );
}
