import { useEffect } from 'react';
import { Toast, Dialog } from 'antd-mobile';
import { useAppStore } from '../store';

export function useMedicationReminder() {
  const { 
    medicationPlans, 
    todayTakenIds, 
    triggeredReminders, 
    markReminderTriggered, 
    toggleMedication 
  } = useAppStore();

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const todayStr = now.toDateString();

      medicationPlans.forEach(plan => {
        if (!plan.reminderEnabled) return;
        if (todayTakenIds.includes(plan.id)) return; // Already taken today

        const triggeredToday = triggeredReminders[todayStr] || [];
        if (triggeredToday.includes(plan.id)) return; // Already triggered today

        // Check if current time matches any of the plan's times
        // We check the exact minute match.
        if (plan.times.includes(currentTime)) {
          // Mark as triggered to prevent spamming
          markReminderTriggered(plan.id, todayStr);

          // Show Notification (Simulated via Dialog/Toast)
          Dialog.show({
            title: '💊 用药提醒',
            content: `该吃药了：${plan.name} (${plan.dose})`,
            closeOnAction: true,
            actions: [
              {
                key: 'snooze',
                text: '稍后提醒',
                className: 'text-slate-500'
              },
              {
                key: 'taken',
                text: '立即打卡',
                className: 'text-[#5B73FF] font-bold',
                onClick: () => {
                  toggleMedication(plan.id);
                  Toast.show({ icon: 'success', content: '打卡成功' });
                }
              }
            ]
          });
        }
      });
    };

    // Check immediately and then every minute
    checkReminders();
    const interval = setInterval(checkReminders, 60000);
    
    return () => clearInterval(interval);
  }, [medicationPlans, todayTakenIds, triggeredReminders, markReminderTriggered, toggleMedication]);
}
