'use client'

import { useState, useEffect } from 'react'
import TimeEntryList from '@/components/teacher/TimeEntryList'
import TimeEntryForm from '@/components/teacher/TimeEntryForm'

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

interface Instructor {
  id: string
  name: string
  email: string
}

interface Summary {
  totalHours: number
  entriesCount: number
  averageHours: number
}

interface SummaryResponse {
  summary: Summary
  breakdownByInstructor?: Record<string, { hours: number; entries: number; name: string }>
  breakdownByMonth: Record<string, { hours: number; entries: number }>
  breakdownByWeek: Record<string, { hours: number; entries: number }>
}

export default function AdminTimeTrackingView() {
  const [entries, setEntries] = useState<TimeEntry[]>([])
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [summary, setSummary] = useState<SummaryResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null)
  const [oldEntriesCount, setOldEntriesCount] = useState(0)
  const [showPurgeConfirm, setShowPurgeConfirm] = useState(false)
  const [purging, setPurging] = useState(false)
  const [purgeSuccess, setPurgeSuccess] = useState<string | null>(null)
  
  // Filters
  const [selectedInstructorId, setSelectedInstructorId] = useState<string>('')
  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  const [startDate, setStartDate] = useState(firstDayOfMonth.toISOString().split('T')[0])
  const [endDate, setEndDate] = useState(lastDayOfMonth.toISOString().split('T')[0])

  useEffect(() => {
    fetchInstructors()
  }, [])

  useEffect(() => {
    fetchEntries()
    fetchSummary()
  }, [selectedInstructorId, startDate, endDate])

  const fetchInstructors = async () => {
    try {
      const response = await fetch('/api/admin/users?role=TEACHER')
      if (response.ok) {
        const data = await response.json()
        setInstructors(data.users || [])
      }
    } catch (error) {
      console.error('Error fetching instructors:', error)
    }
  }

  const fetchEntries = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedInstructorId) params.append('instructorId', selectedInstructorId)
      if (startDate) params.append('startDate', startDate)
      if (endDate) params.append('endDate', endDate)

      const response = await fetch(`/api/time-entries?${params.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch time entries')
      }

      const data = await response.json()
      setEntries(data.timeEntries || [])
      setOldEntriesCount(data.oldEntriesCount || 0)
    } catch (error) {
      console.error('Error fetching entries:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSummary = async () => {
    try {
      const params = new URLSearchParams()
      if (selectedInstructorId) params.append('instructorId', selectedInstructorId)
      if (startDate) params.append('startDate', startDate)
      if (endDate) params.append('endDate', endDate)

      const response = await fetch(`/api/time-entries/summary?${params.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch summary')
      }

      const data: SummaryResponse = await response.json()
      setSummary(data)
    } catch (error) {
      console.error('Error fetching summary:', error)
    }
  }

  const handleEdit = (entry: TimeEntry) => {
    setEditingEntry(entry)
  }

  const handleDelete = () => {
    fetchEntries()
    fetchSummary()
  }

  const handleSuccess = () => {
    setEditingEntry(null)
    fetchEntries()
    fetchSummary()
  }

  const handlePurge = async () => {
    try {
      setPurging(true)
      const response = await fetch('/api/time-entries/cleanup', {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to purge old entries')
      }

      const data = await response.json()
      setPurgeSuccess(`Successfully deleted ${data.deleted} time entry/entries older than 90 days.`)
      setShowPurgeConfirm(false)

      // Refresh entries after purge
      await fetchEntries()
      await fetchSummary()

      // Clear success message after 5 seconds
      setTimeout(() => setPurgeSuccess(null), 5000)
    } catch (error: any) {
      console.error('Error purging entries:', error)
      alert(error.message || 'Failed to purge old entries. Please try again.')
    } finally {
      setPurging(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Time Tracking - All Instructors</h2>
          {oldEntriesCount > 0 && (
            <button
              onClick={() => setShowPurgeConfirm(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Purge Old Entries ({oldEntriesCount} entries &gt;90 days)
            </button>
          )}
        </div>

        {purgeSuccess && (
          <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-4">
            <p className="text-sm text-green-800">{purgeSuccess}</p>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="instructorFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Instructor
            </label>
            <select
              id="instructorFilter"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={selectedInstructorId}
              onChange={(e) => setSelectedInstructorId(e.target.value)}
            >
              <option value="">All Instructors</option>
              {instructors.map((instructor) => (
                <option key={instructor.id} value={instructor.id}>
                  {instructor.name}
                </option>
              ))}
            </select>
          </div>
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

      {/* Summary Statistics */}
      {summary && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <div className="text-sm text-gray-500">Total Hours</div>
              <div className="text-2xl font-bold text-gray-900">{summary.summary.totalHours.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Total Entries</div>
              <div className="text-2xl font-bold text-gray-900">{summary.summary.entriesCount}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Average Hours/Entry</div>
              <div className="text-2xl font-bold text-gray-900">{summary.summary.averageHours.toFixed(2)}</div>
            </div>
          </div>

          {/* Breakdown by Instructor */}
          {summary.breakdownByInstructor && Object.keys(summary.breakdownByInstructor).length > 0 && (
            <div className="mb-6">
              <h4 className="text-md font-semibold text-gray-900 mb-3">Breakdown by Instructor</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Instructor</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Hours</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Entries</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Object.entries(summary.breakdownByInstructor)
                      .sort((a, b) => b[1].hours - a[1].hours)
                      .map(([instructorId, data]) => (
                        <tr key={instructorId}>
                          <td className="px-4 py-2 text-sm text-gray-900">{data.name}</td>
                          <td className="px-4 py-2 text-sm text-right font-medium text-gray-900">
                            {data.hours.toFixed(2)}
                          </td>
                          <td className="px-4 py-2 text-sm text-right text-gray-600">{data.entries}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Breakdown by Month */}
          {Object.keys(summary.breakdownByMonth).length > 0 && (
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-3">Breakdown by Month</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Hours</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Entries</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Object.entries(summary.breakdownByMonth)
                      .sort()
                      .reverse()
                      .map(([month, data]) => (
                        <tr key={month}>
                          <td className="px-4 py-2 text-sm text-gray-900">
                            {new Date(month + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                          </td>
                          <td className="px-4 py-2 text-sm text-right font-medium text-gray-900">
                            {data.hours.toFixed(2)}
                          </td>
                          <td className="px-4 py-2 text-sm text-right text-gray-600">{data.entries}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

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
          showInstructor={true}
        />
      )}

      {/* Edit Modal */}
      {editingEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Edit Time Entry</h3>
              <button
                onClick={() => setEditingEntry(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <TimeEntryForm
              entry={editingEntry}
              onSuccess={handleSuccess}
              onCancel={() => setEditingEntry(null)}
            />
          </div>
        </div>
      )}

      {/* Purge Confirmation Modal */}
      {showPurgeConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium text-gray-900">Confirm Purge</h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Are you sure you want to delete {oldEntriesCount} time entry/entries older than 90 days? This action cannot be undone.
              </p>
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                onClick={() => setShowPurgeConfirm(false)}
                disabled={purging}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                onClick={handlePurge}
                disabled={purging}
              >
                {purging ? 'Purging...' : 'Purge'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
