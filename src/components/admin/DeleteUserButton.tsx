'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface DeleteUserButtonProps {
  userId: string
  userName: string
  userRole: string
  currentUserId: string
  currentUserRole: string
}

export default function DeleteUserButton({ 
  userId, 
  userName, 
  userRole,
  currentUserId, 
  currentUserRole 
}: DeleteUserButtonProps) {
  const router = useRouter()
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleDelete = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to delete user')
        setLoading(false)
        return
      }

      // Refresh the page to show updated user list
      router.refresh()
    } catch (err: any) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  // Don't show delete button for current user
  if (userId === currentUserId) {
    return null
  }

  // Teachers can only delete students
  if (currentUserRole === 'TEACHER' && userRole !== 'STUDENT') {
    return null
  }

  // Students cannot delete anyone
  if (currentUserRole === 'STUDENT') {
    return null
  }

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="text-red-600 hover:text-red-800 text-sm font-medium"
        disabled={loading}
      >
        Delete
      </button>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Confirm Deletion</h3>
            <p className="text-sm text-gray-500 mb-4">
              Are you sure you want to delete <strong>{userName}</strong>? This action cannot be undone.
            </p>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                {error}
              </div>
            )}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowConfirm(false)
                  setError('')
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
