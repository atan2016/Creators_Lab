'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'

interface SyllabusEntry {
  id: string
  date: string
  activities: string
  prework: string | null
  lectureInfo: string | null
  createdAt: string
  updatedAt: string
}

interface SyllabusSectionProps {
  classroomId: string
  isTeacher: boolean
}

export default function SyllabusSection({ classroomId, isTeacher }: SyllabusSectionProps) {
  const [entries, setEntries] = useState<SyllabusEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingEntry, setEditingEntry] = useState<SyllabusEntry | null>(null)

  useEffect(() => {
    fetchEntries()
  }, [classroomId])

  const fetchEntries = async () => {
    try {
      const response = await fetch(`/api/classrooms/${classroomId}/syllabus`)
      const data = await response.json()
      if (response.ok) {
        setEntries(data.entries || [])
      }
    } catch (error) {
      console.error('Error fetching syllabus:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (entryId: string) => {
    if (!confirm('Are you sure you want to delete this syllabus entry?')) {
      return
    }

    try {
      const response = await fetch(`/api/classrooms/${classroomId}/syllabus/${entryId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchEntries()
      } else {
        alert('Failed to delete entry')
      }
    } catch (error) {
      console.error('Error deleting entry:', error)
      alert('An error occurred')
    }
  }

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-500">Loading syllabus...</p>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Course Syllabus</h2>
          {isTeacher && (
            <button
              onClick={() => {
                setEditingEntry(null)
                setShowModal(true)
              }}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Add Entry
            </button>
          )}
        </div>

        {entries.length === 0 ? (
          <p className="text-gray-500 text-sm">No syllabus entries yet.</p>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div key={entry.id} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">
                      {format(new Date(entry.date + 'T00:00:00'), 'EEEE, MMMM d, yyyy')}
                    </div>
                    <div className="mt-2 text-sm text-gray-700">
                      <div className="font-medium mb-1">Activities:</div>
                      <div className="text-gray-600 whitespace-pre-wrap">{entry.activities}</div>
                    </div>
                    {entry.prework && (
                      <div className="mt-2 text-sm text-gray-700">
                        <div className="font-medium mb-1">Prework:</div>
                        <div className="text-gray-600 whitespace-pre-wrap">{entry.prework}</div>
                      </div>
                    )}
                    {entry.lectureInfo && (
                      <div className="mt-2 text-sm text-gray-700">
                        <div className="font-medium mb-1">Lecture Information:</div>
                        <div className="text-gray-600 whitespace-pre-wrap">{entry.lectureInfo}</div>
                      </div>
                    )}
                  </div>
                  {isTeacher && (
                    <div className="ml-4 flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingEntry(entry)
                          setShowModal(true)
                        }}
                        className="text-xs text-blue-600 hover:text-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="text-xs text-red-600 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <SyllabusEntryModal
          classroomId={classroomId}
          entry={editingEntry}
          onClose={() => {
            setShowModal(false)
            setEditingEntry(null)
          }}
          onSuccess={() => {
            setShowModal(false)
            setEditingEntry(null)
            fetchEntries()
          }}
        />
      )}
    </>
  )
}

interface SyllabusEntryModalProps {
  classroomId: string
  entry: SyllabusEntry | null
  onClose: () => void
  onSuccess: () => void
}

function SyllabusEntryModal({ classroomId, entry, onClose, onSuccess }: SyllabusEntryModalProps) {
  // Format date for input field - use local date to avoid timezone issues
  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00')
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const [formData, setFormData] = useState({
    date: entry ? formatDateForInput(entry.date) : '',
    activities: entry?.activities || '',
    prework: entry?.prework || '',
    lectureInfo: entry?.lectureInfo || '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.date || !formData.activities) {
      setError('Date and activities are required')
      return
    }

    setLoading(true)

    try {
      const url = entry
        ? `/api/classrooms/${classroomId}/syllabus/${entry.id}`
        : `/api/classrooms/${classroomId}/syllabus`
      const method = entry ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to save entry')
        return
      }

      onSuccess()
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          {entry ? 'Edit Syllabus Entry' : 'Add Syllabus Entry'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date *
            </label>
            <input
              id="date"
              type="date"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="activities" className="block text-sm font-medium text-gray-700">
              Activities/Details *
            </label>
            <textarea
              id="activities"
              rows={4}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={formData.activities}
              onChange={(e) => setFormData({ ...formData, activities: e.target.value })}
              placeholder="Enter activities and details for this date..."
            />
          </div>

          <div>
            <label htmlFor="prework" className="block text-sm font-medium text-gray-700">
              Prework (Optional)
            </label>
            <textarea
              id="prework"
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={formData.prework}
              onChange={(e) => setFormData({ ...formData, prework: e.target.value })}
              placeholder="Enter any prework required..."
            />
          </div>

          <div>
            <label htmlFor="lectureInfo" className="block text-sm font-medium text-gray-700">
              Lecture Information (Optional)
            </label>
            <textarea
              id="lectureInfo"
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={formData.lectureInfo}
              onChange={(e) => setFormData({ ...formData, lectureInfo: e.target.value })}
              placeholder="Enter lecture information..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
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
              {loading ? 'Saving...' : entry ? 'Update' : 'Add Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
