// File: src/components/AgreementPopup/index.tsx
import React, { useState } from 'react';
import { Popup, Checkbox, Button } from 'antd-mobile';
import { useAppStore } from '../../store';
import { AGREEMENT_TITLE, AGREEMENT_CONTENT } from '../../configs/constants';

interface Props {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

/**
 * JIT 拦截弹窗：用于在页面内（如点击支付按钮时）动态呼出协议签署
 */
export const AgreementPopup: React.FC<Props> = ({ visible, onClose, onConfirm }) => {
  const { signAgreement } = useAppStore();
  const [checked, setChecked] = useState(false);

  const handleConfirm = () => {
    signAgreement();
    onConfirm();
  };

  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      bodyStyle={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px', minHeight: '40vh' }}
    >
      <div className="p-6">
        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4 mx-auto">
          <span className="text-primary text-xl font-bold">!</span>
        </div>
        <h2 className="text-lg font-bold mb-3 text-center text-gray-900">{AGREEMENT_TITLE}</h2>
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
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
          onClick={handleConfirm}
          className="rounded-xl font-medium"
        >
          确认授权并继续
        </Button>
      </div>
    </Popup>
  );
};
