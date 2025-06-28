import React from 'react';
import type { WeeklyNotification } from '../types';

interface WeeklyNotificationsProps {
  weeklyNotification: WeeklyNotification;
  onWeeklyMessageChange: (message: string) => void;
  onWeeklyDayChange: (day: string) => void;
  onWeeklyTimeChange: (time: string) => void;
  onToggleWeekly: () => void;
}

export const WeeklyNotifications: React.FC<WeeklyNotificationsProps> = ({
  weeklyNotification,
  onWeeklyMessageChange,
  onWeeklyDayChange,
  onWeeklyTimeChange,
  onToggleWeekly
}) => {
  return (
    <div className="card">
      <h2>Weekly Notifications</h2>
      
      <textarea
        placeholder="Weekly notification message"
        value={weeklyNotification.message}
        onChange={(e) => onWeeklyMessageChange(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '10px', minHeight: '60px' }}
      />
      <div style={{ marginBottom: '10px' }}>
        <label>Day: </label>
        <select value={weeklyNotification.day} onChange={(e) => onWeeklyDayChange(e.target.value)}>
          <option value="monday">Monday</option>
          <option value="tuesday">Tuesday</option>
          <option value="wednesday">Wednesday</option>
          <option value="thursday">Thursday</option>
          <option value="friday">Friday</option>
          <option value="saturday">Saturday</option>
          <option value="sunday">Sunday</option>
        </select>
        <label style={{ marginLeft: '20px' }}>Time: </label>
        <input
          type="time"
          value={weeklyNotification.time}
          onChange={(e) => onWeeklyTimeChange(e.target.value)}
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={onToggleWeekly}>
          {weeklyNotification.enabled ? 'Disable' : 'Enable'} Weekly Notifications
        </button>
      </div>

      {weeklyNotification.enabled && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#f0f8ff', 
          border: '1px solid #ddd', 
          borderRadius: '4px',
          marginTop: '10px'
        }}>
          <strong>Active Weekly Notification:</strong>
          <br />
          <span style={{ color: 'green' }}>● </span>
          {weeklyNotification.day.charAt(0).toUpperCase() + weeklyNotification.day.slice(1)} at {weeklyNotification.time}
          <br />
          <small style={{ color: '#666' }}>
            {weeklyNotification.message.length > 50 
              ? `${weeklyNotification.message.substring(0, 50)}...` 
              : weeklyNotification.message}
          </small>
        </div>
      )}
    </div>
  );
};
