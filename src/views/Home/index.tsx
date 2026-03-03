import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'antd-mobile';
import { 
  Mic, 
  Plus, 
  ShieldCheck, 
  Activity, 
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Camera
} from 'lucide-react';

type MessageRole = 'ai' | 'user' | 'card';

interface Message {
  id: string;
  role: MessageRole;
  content?: string;
  tags?: string[];
  options?: string[]; // 智能选项卡
  progress?: number; // 问诊进度
  isConclusion?: boolean; // 是否是结论安抚
  riskText?: string; // 风险提示文案
}

// 三大专病阶梯式问诊树配置
const DIALOGUE_TREE: Record<string, { q: string, opts: string[] }[]> = {
  A: [ // 认知衰退
    { q: "请问出现记忆力下降有多长时间了？", opts: ["不到半年", "1年左右", "好几年了"] },
    { q: "这种表现发生的频率大概是？", opts: ["每天发生", "每周数次", "每月偶尔"] },
    { q: "在过去的一年中，会把最近发生的重要事情完全忘记吗（如聚会、吃药）？", opts: ["经常忘记", "有时忘记", "很少忘记"] },
    { q: "记忆问题是否已经影响了日常活动（如独自购物、做饭做不好）？", opts: ["是，影响很大", "轻微影响", "没有影响"] },
    { q: "是否伴有其他身体不适，比如肢体不自主抖动、无力或睡眠障碍？", opts: ["没有", "有肢体抖动/无力", "睡眠严重障碍"] }
  ],
  B: [ // 癫痫
    { q: "发作时的具体表现是什么？", opts: ["全身僵硬抽搐", "局部肢体抽搐", "突然发呆走神"] },
    { q: "发作时，最长的持续时间大概是多久？", opts: ["<1分钟或数秒", "1-5分钟", "5-15分钟", ">15分钟"] },
    { q: "发作的时候是否伴有意识障碍（叫不醒、事后不知道发生了什么）？", opts: ["是，事后无记忆", "否，意识清醒"] },
    { q: "最近三个月内，大概发作了多少次？", opts: ["仅1次", "2-5次", "5次以上"] },
    { q: "请问之前是否已经规律服用过抗癫痫类药物？", opts: ["未曾用药", "已规律用药", "经常漏服"] }
  ],
  C: [ // 偏头痛
    { q: "请问您的头痛发作时，主要是什么感觉？", opts: ["像心跳一样跳痛/搏动痛", "像戴了紧箍咒的压迫感", "针扎或过电样痛"] },
    { q: "这种头痛通常是一侧痛，还是两边都痛？", opts: ["固定一侧痛", "两边都痛", "整个头都在痛"] },
    { q: "发作时，是否有以下伴随不适？", opts: ["恶心想吐", "怕光怕吵", "都有", "都没有"] },
    { q: "如果不吃药，这种头痛大概会持续多久？", opts: ["几个小时就缓解", "半天到三天(4-72h)", "持续好几天不缓解"] },
    { q: "头痛发作时，是否会严重影响您的工作、学习或日常活动？", opts: ["痛得完全没法动", "还能勉强坚持", "没太大影响"] }
  ]
};

export default function HomeView() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      role: 'ai', 
      content: '您好，我是数字华佗。请问您或您的家人最近哪里不舒服？',
      options: ['记忆力下降', '突发抽搐/晕厥', '剧烈头痛']
    }
  ]);
  const [branch, setBranch] = useState<'A' | 'B' | 'C' | null>(null);
  const [step, setStep] = useState(1);
  const [collectedTags, setCollectedTags] = useState<string[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleOptionClick = (option: string, messageId: string, currentStep: number) => {
    // 移除选项卡，防止重复点击
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, options: undefined } : msg
    ));

    // 用户发送选项
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: option }]);
    
    const newTags = [...collectedTags, option];
    setCollectedTags(newTags);
    setIsThinking(true);

    if (currentStep === 1) {
      // 第 1 轮：首屏分流
      let newBranch: 'A' | 'B' | 'C' = 'A';
      if (option === '突发抽搐/晕厥') newBranch = 'B';
      if (option === '剧烈头痛') newBranch = 'C';
      
      setBranch(newBranch);
      setStep(2);

      setTimeout(() => {
        setIsThinking(false);
        const nextQ = DIALOGUE_TREE[newBranch][0];
        setMessages(prev => [...prev, { 
          id: Date.now().toString(), 
          role: 'ai', 
          content: nextQ.q,
          options: nextQ.opts,
          progress: 20
        }]);
      }, 1000);
    } else if (currentStep >= 2 && currentStep <= 5) {
      // 第 2-5 轮：阶梯追问
      setStep(currentStep + 1);
      setTimeout(() => {
        setIsThinking(false);
        const nextQ = DIALOGUE_TREE[branch!][currentStep - 1];
        setMessages(prev => [...prev, { 
          id: Date.now().toString(), 
          role: 'ai', 
          content: nextQ.q,
          options: nextQ.opts,
          progress: currentStep * 20
        }]);
      }, 1000);
    } else if (currentStep === 6) {
      // 第 6 轮：结束并出卡片
      setStep(7);
      setTimeout(() => {
        setIsThinking(false);
        let conclusion = '';
        let riskText = '';
        
        if (branch === 'A') {
          conclusion = '收到。根据您的描述，可能存在早期认知功能衰退的迹象。建议尽早干预，延缓病程发展。';
          riskText = '高度疑似认知衰退，需警惕 AD 风险';
        } else if (branch === 'B') {
          conclusion = '收到。您的症状具有典型的癫痫发作特征，尤其是伴随意识障碍的情况，需要引起高度重视。';
          riskText = '高度疑似癫痫发作，需警惕持续状态风险';
        } else {
          conclusion = '收到。目前看，您的症状符合典型偏头痛的特征。别太担心，很多情况下这和压力或睡眠不足有关。';
          riskText = '高度疑似偏头痛，需警惕 MOH 风险';
        }

        // 免费安抚
        setMessages(prev => [...prev, { 
          id: Date.now().toString(), 
          role: 'ai', 
          content: conclusion,
          isConclusion: true
        }]);
        
        // 延迟出转化卡片
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            id: Date.now().toString(), 
            role: 'card', 
            tags: newTags.filter(t => t.length <= 8).slice(0, 3), // 提取3个短标签展示
            riskText
          }]);
        }, 1200);
      }, 1000);
    }
  };

  const handlePayment = () => {
    Toast.show({ icon: 'loading', content: '正在拉起支付...' });
    setTimeout(() => {
      Toast.show({ icon: 'success', content: '支付成功' });
      navigate('/assessment');
    }, 1500);
  };

  const handleInputClick = () => {
    Toast.show({ content: '请直接点击上方选项卡进行体验' });
  };

  return (
    // 方案A：保留全局 TabBar，使用 h-full 充满父容器（Layout 的 Outlet）
    <div className="flex flex-col h-full bg-[#F7F8FA] relative overflow-hidden">
      {/* 极浅弥散暖色渐变背景 (对齐阿福) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -right-[10%] w-[120%] h-[50%] bg-gradient-to-b from-[#E8F3FF] to-transparent opacity-80 blur-3xl" />
        <div className="absolute top-[20%] -left-[20%] w-[80%] h-[60%] bg-gradient-to-tr from-[#FFF0E6] to-transparent opacity-40 blur-3xl" />
      </div>

      {/* 极窄顶部状态栏 */}
      <div className="absolute top-0 left-0 w-full z-20 bg-white/80 backdrop-blur-md pt-3 pb-2 px-4 flex items-center justify-between shadow-[0_2px_10px_rgba(0,0,0,0.02)] border-b border-white/50">
        <div className="w-8 flex items-center justify-start cursor-pointer active:opacity-70">
          {/* 首页不需要返回按钮，留空占位保持居中 */}
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center space-x-1.5">
            <div className="relative w-5 h-5 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center border border-white/80 shadow-sm">
              <div className="absolute inset-0 rounded-full bg-[#1677FF] opacity-20 animate-pulse" />
              <Sparkles className="text-[#1677FF] w-3 h-3 z-10" />
            </div>
            <span className="text-[14px] font-semibold text-gray-900 tracking-wide">数字华佗</span>
          </div>
          <span className="text-[10px] text-gray-500 font-medium tracking-wide mt-0.5">
            {isThinking ? '正在分析症状...' : '全天候在线管家'}
          </span>
        </div>
        <div className="w-8" />
      </div>

      {/* 最大化对话视口 */}
      <div className="flex-1 overflow-y-auto px-4 pt-20 pb-24 z-10 scroll-smooth">
        <div className="flex flex-col space-y-6 max-w-md mx-auto">
          {messages.map((msg) => {
            if (msg.role === 'ai') {
              return (
                <div key={msg.id} className="flex flex-col items-start max-w-[92%] animate-fade-in">
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center border border-white/80 shadow-sm mr-2 flex-shrink-0 mt-1">
                      <Sparkles className="text-[#1677FF] w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      {/* 进度提示 */}
                      {msg.progress && (
                        <div className="flex items-center space-x-1 mb-1.5 ml-1">
                          <span className="text-[11px] text-gray-400 font-medium">问诊进度 {msg.progress}%</span>
                          <div className="w-2 h-2 rounded-full border border-gray-300 border-t-[#1677FF] animate-spin" />
                        </div>
                      )}
                      {/* 纯白悬浮卡片气泡 */}
                      <div className={`bg-white text-gray-800 rounded-2xl rounded-tl-sm px-4 py-3 text-[15px] leading-relaxed tracking-wide shadow-sm border border-gray-100/50 ${msg.isConclusion ? 'border-l-4 border-l-green-400' : ''}`}>
                        {msg.content}
                      </div>
                    </div>
                  </div>
                  {/* 智能选项卡 (Smart Chips 2.0) */}
                  {msg.options && (
                    <div className="flex flex-wrap gap-2 mt-3 ml-10">
                      {msg.options.map((opt, idx) => (
                        <div 
                          key={idx}
                          onClick={() => handleOptionClick(opt, msg.id, step)}
                          className="bg-white text-[#1677FF] border border-blue-100 shadow-sm rounded-xl px-4 py-2.5 text-[14px] font-medium cursor-pointer active:bg-blue-50 transition-colors flex items-center"
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            if (msg.role === 'user') {
              return (
                <div key={msg.id} className="flex items-start justify-end w-full animate-fade-in">
                  {/* 水滴状圆角 */}
                  <div className="bg-[#1677FF] text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-[0_4px_12px_rgba(22,119,255,0.2)] max-w-[85%] text-[15px] leading-relaxed tracking-wide">
                    {msg.content}
                  </div>
                </div>
              );
            }

            if (msg.role === 'card') {
              return (
                <div key={msg.id} className="w-full flex justify-center animate-fade-in-up mt-6">
                  <div className="bg-white rounded-3xl border border-blue-100 shadow-[0_12px_40px_rgba(22,119,255,0.08)] p-5 w-full relative overflow-hidden">
                    {/* 医疗诊断书装饰 */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full opacity-50 blur-2xl pointer-events-none" />
                    <div className="absolute -top-4 -right-4 opacity-[0.03] pointer-events-none transform rotate-12">
                      <Activity className="w-32 h-32 text-[#1677FF]" />
                    </div>

                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                          <CheckCircle2 className="w-4 h-4 text-[#1677FF]" />
                        </div>
                        <h3 className="text-[17px] font-bold text-gray-900 tracking-wide">初步症状提取图谱</h3>
                      </div>
                    </div>

                    {/* 动态风险提示 */}
                    {msg.riskText && (
                      <div className="bg-red-50 rounded-lg p-2.5 mb-4 border border-red-100 flex items-start relative z-10">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 mr-2 flex-shrink-0 animate-pulse" />
                        <span className="text-red-600 text-[13px] font-medium leading-relaxed">{msg.riskText}</span>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 mb-5 relative z-10">
                      {msg.tags?.map((tag, idx) => (
                        <span key={idx} className="bg-blue-50 text-[#1677FF] rounded-full px-3.5 py-1.5 text-[13px] font-medium border border-blue-100/50">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="bg-gray-50 rounded-xl p-3 mb-5 relative z-10 border border-gray-100">
                      <p className="text-[12px] text-gray-500 leading-relaxed">
                        为了排除器质性病变风险，我为您生成了一份<span className="font-semibold text-gray-700">《华西标准脑健康预检报告》</span>，包含用药禁忌筛查。
                      </p>
                    </div>

                    <button 
                      onClick={handlePayment}
                      className="w-full rounded-full bg-gradient-to-r from-[#1677FF] to-[#4096FF] text-white font-medium py-3.5 shadow-[0_8px_24px_rgba(22,119,255,0.3)] active:scale-95 transition-transform flex items-center justify-center relative z-10"
                    >
                      <span className="tracking-wide text-[15px]">支付 1 元解锁华西标准深度解析</span>
                      <ChevronRight className="w-4 h-4 ml-1 opacity-80" />
                    </button>
                  </div>
                </div>
              );
            }

            return null;
          })}

          {isThinking && (
            <div className="flex items-start max-w-[85%] animate-fade-in">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center border border-white/80 shadow-sm mr-2 flex-shrink-0 mt-1">
                <Sparkles className="text-[#1677FF] w-4 h-4" />
              </div>
              <div className="bg-white border border-gray-100/50 text-gray-500 rounded-2xl rounded-tl-sm px-5 py-3.5 shadow-sm flex items-center space-x-1.5">
                <div className="w-1.5 h-1.5 bg-[#1677FF] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-[#1677FF] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 bg-[#1677FF] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      {/* 极简悬浮输入舱 (对齐阿福样式) */}
      <div className="absolute bottom-0 left-0 w-full z-30 bg-white/90 backdrop-blur-xl border-t border-gray-100 pb-[calc(env(safe-area-inset-bottom)+12px)] pt-3 px-4">
        <div className="flex items-center justify-between max-w-md mx-auto space-x-3">
          {/* 语音切换 Icon */}
          <div 
            onClick={handleInputClick}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-600 active:bg-gray-100 transition-colors cursor-pointer flex-shrink-0"
          >
            <Mic className="w-6 h-6" strokeWidth={1.5} />
          </div>

          {/* 胶囊输入框 */}
          <div 
            onClick={handleInputClick}
            className="flex-1 h-10 bg-gray-100/80 rounded-full flex items-center px-4 cursor-pointer active:bg-gray-200 transition-colors"
          >
            <span className="text-gray-400 text-[14px]">发消息或按住说话...</span>
          </div>

          {/* 右侧 Icons */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <div 
              onClick={handleInputClick}
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-600 active:bg-gray-100 transition-colors cursor-pointer"
            >
              <Plus className="w-6 h-6" strokeWidth={1.5} />
            </div>
            <div 
              onClick={handleInputClick}
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-600 active:bg-gray-100 transition-colors cursor-pointer"
            >
              <Camera className="w-6 h-6" strokeWidth={1.5} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
