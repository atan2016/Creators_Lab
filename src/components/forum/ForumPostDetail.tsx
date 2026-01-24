'use client'

import { useEffect, useState } from 'react'
import ReplyForm from './ReplyForm'

interface ForumPostDetailProps {
  postId: string
  classroomId: string
  isTeacher: boolean
}

export default function ForumPostDetail({ postId, classroomId, isTeacher }: ForumPostDetailProps) {
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPost()
    // Poll for new replies every 10 seconds
    const interval = setInterval(fetchPost, 10000)
    return () => clearInterval(interval)
  }, [postId])

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/forum/posts/${postId}`)
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to load post')
        return
      }

      setPost(data.post)
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
        <p className="text-gray-500">Loading post...</p>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error || 'Post not found'}
      </div>
    )
  }

  const renderReplies = (replies: any[], depth = 0) => {
    return replies.map((reply) => (
      <div key={reply.id} className={`ml-${depth * 8} mt-4 border-l-2 border-gray-200 pl-4`}>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="font-medium text-gray-900">{reply.author.name}</span>
            <span className="text-xs text-gray-500">
              {new Date(reply.createdAt).toLocaleDateString()}
            </span>
            {(reply.author.role === 'TEACHER' || reply.author.role === 'ADMIN') && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                Teacher
              </span>
            )}
          </div>
          <p className="text-gray-700 whitespace-pre-wrap">{reply.content}</p>
          <div className="mt-3">
            <ReplyForm
              postId={postId}
              parentId={reply.id}
              classroomId={classroomId}
              onReply={fetchPost}
            />
          </div>
          {reply.replies && reply.replies.length > 0 && (
            <div className="mt-4">
              {renderReplies(reply.replies, depth + 1)}
            </div>
          )}
        </div>
      </div>
    ))
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className={`mb-6 ${post.isAnnouncement ? 'border-l-4 border-blue-500 pl-4' : ''}`}>
        {post.isAnnouncement && (
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded mb-2 inline-block">
            ANNOUNCEMENT
          </span>
        )}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{post.title}</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
          <span>by <span className="font-medium">{post.author.name}</span></span>
          <span>•</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          {(post.author.role === 'TEACHER' || post.author.role === 'ADMIN') && (
            <>
              <span>•</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">
                Teacher
              </span>
            </>
          )}
        </div>
        <div className="prose max-w-none">
          <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
        </div>
      </div>

      <div className="border-t pt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Replies ({post.replies?.length || 0})
        </h2>
        <ReplyForm
          postId={postId}
          parentId={null}
          classroomId={classroomId}
          onReply={fetchPost}
        />
        {post.replies && post.replies.length > 0 && (
          <div className="mt-6">
            {renderReplies(post.replies)}
          </div>
        )}
      </div>
    </div>
  )
}
