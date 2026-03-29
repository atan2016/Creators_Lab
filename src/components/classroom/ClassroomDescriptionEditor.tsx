'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface ClassroomDescriptionEditorProps {
  classroomId: string
  /** When set and canEdit, name can be changed in the same editor. */
  initialName?: string
  initialDescription: string | null
  canEdit: boolean
}

export default function ClassroomDescriptionEditor({
  classroomId,
  initialName,
  initialDescription,
  canEdit,
}: ClassroomDescriptionEditorProps) {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [name, setName] = useState(initialName || '')
  const [text, setText] = useState(initialDescription || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const showNameRow = Boolean(canEdit && initialName !== undefined)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const trimmedName = name.trim()
    if (showNameRow && !trimmedName) {
      setError('Project name cannot be empty')
      return
    }
    setLoading(true)
    try {
      const body: { name?: string; description: string | null } = {
        description: text.trim() || null,
      }
      if (showNameRow) {
        body.name = trimmedName
      }
      const response = await fetch(`/api/classrooms/${classroomId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await response.json()
      if (!response.ok) {
        setError(data.error || 'Failed to save')
        return
      }
      setShowModal(false)
      router.refresh()
    } catch {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const openModal = () => {
    setName(initialName || '')
    setText(initialDescription || '')
    setError('')
    setShowModal(true)
  }

  return (
    <>
      <div id="program-name-description" className="bg-white shadow rounded-lg p-6 mb-6 scroll-mt-24">
        <div className="flex justify-between items-start gap-4 mb-2">
          <h2 className="text-lg font-semibold text-gray-900">
            {showNameRow ? 'Program name & description' : 'Program description'}
          </h2>
          {canEdit && (
            <button
              type="button"
              onClick={openModal}
              className="text-sm text-blue-600 hover:text-blue-700 shrink-0"
            >
              {showNameRow ? 'Edit' : initialDescription ? 'Edit' : 'Add description'}
            </button>
          )}
        </div>
        {initialDescription ? (
          <p className="text-gray-600 whitespace-pre-wrap text-sm leading-relaxed">{initialDescription}</p>
        ) : (
          <p className="text-sm text-gray-500">
            {canEdit
              ? showNameRow
                ? 'No description yet. Click “Edit” to add details for students and parents.'
                : 'No program description has been added yet.'
              : 'No program description has been added yet.'}
          </p>
        )}
      </div>

      {showModal && canEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {showNameRow ? 'Edit program name & description' : 'Edit program description'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                  {error}
                </div>
              )}
              {showNameRow && (
                <div>
                  <label htmlFor="classroom-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Project name *
                  </label>
                  <input
                    id="classroom-name"
                    type="text"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              )}
              <div>
                <label htmlFor="classroom-description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="classroom-description"
                  rows={8}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Goals, schedule notes, materials, expectations…"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setName(initialName || '')
                    setText(initialDescription || '')
                    setError('')
                  }}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium disabled:opacity-50"
                >
                  {loading ? 'Saving…' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
