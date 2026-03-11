import { useState, useEffect } from 'react';
import { Toast } from 'antd-mobile';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      Toast.show({
        content: '网络已恢复',
        icon: 'success',
        duration: 2000,
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      Toast.show({
        content: '当前网络不可用，请检查网络设置',
        icon: 'fail',
        duration: 3000,
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
