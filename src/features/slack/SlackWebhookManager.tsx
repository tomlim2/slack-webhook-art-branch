import React from 'react';
import { WebhookConfig } from '../../components/WebhookConfig';
import { MessageSender } from '../../components/MessageSender';
import { WeeklyNotifications } from '../../components/WeeklyNotifications';
import { StatusDisplay } from '../../components/StatusDisplay';
import { useSlackManager } from './hooks/useSlackManager';

export const SlackWebhookManager: React.FC = () => {
  const {
    webhookUrl,
    message,
    weeklyNotification,
    status,
    presetWebhooks,
    isLoading,
    setWebhookUrl,
    setMessage,
    updateWeeklyNotification,
    handleSendMessage,
    handleToggleWeekly
  } = useSlackManager();

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
        notifications={[]}
        onWeeklyMessageChange={(msg) => updateWeeklyNotification({ message: msg })}
        onWeeklyDayChange={(day) => updateWeeklyNotification({ day })}
        onWeeklyTimeChange={(time) => updateWeeklyNotification({ time })}
        onToggleWeekly={handleToggleWeekly}
        isLoading={isLoading}
      />

      <StatusDisplay status={status} />
    </>
  );
};
