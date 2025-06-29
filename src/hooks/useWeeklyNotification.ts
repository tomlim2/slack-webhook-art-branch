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
      console.log('Weekly notification enabled, starting check interval...');

      const checkWeeklyNotification = async () => {
        const now = new Date();
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const currentDay = dayNames[now.getDay()];
        const currentTime = now.toTimeString().slice(0, 5);

        // Check every minute for the exact time
        if (currentDay === weeklyNotification.day && currentTime === weeklyNotification.time) {
          console.log('Time to send weekly notification!', { currentDay, currentTime });

          // Use stored webhook URL or fallback to current one
          const storedWebhookUrl = localStorage.getItem('secure-webhook-url') || webhookUrl;

          if (!storedWebhookUrl) {
            onStatusChange('Error: No webhook URL available for weekly notification');
            return;
          }

          try {
            await SlackService.sendMessage({ webhookUrl: storedWebhookUrl }, weeklyNotification.message);
            onStatusChange(`✅ Weekly notification sent at ${currentTime}: ${weeklyNotification.message.substring(0, 30)}...`);
            console.log('Weekly notification sent successfully');
          } catch (error) {
            onStatusChange(`❌ Error sending weekly notification: ${error}`);
            console.error('Failed to send weekly notification:', error);
          }
        }
      };

      // Check immediately when enabled
      checkWeeklyNotification();

      // Then check every minute
      const interval = setInterval(checkWeeklyNotification, 60000);

      return () => {
        console.log('Cleaning up weekly notification interval');
        clearInterval(interval);
      };
    } else {
      console.log('Weekly notifications disabled');
    }
  }, [weeklyNotification, webhookUrl, onStatusChange]);
};
