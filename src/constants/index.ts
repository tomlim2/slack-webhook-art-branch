export const DAYS_OF_WEEK = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' }
] as const;

export const DAY_NAMES = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;

export const STORAGE_KEYS = {
  WEBHOOK_URL: 'slack-webhook-url',
  WEEKLY_NOTIFICATION: 'weekly-notification'
} as const;

export const DEFAULT_WEEKLY_NOTIFICATION = {
  message: '',
  day: 'monday' as const,
  time: '09:00',
  enabled: false
} as const;

export const CHECK_INTERVAL_MS = 60000; // 1 minute
