import { useState, useCallback } from 'react';
import { SlackService } from '../../../services/slackService';
import { useWeeklyNotification } from '../../../hooks/useWeeklyNotification';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import type { WeeklyNotification } from '../../../types';

const STORAGE_KEYS = {
  WEBHOOK_URL: 'slack-webhook-url',
  WEEKLY_NOTIFICATION: 'weekly-notification'
} as const;

export const useSlackManager = () => {
  const [webhookUrl, setWebhookUrl] = useLocalStorage(
    STORAGE_KEYS.WEBHOOK_URL, 
    import.meta.env.VITE_SLACK_TEST_WEBHOOK_URL || ''
  );
  const [message, setMessage] = useState('');
  const [weeklyNotification, setWeeklyNotification] = useLocalStorage(
    STORAGE_KEYS.WEEKLY_NOTIFICATION,
    { message: '', day: 'monday', time: '09:00', enabled: false }
  );
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Use local weekly notification hook for scheduling
  useWeeklyNotification(webhookUrl, weeklyNotification, setStatus);

  // Send message handler
  const handleSendMessage = useCallback(async () => {
    if (!webhookUrl.trim()) {
      setStatus('Error: Please enter a webhook URL');
      return;
    }

    if (!message.trim()) {
      setStatus('Error: Please enter a message');
      return;
    }

    setIsLoading(true);
    try {
      await SlackService.sendMessage({ webhookUrl }, message);
      setStatus('Message sent successfully!');
      setMessage('');
    } catch (error) {
      setStatus(`Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  }, [webhookUrl, message]);

  // Toggle weekly notifications
  const handleToggleWeekly = useCallback(() => {
    if (!webhookUrl || !weeklyNotification.message.trim()) {
      setStatus('Error: Please fill in webhook URL and weekly message');
      return;
    }

    const newEnabled = !weeklyNotification.enabled;
    setWeeklyNotification(prev => ({ ...prev, enabled: newEnabled }));
    setStatus(newEnabled ? 'Weekly notifications enabled (browser must stay open)' : 'Weekly notifications disabled');
  }, [webhookUrl, weeklyNotification, setWeeklyNotification]);

  // Update weekly notification
  const updateWeeklyNotification = useCallback((updates: Partial<WeeklyNotification>) => {
    setWeeklyNotification(prev => ({ ...prev, ...updates }));
  }, [setWeeklyNotification]);

  // Preset webhooks
  const presetWebhooks = {
    production: import.meta.env.VITE_SLACK_WEBHOOK_URL || '',
    test: import.meta.env.VITE_SLACK_TEST_WEBHOOK_URL || ''
  };

  return {
    // State
    webhookUrl,
    message,
    weeklyNotification,
    status,
    presetWebhooks,
    isLoading,
    
    // Setters
    setWebhookUrl,
    setMessage,
    
    // Actions
    updateWeeklyNotification,
    handleSendMessage,
    handleToggleWeekly
  };
};
