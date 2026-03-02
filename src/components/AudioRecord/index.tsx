// File: src/components/AudioRecord/index.tsx
import React, { useState } from 'react';
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

  return <div>UI Placeholder</div>;
}
