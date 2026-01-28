'use client'

import { useState, useEffect } from 'react'

interface Location {
  id: string
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  createdAt: string
  updatedAt: string
}

export default function LocationManager() {
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingLocation, setEditingLocation] = useState<Location | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  })
  const [error, setError] = useState('')

  useEffect(() => {
    fetchLocations()
  }, [])

  const fetchLocations = async () => {
    try {
      const response = await fetch('/api/admin/locations')
      const data = await response.json()
      if (response.ok) {
        setLocations(data.locations || [])
      }
    } catch (error) {
      console.error('Error fetching locations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.name || !formData.address || !formData.city || !formData.state || !formData.zipCode) {
      setError('All fields are required')
      return
    }

    try {
      const url = editingLocation
        ? `/api/admin/locations/${editingLocation.id}`
        : '/api/admin/locations'
      const method = editingLocation ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to save location')
        return
      }

      setShowModal(false)
      setEditingLocation(null)
      setFormData({ name: '', address: '', city: '', state: '', zipCode: '' })
      fetchLocations()
    } catch (err) {
      setError('An error occurred. Please try again.')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this location?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/locations/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchLocations()
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to delete location')
      }
    } catch (error) {
      console.error('Error deleting location:', error)
      alert('An error occurred')
    }
  }

  const handleEdit = (location: Location) => {
    setEditingLocation(location)
    setFormData({
      name: location.name,
      address: location.address,
      city: location.city,
      state: location.state,
      zipCode: location.zipCode,
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
          <h3 className="text-lg leading-6 font-medium text-gray-900">Locations</h3>
          <button
            onClick={() => {
              setEditingLocation(null)
              setFormData({ name: '', address: '', city: '', state: '', zipCode: '' })
              setShowModal(true)
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Add Location
          </button>
        </div>
        {locations.length === 0 ? (
          <div className="px-4 py-5 sm:px-6">
            <p className="text-gray-500 text-sm">No locations yet. Add one to get started.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {locations.map((location) => (
              <li key={location.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{location.name}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        {location.address}, {location.city}, {location.state} {location.zipCode}
                      </div>
                    </div>
                    <div className="ml-4 flex space-x-2">
                      <button
                        onClick={() => handleEdit(location)}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(location.id)}
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
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {editingLocation ? 'Edit Location' : 'Add Location'}
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
                  placeholder="e.g., San Francisco Campus"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Street Address *
                </label>
                <input
                  id="address"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="123 Main St"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    City *
                  </label>
                  <input
                    id="city"
                    type="text"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="San Francisco"
                  />
                </div>

                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                    State *
                  </label>
                  <input
                    id="state"
                    type="text"
                    required
                    maxLength={2}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm uppercase"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
                    placeholder="CA"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                  ZIP Code *
                </label>
                <input
                  id="zipCode"
                  type="text"
                  required
                  pattern="[0-9]{5}(-[0-9]{4})?"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  placeholder="94102"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingLocation(null)
                    setFormData({ name: '', address: '', city: '', state: '', zipCode: '' })
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
                  {editingLocation ? 'Update' : 'Add Location'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
