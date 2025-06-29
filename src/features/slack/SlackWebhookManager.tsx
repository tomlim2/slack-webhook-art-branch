import React from 'react';
import { WebhookConfig } from '../../components/WebhookConfig';
import { MessageSender } from '../../components/MessageSender';
import { WeeklyNotifications } from '../../components/WeeklyNotifications';
import { StatusDisplay } from '../../components/StatusDisplay';
import { useSlackManager } from './hooks/useSlackManager';
import type { WeeklyNotification } from '../../types';

export const SlackWebhookManager: React.FC = () => {
  const {
    webhookUrl,
    message,
    weeklyNotification,
    notifications,
    status,
    presetWebhooks,
    isLoading,
    setWebhookUrl,
    setMessage,
    updateWeeklyNotification,
    handleSendMessage,
    handleToggleWeekly,
    handleSaveWeeklyNotification,
    handleDeleteWeeklyNotification,
    loadNotificationById,
    toggleNotificationById,
    deleteNotificationById,
    createNotification
  } = useSlackManager();

  const handleCreateNotification = async (notification: WeeklyNotification) => {
    const success = await createNotification(notification);
    if (success) {
      // Reset form after successful creation
      updateWeeklyNotification({
        message: '',
        day: 'monday',
        time: '09:00',
        enabled: false
      });
    }
  };

  return (
    <>
      <WebhookConfig 
        webhookUrl={webhookUrl}
        onWebhookUrlChange={setWebhookUrl}
        presetWebhooks={presetWebhooks}
      />

      <MessageSender
        message={message}
        onMessageChange={setMessage}
        onSendMessage={handleSendMessage}
      />

      <WeeklyNotifications
        weeklyNotification={weeklyNotification}
        notifications={notifications}
        onWeeklyMessageChange={(msg) => updateWeeklyNotification({ message: msg })}
        onWeeklyDayChange={(day) => updateWeeklyNotification({ day })}
        onWeeklyTimeChange={(time) => updateWeeklyNotification({ time })}
        onToggleWeekly={handleToggleWeekly}
        onSaveNotification={handleSaveWeeklyNotification}
        onDeleteNotification={handleDeleteWeeklyNotification}
        onLoadNotification={loadNotificationById}
        onToggleNotificationById={toggleNotificationById}
        onDeleteNotificationById={deleteNotificationById}
        onCreateNotification={handleCreateNotification}
        isLoading={isLoading}
      />

      <StatusDisplay status={status} />
    </>
  );
};
