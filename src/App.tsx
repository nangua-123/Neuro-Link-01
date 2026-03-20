import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { useMedicationReminder } from './hooks/useMedicationReminder';
import { Dialog } from 'antd-mobile';
import { AlertTriangle } from 'lucide-react';
import { OfflineBoundary } from './components/OfflineBoundary';

function App() {
  // Initialize global medication reminder watcher
  useMedicationReminder();

  // Global Recall Alert Listener
  useEffect(() => {
    const handleGlobalRecall = (e: CustomEvent) => {
      Dialog.alert({
        title: (
          <div className="flex items-center gap-2 text-rose-600">
            <AlertTriangle size={24} />
            <span>高危预警</span>
          </div>
        ),
        content: `系统检测到：${e.detail.reason}。请密切关注患者状态，必要时请立即联系120或紧急联系人。`,
        confirmText: '我知道了',
      });
    };

    window.addEventListener('GLOBAL_RECALL_ALERT' as any, handleGlobalRecall);
    return () => {
      window.removeEventListener('GLOBAL_RECALL_ALERT' as any, handleGlobalRecall);
    };
  }, []);

  return (
    <OfflineBoundary>
      <RouterProvider router={router} />
    </OfflineBoundary>
  );
}

export default App;
