// File: src/views/Manager/index.tsx
import React from 'react';
import { Empty, Button, Card, Grid, Space, Toast } from 'antd-mobile';
import { VideoOutline, EditSOutline, HeartOutline, FileOutline, UserOutline, PlayOutline } from 'antd-mobile-icons';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store';
import { DiseaseTag } from '../../configs/constants';

export default function ManagerView() {
  const navigate = useNavigate();
  const { selectedDiseaseTag } = useAppStore();

  const handleEmergency = () => {
    Toast.show({
      icon: 'loading',
      content: '正在启动紧急录像与呼救...',
      duration: 2000,
    });
    // 模拟触发全局熔断
    setTimeout(() => {
      Toast.show({
        icon: 'fail',
        content: '已触发全局熔断总线！',
      });
    }, 2000);
  };

  const renderNoneState = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-6">
      <Empty
        description={
          <span className="text-gray-500 text-sm">
            您尚未建立专属脑健康档案
          </span>
        }
        className="mb-8"
      />
      <Button
        color="primary"
        size="large"
        className="w-full rounded-xl font-medium shadow-sm h-12 mb-4"
        onClick={() => navigate('/assessment')}
      >
        立即进行 1 元深度测评
      </Button>
      <Button
        color="default"
        size="large"
        className="w-full rounded-xl font-medium shadow-sm h-12"
        onClick={() => navigate('/crf-assessment')}
      >
        填写既往史信息 (CRF)
      </Button>
    </div>
  );

  const renderEpilepsyState = () => (
    <div className="p-4 animate-fade-in">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">护航管家</h2>
        <p className="text-sm text-gray-500 mt-1">全天候守护您的脑健康安全</p>
      </div>

      {/* 巨大的红色紧急录像按钮 */}
      <Card className="mb-6 shadow-md border-none rounded-2xl bg-gradient-to-br from-[#FF3141] to-[#D91A2A] text-white p-2" onClick={handleEmergency}>
        <div className="flex flex-col items-center justify-center py-6">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4 animate-pulse">
            <VideoOutline fontSize={36} className="text-white" />
          </div>
          <h3 className="text-2xl font-bold tracking-widest mb-1">紧急录像</h3>
          <p className="text-xs text-white/80">点击立即记录发作症状并通知家属</p>
        </div>
      </Card>

      <h3 className="text-base font-semibold text-gray-800 mb-3 px-1">日常管理</h3>
      <Grid columns={2} gap={12}>
        <Grid.Item>
          <Card className="shadow-sm border-none rounded-xl bg-white h-full active:bg-gray-50 transition-colors" onClick={() => Toast.show('开发中')}>
            <div className="flex flex-col items-center justify-center py-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-3">
                <EditSOutline className="text-[#1677FF] text-xl" />
              </div>
              <span className="text-sm font-medium text-gray-800">发作日记</span>
            </div>
          </Card>
        </Grid.Item>
        <Grid.Item>
          <Card className="shadow-sm border-none rounded-xl bg-white h-full active:bg-gray-50 transition-colors" onClick={() => Toast.show('开发中')}>
            <div className="flex flex-col items-center justify-center py-4">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center mb-3">
                <FileOutline className="text-emerald-500 text-xl" />
              </div>
              <span className="text-sm font-medium text-gray-800">用药与化验</span>
            </div>
          </Card>
        </Grid.Item>
        <Grid.Item span={2}>
          <Card className="shadow-sm border-none rounded-xl bg-white active:bg-gray-50 transition-colors" onClick={() => navigate('/device')}>
            <div className="flex items-center p-2">
              <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center mr-4">
                <HeartOutline className="text-indigo-500 text-2xl" />
              </div>
              <div className="flex-1">
                <h4 className="text-base font-medium text-gray-900 mb-0.5">夜间体征监测</h4>
                <p className="text-xs text-gray-500">连接 Neuro-Band 开启睡眠守护</p>
              </div>
            </div>
          </Card>
        </Grid.Item>
      </Grid>
    </div>
  );

  const renderAlzheimerState = () => (
    <div className="p-4 animate-fade-in">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">记忆管家</h2>
        <p className="text-sm text-gray-500 mt-1">科学延缓认知衰退，守护美好回忆</p>
      </div>

      <Space direction="vertical" block style={{ '--gap': '16px' }}>
        <Card className="shadow-sm border-none rounded-2xl bg-gradient-to-br from-[#1677FF] to-[#0A52C6] text-white active:opacity-90 transition-opacity" onClick={() => navigate('/assessment')}>
          <div className="flex items-center p-2">
            <div className="flex-1">
              <div className="text-xs font-medium opacity-80 mb-1">MoCA 测评</div>
              <h3 className="text-xl font-bold tracking-tight mb-1">认知体检</h3>
              <p className="text-xs text-white/80">建议每月进行一次全面评估</p>
            </div>
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
              <EditSOutline fontSize={28} />
            </div>
          </div>
        </Card>

        <Card className="shadow-sm border-none rounded-2xl bg-white active:bg-gray-50 transition-colors" onClick={() => navigate('/assessment')}>
          <div className="flex items-center p-2">
            <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center mr-4">
              <UserOutline className="text-orange-500 text-2xl" />
            </div>
            <div className="flex-1">
              <h4 className="text-base font-medium text-gray-900 mb-0.5">家人代答 (CDR)</h4>
              <p className="text-xs text-gray-500">由照护者填写的知情者问卷</p>
            </div>
          </div>
        </Card>

        <Card className="shadow-sm border-none rounded-2xl bg-white active:bg-gray-50 transition-colors" onClick={() => Toast.show('开发中')}>
          <div className="flex items-center p-2">
            <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center mr-4">
              <PlayOutline className="text-purple-500 text-2xl" />
            </div>
            <div className="flex-1">
              <h4 className="text-base font-medium text-gray-900 mb-0.5">脑力游戏</h4>
              <p className="text-xs text-gray-500">趣味数字与空间记忆训练</p>
            </div>
          </div>
        </Card>
      </Space>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-20">
      {selectedDiseaseTag === DiseaseTag.NONE && renderNoneState()}
      {selectedDiseaseTag === DiseaseTag.EPILEPSY && renderEpilepsyState()}
      {selectedDiseaseTag === DiseaseTag.AD && renderAlzheimerState()}
    </div>
  );
}
