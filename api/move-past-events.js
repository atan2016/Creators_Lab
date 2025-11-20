/**
 * Vercel Serverless Function for Monthly Event Archiving
 * This function runs monthly via Vercel Cron to identify and log past events
 * Note: Events are filtered on the client side, so this function is for monitoring/logging purposes
 */

export default async function handler(req, res) {
  // Only allow GET requests (cron jobs typically use GET)
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the base URL (either from environment variable or construct from request)
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : (process.env.NEXT_PUBLIC_SITE_URL || 'https://creators-lab.org');

    // Fetch announcements.json from the deployed site
    const announcementsUrl = `${baseUrl}/announcements.json`;
    
    const response = await fetch(announcementsUrl, {
      headers: {
        'Cache-Control': 'no-cache'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch announcements: ${response.statusText}`);
    }

    const announcements = await response.json();

    if (!Array.isArray(announcements)) {
      return res.status(500).json({ error: 'Invalid announcements data format' });
    }

    // Get current date (UTC, date only)
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    // Identify past events
    const pastEvents = [];
    const upcomingEvents = [];

    announcements.forEach(event => {
      if (!event.date) {
        // If no date, keep it as-is
        upcomingEvents.push(event);
        return;
      }

      const eventDate = new Date(event.date + 'T00:00:00');
      eventDate.setUTCHours(0, 0, 0, 0);

      if (eventDate < today) {
        pastEvents.push(event);
      } else {
        upcomingEvents.push(event);
      }
    });

    // Log the results
    const result = {
      timestamp: new Date().toISOString(),
      totalEvents: announcements.length,
      pastEvents: pastEvents.length,
      upcomingEvents: upcomingEvents.length,
      message: `Identified ${pastEvents.length} past event(s) and ${upcomingEvents.length} upcoming event(s)`
    };

    // Log detailed information
    console.log('Monthly Event Archiving Report:', result);
    console.log('Past Events:', pastEvents.map(e => ({ title: e.title, date: e.date })));
    console.log('Upcoming Events:', upcomingEvents.map(e => ({ title: e.title, date: e.date })));

    // Return success response
    return res.status(200).json({
      success: true,
      ...result,
      note: 'Events are filtered on the client side. This function logs the status for monitoring purposes.'
    });

  } catch (error) {
    console.error('Error processing events:', error);
    return res.status(500).json({
      error: 'Failed to process events',
      message: error.message
    });
  }
}

