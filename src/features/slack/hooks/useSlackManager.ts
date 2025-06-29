import { useState, useCallback } from 'react';
import { SlackService } from '../../../services/slackService';
import { useWeeklyNotification } from '../../../hooks/useWeeklyNotification';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import { useSupabaseWeeklyNotifications } from './useSupabaseWeeklyNotifications';

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
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Use Supabase hook for weekly notifications
  const {
    weeklyNotification,
    weeklyNotificationId,
    notifications,
    isLoading: isSupabaseLoading,
    error: supabaseError,
    userId,
    updateWeeklyNotification,
    saveWeeklyNotification,
    loadWeeklyNotification,
    deleteWeeklyNotification,
    loadAllNotifications,
    loadNotificationById,
    createNotification,
    updateNotificationById,
    deleteNotificationById,
    toggleNotificationById
  } = useSupabaseWeeklyNotifications();

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
  const handleToggleWeekly = useCallback(async () => {
    if (!webhookUrl || !weeklyNotification.message.trim()) {
      setStatus('Error: Please fill in webhook URL and weekly message');
      return;
    }

    const newEnabled = !weeklyNotification.enabled;
    updateWeeklyNotification({ enabled: newEnabled });
    
    // Save to database
    const success = await saveWeeklyNotification();
    
    if (success) {
      setStatus(newEnabled ? 'Weekly notifications enabled' : 'Weekly notifications disabled');
    } else {
      setStatus('Error saving weekly notification settings');
    }
  }, [webhookUrl, weeklyNotification.message, weeklyNotification.enabled, updateWeeklyNotification, saveWeeklyNotification]);

  // Save weekly notification changes
  const handleSaveWeeklyNotification = useCallback(async () => {
    console.log('handleSaveWeeklyNotification called');
    
    if (!weeklyNotification.message.trim()) {
      setStatus('Error: Please enter a message before saving');
      return;
    }

    setStatus('Saving notification...');
    const success = await saveWeeklyNotification();
    
    if (success) {
      setStatus('Weekly notification saved successfully');
    } else {
      setStatus(supabaseError || 'Error saving weekly notification');
    }
  }, [saveWeeklyNotification, weeklyNotification.message, supabaseError]);

  // Delete weekly notification
  const handleDeleteWeeklyNotification = useCallback(async () => {
    const success = await deleteWeeklyNotification();
    setStatus(success ? 'Weekly notification deleted' : 'Error deleting weekly notification');
  }, [deleteWeeklyNotification]);

  // Update status when Supabase error changes
  useCallback(() => {
    if (supabaseError) {
      setStatus(supabaseError);
    }
  }, [supabaseError]);

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
    notifications,
    status,
    presetWebhooks,
    isLoading: isLoading || isSupabaseLoading,
    weeklyNotificationId,
    userId,
    
    // Setters
    setWebhookUrl,
    setMessage,
    
    // Actions
    updateWeeklyNotification,
    handleSendMessage,
    handleToggleWeekly,
    handleSaveWeeklyNotification,
    handleDeleteWeeklyNotification,
    loadWeeklyNotification,
    // New notification management functions
    loadAllNotifications,
    loadNotificationById,
    createNotification,
    updateNotificationById,
    deleteNotificationById,
    toggleNotificationById
  };
};
