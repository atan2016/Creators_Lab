import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Layout from '@/components/ui/Layout'
import Link from 'next/link'

export default async function StudentDashboard() {
  const session = await auth()

  if (!session || ((session.user as any).role !== 'STUDENT' && (session.user as any).role !== 'ADMIN')) {
    redirect('/login')
  }

  const userId = (session.user as any).id

  const classroomMemberships = await prisma.classroomMember.findMany({
    where: { userId },
    include: {
      classroom: {
        include: {
          _count: {
            select: {
              members: true,
              resources: true,
            },
          },
        },
      },
    },
    orderBy: { joinedAt: 'desc' },
  })

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">My Classrooms</h1>
            <Link
              href="/student/join"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Join Classroom
            </Link>
          </div>

          {classroomMemberships.length === 0 ? (
            <div className="bg-white shadow rounded-lg p-8 text-center">
              <p className="text-gray-500 mb-4">You haven't joined any classrooms yet.</p>
              <Link
                href="/student/join"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Join a Classroom
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {classroomMemberships.map((membership) => (
                <Link
                  key={membership.id}
                  href={`/student/classrooms/${membership.classroom.id}`}
                  className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {membership.classroom.name}
                  </h3>
                  {membership.classroom.description && (
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                      {membership.classroom.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{membership.classroom._count.members} members</span>
                    <span>{membership.classroom._count.resources} resources</span>
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
