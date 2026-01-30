'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Conflict {
  instructorId: string
  instructorName: string
  conflictingSchedules: Array<{
    scheduleId: string
    classroomName: string
    locationName: string
    startTime: Date | string
    endTime: Date | string
    dayOfWeek?: number | null
  }>
}

interface ConflictAlertsProps {
  dateRange?: { start: string; end: string }
}

export default function ConflictAlerts({ dateRange }: ConflictAlertsProps) {
  const [conflicts, setConflicts] = useState<Conflict[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchConflicts()
  }, [dateRange])

  const fetchConflicts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (dateRange?.start) params.append('startDate', dateRange.start)
      if (dateRange?.end) params.append('endDate', dateRange.end)

      const response = await fetch(`/api/admin/schedules/conflicts?${params.toString()}`)
      const data = await response.json()
      
      if (response.ok) {
        setConflicts(data.conflicts || [])
      }
    } catch (error) {
      console.error('Error fetching conflicts:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return null
  }

  if (conflicts.length === 0) {
    return null
  }

  const formatTime = (time: Date | string) => {
    const date = new Date(time)
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  return (
    <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">
            Scheduling Conflicts Detected ({conflicts.length})
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <ul className="list-disc pl-5 space-y-1">
              {conflicts.map((conflict, idx) => (
                <li key={idx}>
                  <strong>{conflict.instructorName}</strong> is scheduled at multiple locations:
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    {conflict.conflictingSchedules.map((schedule, sIdx) => (
                      <li key={sIdx}>
                        {schedule.classroomName} at {schedule.locationName} - {formatTime(schedule.startTime)} to {formatTime(schedule.endTime)}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-3">
            <Link
              href="/admin/calendar"
              className="text-sm font-medium text-red-800 hover:text-red-900 underline"
            >
              View calendar to resolve conflicts →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
