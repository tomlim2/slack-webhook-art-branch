import React from 'react';

interface WebhookConfigProps {
  webhookUrl: string;
  onWebhookUrlChange: (url: string) => void;
  presetWebhooks?: { production: string; test: string };
}

export const WebhookConfig: React.FC<WebhookConfigProps> = ({
  webhookUrl,
  onWebhookUrlChange,
  presetWebhooks
}) => {
  return (
    <div className="card">
      <h2>Webhook Configuration</h2>
      
      {presetWebhooks && (
        <div style={{ marginBottom: '10px' }}>
          <label>Quick Select: </label>
          <button 
            onClick={() => onWebhookUrlChange(presetWebhooks.production)}
            style={{ marginRight: '5px', padding: '4px 8px' }}
            disabled={!presetWebhooks.production}
          >
            Production
          </button>
          <button 
            onClick={() => onWebhookUrlChange(presetWebhooks.test)}
            style={{ padding: '4px 8px' }}
            disabled={!presetWebhooks.test}
          >
            Test
          </button>
        </div>
      )}
      
      <input
        type="url"
        placeholder="Slack Webhook URL (or use Quick Select above)"
        value={webhookUrl}
        onChange={(e) => onWebhookUrlChange(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
      />
      
      {webhookUrl && (
        <small style={{ color: 'green' }}>
          ✓ Webhook URL configured
        </small>
      )}
    </div>
  );
};
