'use client'

import { useState } from 'react'

interface TimeEntry {
  id: string
  date: string
  hours: number
  category: string
  description: string | null
  isOld?: boolean
  instructor?: {
    id: string
    name: string
    email: string
  }
}

// Helper function to format category enum to display label
function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    'IN_CLASS_TEACHING': 'In Class Teaching',
    'LESSON_PLANNING': 'Lesson planning',
    'MEETINGS': 'Meetings',
    'OTHER': 'Other'
  }
  return labels[category] || category
}

interface TimeEntryListProps {
  entries: TimeEntry[]
  onEdit: (entry: TimeEntry) => void
  onDelete: (id: string) => void
  showInstructor?: boolean
}

export default function TimeEntryList({ entries, onEdit, onDelete, showInstructor = false }: TimeEntryListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this time entry?')) {
      return
    }

    setDeletingId(id)
    try {
      const response = await fetch(`/api/time-entries/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete time entry')
      }

      onDelete(id)
    } catch (error: any) {
      alert(error.message || 'Failed to delete time entry')
    } finally {
      setDeletingId(null)
    }
  }

  const totalHours = entries.reduce((sum, entry) => sum + Number(entry.hours), 0)

  if (entries.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-8 text-center">
        <p className="text-gray-500">No time entries found for the selected period.</p>
      </div>
    )
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Time Entries</h3>
          <div className="text-sm text-gray-600">
            <span className="font-medium">Total: {totalHours.toFixed(2)} hours</span>
            <span className="ml-4">({entries.length} {entries.length === 1 ? 'entry' : 'entries'})</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hours
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              {showInstructor && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Instructor
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {entries.map((entry) => (
              <tr key={entry.id} className={`hover:bg-gray-50 ${entry.isOld ? 'opacity-60 bg-gray-50' : ''}`}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(entry.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                  {entry.isOld && (
                    <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                      Older than 90 days
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {Number(entry.hours).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {getCategoryLabel(entry.category)}
                </td>
                {showInstructor && entry.instructor && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {entry.instructor.name}
                  </td>
                )}
                <td className="px-6 py-4 text-sm text-gray-600">
                  {entry.description || <span className="text-gray-400 italic">No description</span>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onEdit(entry)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    disabled={deletingId === entry.id}
                    className="text-red-600 hover:text-red-900 disabled:opacity-50"
                  >
                    {deletingId === entry.id ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
