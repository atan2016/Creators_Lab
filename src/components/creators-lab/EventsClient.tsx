'use client'

import { useEffect } from 'react'

export default function EventsClient() {
  useEffect(() => {
    function formatDate(dateString: string) {
      const date = new Date(dateString + 'T00:00:00')
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
      return date.toLocaleDateString('en-US', options)
    }

    function isUpcoming(eventDate: string) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const event = new Date(eventDate + 'T00:00:00')
      return event >= today
    }

    function loadEvents() {
      const eventsContainer = document.getElementById('events-container')
      
      if (!eventsContainer) {
        return
      }

      fetch('/data/announcements.json?' + Date.now())
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok')
          }
          return response.json()
        })
        .then((data: any[]) => {
          if (!data || !Array.isArray(data) || data.length === 0) {
            eventsContainer.innerHTML = '<div style="text-align:center;padding:2rem;color:var(--muted)">No events available at this time.</div>'
            return
          }

          const sortedEvents = [...data].sort((a, b) => {
            const dateA = new Date(a.date + 'T00:00:00')
            const dateB = new Date(b.date + 'T00:00:00')
            return dateB.getTime() - dateA.getTime()
          })

          const upcoming = sortedEvents.filter(event => isUpcoming(event.date))
          const past = sortedEvents.filter(event => !isUpcoming(event.date))

          let html = ''

          if (upcoming.length > 0) {
            html += '<div style="margin-bottom:3rem">'
            html += '<h2 style="font-size:1.75rem;color:var(--green-700);margin-bottom:1.5rem;border-bottom:2px solid var(--green-700);padding-bottom:0.5rem">Upcoming Events</h2>'
            html += upcoming.map(item => `
              <div class="event-card">
                <div class="event-date">📅 ${formatDate(item.date)}</div>
                <span class="event-badge badge-upcoming">Upcoming</span>
                <div style="text-align:center;margin-bottom:1rem">
                  <h2 style="margin:0 0 0.5rem;color:var(--green-700);font-size:1.5rem;font-weight:700">${item.title}</h2>
                  ${item.subtitle ? `<h3 style="margin:0 0 0.5rem;color:var(--green-900);font-size:1.2rem;font-weight:600">${item.subtitle}</h3>` : ''}
                  ${item.tagline ? `<p style="margin:0 0 1rem;color:var(--green-700);font-size:1rem;font-weight:500;font-style:italic">${item.tagline}</p>` : ''}
                </div>
                <div style="color:var(--muted);font-size:0.95rem;line-height:1.7;margin-bottom:1.5rem">${item.description}</div>
                <div style="text-align:center">
                  <a href="${item.actionUrl}" style="display:inline-block;padding:0.875rem 2rem;background:var(--green-700);color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:1rem;transition:background 0.3s ease">${item.action}</a>
                </div>
              </div>
            `).join('')
            html += '</div>'
          }

          if (past.length > 0) {
            html += '<div>'
            html += '<h2 style="font-size:1.75rem;color:var(--muted);margin-bottom:1.5rem;border-bottom:2px solid var(--muted);padding-bottom:0.5rem">Past Events</h2>'
            html += past.map(item => `
              <div class="event-card" style="border-color:rgba(6,78,59,0.2);opacity:0.9">
                <div class="event-date">📅 ${formatDate(item.date)}</div>
                <span class="event-badge badge-past">Past Event</span>
                <div style="text-align:center;margin-bottom:1rem">
                  <h2 style="margin:0 0 0.5rem;color:var(--green-700);font-size:1.5rem;font-weight:700">${item.title}</h2>
                  ${item.subtitle ? `<h3 style="margin:0 0 0.5rem;color:var(--green-900);font-size:1.2rem;font-weight:600">${item.subtitle}</h3>` : ''}
                  ${item.tagline ? `<p style="margin:0 0 1rem;color:var(--green-700);font-size:1rem;font-weight:500;font-style:italic">${item.tagline}</p>` : ''}
                </div>
                <div style="color:var(--muted);font-size:0.95rem;line-height:1.7;margin-bottom:1.5rem">${item.description}</div>
              </div>
            `).join('')
            html += '</div>'
          }

          if (upcoming.length === 0 && past.length === 0) {
            html = '<div style="text-align:center;padding:2rem;color:var(--muted)">No events available at this time.</div>'
          }

          eventsContainer.innerHTML = html
        })
        .catch(error => {
          console.error('Error loading events:', error)
          eventsContainer.innerHTML = '<div style="text-align:center;padding:2rem;color:var(--muted)">Error loading events. Please try again later.</div>'
        })
    }

    loadEvents()
  }, [])

  return null
}
