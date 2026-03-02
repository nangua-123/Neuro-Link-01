// File: src/views/Login/index.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Radio, Space, Toast } from 'antd-mobile';
import { useAppStore } from '../../store';
import { UserIdentity } from '../../interfaces/user';

export default function LoginView() {
  const navigate = useNavigate();
  const { setAuth } = useAppStore();
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [identity, setIdentity] = useState<UserIdentity>(UserIdentity.PATIENT);

  const handleLogin = () => {
    if (!phone || !code) {
      Toast.show({ content: '请填写手机号和验证码' });
      return;
    }
    
    // 模拟登录成功逻辑
    const mockToken = 'mock_token_' + Date.now();
    // 若选择家属，Mock 写入一个 Family ID
    const mockFamilyId = identity === UserIdentity.FAMILY ? 'fam_' + Date.now() : undefined;
    
    // 写入 Zustand Store，严禁在此页面弹出《数据授权协议》
    setAuth(mockToken, identity, mockFamilyId);
    Toast.show({ content: '登录成功', icon: 'success' });
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-white p-6 flex flex-col">
      <div className="mt-12 mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Neuro-Link</h1>
        <p className="text-gray-500">华西脑健康 - 极简准入</p>
      </div>

      <div className="space-y-6 flex-1">
        <div>
          <div className="text-sm font-medium text-gray-700 mb-2">手机号</div>
          <Input
            placeholder="请输入手机号"
            value={phone}
            onChange={val => setPhone(val)}
            className="bg-gray-50 px-4 py-3 rounded-xl"
            clearable
          />
        </div>

        <div>
          <div className="text-sm font-medium text-gray-700 mb-2">验证码</div>
          <div className="flex gap-3">
            <Input
              placeholder="请输入验证码"
              value={code}
              onChange={val => setCode(val)}
              className="bg-gray-50 px-4 py-3 rounded-xl flex-1"
              clearable
            />
            <Button className="rounded-xl whitespace-nowrap" color="primary" fill="outline">
              获取验证码
            </Button>
          </div>
        </div>

        <div>
          <div className="text-sm font-medium text-gray-700 mb-3">请选择您的身份</div>
          <Radio.Group value={identity} onChange={(val) => setIdentity(val as UserIdentity)}>
            <Space direction="vertical" block>
              <Radio value={UserIdentity.PATIENT} className="w-full bg-gray-50 p-3 rounded-xl">
                我是患者本人
              </Radio>
              <Radio value={UserIdentity.FAMILY} className="w-full bg-gray-50 p-3 rounded-xl">
                我是家属/照护者
              </Radio>
            </Space>
          </Radio.Group>
        </div>

        <div className="pt-6">
          <Button block color="primary" size="large" onClick={handleLogin} className="rounded-xl font-bold">
            快捷登录
          </Button>
        </div>
      </div>
    </div>
  );
}
