'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/ui/Layout'
import { ResourceType } from '@prisma/client'

export default function EditResourcePage({
  params,
}: {
  params: { id: string; resourceId: string }
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [loadingResource, setLoadingResource] = useState(true)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'COURSE_MATERIAL' as ResourceType,
    content: '',
    githubUrl: '',
    googleDriveUrl: '',
  })

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const response = await fetch(`/api/classrooms/${params.id}/resources/${params.resourceId}`)
        const data = await response.json()

        if (!response.ok || !data.resource) {
          setError(data.error || 'Failed to load resource')
          return
        }

        setFormData({
          title: data.resource.title || '',
          description: data.resource.description || '',
          type: data.resource.type,
          content: data.resource.content || '',
          githubUrl: data.resource.githubUrl || '',
          googleDriveUrl: data.resource.googleDriveUrl || '',
        })
      } catch (err) {
        setError('Failed to load resource')
      } finally {
        setLoadingResource(false)
      }
    }

    fetchResource()
  }, [params.id, params.resourceId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.type === 'GITHUB_LINK' && !formData.githubUrl) {
      setError('GitHub URL is required for GitHub link resources')
      return
    }

    if (formData.type === 'GOOGLE_DRIVE_LINK' && !formData.googleDriveUrl) {
      setError('Document Drive URL is required for Document Drive link resources')
      return
    }

    if (formData.type !== 'GITHUB_LINK' && formData.type !== 'GOOGLE_DRIVE_LINK' && !formData.content) {
      setError('Content is required')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/classrooms/${params.id}/resources/${params.resourceId}`, {
        method: 'PUT',
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
        setError(data.error || 'Failed to update resource')
        return
      }

      router.push(`/teacher/classrooms/${params.id}/resources/${params.resourceId}`)
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
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Resource</h1>

          {loadingResource ? (
            <div className="bg-white shadow rounded-lg p-6 text-sm text-gray-500">Loading resource...</div>
          ) : (
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
                    <option value="GOOGLE_DRIVE_LINK">Document Drive Link</option>
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
                      Document Drive File/Folder URL *
                    </label>
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
                  disabled={loading || loadingResource}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  )
}
