'use client'

import { useState } from 'react'

interface AddStudentModalProps {
  classroomId: string
  onClose: () => void
  onSuccess: () => void
  memberType?: 'STUDENT' | 'TEACHER'
}

export default function AddStudentModal({ classroomId, onClose, onSuccess, memberType = 'STUDENT' }: AddStudentModalProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email) {
      setError('Email is required')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/classrooms/${classroomId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || `Failed to add ${memberType.toLowerCase()}`)
        return
      }

      onSuccess()
      onClose()
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const isTeacher = memberType === 'TEACHER'
  const title = isTeacher ? 'Add Teacher to Classroom' : 'Add Student to Classroom'
  const label = isTeacher ? 'Teacher Email *' : 'Student Email *'
  const placeholder = isTeacher ? 'teacher@gmail.com' : 'student@example.com'
  const helpText = isTeacher
    ? 'Enter the email address of the teacher account. The teacher must already be registered in the system and use a Gmail address.'
    : 'Enter the email address of the student account. The student must already be registered in the system.'
  const buttonText = isTeacher ? 'Add Teacher' : 'Add Student'

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              {label}
            </label>
            <input
              id="email"
              type="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder={placeholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p className="mt-1 text-xs text-gray-500">
              {helpText}
            </p>
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
              className={`${isTeacher ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white py-2 px-4 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? 'Adding...' : buttonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
