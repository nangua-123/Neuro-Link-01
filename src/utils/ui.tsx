import React from 'react';
import { Modal } from 'antd-mobile';
import { Sparkles } from 'lucide-react';

/**
 * 统一的“功能开发中/敬请期待”优雅提示
 * 替代生硬的 Toast.show('正在加载...')
 */
export const showComingSoon = (
  title: string = '功能升级中',
  description: string = '华西专病团队正在为您打磨此功能，即将开放体验。'
) => {
  Modal.show({
    content: (
      <div className="flex flex-col items-center justify-center py-4">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 shadow-[0_4px_20px_rgba(59,130,246,0.15)]">
          <Sparkles className="w-8 h-8 text-blue-500" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2 tracking-tight">{title}</h3>
        <p className="text-sm text-slate-500 text-center leading-relaxed font-medium">
          {description}
        </p>
      </div>
    ),
    closeOnAction: true,
    actions: [
      {
        key: 'confirm',
        text: '我知道了',
        primary: true,
        className: 'font-semibold text-blue-600 text-base',
      },
    ],
  });
};
