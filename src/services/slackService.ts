import type { SlackConfig } from '../types';

export class SlackService {
  static async sendMessage(config: SlackConfig, messageText: string): Promise<boolean> {
    if (!config.webhookUrl || !messageText) {
      throw new Error('Please fill in webhook URL and message');
    }

    try {
      await fetch(config.webhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: messageText
        })
      });
      return true;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Network error: Check your internet connection and webhook URL');
      }
      throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
