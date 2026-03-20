import { useState, useEffect, useCallback } from 'react';

export function usePopupState(initialState = false, hashName = 'popup') {
  const [visible, setVisible] = useState(initialState);

  const open = useCallback(() => {
    setVisible(true);
    window.history.pushState({ popup: hashName }, '', `#${hashName}`);
  }, [hashName]);

  const close = useCallback(() => {
    if (visible) {
      setVisible(false);
      if (window.location.hash === `#${hashName}`) {
        window.history.back();
      }
    }
  }, [visible, hashName]);

  useEffect(() => {
    const handlePopState = () => {
      if (visible && window.location.hash !== `#${hashName}`) {
        setVisible(false);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [visible, hashName]);

  return [visible, open, close] as const;
}
