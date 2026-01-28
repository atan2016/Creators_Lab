import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Layout from '@/components/ui/Layout'
import Link from 'next/link'

export default async function TeacherDashboard() {
  const session = await auth()

  if (!session || ((session.user as any).role !== 'TEACHER' && (session.user as any).role !== 'ADMIN')) {
    redirect('/login')
  }

  const userId = (session.user as any).id
  const role = (session.user as any).role

  // Admins can see all classrooms, teachers only see their own
  const classrooms = await prisma.classroom.findMany({
    where: role === 'ADMIN' ? {} : { creatorId: userId },
    include: {
      creator: {
        select: {
          name: true,
          email: true,
        },
      },
      _count: {
        select: {
          members: true,
          resources: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              {role === 'ADMIN' ? 'All Classrooms' : 'My Classrooms'}
            </h1>
            <Link
              href="/teacher/classrooms/new"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Create Classroom
            </Link>
          </div>

          {classrooms.length === 0 ? (
            <div className="bg-white shadow rounded-lg p-8 text-center">
              <p className="text-gray-500 mb-4">You haven't created any classrooms yet.</p>
              <Link
                href="/teacher/classrooms/new"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Create Your First Classroom
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {classrooms.map((classroom) => (
                <Link
                  key={classroom.id}
                  href={`/teacher/classrooms/${classroom.id}`}
                  className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{classroom.name}</h3>
                  {classroom.description && (
                    <p className="text-sm text-gray-500 mb-2 line-clamp-2">{classroom.description}</p>
                  )}
                  {role === 'ADMIN' && (
                    <p className="text-xs text-gray-500 mb-2">
                      Teacher: {classroom.creator.name} ({classroom.creator.email})
                    </p>
                  )}
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{classroom._count.members} members</span>
                    <span>{classroom._count.resources} resources</span>
                  </div>
                  <div className="mt-4 text-xs text-gray-400">
                    Invite Code: <span className="font-mono">{classroom.inviteCode}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
