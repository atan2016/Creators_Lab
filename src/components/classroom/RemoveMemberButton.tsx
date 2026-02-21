'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface RemoveMemberButtonProps {
  classroomId: string
  memberId: string
  memberName: string
  memberRole: string
  isAdmin: boolean
}

export default function RemoveMemberButton({
  classroomId,
  memberId,
  memberName,
  memberRole,
  isAdmin,
}: RemoveMemberButtonProps) {
  const router = useRouter()
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleRemove = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/classrooms/${classroomId}/members/${memberId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to remove member')
        setLoading(false)
        return
      }

      router.refresh()
    } catch {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  // Admin can remove teachers from a classroom (per user request)
  if (memberRole !== 'TEACHER' || !isAdmin) {
    return null
  }

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="text-red-600 hover:text-red-800 text-sm font-medium"
        disabled={loading}
        aria-label={`Remove ${memberName} from classroom`}
      >
        Remove
      </button>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Remove from Classroom</h3>
            <p className="text-sm text-gray-500 mb-4">
              Are you sure you want to remove {memberName} ({memberRole}) from this classroom?
            </p>
            {error && (
              <p className="text-sm text-red-600 mb-4">{error}</p>
            )}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowConfirm(false)
                  setError('')
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleRemove}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md disabled:opacity-50"
              >
                {loading ? 'Removing...' : 'Remove'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
