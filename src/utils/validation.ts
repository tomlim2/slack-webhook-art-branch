export const isValidWebhookUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname === 'hooks.slack.com' && urlObj.pathname.startsWith('/services/');
  } catch {
    return false;
  }
};

export const isValidTime = (time: string): boolean => {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

export const validateWeeklyNotification = (notification: { message: string; time: string }) => {
  const errors: string[] = [];
  
  if (!notification.message.trim()) {
    errors.push('Message is required');
  }
  
  if (!isValidTime(notification.time)) {
    errors.push('Invalid time format');
  }
  
  return errors;
};
