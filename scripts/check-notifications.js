const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkAndSendNotifications() {
  try {
    // Get current day and time
    const now = new Date();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDay = dayNames[now.getDay()];
    const currentTime = now.toTimeString().slice(0, 5);

    console.log(`Checking notifications for ${currentDay} at ${currentTime}`);

    // Find active notifications for current day and time
    const { data: notifications, error } = await supabase
      .from('weekly_notifications')
      .select('*')
      .eq('day_of_week', dayNames.indexOf(currentDay))
      .eq('time', currentTime)
      .eq('is_active', true);

    if (error) {
      throw error;
    }

    console.log(`Found ${notifications?.length || 0} notifications to send`);

    // Send each notification
    for (const notification of notifications || []) {
      try {
        const webhookUrl = process.env.VITE_SLACK_TEST_WEBHOOK_URL;
        
        if (!webhookUrl) {
          throw new Error('No webhook URL configured');
        }

        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: notification.message
          })
        });

        if (response.ok) {
          console.log(`✅ Sent notification ${notification.id}: ${notification.message}`);
        } else {
          console.log(`❌ Failed to send notification ${notification.id}`);
        }
      } catch (error) {
        console.error(`Failed to send notification ${notification.id}:`, error.message);
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the check
checkAndSendNotifications();
