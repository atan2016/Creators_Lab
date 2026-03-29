'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface DeletePostButtonProps {
  postId: string
  classroomId: string
  isAdmin: boolean
  onDeleted?: () => void
  /** When true, redirect to forum list after delete (e.g. from post detail page). */
  redirectAfterDelete?: boolean
  className?: string
}

export default function DeletePostButton({
  postId,
  classroomId,
  isAdmin,
  onDeleted,
  redirectAfterDelete,
  className = '',
}: DeletePostButtonProps) {
  const [deleting, setDeleting] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const router = useRouter()

  if (!isAdmin) return null

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const res = await fetch(`/api/forum/posts/${postId}`, { method: 'DELETE' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        alert(data.error || 'Failed to delete post')
        return
      }
      if (redirectAfterDelete) {
        router.push(`/teacher/classrooms/${classroomId}/forum`)
        router.refresh()
      } else {
        onDeleted?.()
      }
    } catch {
      alert('Failed to delete post')
    } finally {
      setDeleting(false)
      setConfirming(false)
    }
  }

  if (confirming) {
    return (
      <span className={`inline-flex items-center gap-2 ${className}`}>
        <span className="text-sm text-gray-600">Delete this post?</span>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="text-sm text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
        >
          {deleting ? 'Deleting…' : 'Yes, delete'}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          disabled={deleting}
          className="text-sm text-gray-600 hover:text-gray-700 disabled:opacity-50"
        >
          Cancel
        </button>
      </span>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className={`text-sm text-red-600 hover:text-red-700 ${className}`}
    >
      Delete
    </button>
  )
}
