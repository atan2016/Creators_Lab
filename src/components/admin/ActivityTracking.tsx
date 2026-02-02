'use client'

import { useState, useEffect } from 'react'

interface ActivityLog {
  id: string
  userId: string
  action: string
  entityType: string
  entityId: string
  entityName: string
  description: string | null
  createdAt: string
  isOld: boolean
  user: {
    id: string
    name: string
    email: string
    role: string
  }
}

interface Instructor {
  id: string
  name: string
  email: string
  lastLoginAt: string | null
}

interface ActivityLogResponse {
  activities: ActivityLog[]
  instructors: Instructor[]
  oldLogsCount: number
}

export default function ActivityTracking() {
  const [activities, setActivities] = useState<ActivityLog[]>([])
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [oldLogsCount, setOldLogsCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [selectedInstructor, setSelectedInstructor] = useState<string>('')
  const [showPurgeConfirm, setShowPurgeConfirm] = useState(false)
  const [purging, setPurging] = useState(false)
  const [purgeSuccess, setPurgeSuccess] = useState<string | null>(null)

  useEffect(() => {
    fetchActivities()
  }, [selectedInstructor])

  const fetchActivities = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedInstructor) {
        params.append('instructorId', selectedInstructor)
      }

      const response = await fetch(`/api/admin/activity-log?${params.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch activity logs')
      }

      const data: ActivityLogResponse = await response.json()
      setActivities(data.activities)
      setInstructors(data.instructors)
      setOldLogsCount(data.oldLogsCount)
    } catch (error) {
      console.error('Error fetching activities:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePurge = async () => {
    try {
      setPurging(true)
      const response = await fetch('/api/admin/activity-log/cleanup', {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to purge old logs')
      }

      const data = await response.json()
      setPurgeSuccess(`Successfully deleted ${data.deleted} log(s) older than 90 days.`)
      setShowPurgeConfirm(false)
      
      // Refresh activities after purge
      await fetchActivities()
      
      // Clear success message after 5 seconds
      setTimeout(() => setPurgeSuccess(null), 5000)
    } catch (error) {
      console.error('Error purging logs:', error)
      alert('Failed to purge old logs. Please try again.')
    } finally {
      setPurging(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  const formatLastLogin = (lastLoginAt: string | null) => {
    if (!lastLoginAt) return 'Never'
    return formatDate(lastLoginAt)
  }

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <p className="text-gray-500">Loading activity tracking...</p>
      </div>
    )
  }

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Instructor Activity Tracking</h2>
        {oldLogsCount > 0 && (
          <button
            onClick={() => setShowPurgeConfirm(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Purge Old Logs ({oldLogsCount} logs &gt;90 days)
          </button>
        )}
      </div>

      {purgeSuccess && (
        <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-4">
          <p className="text-sm text-green-800">{purgeSuccess}</p>
        </div>
      )}

      {/* Last Login Times */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Last Login Times</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {instructors.map((instructor) => (
            <div key={instructor.id} className="border rounded-lg p-3">
              <div className="font-medium text-gray-900">{instructor.name}</div>
              <div className="text-sm text-gray-500">{instructor.email}</div>
              <div className="text-sm text-gray-600 mt-1">
                Last login: {formatLastLogin(instructor.lastLoginAt)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Filter */}
      <div className="mb-4">
        <label htmlFor="instructorFilter" className="block text-sm font-medium text-gray-700 mb-1">
          Filter by Instructor
        </label>
        <select
          id="instructorFilter"
          className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          value={selectedInstructor}
          onChange={(e) => setSelectedInstructor(e.target.value)}
        >
          <option value="">All Instructors</option>
          {instructors.map((instructor) => (
            <option key={instructor.id} value={instructor.id}>
              {instructor.name}
            </option>
          ))}
        </select>
      </div>

      {/* Activity Summary */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Activity Summary</h3>
        {activities.length === 0 ? (
          <p className="text-gray-500">No activities found.</p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className={`border rounded-lg p-3 ${
                  activity.isOld
                    ? 'bg-gray-50 border-gray-200 opacity-75'
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{activity.user.name}</span>
                      <span className="text-sm text-gray-500">
                        {activity.description || `${activity.action.toLowerCase()}d ${activity.entityType}: ${activity.entityName}`}
                      </span>
                      {activity.isOld && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          &gt;90 days
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {formatDate(activity.createdAt)} • {new Date(activity.createdAt).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Purge Confirmation Modal */}
      {showPurgeConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Confirm Purge</h3>
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete {oldLogsCount} log(s) older than 90 days? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowPurgeConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                disabled={purging}
              >
                Cancel
              </button>
              <button
                onClick={handlePurge}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium"
                disabled={purging}
              >
                {purging ? 'Purging...' : 'Confirm Purge'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
