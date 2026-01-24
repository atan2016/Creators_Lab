import Link from 'next/link'

export default function Footer() {
  return (
    <footer>
      <section>
        <div className="container">
          <div className="footer-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
              <Link href="/about" style={{ color: '#fff', textDecoration: 'none' }}>About Us</Link>
              <Link href="/careers" style={{ color: '#fff', textDecoration: 'none' }}>Careers</Link>
              <Link href="/login" style={{ color: '#fff', textDecoration: 'none' }}>Member Login</Link>
              <a href="https://www.facebook.com/profile.php?id=61582517454567" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }} aria-label="Follow us on Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
            <div className="center">© {new Date().getFullYear()} Creators Lab (a Rokk Research LLC company) • All rights reserved. • EIN: 83-4291515</div>
            <div style={{ display: 'flex', gap: '12px' }}><Link href="/" style={{ color: '#fff' }}>Back to Home</Link></div>
          </div>
        </div>
      </section>
    </footer>
  )
}
