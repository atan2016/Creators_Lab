'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/ui/Layout'
import { ResourceType } from '@prisma/client'

export default function NewResourcePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'COURSE_MATERIAL' as ResourceType,
    content: '',
    githubUrl: '',
    googleDriveUrl: '',
  })
  const [classroomDriveUrl, setClassroomDriveUrl] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchClassroomInfo()
  }, [])

  const fetchClassroomInfo = async () => {
    try {
      const response = await fetch(`/api/classrooms/${params.id}`)
      const data = await response.json()
      if (response.ok && data.classroom) {
        setClassroomDriveUrl(data.classroom.googleDriveUrl)
      }
    } catch (error) {
      console.error('Error fetching classroom info:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.type === 'GITHUB_LINK' && !formData.githubUrl) {
      setError('GitHub URL is required for GitHub link resources')
      return
    }

    if (formData.type === 'GOOGLE_DRIVE_LINK' && !formData.googleDriveUrl) {
      setError('Google Drive URL is required for Google Drive link resources')
      return
    }

    if (formData.type !== 'GITHUB_LINK' && formData.type !== 'GOOGLE_DRIVE_LINK' && !formData.content) {
      setError('Content is required')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/classrooms/${params.id}/resources`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          type: formData.type,
          content: (formData.type === 'GITHUB_LINK' || formData.type === 'GOOGLE_DRIVE_LINK') ? null : formData.content,
          githubUrl: formData.type === 'GITHUB_LINK' ? formData.githubUrl : null,
          googleDriveUrl: formData.type === 'GOOGLE_DRIVE_LINK' ? formData.googleDriveUrl : null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to create resource')
        return
      }

      router.push(`/teacher/classrooms/${params.id}`)
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Add Resource</h1>

          <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title *
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Resource Type *
                </label>
                <select
                  id="type"
                  name="type"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as ResourceType })}
                >
                  <option value="COURSE_MATERIAL">Course Material</option>
                  <option value="LESSON_PLAN">Lesson Plan</option>
                  <option value="HOMEWORK">Homework</option>
                  <option value="GITHUB_LINK">GitHub Link</option>
                  <option value="GOOGLE_DRIVE_LINK">Google Drive Link</option>
                </select>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              {formData.type === 'GITHUB_LINK' ? (
                <div>
                  <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700">
                    GitHub Repository URL *
                  </label>
                  <input
                    id="githubUrl"
                    name="githubUrl"
                    type="url"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="https://github.com/owner/repo"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  />
                </div>
              ) : formData.type === 'GOOGLE_DRIVE_LINK' ? (
                <div>
                  <label htmlFor="googleDriveUrl" className="block text-sm font-medium text-gray-700">
                    Google Drive File/Folder URL *
                  </label>
                  {classroomDriveUrl && (
                    <div className="mb-3 p-3 bg-blue-50 rounded border border-blue-200">
                      <p className="text-sm font-medium text-gray-900 mb-1">Classroom Google Drive Folder:</p>
                      <a
                        href={classroomDriveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm break-all"
                      >
                        {classroomDriveUrl}
                      </a>
                      <p className="mt-2 text-xs text-gray-600">
                        Copy a file or folder URL from the classroom's Google Drive folder above, or paste any Google Drive URL below.
                      </p>
                    </div>
                  )}
                  {!classroomDriveUrl && (
                    <div className="mb-3 p-3 bg-yellow-50 rounded border border-yellow-200">
                      <p className="text-sm text-yellow-800">
                        No Google Drive folder is linked to this classroom. Please add a Google Drive folder link in the classroom settings first.
                      </p>
                    </div>
                  )}
                  <input
                    id="googleDriveUrl"
                    name="googleDriveUrl"
                    type="url"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="https://drive.google.com/file/d/... or https://drive.google.com/drive/folders/..."
                    value={formData.googleDriveUrl}
                    onChange={(e) => setFormData({ ...formData, googleDriveUrl: e.target.value })}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Paste a Google Drive file or folder URL. Make sure you have access to the file/folder.
                  </p>
                </div>
              ) : (
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                    Content *
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    rows={10}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter resource content, instructions, description..."
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  />
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Resource'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}
