import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Layout from '@/components/ui/Layout'
import Link from 'next/link'
import ClassroomActions from '@/components/classroom/ClassroomActions'
import SyllabusSection from '@/components/syllabus/SyllabusSection'
import AddStudentButton from '@/components/classroom/AddStudentButton'
import GoogleDriveLinkEditor from '@/components/classroom/GoogleDriveLinkEditor'

export default async function TeacherClassroomPage({ params }: { params: { id: string } }) {
  const session = await auth()

  if (!session || ((session.user as any).role !== 'TEACHER' && (session.user as any).role !== 'ADMIN')) {
    redirect('/login')
  }

  const classroom = await prisma.classroom.findUnique({
    where: { id: params.id },
    include: {
      creator: {
        select: {
          name: true,
          email: true,
        },
      },
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      },
      resources: {
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
      _count: {
        select: {
          resources: true,
          forumPosts: true,
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
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{classroom.name}</h1>
              {classroom.description && (
                <p className="mt-2 text-gray-600">{classroom.description}</p>
              )}
              <p className="mt-2 text-sm text-gray-500">
                Invite Code: <span className="font-mono">{classroom.inviteCode}</span>
              </p>
            </div>
            <ClassroomActions classroomId={classroom.id} />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {/* Document Drive Link */}
              <GoogleDriveLinkEditor classroomId={classroom.id} currentUrl={classroom.googleDriveUrl} />

              {/* Quick Stats */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{classroom._count.resources}</div>
                    <div className="text-sm text-gray-500">Resources</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{classroom._count.forumPosts}</div>
                    <div className="text-sm text-gray-500">Forum Posts</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{classroom.members.length}</div>
                    <div className="text-sm text-gray-500">Members</div>
                  </div>
                </div>
              </div>

              {/* Recent Resources */}
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Resources</h2>
                  <Link
                    href={`/teacher/classrooms/${classroom.id}/resources/new`}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Add Resource
                  </Link>
                </div>
                {classroom.resources.length === 0 ? (
                  <p className="text-gray-500 text-sm">No resources yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {classroom.resources.map((resource) => (
                      <li key={resource.id} className="text-sm">
                        <Link
                          href={`/teacher/classrooms/${classroom.id}/resources/${resource.id}`}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          {resource.title}
                        </Link>
                        <span className="ml-2 text-gray-500">({resource.type})</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Syllabus Section */}
              <SyllabusSection classroomId={classroom.id} isTeacher={true} />

              {/* Forum Link */}
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">Forum</h2>
                  <Link
                    href={`/teacher/classrooms/${classroom.id}/forum`}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    View Forum →
                  </Link>
                </div>
              </div>
            </div>

            {/* Members Sidebar */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Members ({classroom.members.length})</h2>
                <AddStudentButton classroomId={classroom.id} />
              </div>
              <ul className="space-y-2">
                {classroom.members.map((member) => (
                  <li key={member.id} className="text-sm">
                    <div className="font-medium text-gray-900">{member.user.name}</div>
                    <div className="text-gray-500">{member.user.email}</div>
                    <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded ${
                      member.user.role === 'TEACHER' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {member.user.role}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
