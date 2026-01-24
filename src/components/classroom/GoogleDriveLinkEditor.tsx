'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface GoogleDriveLinkEditorProps {
  classroomId: string
  currentUrl: string | null
}

export default function GoogleDriveLinkEditor({ classroomId, currentUrl }: GoogleDriveLinkEditorProps) {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [driveUrl, setDriveUrl] = useState(currentUrl || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (driveUrl && !driveUrl.match(/drive\.google\.com/)) {
      setError('Please enter a valid Google Drive URL')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/classrooms/${classroomId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ googleDriveUrl: driveUrl || null }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to update Google Drive link')
        return
      }

      setShowModal(false)
      router.refresh()
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-900">Google Drive Folder</h3>
          <button
            onClick={() => setShowModal(true)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            {currentUrl ? 'Edit' : 'Add Link'}
          </button>
        </div>
        {currentUrl ? (
          <div>
            <a
              href={currentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 text-sm break-all"
            >
              {currentUrl}
            </a>
            <p className="mt-2 text-xs text-gray-500">
              This is the Google Drive folder for this classroom. Teachers can link resources from this folder.
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            No Google Drive folder linked. Click "Add Link" to add one.
          </p>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {currentUrl ? 'Edit Google Drive Link' : 'Add Google Drive Link'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="driveUrl" className="block text-sm font-medium text-gray-700">
                  Google Drive Folder URL
                </label>
                <input
                  id="driveUrl"
                  type="url"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="https://drive.google.com/drive/folders/..."
                  value={driveUrl}
                  onChange={(e) => setDriveUrl(e.target.value)}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Enter the Google Drive folder URL for this classroom. Make sure you've shared this folder with the teacher's Gmail account.
                </p>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setDriveUrl(currentUrl || '')
                    setError('')
                  }}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
