import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Layout from '@/components/ui/Layout'
import Link from 'next/link'
import SyllabusSection from '@/components/syllabus/SyllabusSection'

export default async function StudentClassroomPage({ params }: { params: { id: string } }) {
  const session = await auth()

  if (!session || ((session.user as any).role !== 'STUDENT' && (session.user as any).role !== 'ADMIN')) {
    redirect('/login')
  }

  const userId = (session.user as any).id

  const classroom = await prisma.classroom.findUnique({
    where: { id: params.id },
    include: {
      creator: {
        select: {
          name: true,
          email: true,
        },
      },
      resources: {
        orderBy: { createdAt: 'desc' },
        include: {
          createdBy: {
            select: {
              name: true,
            },
          },
        },
      },
      _count: {
        select: {
          resources: true,
          forumPosts: true,
          members: true,
        },
      },
    },
  })

  if (!classroom) {
    redirect('/student')
  }

  // Check if user is a member
  const membership = await prisma.classroomMember.findUnique({
    where: {
      classroomId_userId: {
        classroomId: classroom.id,
        userId,
      },
    },
  })

  if (!membership && (session.user as any).role !== 'ADMIN') {
    redirect('/student')
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">{classroom.name}</h1>
            {classroom.description && (
              <p className="mt-2 text-gray-600">{classroom.description}</p>
            )}
            <p className="mt-2 text-sm text-gray-500">
              Teacher: {classroom.creator.name}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {/* Resources */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Resources ({classroom._count.resources})</h2>
                {classroom.resources.length === 0 ? (
                  <p className="text-gray-500 text-sm">No resources available yet.</p>
                ) : (
                  <div className="space-y-4">
                    {classroom.resources.map((resource) => (
                      <div key={resource.id} className="border-b border-gray-200 pb-4 last:border-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <Link
                              href={`/student/classrooms/${classroom.id}/resources/${resource.id}`}
                              className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                              {resource.title}
                            </Link>
                            <p className="text-sm text-gray-500 mt-1">{resource.description}</p>
                            <div className="mt-2 flex items-center space-x-2">
                              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                                {resource.type.replace('_', ' ')}
                              </span>
                              <span className="text-xs text-gray-500">
                                by {resource.createdBy.name}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Syllabus Section */}
              <SyllabusSection classroomId={classroom.id} isTeacher={false} />

              {/* Forum Link */}
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">Forum</h2>
                  <Link
                    href={`/student/classrooms/${classroom.id}/forum`}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    View Forum →
                  </Link>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  {classroom._count.forumPosts} posts
                </p>
              </div>
            </div>

            {/* Info Sidebar */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Classroom Info</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-gray-500">Teacher</div>
                  <div className="font-medium text-gray-900">{classroom.creator.name}</div>
                  <div className="text-gray-500">{classroom.creator.email}</div>
                </div>
                <div>
                  <div className="text-gray-500">Members</div>
                  <div className="font-medium text-gray-900">{classroom._count.members}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
