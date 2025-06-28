import React from 'react';

interface MessageSenderProps {
  message: string;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
}

export const MessageSender: React.FC<MessageSenderProps> = ({
  message,
  onMessageChange,
  onSendMessage
}) => {
  return (
    <div className="card">
      <h2>Send Message</h2>
      <textarea
        placeholder="Enter your message"
        value={message}
        onChange={(e) => onMessageChange(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '10px', minHeight: '60px' }}
      />
      <button onClick={onSendMessage}>Send Message</button>
    </div>
  );
};
