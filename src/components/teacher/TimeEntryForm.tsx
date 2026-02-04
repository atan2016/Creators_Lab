'use client'

import { useState } from 'react'

interface TimeEntry {
  id: string
  date: string
  hours: number
  category: string
  description: string | null
}

interface TimeEntryFormProps {
  entry?: TimeEntry | null
  onSuccess: () => void
  onCancel?: () => void
}

// Helper function to count words
function countWords(text: string): number {
  if (!text || !text.trim()) return 0
  return text.trim().split(/\s+/).filter(word => word.length > 0).length
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

export default function TimeEntryForm({ entry, onSuccess, onCancel }: TimeEntryFormProps) {
  const [date, setDate] = useState(entry?.date ? entry.date.split('T')[0] : new Date().toISOString().split('T')[0])
  const [hours, setHours] = useState(entry?.hours?.toString() || '')
  const [category, setCategory] = useState(entry?.category || '')
  const [description, setDescription] = useState(entry?.description || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const wordCount = countWords(description)
  const maxWords = 200

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validation
    if (!date) {
      setError('Date is required')
      setLoading(false)
      return
    }

    const hoursNum = parseFloat(hours)
    if (!hours || isNaN(hoursNum) || hoursNum <= 0) {
      setError('Hours must be a positive number')
      setLoading(false)
      return
    }

    if (!category) {
      setError('Category is required')
      setLoading(false)
      return
    }

    // Validate description word count
    if (description && countWords(description) > maxWords) {
      setError(`Description must be less than ${maxWords} words (currently ${wordCount} words)`)
      setLoading(false)
      return
    }

    try {
      const url = entry ? `/api/time-entries/${entry.id}` : '/api/time-entries'
      const method = entry ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          hours: hoursNum,
          category: category,
          description: description.trim() || null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save time entry')
      }

      // Reset form if creating new entry
      if (!entry) {
        setDate(new Date().toISOString().split('T')[0])
        setHours('')
        setCategory('')
        setDescription('')
      }

      onSuccess()
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {entry ? 'Edit Time Entry' : 'Add Time Entry'}
      </h3>

      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Date *
          </label>
          <input
            id="date"
            type="date"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="hours" className="block text-sm font-medium text-gray-700 mb-1">
            Hours *
          </label>
          <input
            id="hours"
            type="number"
            step="0.25"
            min="0.25"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            placeholder="e.g., 2.5 for 2 hours 30 minutes"
          />
          <p className="mt-1 text-xs text-gray-500">Enter hours as a decimal (e.g., 2.5 for 2 hours 30 minutes)</p>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <select
            id="category"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select a category</option>
            <option value="IN_CLASS_TEACHING">In Class Teaching</option>
            <option value="LESSON_PLANNING">Lesson planning</option>
            <option value="MEETINGS">Meetings</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description (optional)
          </label>
          <textarea
            id="description"
            rows={3}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
              wordCount > maxWords ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
            }`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What did you work on?"
          />
          <div className="mt-1 flex justify-between">
            <p className="text-xs text-gray-500">Maximum {maxWords} words</p>
            <p className={`text-xs ${wordCount > maxWords ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
              {wordCount} / {maxWords} words
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : entry ? 'Update Entry' : 'Add Entry'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  )
}
