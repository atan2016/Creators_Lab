'use client'

import { Suspense, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import PageLayout from '@/components/creators-lab/PageLayout'

function JeiCancelConfirmPageContent() {
  const searchParams = useSearchParams()
  const token = useMemo(() => searchParams.get('token') || '', [searchParams])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<any>(null)

  const confirmCancel = async () => {
    setError('')
    setLoading(true)
    try {
      const response = await fetch('/api/jei/register/cancel-confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to process cancellation')
      setResult(data)
    } catch (err: any) {
      setError(err.message || 'Unable to process cancellation')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout>
      <section className="section">
        <div className="container">
          <div className="card" style={{ maxWidth: '720px', margin: '0 auto' }}>
            <h1 style={{ marginTop: 0, color: 'var(--green-700)' }}>Confirm JEI Cancellation</h1>
            <p className="muted">
              This cancellation will follow JEI policy: up to 30 days before start date, refund minus 3% processing fee; within 30 days, credit only (expires in 1 year).
            </p>

            {!token && (
              <div style={{ background: '#fee2e2', color: '#991b1b', padding: '0.75rem', borderRadius: '8px' }}>
                Missing cancellation token.
              </div>
            )}

            {error && (
              <div style={{ background: '#fee2e2', color: '#991b1b', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>
                {error}
              </div>
            )}

            {result && (
              <div style={{ background: '#ecfdf5', color: '#166534', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>
                {result.mode === 'refund' ? (
                  <div>
                    Cancellation completed. Refund: ${result.refundAmount} (processing fee: ${result.processingFee}).
                  </div>
                ) : (
                  <div>
                    Cancellation completed. Credit issued: ${result.creditAmount}. Expires on{' '}
                    {result.creditExpiresAt ? new Date(result.creditExpiresAt).toLocaleDateString() : 'N/A'}.
                  </div>
                )}
              </div>
            )}

            <button
              type="button"
              disabled={!token || loading || !!result}
              onClick={confirmCancel}
              style={{ padding: '0.8rem 1.2rem', borderRadius: '8px', border: 'none', background: 'var(--green-700)', color: '#fff', fontWeight: 600 }}
            >
              {loading ? 'Processing...' : 'Confirm Cancellation'}
            </button>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}

export default function JeiCancelConfirmPage() {
  return (
    <Suspense fallback={<PageLayout><section className="section"><div className="container"><div className="card">Loading cancellation page...</div></div></section></PageLayout>}>
      <JeiCancelConfirmPageContent />
    </Suspense>
  )
}
