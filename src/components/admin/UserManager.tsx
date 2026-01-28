'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
}

type CreationMode = 'single' | 'bulk'

interface BulkResult {
  success: number
  errors: number
  results: {
    success: Array<{ name: string; email: string; role: string; password?: string }>
    errors: Array<{ user: { name: string; email: string; role: string }; error: string }>
  }
}

export default function UserManager() {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [mode, setMode] = useState<CreationMode>('single')
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'TEACHER' as 'ADMIN' | 'TEACHER' | 'STUDENT',
  })
  const [bulkInput, setBulkInput] = useState('')
  const [defaultRole, setDefaultRole] = useState<'ADMIN' | 'TEACHER' | 'STUDENT'>('TEACHER')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [bulkResult, setBulkResult] = useState<BulkResult | null>(null)

  const parseBulkInput = (input: string): Array<{ name: string; email: string; role?: string }> => {
    const lines = input
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)

    return lines.map((line) => {
      const parts = line.split(',').map((p) => p.trim())
      if (parts.length === 2) {
        return { name: parts[0], email: parts[1] }
      } else if (parts.length === 3) {
        return { name: parts[0], email: parts[1], role: parts[2].toUpperCase() }
      }
      throw new Error(`Invalid format: ${line}. Expected "name,email" or "name,email,role"`)
    })
  }

  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!formData.name || !formData.email || !formData.password) {
      setError('All fields are required')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to create user')
        return
      }

      // Display the password if it was auto-generated
      const passwordMessage = data.password 
        ? `User created successfully! Password: ${data.password}`
        : 'User created successfully!'
      
      setSuccess(passwordMessage)
      setFormData({ name: '', email: '', password: '', role: 'TEACHER' })
      setTimeout(() => {
        setShowModal(false)
        setSuccess('')
        router.refresh()
      }, data.password ? 5000 : 1500) // Show longer if password is displayed
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setBulkResult(null)

    if (!bulkInput.trim()) {
      setError('Please enter user data')
      return
    }

    let users
    try {
      users = parseBulkInput(bulkInput)
    } catch (err: any) {
      setError(err.message || 'Invalid format. Use "name,email" or "name,email,role" per line.')
      return
    }

    if (users.length === 0) {
      setError('No users to create')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/register-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          users,
          defaultRole,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to create users')
        return
      }

      setBulkResult(data.results)
      setSuccess(`Successfully created ${data.success} user(s). ${data.errors > 0 ? `${data.errors} error(s).` : ''}`)
      setBulkInput('')
      
      setTimeout(() => {
        setShowModal(false)
        setSuccess('')
        setBulkResult(null)
        router.refresh()
      }, 3000)
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const resetModal = () => {
    setShowModal(false)
    setMode('single')
    setFormData({ name: '', email: '', password: '', role: 'TEACHER' })
    setBulkInput('')
    setDefaultRole('TEACHER')
    setError('')
    setSuccess('')
    setBulkResult(null)
  }

  return (
    <>
      <div className="bg-white shadow overflow-hidden sm:rounded-md mb-6">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">User Management</h3>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setMode('single')
                setShowModal(true)
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Create User
            </button>
            <button
              onClick={() => {
                setMode('bulk')
                setShowModal(true)
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Bulk Create
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`bg-white rounded-lg p-6 ${mode === 'bulk' ? 'max-w-2xl' : 'max-w-md'} w-full mx-4 max-h-[90vh] overflow-y-auto`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {mode === 'single' ? 'Create New User' : 'Bulk Create Users'}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setMode(mode === 'single' ? 'bulk' : 'single')}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Switch to {mode === 'single' ? 'Bulk' : 'Single'}
                </button>
                <button
                  onClick={resetModal}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
            </div>

            {mode === 'single' ? (
              <form onSubmit={handleSingleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                    <div className="whitespace-pre-wrap break-words">{success}</div>
                    {success.includes('Password:') && (
                      <div className="mt-2 p-2 bg-white border border-green-300 rounded font-mono text-sm break-all">
                        {success.split('Password: ')[1]}
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder={formData.role === 'TEACHER' ? 'teacher@example.com' : 'student@example.com'}
                />
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    Role *
                  </label>
                  <select
                    id="role"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                  >
                    <option value="STUDENT">Student</option>
                    <option value="TEACHER">Teacher</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      className="mt-1 block w-full px-3 py-2 pr-12 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="At least 6 characters"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setShowPassword((prev) => !prev)
                      }}
                      className="absolute inset-y-0 right-0 flex items-center justify-center px-3 text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700 z-10"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      tabIndex={0}
                    >
                      {showPassword ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetModal}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Creating...' : 'Create User'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleBulkSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                    {success}
                  </div>
                )}

                <div>
                  <label htmlFor="defaultRole" className="block text-sm font-medium text-gray-700 mb-2">
                    Default Role (for entries without role specified)
                  </label>
                  <select
                    id="defaultRole"
                    className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={defaultRole}
                    onChange={(e) => setDefaultRole(e.target.value as any)}
                  >
                    <option value="STUDENT">Student</option>
                    <option value="TEACHER">Teacher</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="bulkInput" className="block text-sm font-medium text-gray-700 mb-2">
                    User Data (one per line) *
                  </label>
                  <textarea
                    id="bulkInput"
                    rows={10}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-mono text-sm"
                    value={bulkInput}
                    onChange={(e) => setBulkInput(e.target.value)}
                    placeholder="John Doe,john@example.com,TEACHER&#10;Jane Smith,jane@example.com,TEACHER&#10;Bob Johnson,bob@example.com,STUDENT&#10;&#10;Or without role (uses default):&#10;Alice Brown,alice@example.com"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Format: name,email,role (one per line). Role is optional - if omitted, uses the default role above.
                    <br />
                    Example: John Doe,john@example.com,TEACHER
                  </p>
                </div>

                {bulkResult && (
                  <>
                    {bulkResult.success > 0 && (
                      <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded mb-4">
                        <p className="font-medium mb-2">Successfully Created ({bulkResult.success}):</p>
                        <ul className="list-disc list-inside text-sm space-y-2">
                          {bulkResult.results.success.map((user, idx) => (
                            <li key={idx} className="break-words">
                              <strong>{user.name}</strong> ({user.email}) - {user.role}
                              {user.password && (
                                <div className="ml-4 mt-1 p-2 bg-white border border-green-300 rounded font-mono text-xs break-all">
                                  Password: {user.password}
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {bulkResult.errors > 0 && (
                      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded">
                        <p className="font-medium mb-2">Errors ({bulkResult.errors}):</p>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          {bulkResult.results.errors.map((err, idx) => (
                            <li key={idx}>
                              {err.user.name} ({err.user.email}): {err.error}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetModal}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Creating...' : 'Create Users'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
