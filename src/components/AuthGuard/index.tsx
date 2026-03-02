// File: src/components/AuthGuard/index.tsx
import React, { useState } from 'react';
import { Checkbox, Button } from 'antd-mobile';
import { useAppStore } from '../../store';
import { AGREEMENT_TITLE, AGREEMENT_CONTENT } from '../../configs/constants';

/**
 * 场景化合规路由守卫 (JIT Route Guard)
 * 拦截核心业务节点，强制要求签署《三方电子联合数据授权协议》
 */
export const RequireAgreement: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { hasSignedAgreement, signAgreement } = useAppStore();
  const [checked, setChecked] = useState(false);

  // 如果未签署协议，物理锁死后续视图，渲染合规拦截器
  if (!hasSignedAgreement) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 bg-gray-50 animate-fade-in">
        <div className="bg-white p-6 rounded-2xl shadow-sm w-full max-w-sm border border-gray-100">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4 mx-auto">
            <span className="text-primary text-xl font-bold">!</span>
          </div>
          <h2 className="text-lg font-bold mb-3 text-center text-gray-900">{AGREEMENT_TITLE}</h2>
          <div className="bg-gray-50 p-3 rounded-lg mb-6">
            <p className="text-sm text-gray-600 leading-relaxed text-justify">
              {AGREEMENT_CONTENT}
            </p>
          </div>
          <Checkbox
            checked={checked}
            onChange={setChecked}
            className="mb-6 text-sm text-gray-700"
            style={{ '--icon-size': '18px' }}
          >
            我已阅读并同意授权
          </Checkbox>
          <Button
            block
            color="primary"
            disabled={!checked}
            onClick={() => signAgreement()}
            className="rounded-xl font-medium"
          >
            确认授权并继续
          </Button>
        </div>
      </div>
    );
  }

  // 已签署，放行渲染子路由
  return <>{children}</>;
};
