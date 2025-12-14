export interface User {
  name: string;
  avatar: string;
}

export interface HealthMetric {
  label: string;
  value: string;
  unit: string;
  status: 'Improving' | 'Stable' | 'Worsening' | 'Neutral';
  trendValue?: string;
  icon: 'heart' | 'droplet' | 'scale';
}

export interface ActivityItem {
  id: string;
  title: string;
  subtitle: string;
  type: 'report' | 'message' | 'prescription';
  date: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: string;
  timestamp: Date;
}

export enum SidebarTab {
  DASHBOARD = 'Dashboard',
  REPORTS = 'Reports',
  APPOINTMENTS = 'Appointments',
  TRIAGE = 'AI Triage',
  PRESCRIPTIONS = 'Prescriptions',
  SETTINGS = 'Settings'
}