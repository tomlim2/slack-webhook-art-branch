import React from 'react';
import type { WeeklyNotification } from '../types';

interface WeeklyNotificationsProps {
  weeklyNotification: WeeklyNotification;
  notifications: Array<WeeklyNotification & { id: string }>;
  onWeeklyMessageChange: (message: string) => void;
  onWeeklyDayChange: (day: string) => void;
  onWeeklyTimeChange: (time: string) => void;
  onToggleWeekly: () => void;
  onSaveNotification?: () => void;
  onDeleteNotification?: () => void;
  onLoadNotification?: (id: string) => void;
  onToggleNotificationById?: (id: string) => void;
  onDeleteNotificationById?: (id: string) => void;
  onCreateNotification?: (notification: WeeklyNotification) => void;
  isLoading?: boolean;
}

export const WeeklyNotifications: React.FC<WeeklyNotificationsProps> = ({
  weeklyNotification,
  notifications,
  onWeeklyMessageChange,
  onWeeklyDayChange,
  onWeeklyTimeChange,
  onToggleWeekly,
  onSaveNotification,
  onDeleteNotification,
  onLoadNotification,
  onToggleNotificationById,
  onDeleteNotificationById,
  onCreateNotification,
  isLoading = false
}) => {
  const handleCreateNew = () => {
    if (onCreateNotification && weeklyNotification.message.trim()) {
      onCreateNotification(weeklyNotification);
    }
  };

  return (
    <div className="card">
      <h2>Weekly Notifications</h2>
      
      {/* Form for creating/editing notifications */}
      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '4px' }}>
        <h3>Create/Edit Notification</h3>
        <textarea
          placeholder="Weekly notification message"
          value={weeklyNotification.message}
          onChange={(e) => onWeeklyMessageChange(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '10px', minHeight: '60px' }}
          disabled={isLoading}
        />
        <div style={{ marginBottom: '10px' }}>
          <label>Day: </label>
          <select 
            value={weeklyNotification.day} 
            onChange={(e) => onWeeklyDayChange(e.target.value)}
            disabled={isLoading}
          >
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
            disabled={isLoading}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <button onClick={onToggleWeekly} disabled={isLoading}>
            {weeklyNotification.enabled ? 'Disable' : 'Enable'} Weekly Notifications
          </button>
          {onSaveNotification && (
            <button 
              onClick={onSaveNotification} 
              disabled={isLoading || !weeklyNotification.message.trim()} 
              style={{ 
                marginLeft: '10px',
                backgroundColor: !weeklyNotification.message.trim() ? '#ccc' : '#4caf50',
                color: 'white'
              }}
            >
              {isLoading ? 'Saving...' : 'Save Notification'}
            </button>
          )}
          {onCreateNotification && (
            <button 
              onClick={handleCreateNew} 
              disabled={isLoading || !weeklyNotification.message.trim()} 
              style={{ 
                marginLeft: '10px',
                backgroundColor: !weeklyNotification.message.trim() ? '#ccc' : '#2196f3',
                color: 'white'
              }}
            >
              {isLoading ? 'Creating...' : 'Create New'}
            </button>
          )}
          {onDeleteNotification && (
            <button onClick={onDeleteNotification} disabled={isLoading} style={{ marginLeft: '10px', backgroundColor: '#ff4444', color: 'white' }}>
              Delete Current
            </button>
          )}
        </div>
      </div>

      {/* Warning message about browser requirements */}
      {weeklyNotification.enabled && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#fff3cd', 
          border: '1px solid #ffeaa7', 
          borderRadius: '4px',
          marginTop: '10px'
        }}>
          <strong>⚠️ Important:</strong>
          <br />
          <span style={{ color: '#856404' }}>
            Weekly notifications only work when this browser tab is open. 
            For reliable notifications, consider setting up a server-side solution.
          </span>
          <br />
          <small style={{ color: '#666' }}>
            Current schedule: {weeklyNotification.day.charAt(0).toUpperCase() + weeklyNotification.day.slice(1)} at {weeklyNotification.time}
            <br />
            Next check: Every minute when browser is open
          </small>
        </div>
      )}

      {/* List of all notifications */}
      <div>
        <h3>All Notifications ({notifications.length})</h3>
        {isLoading && <p>Loading notifications...</p>}
        {notifications.length === 0 && !isLoading && (
          <p style={{ color: '#666', fontStyle: 'italic' }}>No notifications found. Create one above.</p>
        )}
        {notifications.map(notification => (
          <div 
            key={notification.id} 
            style={{ 
              border: '1px solid #ccc', 
              padding: '15px', 
              margin: '10px 0', 
              borderRadius: '4px',
              backgroundColor: notification.enabled ? '#f0f8ff' : '#f9f9f9'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>
                  {notification.message.length > 100 
                    ? `${notification.message.substring(0, 100)}...` 
                    : notification.message}
                </p>
                <p style={{ margin: '0 0 5px 0', color: '#666' }}>
                  <strong>Schedule:</strong> {notification.day.charAt(0).toUpperCase() + notification.day.slice(1)} at {notification.time}
                </p>
                <p style={{ margin: '0', color: notification.enabled ? 'green' : 'red' }}>
                  <strong>Status:</strong> {notification.enabled ? '✅ Active' : '❌ Inactive'}
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginLeft: '15px' }}>
                {onLoadNotification && (
                  <button 
                    onClick={() => onLoadNotification(notification.id)}
                    disabled={isLoading}
                    style={{ padding: '4px 8px', fontSize: '12px' }}
                  >
                    Edit
                  </button>
                )}
                {onToggleNotificationById && (
                  <button 
                    onClick={() => onToggleNotificationById(notification.id)}
                    disabled={isLoading}
                    style={{ 
                      padding: '4px 8px', 
                      fontSize: '12px',
                      backgroundColor: notification.enabled ? '#ff9800' : '#4caf50',
                      color: 'white',
                      border: 'none'
                    }}
                  >
                    {notification.enabled ? 'Disable' : 'Enable'}
                  </button>
                )}
                {onDeleteNotificationById && (
                  <button 
                    onClick={() => onDeleteNotificationById(notification.id)}
                    disabled={isLoading}
                    style={{ 
                      padding: '4px 8px', 
                      fontSize: '12px',
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none'
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
