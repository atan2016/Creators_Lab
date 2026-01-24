import Link from 'next/link'
import Image from 'next/image'

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
      <Image
        src="/assets/images/creatorslab_logo.png"
        alt="CreatorsLab"
        width={200}
        height={79}
        style={{ marginBottom: '2rem' }}
      />
      <h1 style={{ fontSize: '3rem', color: 'var(--green-700)', marginBottom: '1rem' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', color: 'var(--green-900)', marginBottom: '1rem' }}>Page Not Found</h2>
      <p style={{ color: 'var(--muted)', marginBottom: '2rem', maxWidth: '500px' }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link 
        href="/" 
        style={{ 
          display: 'inline-block',
          padding: '0.875rem 2rem', 
          background: 'var(--green-700)', 
          color: '#fff', 
          textDecoration: 'none', 
          borderRadius: '8px', 
          fontWeight: 600,
          fontSize: '1rem'
        }}
      >
        Go to Home
      </Link>
    </div>
  )
}
