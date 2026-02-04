'use client'

import { useState, useEffect } from 'react'
import TimeEntryForm from './TimeEntryForm'
import TimeEntryList from './TimeEntryList'

interface TimeEntry {
  id: string
  date: string
  hours: number
  category: string
  description: string | null
  isOld?: boolean
}

interface Summary {
  totalHours: number
  entriesCount: number
  averageHours: number
}

export default function TimeTrackingView() {
  const [entries, setEntries] = useState<TimeEntry[]>([])
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null)
  
  // Date range filters - default to current month
  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  
  const [startDate, setStartDate] = useState(firstDayOfMonth.toISOString().split('T')[0])
  const [endDate, setEndDate] = useState(lastDayOfMonth.toISOString().split('T')[0])

  useEffect(() => {
    fetchEntries()
    fetchSummary()
  }, [startDate, endDate])

  const fetchEntries = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (startDate) params.append('startDate', startDate)
      if (endDate) params.append('endDate', endDate)

      const response = await fetch(`/api/time-entries?${params.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch time entries')
      }

      const data = await response.json()
      setEntries(data.timeEntries || [])
    } catch (error) {
      console.error('Error fetching entries:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSummary = async () => {
    try {
      const params = new URLSearchParams()
      if (startDate) params.append('startDate', startDate)
      if (endDate) params.append('endDate', endDate)

      const response = await fetch(`/api/time-entries/summary?${params.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch summary')
      }

      const data = await response.json()
      setSummary(data.summary)
    } catch (error) {
      console.error('Error fetching summary:', error)
    }
  }

  const handleSuccess = () => {
    setEditingEntry(null)
    fetchEntries()
    fetchSummary()
  }

  const handleEdit = (entry: TimeEntry) => {
    setEditingEntry(entry)
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = () => {
    fetchEntries()
    fetchSummary()
  }

  const handleCancelEdit = () => {
    setEditingEntry(null)
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      {summary && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-gray-500">Total Hours</div>
              <div className="text-2xl font-bold text-gray-900">{summary.totalHours.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Total Entries</div>
              <div className="text-2xl font-bold text-gray-900">{summary.entriesCount}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Average Hours/Entry</div>
              <div className="text-2xl font-bold text-gray-900">{summary.averageHours.toFixed(2)}</div>
            </div>
          </div>
        </div>
      )}

      {/* Date Range Filter */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter by Date Range</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              id="startDate"
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              id="endDate"
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => {
              const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
              const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
              setStartDate(firstDay.toISOString().split('T')[0])
              setEndDate(lastDay.toISOString().split('T')[0])
            }}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            This Month
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={() => {
              const firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1)
              const lastDay = new Date(now.getFullYear(), now.getMonth(), 0)
              setStartDate(firstDay.toISOString().split('T')[0])
              setEndDate(lastDay.toISOString().split('T')[0])
            }}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Last Month
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={() => {
              const firstDay = new Date(now.getFullYear(), 0, 1)
              const lastDay = new Date(now.getFullYear(), 11, 31)
              setStartDate(firstDay.toISOString().split('T')[0])
              setEndDate(lastDay.toISOString().split('T')[0])
            }}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            This Year
          </button>
        </div>
      </div>

      {/* Time Entry Form */}
      <TimeEntryForm
        entry={editingEntry}
        onSuccess={handleSuccess}
        onCancel={editingEntry ? handleCancelEdit : undefined}
      />

      {/* Time Entry List */}
      {loading ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <p className="text-gray-500">Loading time entries...</p>
        </div>
      ) : (
        <TimeEntryList
          entries={entries}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
