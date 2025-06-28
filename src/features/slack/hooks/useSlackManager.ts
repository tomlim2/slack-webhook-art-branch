import { useState, useCallback } from 'react';
import type { WeeklyNotification } from '../../../types';
import { SlackService } from '../../../services/slackService';
import { useWeeklyNotification } from '../../../hooks/useWeeklyNotification';
import { useLocalStorage } from '../../../hooks/useLocalStorage';

const INITIAL_WEEKLY_NOTIFICATION: WeeklyNotification = {
  message: '',
  day: 'monday',
  time: '09:00',
  enabled: false
};

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
  const [weeklyNotification, setWeeklyNotification] = useLocalStorage<WeeklyNotification>(
    STORAGE_KEYS.WEEKLY_NOTIFICATION, 
    INITIAL_WEEKLY_NOTIFICATION
  );
  const [status, setStatus] = useState('');

  useWeeklyNotification(webhookUrl, weeklyNotification, setStatus);

  // Weekly notification handlers
  const updateWeeklyNotification = useCallback((updates: Partial<WeeklyNotification>) => {
    setWeeklyNotification(prev => ({ ...prev, ...updates }));
  }, [setWeeklyNotification]);

  // Message handlers
  const handleSendMessage = useCallback(async () => {
    try {
      await SlackService.sendMessage({ webhookUrl }, message);
      setStatus('Message sent successfully!');
      setMessage('');
    } catch (error) {
      setStatus(`Error: ${error}`);
    }
  }, [webhookUrl, message]);

  const handleToggleWeekly = useCallback(() => {
    if (!webhookUrl || !weeklyNotification.message.trim()) {
      setStatus('Error: Please fill in webhook URL and weekly message');
      return;
    }

    const newEnabled = !weeklyNotification.enabled;
    updateWeeklyNotification({ enabled: newEnabled });
    setStatus(newEnabled ? 'Weekly notifications enabled' : 'Weekly notifications disabled');
  }, [webhookUrl, weeklyNotification.message, weeklyNotification.enabled, updateWeeklyNotification]);

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
    
    // Setters
    setWebhookUrl,
    setMessage,
    
    // Actions
    updateWeeklyNotification,
    handleSendMessage,
    handleToggleWeekly
  };
};
