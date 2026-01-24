import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://creators-lab.org')

    const announcementsUrl = `${baseUrl}/data/announcements.json`
    
    const response = await fetch(announcementsUrl, {
      headers: {
        'Cache-Control': 'no-cache',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch announcements: ${response.statusText}`)
    }

    const announcements = await response.json()

    if (!Array.isArray(announcements)) {
      return NextResponse.json({ error: 'Invalid announcements data format' }, { status: 500 })
    }

    const today = new Date()
    today.setUTCHours(0, 0, 0, 0)

    const pastEvents: any[] = []
    const upcomingEvents: any[] = []

    announcements.forEach((event: any) => {
      if (!event.date) {
        upcomingEvents.push(event)
        return
      }

      const eventDate = new Date(event.date + 'T00:00:00')
      eventDate.setUTCHours(0, 0, 0, 0)

      if (eventDate < today) {
        pastEvents.push(event)
      } else {
        upcomingEvents.push(event)
      }
    })

    const result = {
      timestamp: new Date().toISOString(),
      totalEvents: announcements.length,
      pastEvents: pastEvents.length,
      upcomingEvents: upcomingEvents.length,
      message: `Identified ${pastEvents.length} past event(s) and ${upcomingEvents.length} upcoming event(s)`,
    }

    console.log('Monthly Event Archiving Report:', result)
    console.log('Past Events:', pastEvents.map(e => ({ title: e.title, date: e.date })))
    console.log('Upcoming Events:', upcomingEvents.map(e => ({ title: e.title, date: e.date })))

    return NextResponse.json({
      success: true,
      ...result,
      note: 'Events are filtered on the client side. This function logs the status for monitoring purposes.',
    })
  } catch (error: any) {
    console.error('Error processing events:', error)
    return NextResponse.json(
      {
        error: 'Failed to process events',
        message: error.message,
      },
      { status: 500 }
    )
  }
}
