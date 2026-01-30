'use client'

import { useState, useEffect } from 'react'

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

interface Location {
  id: string
  name: string
}

interface Classroom {
  id: string
  name: string
}

interface Teacher {
  id: string
  name: string
  email: string
}

export default function ScheduleManager() {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null)
  const [formData, setFormData] = useState({
    instructorId: '',
    classroomId: '',
    locationId: '',
    isRecurring: false,
    recurrenceType: 'weekly', // 'daily' or 'weekly'
    dayOfWeek: '',
    startTime: '',
    endTime: '',
    startDate: '',
    endDate: '',
  })
  const [error, setError] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [schedulesRes, locationsRes, classroomsRes, teachersRes] = await Promise.all([
        fetch('/api/admin/schedules'),
        fetch('/api/admin/locations'),
        fetch('/api/classrooms'),
        fetch('/api/admin/users?role=TEACHER'),
      ])

      const schedulesData = await schedulesRes.json()
      const locationsData = await locationsRes.json()
      const classroomsData = await classroomsRes.json()
      const teachersData = await teachersRes.json()

      if (schedulesRes.ok) {
        setSchedules(schedulesData.schedules || [])
      }
      if (locationsRes.ok) {
        setLocations(locationsData.locations || [])
      }
      if (classroomsRes.ok) {
        setClassrooms(classroomsData.classrooms || [])
      }
      if (teachersRes.ok) {
        setTeachers(teachersData.users || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.instructorId || !formData.classroomId || !formData.locationId || !formData.startTime || !formData.endTime) {
      setError('All required fields must be filled')
      return
    }

    if (formData.isRecurring) {
      if (!formData.startDate || !formData.endDate) {
        setError('Start date and end date are required for recurring schedules')
        return
      }
      if (formData.recurrenceType === 'weekly' && !formData.dayOfWeek) {
        setError('Day of week is required for weekly recurring schedules')
        return
      }
    }

    // For recurring schedules, combine date and time
    let startTime: string
    let endTime: string

    if (formData.isRecurring) {
      // Use a reference date (Monday) and combine with time
      const refDate = new Date('2024-01-01') // Monday
      const [startHour, startMin] = formData.startTime.split(':')
      const [endHour, endMin] = formData.endTime.split(':')
      refDate.setHours(parseInt(startHour), parseInt(startMin), 0, 0)
      startTime = refDate.toISOString()
      refDate.setHours(parseInt(endHour), parseInt(endMin), 0, 0)
      endTime = refDate.toISOString()
    } else {
      // One-time: combine date and time
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`)
      const endDateTime = new Date(`${formData.startDate}T${formData.endTime}`)
      startTime = startDateTime.toISOString()
      endTime = endDateTime.toISOString()
    }

    try {
      const url = editingSchedule
        ? `/api/admin/schedules/${editingSchedule.id}`
        : '/api/admin/schedules'
      const method = editingSchedule ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instructorId: formData.instructorId,
          classroomId: formData.classroomId,
          locationId: formData.locationId,
          dayOfWeek: formData.isRecurring && formData.recurrenceType === 'weekly' ? parseInt(formData.dayOfWeek) : null,
          startTime,
          endTime,
          isRecurring: formData.isRecurring,
          startDate: formData.isRecurring && formData.startDate ? formData.startDate : null,
          endDate: formData.isRecurring && formData.endDate ? formData.endDate : null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to save schedule')
        return
      }

      setShowModal(false)
      setEditingSchedule(null)
      resetForm()
      fetchData()
    } catch (err) {
      setError('An error occurred. Please try again.')
    }
  }

  const resetForm = () => {
    setFormData({
      instructorId: '',
      classroomId: '',
      locationId: '',
      isRecurring: false,
      recurrenceType: 'weekly',
      dayOfWeek: '',
      startTime: '',
      endTime: '',
      startDate: '',
      endDate: '',
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this schedule?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/schedules/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchData()
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to delete schedule')
      }
    } catch (error) {
      console.error('Error deleting schedule:', error)
      alert('An error occurred')
    }
  }

  const handleEdit = (schedule: Schedule) => {
    setEditingSchedule(schedule)
    
    // Extract time from startTime/endTime
    const startDate = new Date(schedule.startTime)
    const endDate = new Date(schedule.endTime)
    const startTimeStr = `${String(startDate.getHours()).padStart(2, '0')}:${String(startDate.getMinutes()).padStart(2, '0')}`
    const endTimeStr = `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`
    
    setFormData({
      instructorId: schedule.instructorId,
      classroomId: schedule.classroomId,
      locationId: schedule.locationId,
      isRecurring: schedule.isRecurring,
      recurrenceType: schedule.dayOfWeek === null ? 'daily' : 'weekly',
      dayOfWeek: schedule.dayOfWeek?.toString() || '',
      startTime: startTimeStr,
      endTime: endTimeStr,
      startDate: schedule.startDate ? schedule.startDate.split('T')[0] : '',
      endDate: schedule.endDate ? schedule.endDate.split('T')[0] : '',
    })
    setShowModal(true)
  }

  const formatScheduleTime = (schedule: Schedule) => {
    if (schedule.isRecurring) {
      const start = new Date(schedule.startTime)
      const end = new Date(schedule.endTime)
      const timeStr = `${start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - ${end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
      
      if (schedule.dayOfWeek === null) {
        // Daily recurring
        return `Daily ${timeStr}`
      } else {
        // Weekly recurring
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        const dayName = days[schedule.dayOfWeek]
        return `${dayName} ${timeStr}`
      }
    } else {
      const start = new Date(schedule.startTime)
      const end = new Date(schedule.endTime)
      return `${start.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })} - ${end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
    }
  }

  if (loading) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white shadow overflow-hidden sm:rounded-md mb-6">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Schedules</h3>
          <button
            onClick={() => {
              setEditingSchedule(null)
              resetForm()
              setShowModal(true)
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Add Schedule
          </button>
        </div>
        {schedules.length === 0 ? (
          <div className="px-4 py-5 sm:px-6">
            <p className="text-gray-500 text-sm">No schedules yet. Add one to get started.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {schedules.map((schedule) => (
              <li key={schedule.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        {schedule.instructor.name} - {schedule.classroom.name}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {schedule.location.name} • {formatScheduleTime(schedule)}
                      </div>
                      {schedule.isRecurring && schedule.startDate && schedule.endDate && (
                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(schedule.startDate).toLocaleDateString()} - {new Date(schedule.endDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex space-x-2">
                      <button
                        onClick={() => handleEdit(schedule)}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(schedule.id)}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {editingSchedule ? 'Edit Schedule' : 'Add Schedule'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="instructorId" className="block text-sm font-medium text-gray-700">
                  Instructor *
                </label>
                <select
                  id="instructorId"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.instructorId}
                  onChange={(e) => setFormData({ ...formData, instructorId: e.target.value })}
                >
                  <option value="">Select instructor</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name} ({teacher.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="classroomId" className="block text-sm font-medium text-gray-700">
                  Classroom/Subject *
                </label>
                <select
                  id="classroomId"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.classroomId}
                  onChange={(e) => setFormData({ ...formData, classroomId: e.target.value })}
                >
                  <option value="">Select classroom</option>
                  {classrooms.map((classroom) => (
                    <option key={classroom.id} value={classroom.id}>
                      {classroom.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="locationId" className="block text-sm font-medium text-gray-700">
                  Location *
                </label>
                <select
                  id="locationId"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.locationId}
                  onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
                >
                  <option value="">Select location</option>
                  {locations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={formData.isRecurring}
                    onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked, dayOfWeek: '', recurrenceType: 'weekly' })}
                  />
                  <span className="ml-2 text-sm text-gray-700">Recurring schedule</span>
                </label>
              </div>

              {formData.isRecurring ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Recurrence Type *
                    </label>
                    <div className="flex gap-6">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="recurrenceType"
                          value="daily"
                          checked={formData.recurrenceType === 'daily'}
                          onChange={(e) => setFormData({ ...formData, recurrenceType: e.target.value, dayOfWeek: '' })}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">Daily</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="recurrenceType"
                          value="weekly"
                          checked={formData.recurrenceType === 'weekly'}
                          onChange={(e) => setFormData({ ...formData, recurrenceType: e.target.value })}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">Weekly</span>
                      </label>
                    </div>
                  </div>
                  {formData.recurrenceType === 'weekly' && (
                    <div>
                      <label htmlFor="dayOfWeek" className="block text-sm font-medium text-gray-700">
                        Day of Week *
                      </label>
                      <select
                        id="dayOfWeek"
                        required={formData.recurrenceType === 'weekly'}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={formData.dayOfWeek}
                        onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value })}
                      >
                        <option value="">Select day</option>
                        <option value="0">Sunday</option>
                        <option value="1">Monday</option>
                        <option value="2">Tuesday</option>
                        <option value="3">Wednesday</option>
                        <option value="4">Thursday</option>
                        <option value="5">Friday</option>
                        <option value="6">Saturday</option>
                      </select>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                        Start Date *
                      </label>
                      <input
                        id="startDate"
                        type="date"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                        End Date *
                      </label>
                      <input
                        id="endDate"
                        type="date"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                    Date *
                  </label>
                  <input
                    id="startDate"
                    type="date"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                    Start Time *
                  </label>
                  <input
                    id="startTime"
                    type="time"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                    End Time *
                  </label>
                  <input
                    id="endTime"
                    type="time"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingSchedule(null)
                    resetForm()
                    setError('')
                  }}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium"
                >
                  {editingSchedule ? 'Update' : 'Add Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
