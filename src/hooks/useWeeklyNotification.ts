import { useEffect } from 'react';
import { SlackService } from '../services/slackService';
import type { WeeklyNotification } from '../types';

export const useWeeklyNotification = (
  webhookUrl: string,
  weeklyNotification: WeeklyNotification,
  onStatusChange: (status: string) => void
) => {
  useEffect(() => {
    if (weeklyNotification.enabled) {
      const checkWeeklyNotification = async () => {
        const now = new Date();
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const currentDay = dayNames[now.getDay()];
        const currentTime = now.toTimeString().slice(0, 5);

        if (currentDay === weeklyNotification.day && currentTime === weeklyNotification.time) {
          try {
            await SlackService.sendMessage({ webhookUrl }, weeklyNotification.message);
            onStatusChange(`Weekly notification sent: ${weeklyNotification.message.substring(0, 30)}...`);
          } catch (error) {
            onStatusChange(`Error sending weekly notification: ${error}`);
          }
        }
      };

      const interval = setInterval(checkWeeklyNotification, 60000);
      return () => clearInterval(interval);
    }
  }, [weeklyNotification, webhookUrl, onStatusChange]);
};
