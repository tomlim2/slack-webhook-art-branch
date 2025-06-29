require('dotenv').config();

async function testFunction() {
  try {
    const response = await fetch(`${process.env.VITE_SUPABASE_URL}/functions/v1/send-notifications`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();
    console.log('Function response:', result);
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testFunction();
