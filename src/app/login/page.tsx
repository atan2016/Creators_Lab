'use client'

import { useState, useEffect, Suspense } from 'react'
import { getSession, signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Script from 'next/script'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Check for error in URL (from NextAuth redirect)
  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam) {
      if (errorParam === 'CredentialsSignin' || errorParam === 'undefined') {
        setError('Invalid email or password')
      } else {
        setError(`Login error: ${errorParam}`)
      }
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()
    
    console.log('Form submitted!', { email: email.substring(0, 3) + '...' })
    
    if (!email || !password) {
      setError('Please enter both email and password')
      return
    }

    setError('')
    setLoading(true)

    try {
      console.log('Attempting to sign in with:', { email })
      
      const result = await signIn('credentials', {
        email: email.trim(),
        password,
        redirect: false,
      })

      console.log('Sign in result:', result)

      if (!result) {
        setError('No response from server. Please try again.')
        setLoading(false)
        return
      }

      if (result.error) {
        console.error('Sign in error:', result.error)
        const errorMessage = result.error === 'CredentialsSignin' || result.error === 'undefined'
          ? 'Invalid email or password'
          : result.error || 'Login failed. Please try again.'
        setError(errorMessage)
        setLoading(false)
        return
      }

      if (result.ok) {
        console.log('Sign in successful, resolving destination...')
        // Small delay to ensure session is set
        await new Promise(resolve => setTimeout(resolve, 100))
        const session = await getSession()
        const role = (session?.user as any)?.role
        const mustResetPassword = (session?.user as any)?.mustResetPassword
        const destination =
          mustResetPassword
            ? '/reset-password'
            : role === 'ADMIN'
              ? '/admin'
              : role === 'TEACHER'
                ? '/teacher'
                : role === 'STUDENT'
                  ? '/student'
                  : '/'
        router.push(destination)
        router.refresh()
      } else {
        setError('Login failed. Please try again.')
        setLoading(false)
      }
    } catch (err: any) {
      console.error('Login exception:', err)
      setError(err?.message || 'An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-85L4ZPPPP0"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-85L4ZPPPP0');
        `}
      </Script>

      <header>
        <div className="container nav" style={{ justifyContent: 'space-between' }}>
          <Link className="brand" href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Image
              src="/assets/images/creatorslab_logo.png"
              alt="CreatorsLab"
              width={150}
              height={59}
              style={{ height: '3.69140625em', display: 'inline-block', verticalAlign: 'middle', marginRight: '12px' }}
            />
          </Link>
          <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link href="/" style={{ textDecoration: 'none', color: 'var(--green-900)', fontSize: '1rem', fontWeight: 500 }}>Home</Link>
            <Link href="/what-we-teach" style={{ textDecoration: 'none', color: 'var(--green-900)', fontSize: '1rem', fontWeight: 500 }}>What We Teach</Link>
            <Link href="/#programs" style={{ textDecoration: 'none', color: 'var(--green-900)', fontSize: '1rem', fontWeight: 500 }}>Explore Programs</Link>
            <Link href="/showcase" style={{ textDecoration: 'none', color: 'var(--green-900)', fontSize: '1rem', fontWeight: 500 }}>Showcase</Link>
            <Link href="/resources" style={{ textDecoration: 'none', color: 'var(--green-900)', fontSize: '1rem', fontWeight: 500 }}>Resources</Link>
            <Link href="/events" style={{ textDecoration: 'none', color: 'var(--green-900)', fontSize: '1rem', fontWeight: 500 }}>Events</Link>
            <Link href="/#contact" style={{ textDecoration: 'none', color: 'var(--green-900)', fontSize: '1rem', fontWeight: 500 }}>Contact Us</Link>
          </nav>
        </div>
      </header>

      <section className="section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
        <div className="container">
          <div className="card" style={{ maxWidth: 480, margin: '0 auto', padding: '2rem' }}>
            <h1 style={{ textAlign: 'center', marginTop: 0, fontSize: '2rem', color: 'var(--green-900)' }}>Member Login</h1>
            <form onSubmit={handleSubmit} noValidate>
              {error && (
                <div style={{ background: '#fee', border: '1px solid #fcc', color: '#c33', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>
                  {error}
                </div>
              )}
              <input
                className="form-input"
                placeholder="Email"
                type="email"
                required
                style={{ marginBottom: '1rem' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="form-input"
                placeholder="Password"
                type="password"
                required
                style={{ marginBottom: '1rem' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  if (!email || !password) {
                    setError('Please enter both email and password')
                    return
                  }
                  handleSubmit(e as any)
                }}
                disabled={loading}
                className="btn"
                style={{ width: '100%', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}
              >
                {loading ? 'Signing in...' : 'Login'}
              </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' }} className="muted">
              <Link href="/forgot-password" style={{ color: 'var(--green-700)', textDecoration: 'underline' }}>
                Forgot your password?
              </Link>
            </p>
            <p style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.9rem' }} className="muted">
              Need an account? <a href="mailto:info@creators-lab.org" style={{ color: 'var(--green-700)' }}>Contact us</a> to get started.
            </p>
          </div>
        </div>
      </section>

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
              <div className="center">© {new Date().getFullYear()} Creators Lab (a Rokk Research LLC company) • All rights reserved.</div>
              <div style={{ display: 'flex', gap: '12px' }}><Link href="/" style={{ color: '#fff' }}>Back to Home</Link></div>
            </div>
          </div>
        </section>
      </footer>
    </>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading...</p>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
