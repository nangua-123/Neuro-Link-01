export type TaskType = 'MEDICATION' | 'TRAINING' | 'ASSESSMENT' | 'DIARY' | 'OTHER';
export type TaskTime = 'MORNING' | 'NOON' | 'EVENING' | 'ANYTIME';
export type TaskStatus = 'PENDING' | 'COMPLETED' | 'SKIPPED';

export interface Task {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  time: TaskTime;
  status: TaskStatus;
  actionLabel: string;
  iconName: string;
  diseaseTag?: string;
}
