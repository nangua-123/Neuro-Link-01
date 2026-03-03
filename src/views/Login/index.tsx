// File: src/views/Login/index.tsx
import React, { useState, useEffect } from 'react';
import { Button, Input, Checkbox, Toast } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store';
import { UserIdentity } from '../../interfaces/user';

export default function LoginView() {
  const navigate = useNavigate();
  const { setAuth, signAgreement } = useAppStore();
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  // 默认选中患者本人，降低转化摩擦
  const [identity, setIdentity] = useState<UserIdentity>(UserIdentity.PATIENT);
  const [agreed, setAgreed] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown]);

  const handleSendCode = () => {
    if (!phone || phone.length !== 11) {
      Toast.show({ content: '请输入有效的11位手机号' });
      return;
    }
    setCountdown(60);
    Toast.show({ icon: 'success', content: '验证码已发送' });
  };

  const handleLogin = () => {
    if (!phone || phone.length !== 11) {
      Toast.show({ content: '请输入有效的手机号' });
      return;
    }
    if (!code || code.length !== 6) {
      Toast.show({ content: '请输入6位验证码' });
      return;
    }
    if (!agreed) {
      Toast.show({ content: '请阅读并同意服务协议与隐私政策' });
      return;
    }

    executeLogin();
  };

  const handleQuickLogin = (provider: 'wechat' | 'alipay') => {
    if (!agreed) {
      Toast.show({ content: '请阅读并同意服务协议与隐私政策' });
      return;
    }
    Toast.show({ icon: 'loading', content: `正在拉起${provider === 'wechat' ? '微信' : '支付宝'}授权...` });
    
    // 模拟第三方授权回调延迟
    setTimeout(() => {
      executeLogin();
    }, 1500);
  };

  const executeLogin = () => {
    setIsLoggingIn(true);
    setTimeout(() => {
      setIsLoggingIn(false);
      // 调用全局状态，设置登录态
      setAuth('mock_token_123', identity);
      if (agreed) {
        signAgreement();
      }
      Toast.show({ icon: 'success', content: '登录成功' });
      navigate('/', { replace: true });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#FCFCFD] flex flex-col relative overflow-hidden">
      <style>{`
        input[type="tel"]::-webkit-inner-spin-button,
        input[type="tel"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      `}</style>
      {/* 极度柔和的弥散渐变背景 (华西科技蓝主题) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -right-[10%] w-[120%] h-[50%] bg-gradient-to-b from-[#F0F5FF] to-transparent opacity-90 blur-3xl" />
        <div className="absolute top-[20%] -left-[20%] w-[80%] h-[60%] bg-gradient-to-tr from-[#E6F0FF] to-transparent opacity-80 blur-3xl" />
      </div>

      <div className="flex-1 px-6 pt-16 pb-8 flex flex-col z-10 overflow-y-auto items-center">
        
        {/* AI管家式欢迎区 */}
        <div className="flex flex-col items-center text-center mb-10 w-full animate-fade-in">
          <div className="w-20 h-20 mb-5 relative flex items-center justify-center">
            <div className="absolute inset-0 bg-[#1677FF] opacity-15 rounded-full blur-xl animate-pulse" />
            <div className="w-16 h-16 bg-white rounded-full shadow-[0_8px_24px_rgba(22,119,255,0.08)] flex items-center justify-center text-[#1677FF] z-10 border border-white/80">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a2 2 0 0 1 2 2c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2z"/>
                <path d="M16.24 7.76A6 6 0 1 1 7.76 16.24"/>
                <path d="M14.12 9.88a3 3 0 1 1-4.24 4.24"/>
              </svg>
            </div>
          </div>
          <h1 className="text-[24px] font-medium text-gray-900 tracking-wide mb-2">
            Hi，我是您的脑健康管家
          </h1>
          <p className="text-[14px] text-gray-500 tracking-wider">
            基于华西医学金标准
          </p>
        </div>

        {/* 胶囊型身份选择器 */}
        <div className="w-full max-w-[320px] bg-gray-100/60 backdrop-blur-md p-1 rounded-full flex mb-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div
            className={`flex-1 py-3 text-center rounded-full text-[15px] font-medium transition-all duration-300 cursor-pointer ${
              identity === UserIdentity.PATIENT 
                ? 'bg-white text-[#1677FF] shadow-[0_2px_12px_rgba(22,119,255,0.08)]' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setIdentity(UserIdentity.PATIENT)}
          >
            我是患者本人
          </div>
          <div
            className={`flex-1 py-3 text-center rounded-full text-[15px] font-medium transition-all duration-300 cursor-pointer ${
              identity === UserIdentity.FAMILY 
                ? 'bg-white text-[#1677FF] shadow-[0_2px_12px_rgba(22,119,255,0.08)]' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setIdentity(UserIdentity.FAMILY)}
          >
            我是家属 / 照护者
          </div>
        </div>

        {/* 无边界输入区 */}
        <div className="w-full max-w-[320px] space-y-4 mb-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="h-14 bg-slate-50 rounded-full px-6 flex items-center shadow-sm border border-transparent transition-all duration-300 focus-within:border-[#1677FF]/30 focus-within:bg-white focus-within:shadow-[0_4px_20px_rgba(22,119,255,0.08)]">
            <span className="text-gray-900 font-medium mr-3 text-[16px]">+86</span>
            <Input 
              placeholder="请输入手机号" 
              type="tel" 
              maxLength={11}
              value={phone}
              onChange={val => setPhone(val)}
              className="flex-1 text-[16px] bg-transparent"
              style={{ '--font-size': '16px' }}
            />
          </div>

          <div className="h-14 bg-slate-50 rounded-full px-6 flex items-center shadow-sm border border-transparent transition-all duration-300 focus-within:border-[#1677FF]/30 focus-within:bg-white focus-within:shadow-[0_4px_20px_rgba(22,119,255,0.08)]">
            <Input 
              placeholder="请输入验证码" 
              type="tel" 
              maxLength={6}
              value={code}
              onChange={val => setCode(val)}
              className="flex-1 text-[16px] bg-transparent"
              style={{ '--font-size': '16px' }}
            />
            <div className="w-[1px] h-4 bg-gray-200 mx-3" />
            <Button 
              fill="none" 
              className={`whitespace-nowrap text-[15px] font-medium p-0 ${countdown > 0 ? 'text-gray-400' : 'text-[#1677FF]'}`}
              onClick={handleSendCode}
              disabled={countdown > 0}
              style={{ border: 'none' }}
            >
              {countdown > 0 ? `${countdown}s 后重试` : '获取验证码'}
            </Button>
          </div>
        </div>

        {/* 丝滑主登录按钮 */}
        <div className="w-full max-w-[320px] mb-6 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <Button 
            block 
            color="primary"
            loading={isLoggingIn}
            onClick={handleLogin}
            className="w-full border-none text-[17px] font-medium h-[54px] shadow-[0_8px_24px_rgba(22,119,255,0.25)] active:scale-[0.98] transition-transform"
            style={{ 
              '--background-color': '#1677FF', 
              '--text-color': '#FFFFFF',
              '--border-radius': '9999px'
            }}
          >
            安全登录
          </Button>
        </div>

        {/* 协议勾选 */}
        <div className="w-full max-w-[320px] flex justify-center px-2 animate-fade-in" style={{ animationDelay: '400ms' }}>
          <Checkbox 
            checked={agreed} 
            onChange={val => setAgreed(val)}
            style={{ '--icon-size': '16px', '--font-size': '12px' }}
            className="text-gray-400"
          >
            <span className="text-[12px] leading-relaxed text-gray-400">
              阅读并同意
              <span className="text-[#1677FF] px-1 active:opacity-70" onClick={(e) => { e.stopPropagation(); Toast.show('查看服务协议'); }}>《服务协议》</span>
              与
              <span className="text-[#1677FF] active:opacity-70" onClick={(e) => { e.stopPropagation(); Toast.show('查看隐私政策'); }}>《隐私政策》</span>
            </span>
          </Checkbox>
        </div>

        {/* 底部快捷登录区 */}
        <div className="mt-auto pt-10 pb-4 w-full flex justify-center gap-4 animate-fade-in" style={{ animationDelay: '500ms' }}>
          <div 
            className="bg-white/60 backdrop-blur-md rounded-full px-5 py-2.5 flex items-center gap-2 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-white/60 cursor-pointer active:scale-95 transition-transform" 
            onClick={() => handleQuickLogin('wechat')}
          >
            <svg viewBox="0 0 1024 1024" width="18" height="18" fill="#07C160">
              <path d="M682.666667 341.333333c-17.066667 0-34.133333 4.266667-51.2 8.533334C588.8 204.8 439.466667 106.666667 277.333333 106.666667 123.733333 106.666667 0 213.333333 0 341.333333c0 72.533333 38.4 136.533333 98.133333 183.466667l-25.6 76.8 85.333334-42.666667c34.133333 12.8 72.533333 21.333333 115.2 21.333334 12.8 0 25.6 0 38.4-4.266667C302.933333 588.8 302.933333 601.6 302.933333 618.666667c0 149.333333 149.333333 273.066667 341.333334 273.066666 42.666667 0 85.333333-8.533333 123.733333-21.333333l85.333333 42.666667-25.6-76.8c55.466667-46.933333 93.866667-110.933333 93.866667-183.466667 0-149.333333-149.333333-273.066667-341.333333-273.066667zM192 277.333333c21.333333 0 38.4 17.066667 38.4 38.4s-17.066667 38.4-38.4 38.4-38.4-17.066667-38.4-38.4 17.066667-38.4 38.4-38.4z m170.666667 76.8c-21.333333 0-38.4-17.066667-38.4-38.4s17.066667-38.4 38.4-38.4 38.4 17.066667 38.4 38.4-17.066667 38.4-38.4 38.4z m234.666666 149.333334c-17.066667 0-34.133333-12.8-34.133333-34.133334s12.8-34.133333 34.133333-34.133333 34.133333 12.8 34.133334 34.133333-17.066667 34.133334-34.133334 34.133334z m170.666667 0c-17.066667 0-34.133333-12.8-34.133333-34.133334s12.8-34.133333 34.133333-34.133333 34.133333 12.8 34.133334 34.133333-17.066667 34.133334-34.133334 34.133334z" />
            </svg>
            <span className="text-[13px] text-gray-600 font-medium tracking-wide">微信登录</span>
          </div>
          <div 
            className="bg-white/60 backdrop-blur-md rounded-full px-5 py-2.5 flex items-center gap-2 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-white/60 cursor-pointer active:scale-95 transition-transform" 
            onClick={() => handleQuickLogin('alipay')}
          >
            <svg viewBox="0 0 1024 1024" width="18" height="18" fill="#1677FF">
              <path d="M874.666667 1024H149.333333C68.266667 1024 0 955.733333 0 874.666667V149.333333C0 68.266667 68.266667 0 149.333333 0h725.333334C955.733333 0 1024 68.266667 1024 149.333333v725.333334C1024 955.733333 955.733333 1024 874.666667 1024zM716.8 469.333333H580.266667c17.066667-51.2 29.866667-106.666667 38.4-162.133333h123.733333v-76.8H512V149.333333h-85.333333v81.066667H192v76.8h337.066667c-8.533333 46.933333-21.333333 93.866667-38.4 136.533333-34.133333-64-64-123.733333-85.333334-174.933333l-76.8 34.133333c25.6 55.466667 59.733333 123.733333 98.133334 192-38.4 46.933333-85.333333 89.6-136.533334 123.733334l46.933334 64c59.733333-38.4 115.2-89.6 157.866666-145.066667 42.666667 64 102.4 115.2 174.933334 157.866667l51.2-68.266667c-64-38.4-119.466667-85.333333-157.866667-145.066667 21.333333-46.933333 38.4-98.133333 51.2-153.6h196.266667v-59.733333z" />
            </svg>
            <span className="text-[13px] text-gray-600 font-medium tracking-wide">支付宝登录</span>
          </div>
        </div>

      </div>
    </div>
  );
}

