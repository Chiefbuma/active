import type { LucideIcon } from 'lucide-react';

export type Metric = {
  id: string;
  name: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease' | 'stable';
  icon: LucideIcon;
  data: { week: string; value: number }[];
};

export type User = {
  name: string;
  email: string;
  avatarUrl: string;
};

export type HealthData = {
  user: User;
  metrics: Metric[];
  weekNumber: number;
  progressSummary: string;
};
