'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface ClassroomUser {
  id: string
  name: string | null
  email: string
  role: string
}

interface CreatePostModalProps {
  classroomId: string
  isTeacher: boolean
  onClose: () => void
}

export default function CreatePostModal({ classroomId, isTeacher, onClose }: CreatePostModalProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    isAnnouncement: false,
    visibleToUserIds: [] as string[],
  })
  const [classroomUsers, setClassroomUsers] = useState<ClassroomUser[]>([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isTeacher) return
    let cancelled = false
    setUsersLoading(true)
    fetch(`/api/classrooms/${classroomId}/members`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data.users) setClassroomUsers(data.users)
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setUsersLoading(false) })
    return () => { cancelled = true }
  }, [classroomId, isTeacher])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const body: Record<string, unknown> = {
        title: formData.title,
        content: formData.content,
        isAnnouncement: formData.isAnnouncement,
      }
      if (!formData.isAnnouncement && formData.visibleToUserIds.length > 0) {
        body.visibleToUserIds = formData.visibleToUserIds
      }
      const response = await fetch(`/api/classrooms/${classroomId}/forum`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to create post')
        return
      }

      router.refresh()
      onClose()
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const toggleViewer = (userId: string) => {
    setFormData((prev) => ({
      ...prev,
      visibleToUserIds: prev.visibleToUserIds.includes(userId)
        ? prev.visibleToUserIds.filter((id) => id !== userId)
        : [...prev.visibleToUserIds, userId],
    }))
  }

  const selectAllViewers = () => {
    setFormData((prev) => ({
      ...prev,
      visibleToUserIds: classroomUsers.map((u) => u.id),
    }))
  }

  const clearViewers = () => {
    setFormData((prev) => ({ ...prev, visibleToUserIds: [] }))
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-lg shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">
            {isTeacher ? 'Create Post or Announcement' : 'Create Post'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Content *
            </label>
            <textarea
              id="content"
              name="content"
              rows={6}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
          </div>

          {isTeacher && (
            <div className="flex items-center">
              <input
                id="isAnnouncement"
                name="isAnnouncement"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={formData.isAnnouncement}
                onChange={(e) => setFormData({ ...formData, isAnnouncement: e.target.checked })}
              />
              <label htmlFor="isAnnouncement" className="ml-2 block text-sm text-gray-900">
                Post as announcement (visible to everyone in the classroom)
              </label>
            </div>
          )}

          {isTeacher && !formData.isAnnouncement && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Who can see this post?
              </label>
              {usersLoading ? (
                <p className="text-sm text-gray-500">Loading classroom members...</p>
              ) : classroomUsers.length === 0 ? (
                <p className="text-sm text-gray-500">No other members in this classroom.</p>
              ) : (
                <div className="border border-gray-200 rounded-md p-3 max-h-40 overflow-y-auto bg-gray-50 space-y-2">
                  <div className="flex gap-2 mb-2">
                    <button
                      type="button"
                      onClick={selectAllViewers}
                      className="text-xs text-blue-600 hover:text-blue-700"
                    >
                      Select all
                    </button>
                    <button
                      type="button"
                      onClick={clearViewers}
                      className="text-xs text-gray-600 hover:text-gray-700"
                    >
                      Clear
                    </button>
                  </div>
                  {classroomUsers.map((user) => (
                    <label key={user.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.visibleToUserIds.includes(user.id)}
                        onChange={() => toggleViewer(user.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-900">
                        {user.name || user.email}
                        {user.name && (
                          <span className="text-gray-500 font-normal"> ({user.email})</span>
                        )}
                      </span>
                      {user.role === 'TEACHER' || user.role === 'ADMIN' ? (
                        <span className="text-xs text-blue-600">Teacher</span>
                      ) : null}
                    </label>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Only selected users will see this post. You will always see your own posts.
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
