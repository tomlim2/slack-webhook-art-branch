import type { DAY_NAMES } from '../constants';

export interface SlackConfig {
  webhookUrl: string;
}

export type DayOfWeek = typeof DAY_NAMES[number];

export interface WeeklyNotification {
  message: string;
  day: string;
  time: string;
  enabled: boolean;
}

export interface AppState {
  webhookUrl: string;
  message: string;
  weeklyNotification: WeeklyNotification;
  status: string;
}

export interface PresetWebhooks {
  production: string;
  test: string;
}
