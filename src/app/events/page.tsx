import PageLayout from '@/components/creators-lab/PageLayout'
import EventsClient from '@/components/creators-lab/EventsClient'

export const metadata = {
  title: 'Events — CreatorsLab',
  description: 'Stay up to date with our upcoming workshops, events, and community gatherings.',
}

export default function EventsPage() {
  return (
    <PageLayout>
      <div className="hero">
        <section>
          <div className="container">
            <h1 style={{ fontSize: '2.5rem', margin: '0 0 1rem', textAlign: 'center' }}>Events</h1>
            <p style={{ fontSize: '1.25rem', textAlign: 'center', opacity: 0.95, maxWidth: '800px', margin: '0 auto' }}>Stay up to date with our upcoming workshops, events, and community gatherings.</p>
          </div>
        </section>
      </div>

      <div id="events" style={{ background: '#fff', padding: '3rem 0' }}>
        <section className="section">
          <div className="container">
            <div id="events-container">
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)' }}>
                Loading events...
              </div>
            </div>
          </div>
        </section>
      </div>
      <EventsClient />
    </PageLayout>
  )
}
