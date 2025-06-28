import React from 'react';

interface StatusDisplayProps {
  status: string;
}

export const StatusDisplay: React.FC<StatusDisplayProps> = ({ status }) => {
  if (!status) return null;

  return (
    <div className="card">
      <p style={{ color: status.includes('Error') ? 'red' : 'green' }}>
        {status}
      </p>
    </div>
  );
};
