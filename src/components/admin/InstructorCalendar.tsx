'use client'

import { useState, useEffect, useMemo } from 'react'
import { Calendar, momentLocalizer, View } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const localizer = momentLocalizer(moment)

interface Schedule {
  id: string
  instructorId: string
  instructor: {
    id: string
    name: string
    email: string
  }
  classroomId: string
  classroom: {
    id: string
    name: string
  }
  locationId: string
  location: {
    id: string
    name: string
    address: string
    city: string
    state: string
  }
  dayOfWeek: number | null
  startTime: string
  endTime: string
  isRecurring: boolean
  startDate: string | null
  endDate: string | null
}

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

interface InstructorCalendarProps {
  isAdmin: boolean
  instructorId?: string
}

// Generate consistent color for each instructor
function getInstructorColor(instructorId: string): string {
  const hash = instructorId.split('').reduce((acc, char) => 
    char.charCodeAt(0) + ((acc << 5) - acc), 0)
  const hue = Math.abs(hash) % 360
  return `hsl(${hue}, 70%, 50%)`
}

export default function InstructorCalendar({ isAdmin, instructorId }: InstructorCalendarProps) {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [conflicts, setConflicts] = useState<Conflict[]>([])
  const [locations, setLocations] = useState<Array<{ id: string; name: string }>>([])
  const [teachers, setTeachers] = useState<Array<{ id: string; name: string; email: string }>>([])
  const [loading, setLoading] = useState(true)
  const [currentView, setCurrentView] = useState<View>('month')
  const [currentDate, setCurrentDate] = useState(new Date())
  
  // Filters
  const [selectedLocationId, setSelectedLocationId] = useState<string>('')
  const [selectedInstructorId, setSelectedInstructorId] = useState<string>(instructorId || '')
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: moment().startOf('month').format('YYYY-MM-DD'),
    end: moment().endOf('month').format('YYYY-MM-DD'),
  })

  useEffect(() => {
    fetchData()
  }, [selectedLocationId, selectedInstructorId, dateRange, instructorId])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Build query params
      const params = new URLSearchParams()
      if (selectedLocationId) params.append('locationId', selectedLocationId)
      if (selectedInstructorId) params.append('instructorId', selectedInstructorId)
      if (dateRange.start) params.append('startDate', dateRange.start)
      if (dateRange.end) params.append('endDate', dateRange.end)
      
      // If not admin and instructorId is provided, always filter by that instructor
      if (!isAdmin && instructorId) {
        params.set('instructorId', instructorId)
      }

      const [schedulesRes, conflictsRes, locationsRes, teachersRes] = await Promise.all([
        fetch(`/api/admin/schedules?${params.toString()}`),
        isAdmin ? fetch(`/api/admin/schedules/conflicts?${params.toString()}`) : Promise.resolve(null),
        fetch('/api/admin/locations'),
        isAdmin ? fetch('/api/admin/users?role=TEACHER') : Promise.resolve(null),
      ])

      const schedulesData = await schedulesRes.json()
      if (schedulesRes.ok) {
        console.log('Fetched schedules:', schedulesData.schedules?.length || 0, schedulesData.schedules)
        setSchedules(schedulesData.schedules || [])
      } else {
        console.error('Failed to fetch schedules:', schedulesData)
      }

      if (isAdmin && conflictsRes && conflictsRes.ok) {
        const conflictsData = await conflictsRes.json()
        setConflicts(conflictsData.conflicts || [])
      }

      if (locationsRes && locationsRes.ok) {
        const locationsData = await locationsRes.json()
        setLocations(locationsData.locations || [])
      }

      if (isAdmin && teachersRes && teachersRes.ok) {
        const teachersData = await teachersRes.json()
        setTeachers(teachersData.users || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Convert schedules to calendar events
  const events = useMemo(() => {
    const conflictScheduleIds = new Set<string>()
    if (isAdmin) {
      conflicts.forEach(conflict => {
        conflict.conflictingSchedules.forEach(s => {
          conflictScheduleIds.add(s.scheduleId)
        })
      })
    }

    const calendarEvents: Array<{
      id: string
      title: string
      start: Date
      end: Date
      resource: Schedule
      style?: { backgroundColor: string; borderColor: string }
    }> = []

    schedules.forEach(schedule => {
      const instructorColor = getInstructorColor(schedule.instructorId)
      const isConflict = conflictScheduleIds.has(schedule.id)

      if (schedule.isRecurring) {
        // For recurring schedules, generate events for the visible date range
        const start = moment(dateRange.start)
        const end = moment(dateRange.end)
        const scheduleStart = schedule.startDate ? moment(schedule.startDate) : start
        const scheduleEnd = schedule.endDate ? moment(schedule.endDate) : end
        
        const actualStart = moment.max(start, scheduleStart)
        const actualEnd = moment.min(end, scheduleEnd)
        
        // Generate events for each occurrence of the recurring schedule
        let current = actualStart.clone()
        while (current.isSameOrBefore(actualEnd)) {
          const dayOfWeek = current.day()
          const isDaily = schedule.dayOfWeek === null
          const isWeeklyMatch = schedule.dayOfWeek !== null && schedule.dayOfWeek === dayOfWeek
          
          // For daily: create event for every day
          // For weekly: create event only on matching day of week
          if (isDaily || isWeeklyMatch) {
            const startTime = moment(schedule.startTime)
            const endTime = moment(schedule.endTime)
            
            const eventStart = current.clone()
              .hour(startTime.hour())
              .minute(startTime.minute())
              .second(0)
              .millisecond(0)
            
            const eventEnd = current.clone()
              .hour(endTime.hour())
              .minute(endTime.minute())
              .second(0)
              .millisecond(0)

            calendarEvents.push({
              id: `${schedule.id}-${current.format('YYYY-MM-DD')}`,
              title: `${schedule.instructor.name} - ${schedule.classroom.name} @ ${schedule.location.name}`,
              start: eventStart.toDate(),
              end: eventEnd.toDate(),
              resource: schedule,
              style: {
                backgroundColor: instructorColor,
                borderColor: isConflict ? '#ef4444' : instructorColor,
              },
            })
          }
          current.add(1, 'day')
        }
      } else {
        // One-time schedule
        const start = moment(schedule.startTime)
        const end = moment(schedule.endTime)
        
        calendarEvents.push({
          id: schedule.id,
          title: `${schedule.instructor.name} - ${schedule.classroom.name} @ ${schedule.location.name}`,
          start: start.toDate(),
          end: end.toDate(),
          resource: schedule,
          style: {
            backgroundColor: instructorColor,
            borderColor: isConflict ? '#ef4444' : instructorColor,
          },
        })
      }
    })

    return calendarEvents
  }, [schedules, conflicts, dateRange, isAdmin])

  const eventStyleGetter = (event: any) => {
    return {
      style: {
        backgroundColor: event.style?.backgroundColor || '#3174ad',
        borderColor: event.style?.borderColor || '#3174ad',
        borderWidth: event.style?.borderColor === '#ef4444' ? '3px' : '1px',
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: 'none',
        display: 'block',
      },
    }
  }

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-8 text-center">
        <p className="text-gray-500">Loading calendar...</p>
      </div>
    )
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="mb-6 space-y-4">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {isAdmin && (
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
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          <div>
            <label htmlFor="locationFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <select
              id="locationFilter"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={selectedLocationId}
              onChange={(e) => setSelectedLocationId(e.target.value)}
            >
              <option value="">All Locations</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              />
              <input
                type="date"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Legend */}
        {isAdmin && (
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ef4444', border: '2px solid #ef4444' }}></div>
              <span>Conflict</span>
            </div>
            <div className="text-gray-500">
              Each instructor has a unique color
            </div>
          </div>
        )}
      </div>

      <div style={{ height: '600px' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          view={currentView}
          onView={setCurrentView}
          date={currentDate}
          onNavigate={setCurrentDate}
          eventPropGetter={eventStyleGetter}
          views={['month', 'week', 'day', 'agenda']}
          defaultDate={new Date()}
        />
      </div>
    </div>
  )
}
