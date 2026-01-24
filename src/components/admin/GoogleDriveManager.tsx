'use client'

import { useState, useEffect } from 'react'

interface GoogleDriveLink {
  id: string
  name: string
  driveUrl: string
  description: string | null
  createdAt: string
  createdBy: {
    name: string
    email: string
  }
}

export default function GoogleDriveManager() {
  const [links, setLinks] = useState<GoogleDriveLink[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingLink, setEditingLink] = useState<GoogleDriveLink | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    driveUrl: '',
    description: '',
  })
  const [error, setError] = useState('')

  useEffect(() => {
    fetchLinks()
  }, [])

  const fetchLinks = async () => {
    try {
      const response = await fetch('/api/admin/google-drive')
      const data = await response.json()
      if (response.ok) {
        setLinks(data.links || [])
      }
    } catch (error) {
      console.error('Error fetching Google Drive links:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.name || !formData.driveUrl) {
      setError('Name and Drive URL are required')
      return
    }

    try {
      const url = editingLink
        ? `/api/admin/google-drive/${editingLink.id}`
        : '/api/admin/google-drive'
      const method = editingLink ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to save Google Drive link')
        return
      }

      setShowModal(false)
      setEditingLink(null)
      setFormData({ name: '', driveUrl: '', description: '' })
      fetchLinks()
    } catch (err) {
      setError('An error occurred. Please try again.')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this Google Drive link?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/google-drive/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchLinks()
      } else {
        alert('Failed to delete link')
      }
    } catch (error) {
      console.error('Error deleting link:', error)
      alert('An error occurred')
    }
  }

  const handleEdit = (link: GoogleDriveLink) => {
    setEditingLink(link)
    setFormData({
      name: link.name,
      driveUrl: link.driveUrl,
      description: link.description || '',
    })
    setShowModal(true)
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
          <h3 className="text-lg leading-6 font-medium text-gray-900">Google Drive Links</h3>
          <button
            onClick={() => {
              setEditingLink(null)
              setFormData({ name: '', driveUrl: '', description: '' })
              setShowModal(true)
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Add Google Drive Link
          </button>
        </div>
        {links.length === 0 ? (
          <div className="px-4 py-5 sm:px-6">
            <p className="text-gray-500 text-sm">No Google Drive links yet. Add one to get started.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {links.map((link) => (
              <li key={link.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{link.name}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        <a
                          href={link.driveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          {link.driveUrl}
                        </a>
                      </div>
                      {link.description && (
                        <div className="text-sm text-gray-500 mt-1">{link.description}</div>
                      )}
                      <div className="text-xs text-gray-400 mt-1">
                        Created by {link.createdBy.name}
                      </div>
                    </div>
                    <div className="ml-4 flex space-x-2">
                      <button
                        onClick={() => handleEdit(link)}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(link.id)}
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
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {editingLink ? 'Edit Google Drive Link' : 'Add Google Drive Link'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name *
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Course Materials Drive"
                />
              </div>

              <div>
                <label htmlFor="driveUrl" className="block text-sm font-medium text-gray-700">
                  Google Drive URL *
                </label>
                <input
                  id="driveUrl"
                  type="url"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.driveUrl}
                  onChange={(e) => setFormData({ ...formData, driveUrl: e.target.value })}
                  placeholder="https://drive.google.com/drive/folders/..."
                />
                <p className="mt-1 text-xs text-gray-500">
                  Paste the Google Drive folder URL. Make sure you've shared this folder with teachers outside the app.
                </p>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Optional description for this Google Drive"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingLink(null)
                    setFormData({ name: '', driveUrl: '', description: '' })
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
                  {editingLink ? 'Update' : 'Add Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
