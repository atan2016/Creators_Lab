'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import PageLayout from '@/components/creators-lab/PageLayout'

function JeiPayContent() {
  const searchParams = useSearchParams()
  const registrationId = searchParams.get('registrationId')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!registrationId) {
      setError('Missing registration ID. Use the payment link from your registration confirmation.')
      return
    }

    let cancelled = false

    ;(async () => {
      try {
        const response = await fetch('/api/jei/checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ registrationId }),
        })
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.error || data.message || 'Checkout failed.')
        }
        if (!data.url) throw new Error('No checkout URL returned.')
        if (!cancelled) window.location.href = data.url as string
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Something went wrong.'
        if (!cancelled) setError(msg)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [registrationId])

  return (
    <PageLayout>
      <section className="section">
        <div className="container">
          <div className="card" style={{ maxWidth: '560px', margin: '0 auto' }}>
            {error ? (
              <>
                <h1 style={{ marginTop: 0, color: 'var(--green-800)' }}>Payment</h1>
                <p style={{ color: '#991b1b', lineHeight: 1.55 }}>{error}</p>
                <p className="muted" style={{ lineHeight: 1.55 }}>
                  Return to{' '}
                  <a href="/JEI/register" style={{ color: 'var(--green-700)', fontWeight: 600 }}>
                    JEI registration
                  </a>{' '}
                  or email{' '}
                  <a href="mailto:info@creators-lab.org" style={{ color: 'var(--green-700)', fontWeight: 600 }}>
                    info@creators-lab.org
                  </a>
                  .
                </p>
              </>
            ) : (
              <>
                <h1 style={{ marginTop: 0, color: 'var(--green-800)' }}>Redirecting to checkout…</h1>
                <p className="muted" style={{ lineHeight: 1.55 }}>
                  You are being sent to Stripe to complete payment for the correct number of students and amount.
                  If you have a promotion or coupon code, you can enter it on the Stripe checkout page.
                </p>
              </>
            )}
          </div>
        </div>
      </section>
    </PageLayout>
  )
}

export default function JeiPayPage() {
  return (
    <Suspense
      fallback={
        <PageLayout>
          <section className="section">
            <div className="container">
              <div className="card">Loading…</div>
            </div>
          </section>
        </PageLayout>
      }
    >
      <JeiPayContent />
    </Suspense>
  )
}
