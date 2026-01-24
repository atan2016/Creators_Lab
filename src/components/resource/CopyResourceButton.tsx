'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CopyResourceButton({ resourceId }: { resourceId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCopy = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/resources/${resourceId}/copy`, {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to copy resource')
        return
      }

      router.refresh()
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {error && (
        <div className="mb-2 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
          {error}
        </div>
      )}
      <button
        onClick={handleCopy}
        disabled={loading}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Copying...' : 'Copy Resource'}
      </button>
    </div>
  )
}
