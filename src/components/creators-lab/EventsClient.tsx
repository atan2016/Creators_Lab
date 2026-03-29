'use client'

import { useEffect, useState } from 'react'

export default function EventsClient() {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)
  const [lightboxAlt, setLightboxAlt] = useState<string>('')

  useEffect(() => {
    // Lightbox functionality
    function setupLightbox() {
      const images = document.querySelectorAll('.event-image')
      
      images.forEach(img => {
        img.addEventListener('click', (e) => {
          const target = e.target as HTMLImageElement
          if (target.src) {
            setLightboxImage(target.src)
            setLightboxAlt(target.alt || 'Event image')
            document.body.style.overflow = 'hidden'
          }
        })
      })
      
      // Close on Escape key
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setLightboxImage(null)
          document.body.style.overflow = ''
        }
      }
      document.addEventListener('keydown', handleEscape)
      
      return () => {
        document.removeEventListener('keydown', handleEscape)
      }
    }
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

          // Group Spring 2026 and JEI summer programs together
          const spring2026Programs = upcoming.filter(event => event.group === 'spring2026')

          const ctaButtonStyle =
            'flex:1;min-width:min(100%,11rem);text-align:center;box-sizing:border-box;padding:0.875rem 1rem;background:var(--green-700);color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:1rem;transition:background 0.3s ease'
          function renderActionRow(item: any) {
            if (item.secondaryActionUrl && item.secondaryAction) {
              return `<div style="display:flex;flex-wrap:wrap;gap:0.75rem;justify-content:stretch;width:100%;max-width:36rem;margin:0 auto">
                    <a href="${item.actionUrl}" style="${ctaButtonStyle}">${item.action}</a>
                    <a href="${item.secondaryActionUrl}" style="${ctaButtonStyle}">${item.secondaryAction}</a>
                  </div>`
            }
            return `<div style="text-align:center;flex-shrink:0">
                    <a href="${item.actionUrl}" style="display:inline-block;padding:0.875rem 2rem;background:var(--green-700);color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:1rem;transition:background 0.3s ease">${item.action}</a>
                  </div>`
          }

          let html = ''

          if (upcoming.length > 0) {
            html += '<div style="margin-bottom:3rem">'
            html += '<h2 style="font-size:1.75rem;color:var(--green-700);margin-bottom:1.5rem;border-bottom:2px solid var(--green-700);padding-bottom:0.5rem">Current Events</h2>'

            // Display shared message for Spring 2026 programs
            if (spring2026Programs.length > 0) {
              html += '<div style="background:#fefce8;border:2px solid var(--yellow-400);border-radius:12px;padding:1.5rem;margin-bottom:2rem">'
              html += `<p style="color:var(--green-900);font-size:1.1rem;line-height:1.8;margin:0 0 1rem;font-weight:500;text-align:center">🎉✨ We're excited to announce that these programs have been officially approved by the Millbrae Rec Center—and we're going live! ✨🎉</p>`
              html += '<p style="color:var(--green-900);font-size:1.1rem;line-height:1.8;margin:0 0 1rem;font-weight:500;text-align:center">📅 Mark your calendar: Space is limited, and registration opens March 6.<br>👉 Register at: <a href="https://bit.ly/milrec" style="color:var(--green-700);text-decoration:underline;font-weight:600">bit.ly/milrec</a></p>'
              html += `<p style="color:var(--green-900);font-size:1.1rem;line-height:1.8;margin:0 0 1rem;font-weight:500;text-align:center">Can't make this session? More programs will be announced soon.</p>`
              html += `<p style="color:var(--green-900);font-size:1.1rem;line-height:1.8;margin:0;font-weight:500;text-align:center">We can't wait to get started! 🚀</p>`
              html += '</div>'

              html += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:1.5rem;margin-bottom:2rem">'
              html += spring2026Programs.map(item => `
                <div class="event-card" style="display:flex;flex-direction:column;height:100%;padding:0">
                  ${item.image ? `<div style="text-align:center;margin:0;flex-shrink:0;width:100%;height:500px;display:flex;align-items:center;justify-content:center;background:#f9fafb;border-radius:8px;overflow:hidden;padding:0"><img class="event-image" src="${item.image}" alt="${item.title}" style="width:100%;height:100%;object-fit:contain;border-radius:8px;display:block;cursor:pointer;transition:transform 0.2s ease" title="Click to zoom" /></div>` : ''}
                </div>
              `).join('')
              html += '</div>'
            }

            html += '</div>'
          }

          if (past.length > 0) {
            html += '<div>'
            html += '<h2 style="font-size:1.75rem;color:var(--muted);margin-bottom:1.5rem;border-bottom:2px solid var(--muted);padding-bottom:0.5rem">Past Events</h2>'
            html += past.map(item => `
              <div class="event-card" style="border-color:rgba(6,78,59,0.2);opacity:0.9">
                <span class="event-badge badge-past">Past Event</span>
                ${item.image ? `<div style="text-align:center;margin-bottom:1.5rem;width:100%;height:300px;display:flex;align-items:center;justify-content:center;background:#f9fafb;border-radius:8px;overflow:hidden;padding:0.5rem"><img class="event-image" src="${item.image}" alt="${item.title}" style="max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1);opacity:0.8;cursor:pointer;transition:transform 0.2s ease" title="Click to zoom" /></div>` : ''}
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
          
          // Setup lightbox after content is loaded
          setTimeout(() => {
            setupLightbox()
          }, 100)
        })
        .catch(error => {
          console.error('Error loading events:', error)
          eventsContainer.innerHTML = '<div style="text-align:center;padding:2rem;color:var(--muted)">Error loading events. Please try again later.</div>'
        })
    }

    loadEvents()
  }, [])

  const closeLightbox = () => {
    setLightboxImage(null)
    document.body.style.overflow = ''
  }

  if (!lightboxImage) {
    return null
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}
      onClick={closeLightbox}
    >
      <div
        style={{
          position: 'relative',
          backgroundColor: '#fff',
          borderRadius: '12px',
          padding: '1rem',
          maxWidth: '90vw',
          maxHeight: '90vh',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeLightbox}
          style={{
            position: 'absolute',
            top: '-15px',
            right: '-15px',
            background: 'var(--green-700)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            color: 'white',
            fontSize: '20px',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10001,
            transition: 'background 0.3s ease',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--green-900)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--green-700)'
          }}
        >
          ×
        </button>
        <img
          src={lightboxImage}
          alt={lightboxAlt}
          style={{
            maxWidth: '85vw',
            maxHeight: '85vh',
            objectFit: 'contain',
            borderRadius: '8px',
            display: 'block'
          }}
        />
      </div>
    </div>
  )
}
