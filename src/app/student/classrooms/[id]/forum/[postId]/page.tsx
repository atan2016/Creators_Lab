import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Layout from '@/components/ui/Layout'
import ForumPostDetail from '@/components/forum/ForumPostDetail'
import Link from 'next/link'

export default async function StudentForumPostPage({
  params,
}: {
  params: { id: string; postId: string }
}) {
  const session = await auth()

  if (!session || ((session.user as any).role !== 'STUDENT' && (session.user as any).role !== 'ADMIN')) {
    redirect('/login')
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-4">
            <Link
              href={`/student/classrooms/${params.id}/forum`}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              ← Back to Forum
            </Link>
          </div>

          <ForumPostDetail postId={params.postId} classroomId={params.id} isTeacher={false} />
        </div>
      </div>
    </Layout>
  )
}
