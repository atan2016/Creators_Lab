import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Layout from '@/components/ui/Layout'
import ForumList from '@/components/forum/ForumList'
import CreatePostButton from '@/components/forum/CreatePostButton'
import Link from 'next/link'

export default async function StudentForumPage({ params }: { params: { id: string } }) {
  const session = await auth()

  if (!session || ((session.user as any).role !== 'STUDENT' && (session.user as any).role !== 'ADMIN')) {
    redirect('/login')
  }

  const userId = (session.user as any).id

  const classroom = await prisma.classroom.findUnique({
    where: { id: params.id },
  })

  if (!classroom) {
    redirect('/student')
  }

  // Check if user is a member
  const membership = await prisma.classroomMember.findUnique({
    where: {
      classroomId_userId: {
        classroomId: params.id,
        userId,
      },
    },
  })

  if (!membership && (session.user as any).role !== 'ADMIN') {
    redirect('/student')
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-4">
            <Link
              href={`/student/classrooms/${params.id}`}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              ← Back to Classroom
            </Link>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Forum</h1>
            <CreatePostButton classroomId={params.id} isTeacher={false} />
          </div>

          <ForumList classroomId={params.id} />
        </div>
      </div>
    </Layout>
  )
}
