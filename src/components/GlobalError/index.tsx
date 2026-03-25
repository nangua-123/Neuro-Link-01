import React from 'react';
import { useRouteError, useNavigate } from 'react-router-dom';
import { Button } from 'antd-mobile';
import { AlertCircle } from 'lucide-react';

export default function GlobalError() {
  const error = useRouteError();
  const navigate = useNavigate();

  return (
    <div className="h-full bg-[#FAFAFA] flex flex-col items-center justify-center p-6 text-center overflow-y-auto hide-scrollbar">
      <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
        <AlertCircle className="w-10 h-10 text-red-500" />
      </div>
      <h1 className="text-xl font-bold text-slate-900 mb-3">系统开小差了</h1>
      <p className="text-sm text-slate-500 mb-8 max-w-[260px] leading-relaxed">
        抱歉，加载页面时遇到了一点问题。您可以尝试刷新或返回首页。
      </p>
      <div className="flex gap-4 w-full max-w-[240px]">
        <Button 
          className="flex-1 rounded-full border-slate-200 text-slate-600"
          onClick={() => window.location.reload()}
        >
          刷新
        </Button>
        <Button 
          color="primary" 
          className="flex-1 rounded-full shadow-[0_8px_20px_rgba(37,99,235,0.2)]"
          onClick={() => navigate('/', { replace: true })}
        >
          返回首页
        </Button>
      </div>
    </div>
  );
}
