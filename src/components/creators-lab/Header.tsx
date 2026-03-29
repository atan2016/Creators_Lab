import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  return (
    <header>
      <div
        className="container nav"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          maxWidth: '80rem',
          marginLeft: 'auto',
          marginRight: 'auto',
          padding: '1rem 1.5rem',
        }}
      >
        <Link className="brand" href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Image
            src="/assets/images/creatorslab_logo.png"
            alt="Creators Lab"
            width={150}
            height={59}
            style={{ height: '3.69140625em', display: 'inline-block', verticalAlign: 'middle', marginRight: '12px' }}
          />
        </Link>
        <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <Link href="/" style={{ textDecoration: 'none', color: '#064e3b', fontSize: '1rem', fontWeight: 500 }}>Home</Link>
          <Link href="/what-we-teach" style={{ textDecoration: 'none', color: '#064e3b', fontSize: '1rem', fontWeight: 500 }}>What We Teach</Link>
          <Link href="/#programs" style={{ textDecoration: 'none', color: '#064e3b', fontSize: '1rem', fontWeight: 500 }}>Explore Programs</Link>
          <Link href="/showcase" style={{ textDecoration: 'none', color: '#064e3b', fontSize: '1rem', fontWeight: 500 }}>Showcase</Link>
          <Link href="/resources" style={{ textDecoration: 'none', color: '#064e3b', fontSize: '1rem', fontWeight: 500 }}>Resources</Link>
          <Link href="/events" style={{ textDecoration: 'none', color: '#064e3b', fontSize: '1rem', fontWeight: 500 }}>Events</Link>
          <Link href="/#contact" style={{ textDecoration: 'none', color: '#064e3b', fontSize: '1rem', fontWeight: 500 }}>Contact Us</Link>
          <div className="search-container">
            <div className="search-icon" id="searchIcon" aria-label="Search">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="search-input-wrapper" id="searchInputWrapper">
              <input type="text" className="search-input" id="searchInput" placeholder="Search..." aria-label="Search input" />
              <div className="search-results" id="searchResults"></div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}
