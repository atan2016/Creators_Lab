'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import ForumPostCard from './ForumPostCard'

interface ForumListProps {
  classroomId: string
}

export default function ForumList({ classroomId }: ForumListProps) {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPosts()
    // Poll for new posts every 30 seconds
    const interval = setInterval(fetchPosts, 30000)
    return () => clearInterval(interval)
  }, [classroomId])

  const fetchPosts = async () => {
    try {
      const response = await fetch(`/api/classrooms/${classroomId}/forum`)
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to load posts')
        return
      }

      setPosts(data.posts || [])
      setError('')
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-500">Loading forum posts...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6 text-center">
        <p className="text-gray-500">No posts yet. Be the first to start a discussion!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <ForumPostCard key={post.id} post={post} classroomId={classroomId} />
      ))}
    </div>
  )
}
