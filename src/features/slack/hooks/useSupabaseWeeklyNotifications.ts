import { useState, useCallback, useEffect } from 'react';
import type { WeeklyNotification } from '../../../types';
import { supabase } from '../../../lib/supabase';

const INITIAL_WEEKLY_NOTIFICATION: WeeklyNotification = {
  message: '',
  day: 'monday',
  time: '09:00',
  enabled: false
};

// Day mapping for database
const DAY_TO_NUMBER = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6
} as const;

const NUMBER_TO_DAY = {
  0: 'sunday',
  1: 'monday',
  2: 'tuesday',
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
  6: 'saturday'
} as const;

export const useSupabaseWeeklyNotifications = () => {
  const [weeklyNotification, setWeeklyNotification] = useState<WeeklyNotification>(INITIAL_WEEKLY_NOTIFICATION);
  const [weeklyNotificationId, setWeeklyNotificationId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Array<WeeklyNotification & { id: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>('anonymous-user'); // Use anonymous for now

  // Remove user authentication requirement for testing
  useEffect(() => {
    // Set a dummy user ID for testing
    setUserId('anonymous-user');
  }, []);

  // Load all weekly notifications from database
  const loadAllNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Loading all notifications...');
      const { data, error } = await supabase
        .from('weekly_notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Loaded notifications:', data);

      const formattedNotifications = (data || []).map(item => ({
        id: item.id,
        message: item.message,
        day: NUMBER_TO_DAY[item.day_of_week as keyof typeof NUMBER_TO_DAY],
        time: item.time,
        enabled: item.is_active
      }));

      setNotifications(formattedNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
      setError(`Error loading notifications: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save weekly notification to database
  const saveWeeklyNotification = useCallback(async () => {
    console.log('saveWeeklyNotification called', { weeklyNotification });
    
    if (!weeklyNotification.message.trim()) {
      setError('Message is required');
      console.log('No message provided');
      return false;
    }

    setIsLoading(true);
    setError(null);
    try {
      const notificationData = {
        message: weeklyNotification.message,
        day_of_week: DAY_TO_NUMBER[weeklyNotification.day as keyof typeof DAY_TO_NUMBER],
        time: weeklyNotification.time,
        is_active: weeklyNotification.enabled,
        updated_at: new Date().toISOString()
      };

      console.log('Saving notification data:', notificationData);

      if (weeklyNotificationId) {
        // Update existing
        console.log('Updating existing notification with ID:', weeklyNotificationId);
        const { error } = await supabase
          .from('weekly_notifications')
          .update(notificationData)
          .eq('id', weeklyNotificationId);

        if (error) {
          console.error('Update error:', error);
          throw error;
        }
      } else {
        // Create new
        console.log('Creating new notification');
        const { data, error } = await supabase
          .from('weekly_notifications')
          .insert(notificationData)
          .select()
          .single();

        if (error) {
          console.error('Insert error:', error);
          throw error;
        }
        console.log('Created notification with ID:', data.id);
        setWeeklyNotificationId(data.id);
      }

      // Refresh the notifications list
      await loadAllNotifications();
      console.log('Notification saved successfully');
      return true;
    } catch (error) {
      console.error('Error saving weekly notification:', error);
      setError(`Error saving weekly notification: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [weeklyNotification, weeklyNotificationId, loadAllNotifications]);

  // Create new notification
  const createNotification = useCallback(async (notificationData: WeeklyNotification) => {
    console.log('createNotification called', { notificationData });
    
    if (!notificationData.message.trim()) {
      setError('Message is required');
      return false;
    }

    setIsLoading(true);
    setError(null);
    try {
      const insertData = {
        message: notificationData.message,
        day_of_week: DAY_TO_NUMBER[notificationData.day as keyof typeof DAY_TO_NUMBER],
        time: notificationData.time,
        is_active: notificationData.enabled
      };

      console.log('Creating notification with data:', insertData);

      const { data, error } = await supabase
        .from('weekly_notifications')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Create error:', error);
        throw error;
      }

      console.log('Created notification:', data);

      // Refresh the notifications list
      await loadAllNotifications();
      
      return data.id;
    } catch (error) {
      console.error('Error creating notification:', error);
      setError(`Error creating notification: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [loadAllNotifications]);

  // Load specific notification by ID
  const loadNotificationById = useCallback(async (notificationId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Loading notification by ID:', notificationId);
      const { data, error } = await supabase
        .from('weekly_notifications')
        .select('*')
        .eq('id', notificationId)
        .single();

      if (error) {
        console.error('Load by ID error:', error);
        throw error;
      }

      if (data) {
        console.log('Loaded notification:', data);
        setWeeklyNotificationId(data.id);
        setWeeklyNotification({
          message: data.message,
          day: NUMBER_TO_DAY[data.day_of_week as keyof typeof NUMBER_TO_DAY],
          time: data.time,
          enabled: data.is_active
        });
      }
    } catch (error) {
      console.error('Error loading notification:', error);
      setError(`Error loading notification: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Delete notification by ID
  const deleteNotificationById = useCallback(async (notificationId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Deleting notification:', notificationId);
      const { error } = await supabase
        .from('weekly_notifications')
        .delete()
        .eq('id', notificationId);

      if (error) {
        console.error('Delete error:', error);
        throw error;
      }

      // If we're deleting the currently selected notification, reset the form
      if (weeklyNotificationId === notificationId) {
        setWeeklyNotificationId(null);
        setWeeklyNotification(INITIAL_WEEKLY_NOTIFICATION);
      }

      // Refresh the notifications list
      await loadAllNotifications();
      
      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      setError(`Error deleting notification: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [weeklyNotificationId, loadAllNotifications]);

  // Update notification by ID
  const updateNotificationById = useCallback(async (notificationId: string, updates: Partial<WeeklyNotification>) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Updating notification:', notificationId, updates);
      
      const updateData: {
        updated_at: string;
        message?: string;
        day_of_week?: number;
        time?: string;
        is_active?: boolean;
      } = { updated_at: new Date().toISOString() };
      
      if (updates.message !== undefined) updateData.message = updates.message;
      if (updates.day !== undefined) updateData.day_of_week = DAY_TO_NUMBER[updates.day as keyof typeof DAY_TO_NUMBER];
      if (updates.time !== undefined) updateData.time = updates.time;
      if (updates.enabled !== undefined) updateData.is_active = updates.enabled;

      const { error } = await supabase
        .from('weekly_notifications')
        .update(updateData)
        .eq('id', notificationId);

      if (error) {
        console.error('Update error:', error);
        throw error;
      }

      // Refresh the notifications list
      await loadAllNotifications();
      
      return true;
    } catch (error) {
      console.error('Error updating notification:', error);
      setError(`Error updating notification: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [loadAllNotifications]);

  // Toggle notification status by ID
  const toggleNotificationById = useCallback(async (notificationId: string) => {
    const notification = notifications.find(n => n.id === notificationId);
    if (!notification) return false;

    return await updateNotificationById(notificationId, { enabled: !notification.enabled });
  }, [notifications, updateNotificationById]);

  // Update weekly notification (local state)
  const updateWeeklyNotification = useCallback((updates: Partial<WeeklyNotification>) => {
    setWeeklyNotification(prev => ({ ...prev, ...updates }));
  }, []);

  // Load notifications on mount
  useEffect(() => {
    loadAllNotifications();
  }, [loadAllNotifications]);

  // Delete weekly notification (for the currently selected one)
  const deleteWeeklyNotification = useCallback(async () => {
    if (!weeklyNotificationId) return false;

    setIsLoading(true);
    setError(null);
    try {
      console.log('Deleting current weekly notification:', weeklyNotificationId);
      const { error } = await supabase
        .from('weekly_notifications')
        .delete()
        .eq('id', weeklyNotificationId);

      if (error) {
        console.error('Delete error:', error);
        throw error;
      }

      setWeeklyNotificationId(null);
      setWeeklyNotification(INITIAL_WEEKLY_NOTIFICATION);
      
      // Refresh the notifications list
      await loadAllNotifications();
      
      return true;
    } catch (error) {
      console.error('Error deleting weekly notification:', error);
      setError(`Error deleting weekly notification: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [weeklyNotificationId, loadAllNotifications]);

  // Load weekly notification (load the first one or a specific one)
  const loadWeeklyNotification = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Loading weekly notification...');
      const { data, error } = await supabase
        .from('weekly_notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setWeeklyNotificationId(data.id);
        setWeeklyNotification({
          message: data.message,
          day: NUMBER_TO_DAY[data.day_of_week as keyof typeof NUMBER_TO_DAY],
          time: data.time,
          enabled: data.is_active
        });
      } else {
        // Reset to initial state if no data found
        setWeeklyNotificationId(null);
        setWeeklyNotification(INITIAL_WEEKLY_NOTIFICATION);
      }
    } catch (error) {
      console.error('Error loading weekly notification:', error);
      setError(`Error loading weekly notification: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    weeklyNotification,
    weeklyNotificationId,
    notifications,
    isLoading,
    error,
    userId,
    updateWeeklyNotification,
    saveWeeklyNotification,
    loadWeeklyNotification,
    deleteWeeklyNotification,
    // New functions for managing multiple notifications
    loadAllNotifications,
    loadNotificationById,
    createNotification,
    updateNotificationById,
    deleteNotificationById,
    toggleNotificationById
  };
};
