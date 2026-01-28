import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Layout from '@/components/ui/Layout'
import ForumList from '@/components/forum/ForumList'
import CreatePostButton from '@/components/forum/CreatePostButton'
import Link from 'next/link'

export default async function TeacherForumPage({ params }: { params: { id: string } }) {
  const session = await auth()

  if (!session || ((session.user as any).role !== 'TEACHER' && (session.user as any).role !== 'ADMIN')) {
    redirect('/login')
  }

  const classroom = await prisma.classroom.findUnique({
    where: { id: params.id },
    include: {
      members: {
        where: {
          role: 'TEACHER',
        },
        select: {
          userId: true,
        },
      },
    },
  })

  if (!classroom) {
    redirect('/teacher')
  }

  const userId = (session.user as any).id
  const role = (session.user as any).role

  // Check if user is creator, admin, or a teacher member of this classroom
  const isCreator = classroom.creatorId === userId
  const isAdmin = role === 'ADMIN'
  const isMember = classroom.members.some((m: any) => m.userId === userId)

  if (!isCreator && !isAdmin && !isMember) {
    redirect('/teacher')
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-4">
            <Link
              href={`/teacher/classrooms/${params.id}`}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              ← Back to Classroom
            </Link>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Forum</h1>
            <CreatePostButton classroomId={params.id} isTeacher={true} />
          </div>

          <ForumList classroomId={params.id} />
        </div>
      </div>
    </Layout>
  )
}
