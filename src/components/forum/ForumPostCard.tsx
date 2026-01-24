import Link from 'next/link'

interface ForumPostCardProps {
  post: any
  classroomId: string
}

export default function ForumPostCard({ post, classroomId }: ForumPostCardProps) {
  const isTeacher = post.author.role === 'TEACHER' || post.author.role === 'ADMIN'

  return (
    <div
      className={`bg-white shadow rounded-lg p-6 ${
        post.isAnnouncement ? 'border-l-4 border-blue-500' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            {post.isAnnouncement && (
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                ANNOUNCEMENT
              </span>
            )}
            <Link
              href={`/${isTeacher ? 'teacher' : 'student'}/classrooms/${classroomId}/forum/${post.id}`}
              className="text-lg font-semibold text-gray-900 hover:text-blue-600"
            >
              {post.title}
            </Link>
          </div>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{post.content}</p>
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span>
              by <span className="font-medium">{post.author.name}</span>
            </span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            {post._count.replies > 0 && (
              <span>{post._count.replies} repl{post._count.replies !== 1 ? 'ies' : 'y'}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
