import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'antd-mobile';
import { 
  Mic, 
  Keyboard, 
  Plus, 
  ShieldCheck, 
  Activity, 
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Camera,
  Send
} from 'lucide-react';

type MessageRole = 'ai' | 'user' | 'card';

interface OptionDef {
  label: string;
  tag?: string;
  nextNodeId: string;
}

interface NodeDef {
  id: string;
  aiText: string;
  options?: OptionDef[];
  progress?: number;
  isConclusion?: boolean;
  riskText?: string;
}

interface Message {
  id: string;
  role: MessageRole;
  content?: string;
  tags?: string[];
  options?: string[]; // 智能选项卡 (仅用于渲染)
  nodeId?: string; // 关联的节点 ID
  progress?: number;
  isConclusion?: boolean;
  riskText?: string;
}

// ==========================================
// 数据层：三大专病阶梯式问诊树 (状态机配置)
// ==========================================
const getDialogueTree = (isFamily: boolean): Record<string, NodeDef> => ({
  root: {
    id: 'root',
    aiText: isFamily ? '您好，我是数字华佗。请问您的长辈最近哪里不舒服？' : '您好，我是数字华佗。请问您最近哪里不舒服？',
    options: [
      { label: '记忆力下降', tag: '记忆力下降', nextNodeId: 'ad_q1' },
      { label: '突发抽搐/晕厥', tag: '突发抽搐', nextNodeId: 'ep_q1' },
      { label: '剧烈头痛', tag: '剧烈头痛', nextNodeId: 'mg_q1' }
    ]
  },
  // --- 分支 A: 认知衰退 ---
  ad_q1: {
    id: 'ad_q1', aiText: isFamily ? '请问长辈出现记忆力下降有多长时间了？' : '请问出现记忆力下降有多长时间了？', progress: 20,
    options: [
      { label: '不到半年', tag: '病程<半年', nextNodeId: 'ad_q2' },
      { label: '1年左右', tag: '病程约1年', nextNodeId: 'ad_q2' },
      { label: '好几年了', tag: '病程>数年', nextNodeId: 'ad_q2' }
    ]
  },
  ad_q2: {
    id: 'ad_q2', aiText: '这种表现发生的频率大概是？', progress: 40,
    options: [
      { label: '每天发生', tag: '高频发生', nextNodeId: 'ad_q3' },
      { label: '每周数次', tag: '中频发生', nextNodeId: 'ad_q3' },
      { label: '每月偶尔', tag: '低频发生', nextNodeId: 'ad_q3' }
    ]
  },
  ad_q3: {
    id: 'ad_q3', aiText: isFamily ? '在过去的一年中，长辈会把最近发生的重要事情完全忘记吗（如聚会、吃药）？' : '在过去的一年中，会把最近发生的重要事情完全忘记吗（如聚会、吃药）？', progress: 60,
    options: [
      { label: '经常忘记', tag: '近事遗忘严重', nextNodeId: 'ad_q4' },
      { label: '有时忘记', tag: '偶有近事遗忘', nextNodeId: 'ad_q4' },
      { label: '很少忘记', tag: '近事记忆尚可', nextNodeId: 'ad_q4' }
    ]
  },
  ad_q4: {
    id: 'ad_q4', aiText: isFamily ? '记忆问题是否已经影响了长辈的日常活动（如独自购物、做饭做不好）？' : '记忆问题是否已经影响了日常活动（如独自购物、做饭做不好）？', progress: 80,
    options: [
      { label: '是，影响很大', tag: '日常能力受损', nextNodeId: 'ad_q5' },
      { label: '轻微影响', tag: '轻微影响日常', nextNodeId: 'ad_q5' },
      { label: '没有影响', tag: '日常能力正常', nextNodeId: 'ad_q5' }
    ]
  },
  ad_q5: {
    id: 'ad_q5', aiText: isFamily ? '长辈是否伴有其他身体不适，比如肢体不自主抖动、无力或睡眠障碍？' : '是否伴有其他身体不适，比如肢体不自主抖动、无力或睡眠障碍？', progress: 95,
    options: [
      { label: '没有', nextNodeId: 'ad_end' },
      { label: '有肢体抖动/无力', tag: '伴随运动症状', nextNodeId: 'ad_end' },
      { label: '睡眠严重障碍', tag: '伴随睡眠障碍', nextNodeId: 'ad_end' }
    ]
  },
  ad_end: {
    id: 'ad_end', isConclusion: true,
    aiText: isFamily ? '收到。根据您的描述，长辈可能存在早期认知功能衰退的迹象。建议尽早干预，延缓病程发展。' : '收到。根据您的描述，可能存在早期认知功能衰退的迹象。建议尽早干预，延缓病程发展。',
    riskText: '高度疑似认知衰退，需警惕 AD 风险'
  },

  // --- 分支 B: 癫痫 ---
  ep_q1: {
    id: 'ep_q1', aiText: '发作时的具体表现是什么？', progress: 20,
    options: [
      { label: '全身僵硬抽搐', tag: '全面强直阵挛', nextNodeId: 'ep_q2' },
      { label: '局部肢体抽搐', tag: '局灶性运动', nextNodeId: 'ep_q2' },
      { label: '突然发呆走神', tag: '失神发作', nextNodeId: 'ep_q2' }
    ]
  },
  ep_q2: {
    id: 'ep_q2', aiText: '发作时，最长的持续时间大概是多久？', progress: 40,
    options: [
      { label: '<1分钟或数秒', tag: '持续<1min', nextNodeId: 'ep_q3' },
      { label: '1-5分钟', tag: '持续1-5min', nextNodeId: 'ep_q3' },
      { label: '5-15分钟', tag: '持续5-15min', nextNodeId: 'ep_q3' },
      { label: '>15分钟', tag: '持续>15min', nextNodeId: 'ep_q3' }
    ]
  },
  ep_q3: {
    id: 'ep_q3', aiText: '发作的时候是否伴有意识障碍（叫不醒、事后不知道发生了什么）？', progress: 60,
    options: [
      { label: '是，事后无记忆', tag: '伴意识障碍', nextNodeId: 'ep_q4' },
      { label: '否，意识清醒', tag: '意识清醒', nextNodeId: 'ep_q4' }
    ]
  },
  ep_q4: {
    id: 'ep_q4', aiText: isFamily ? '长辈最近三个月内，大概发作了多少次？' : '最近三个月内，大概发作了多少次？', progress: 80,
    options: [
      { label: '仅1次', tag: '单次发作', nextNodeId: 'ep_q5' },
      { label: '2-5次', tag: '低频发作', nextNodeId: 'ep_q5' },
      { label: '5次以上', tag: '高频发作', nextNodeId: 'ep_q5' }
    ]
  },
  ep_q5: {
    id: 'ep_q5', aiText: isFamily ? '请问长辈之前是否已经规律服用过抗癫痫类药物？' : '请问之前是否已经规律服用过抗癫痫类药物？', progress: 95,
    options: [
      { label: '未曾用药', tag: '初次发病/未治', nextNodeId: 'ep_end' },
      { label: '已规律用药', tag: '规律服药中', nextNodeId: 'ep_end' },
      { label: '经常漏服', tag: '依从性差', nextNodeId: 'ep_end' }
    ]
  },
  ep_end: {
    id: 'ep_end', isConclusion: true,
    aiText: isFamily ? '收到。长辈的症状具有典型的癫痫发作特征，尤其是伴随意识障碍的情况，需要引起高度重视。' : '收到。您的症状具有典型的癫痫发作特征，尤其是伴随意识障碍的情况，需要引起高度重视。',
    riskText: '高度疑似癫痫发作，需警惕持续状态风险'
  },

  // --- 分支 C: 偏头痛 ---
  mg_q1: {
    id: 'mg_q1', aiText: isFamily ? '请问长辈的头痛发作时，主要是什么感觉？' : '请问您的头痛发作时，主要是什么感觉？', progress: 20,
    options: [
      { label: '像心跳一样跳痛/搏动痛', tag: '搏动性痛', nextNodeId: 'mg_q2' },
      { label: '像戴了紧箍咒的压迫感', tag: '压迫感', nextNodeId: 'mg_q2' },
      { label: '针扎或过电样痛', tag: '神经痛', nextNodeId: 'mg_q2' }
    ]
  },
  mg_q2: {
    id: 'mg_q2', aiText: '这种头痛通常是一侧痛，还是两边都痛？', progress: 40,
    options: [
      { label: '固定一侧痛', tag: '单侧痛', nextNodeId: 'mg_q3' },
      { label: '两边都痛', tag: '双侧痛', nextNodeId: 'mg_q3' },
      { label: '整个头都在痛', tag: '全头痛', nextNodeId: 'mg_q3' }
    ]
  },
  mg_q3: {
    id: 'mg_q3', aiText: '发作时，是否有以下伴随不适？', progress: 60,
    options: [
      { label: '恶心想吐', tag: '伴恶心呕吐', nextNodeId: 'mg_q4' },
      { label: '怕光怕吵', tag: '畏光畏声', nextNodeId: 'mg_q4' },
      { label: '都有', tag: '伴恶心/畏光声', nextNodeId: 'mg_q4' },
      { label: '都没有', nextNodeId: 'mg_q4' }
    ]
  },
  mg_q4: {
    id: 'mg_q4', aiText: '如果不吃药，这种头痛大概会持续多久？', progress: 80,
    options: [
      { label: '几个小时就缓解', tag: '持续<4h', nextNodeId: 'mg_q5' },
      { label: '半天到三天(4-72h)', tag: '持续4-72h', nextNodeId: 'mg_q5' },
      { label: '持续好几天不缓解', tag: '持续>72h', nextNodeId: 'mg_q5' }
    ]
  },
  mg_q5: {
    id: 'mg_q5', aiText: isFamily ? '头痛发作时，是否会严重影响长辈的工作、学习或日常活动？' : '头痛发作时，是否会严重影响您的工作、学习或日常活动？', progress: 95,
    options: [
      { label: '痛得完全没法动', tag: '重度失能', nextNodeId: 'mg_end' },
      { label: '还能勉强坚持', tag: '轻中度影响', nextNodeId: 'mg_end' },
      { label: '没太大影响', tag: '无明显失能', nextNodeId: 'mg_end' }
    ]
  },
  mg_end: {
    id: 'mg_end', isConclusion: true,
    aiText: isFamily ? '收到。目前看，长辈的症状符合典型偏头痛的特征。别太担心，很多情况下这和压力或睡眠不足有关。' : '收到。目前看，您的症状符合典型偏头痛的特征。别太担心，很多情况下这和压力或睡眠不足有关。',
    riskText: '高度疑似偏头痛，需警惕 MOH 风险'
  }
});

import { useAppStore } from '../../store';
import { DiseaseTag } from '../../configs/constants';
import { simulateNetworkRequest } from '../../utils/network';
import { UserIdentity } from '../../interfaces/user';

// ==========================================
// 视图层：纯粹的渲染引擎与交互控制
// ==========================================
export default function HomeView() {
  const navigate = useNavigate();
  const { setDiseaseTag, identity } = useAppStore();
  const isFamily = identity === UserIdentity.FAMILY;
  const DIALOGUE_TREE = getDialogueTree(isFamily);
  
  // 核心状态
  const [currentNodeId, setCurrentNodeId] = useState<string>('root');
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 'msg_1', 
      role: 'ai', 
      content: DIALOGUE_TREE['root'].aiText,
      options: DIALOGUE_TREE['root'].options?.map(o => o.label),
      nodeId: 'root'
    }
  ]);
  const [collectedTags, setCollectedTags] = useState<string[]>([]);
  
  // UI 状态
  const [isThinking, setIsThinking] = useState(false);
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  // 处理选项点击 (正常流程推进)
  const handleOptionClick = (optLabel: string, msgId: string, nodeId: string) => {
    const nodeDef = DIALOGUE_TREE[nodeId];
    const optionDef = nodeDef.options?.find(o => o.label === optLabel);
    if (!optionDef) return;

    // 1. 移除当前气泡的选项卡
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, options: undefined } : m));
    
    // 2. 渲染用户气泡
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: optLabel }]);
    
    // 3. 收集打标
    if (optionDef.tag) {
      setCollectedTags(prev => [...prev, optionDef.tag!]);
    }

    // 4. 推进状态机
    setIsThinking(true);

    const processNextNode = async () => {
      try {
        await simulateNetworkRequest(null, 1000, 0.15); // 15% 概率模拟网络异常
        setIsThinking(false);
        setCurrentNodeId(optionDef.nextNodeId);
        
        const nextNode = DIALOGUE_TREE[optionDef.nextNodeId];
        
        if (nextNode.isConclusion) {
          // 渲染结论安抚
          setMessages(prev => [...prev, { 
            id: Date.now().toString(), 
            role: 'ai', 
            content: nextNode.aiText,
            isConclusion: true
          }]);
          
          // 延迟渲染转化卡片
          setTimeout(() => {
            setMessages(prev => [...prev, { 
              id: Date.now().toString(), 
              role: 'card', 
              tags: [...collectedTags, optionDef.tag!].filter(Boolean).slice(0, 4), // 最多展示4个核心标签
              riskText: nextNode.riskText
            }]);
          }, 1200);
        } else {
          // 渲染下一个问题
          setMessages(prev => [...prev, { 
            id: Date.now().toString(), 
            role: 'ai', 
            content: nextNode.aiText,
            options: nextNode.options?.map(o => o.label),
            progress: nextNode.progress,
            nodeId: nextNode.id
          }]);
        }
      } catch (error) {
        setIsThinking(false);
        Toast.show({ content: '网络连接异常，请重试', icon: 'fail' });
        // 恢复选项卡，允许用户重试
        setMessages(prev => {
          const newMsgs = [...prev];
          // 移除刚才添加的用户气泡
          newMsgs.pop();
          // 恢复上一个 AI 气泡的选项卡
          const lastAiIdx = newMsgs.map(m => m.role).lastIndexOf('ai');
          if (lastAiIdx >= 0) {
            newMsgs[lastAiIdx].options = DIALOGUE_TREE[nodeId].options?.map(o => o.label);
          }
          return newMsgs;
        });
      }
    };

    processNextNode();
  };

  // 处理多模态自定义输入 (打断与回归逻辑)
  const handleCustomInput = (text: string, type: 'text' | 'voice' | 'camera') => {
    if (!text.trim()) return;

    // 1. 渲染用户气泡，并清除上一个 AI 气泡的选项卡
    setMessages(prev => {
      const newMsgs = [...prev];
      const lastAiIdx = newMsgs.map(m => m.role).lastIndexOf('ai');
      if (lastAiIdx >= 0) {
        newMsgs[lastAiIdx].options = undefined;
      }
      return [...newMsgs, { id: Date.now().toString(), role: 'user', content: text }];
    });
    
    setInputText('');
    setIsThinking(true);

    // 2. 模拟 NLP 意图识别与柔性兜底
    const processCustomInput = async () => {
      try {
        await simulateNetworkRequest(null, 1500, 0.1); // 10% 概率模拟网络异常
        setIsThinking(false);
        const currentNode = DIALOGUE_TREE[currentNodeId];
        
        if (!currentNode || currentNode.isConclusion) return;

        let fallbackText = `我理解了，您提到了“${text}”。为了更全面地评估，我们继续刚才的问题：${currentNode.aiText}`;
        if (type === 'camera') {
          fallbackText = `已识别到您上传的图片。结合您刚才的描述，我们继续：${currentNode.aiText}`;
        }

        // 重新渲染当前节点的问题和选项
        setMessages(prev => [...prev, { 
          id: Date.now().toString(), 
          role: 'ai', 
          content: fallbackText,
          options: currentNode.options?.map(o => o.label),
          progress: currentNode.progress,
          nodeId: currentNode.id
        }]);
      } catch (error) {
        setIsThinking(false);
        Toast.show({ content: '网络连接异常，请重试', icon: 'fail' });
        // 恢复输入框内容
        if (type === 'text') setInputText(text);
        // 移除刚才添加的用户气泡
        setMessages(prev => prev.slice(0, -1));
      }
    };

    processCustomInput();
  };

  const handlePayment = (tags: string[] = []) => {
    if (isPaying) return;
    setIsPaying(true);
    
    // Determine disease tag based on collected tags
    let tag = DiseaseTag.NONE;
    const tagString = tags.join(',');
    if (tagString.includes('记忆') || tagString.includes('认知') || tagString.includes('病程')) {
      tag = DiseaseTag.AD;
    } else if (tagString.includes('抽搐') || tagString.includes('发作') || tagString.includes('失神')) {
      tag = DiseaseTag.EPILEPSY;
    } else if (tagString.includes('头痛') || tagString.includes('搏动')) {
      tag = DiseaseTag.MIGRAINE;
    }
    
    setDiseaseTag(tag);

    Toast.show({ icon: 'loading', content: '正在处理支付...' });
    setTimeout(() => {
      setIsPaying(false);
      Toast.show({ icon: 'success', content: '支付成功' });
      navigate('/assessment');
    }, 1500);
  };

  return (
    <div className="flex flex-col w-full h-full bg-[#FAFAFA] relative">
      {/* 极浅弥散暖色渐变背景 */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -right-[10%] w-[120%] h-[50%] bg-gradient-to-b from-[#E8F3FF] to-transparent opacity-60 blur-3xl" />
        <div className="absolute top-[20%] -left-[20%] w-[80%] h-[60%] bg-gradient-to-tr from-[#FFF0E6] to-transparent opacity-30 blur-3xl" />
      </div>

      {/* 极窄顶部状态栏 */}
      <div className="fixed top-0 left-0 right-0 max-w-md mx-auto z-20 bg-white/80 backdrop-blur-md pt-3 pb-2 px-4 flex items-center justify-between shadow-[0_2px_10px_rgba(0,0,0,0.02)] border-b border-slate-100/50">
        <div className="w-8 flex items-center justify-start cursor-pointer active:opacity-70"></div>
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center space-x-1.5">
            <div className="relative w-5 h-5 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center border border-white/80 shadow-sm">
              <div className="absolute inset-0 rounded-full bg-blue-500 opacity-20 animate-pulse" />
              <Sparkles className="text-blue-600 w-3 h-3 z-10" />
            </div>
            <span className="text-[14px] font-semibold text-slate-900 tracking-wide">数字华佗</span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium tracking-wide mt-0.5">
            {isThinking ? '正在分析症状...' : '您的专属脑健康管家'}
          </span>
        </div>
        <div className="w-8" />
      </div>

      {/* 最大化对话视口 */}
      <div className="flex-1 overflow-y-auto px-4 pt-20 pb-[120px] z-10 hide-scrollbar">
        <div className="flex flex-col space-y-6 max-w-md mx-auto">
          {messages.map((msg) => {
            if (msg.role === 'ai') {
              return (
                <div key={msg.id} className="flex flex-col items-start max-w-[92%] animate-fade-in">
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center border border-white/80 shadow-sm mr-2 flex-shrink-0 mt-1">
                      <Sparkles className="text-blue-600 w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      {msg.progress && (
                        <div className="flex items-center space-x-1 mb-1.5 ml-1">
                          <span className="text-[11px] text-slate-400 font-medium">问诊进度 {msg.progress}%</span>
                          <div className="w-2 h-2 rounded-full border border-slate-300 border-t-blue-500 animate-spin" />
                        </div>
                      )}
                      <div className={`bg-white text-slate-800 rounded-[20px] rounded-tl-sm px-4 py-3 text-[15px] leading-relaxed tracking-wide shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100/50 ${msg.isConclusion ? 'border-l-4 border-l-emerald-400' : ''}`}>
                        {/* 简单的高亮处理逻辑 */}
                        {msg.content?.split(/(记忆力下降|突发抽搐|剧烈头痛|典型偏头痛|认知功能衰退|癫痫发作)/g).map((part, i) => 
                          /(记忆力下降|突发抽搐|剧烈头痛|典型偏头痛|认知功能衰退|癫痫发作)/.test(part) ? 
                            <span key={i} className="font-semibold text-blue-600">{part}</span> : 
                            <span key={i}>{part}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {msg.options && msg.nodeId && (
                    <div className="flex flex-wrap gap-2 mt-3 ml-10">
                      {msg.options.map((opt, idx) => (
                        <div 
                          key={idx}
                          onClick={() => handleOptionClick(opt, msg.id, msg.nodeId!)}
                          className="bg-white text-blue-600 border border-blue-100 shadow-[0_2px_10px_rgba(37,99,235,0.05)] rounded-[16px] px-4 py-2.5 text-[14px] font-medium cursor-pointer active:bg-blue-50 transition-colors flex items-center"
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
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-[20px] rounded-tr-sm px-4 py-3 shadow-[0_4px_12px_rgba(37,99,235,0.2)] max-w-[85%] text-[15px] leading-relaxed tracking-wide">
                    {msg.content}
                  </div>
                </div>
              );
            }

            if (msg.role === 'card') {
              return (
                <div key={msg.id} className="w-full flex justify-center animate-fade-in-up mt-6">
                  <div className="bg-white rounded-[24px] border border-blue-100/50 shadow-[0_12px_40px_rgba(37,99,235,0.08)] p-4 w-full relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full opacity-50 blur-2xl pointer-events-none" />
                    <div className="absolute -top-4 -right-4 opacity-[0.03] pointer-events-none transform rotate-12">
                      <Activity className="w-32 h-32 text-blue-600" />
                    </div>

                    <div className="flex items-center justify-between mb-3 relative z-10">
                      <div className="flex items-center">
                        <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center mr-2.5">
                          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                        </div>
                        <h3 className="text-[16px] font-bold text-slate-900 tracking-wide">✨ AI 症状解析图谱</h3>
                      </div>
                    </div>

                    {msg.riskText && (
                      <div className="bg-red-50 rounded-[12px] p-2.5 mb-3 border border-red-100/50 flex items-start relative z-10">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 mr-2 flex-shrink-0 animate-pulse" />
                        <span className="text-red-600 text-[12px] font-medium leading-relaxed">{msg.riskText}</span>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1.5 mb-3 relative z-10">
                      {msg.tags?.map((tag, idx) => (
                        <span key={idx} className="bg-blue-50 text-blue-600 rounded-full px-3 py-1 text-[12px] font-medium border border-blue-100/50">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="bg-slate-50 rounded-[12px] p-2.5 mb-4 relative z-10 border border-slate-100/50">
                      <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                        基于您的症状描述，已生成专属<span className="font-semibold text-slate-700">《脑健康预检报告》</span>，建议进一步评估。
                      </p>
                    </div>

                    <button 
                      onClick={() => handlePayment(msg.tags)}
                      disabled={isPaying}
                      className="w-full rounded-[16px] bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-3 shadow-[0_8px_24px_rgba(37,99,235,0.25)] active:scale-95 transition-transform flex items-center justify-center relative z-10 disabled:opacity-70"
                    >
                      <span className="tracking-wide text-[14px] line-clamp-1">
                        {isPaying ? '处理中...' : '开启专业评测'}
                      </span>
                      {!isPaying && <ChevronRight className="w-4 h-4 ml-1 opacity-80 flex-shrink-0" />}
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
                <Sparkles className="text-blue-600 w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-100/50 text-slate-500 rounded-[20px] rounded-tl-sm px-5 py-3.5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex items-center space-x-1.5">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      {/* 悬浮药丸输入舱 (Floating Pill) - 完美解决间距问题并支持多模态 */}
      <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+80px)] left-4 right-4 max-w-md mx-auto z-30 bg-white/90 backdrop-blur-xl rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-white/60 p-2 flex items-center space-x-2">
        {/* 语音/键盘切换 */}
        <div 
          onClick={() => setInputMode(m => m === 'voice' ? 'text' : 'voice')} 
          className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 active:bg-slate-100 transition-colors cursor-pointer flex-shrink-0"
        >
          {inputMode === 'voice' ? <Keyboard className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </div>

        {/* 核心输入区 */}
        {inputMode === 'text' ? (
          <input 
            type="text" 
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="发消息或按住说话..."
            className="flex-1 h-10 bg-transparent outline-none text-[15px] text-slate-800 placeholder-slate-400 px-2"
            onKeyDown={e => {
              if (e.key === 'Enter') handleCustomInput(inputText, 'text');
            }}
          />
        ) : (
          <div 
            onPointerDown={() => setIsRecording(true)}
            onPointerUp={() => { 
              setIsRecording(false); 
              handleCustomInput('我感觉头晕，而且有点想吐...', 'voice'); 
            }}
            onPointerLeave={() => setIsRecording(false)}
            className={`flex-1 h-10 rounded-full flex items-center justify-center text-white text-[15px] font-medium transition-all select-none cursor-pointer ${
              isRecording 
                ? 'bg-gradient-to-r from-red-500 to-red-600 scale-[0.98] shadow-inner' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 active:scale-[0.98]'
            }`}
          >
            {isRecording ? '松开 发送' : '按住 说话'}
          </div>
        )}

        {/* 右侧操作区 */}
        {inputMode === 'text' && inputText.trim() ? (
          <div 
            onClick={() => handleCustomInput(inputText, 'text')} 
            className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white active:bg-blue-700 transition-colors cursor-pointer flex-shrink-0 shadow-sm"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </div>
        ) : (
          <div className="flex items-center space-x-2 flex-shrink-0">
            <div 
              onClick={() => handleCustomInput('[图片]', 'camera')}
              className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 active:bg-slate-100 transition-colors cursor-pointer"
            >
              <Plus className="w-5 h-5" />
            </div>
            <div 
              onClick={() => handleCustomInput('[图片]', 'camera')}
              className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 active:bg-slate-100 transition-colors cursor-pointer"
            >
              <Camera className="w-5 h-5" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
