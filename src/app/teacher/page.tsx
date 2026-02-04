import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Layout from '@/components/ui/Layout'
import Link from 'next/link'
import ActivityTracking from '@/components/admin/ActivityTracking'

export default async function TeacherDashboard() {
  const session = await auth()

  if (!session || ((session.user as any).role !== 'TEACHER' && (session.user as any).role !== 'ADMIN')) {
    redirect('/login')
  }

  const userId = (session.user as any).id
  const role = (session.user as any).role

  // Admins can see all classrooms
  // Teachers see classrooms they created OR classrooms they've been added to as members
  let classrooms
  if (role === 'ADMIN') {
    classrooms = await prisma.classroom.findMany({
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
  } else {
    // Get classrooms where teacher is creator
    const createdClassrooms = await prisma.classroom.findMany({
      where: { creatorId: userId },
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
    })

    // Get classrooms where teacher is a member
    const memberClassrooms = await prisma.classroomMember.findMany({
      where: {
        userId,
      },
      include: {
        classroom: {
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
        },
      },
    })

    // Combine and deduplicate (in case teacher is both creator and member)
    const classroomMap = new Map()
    createdClassrooms.forEach(c => classroomMap.set(c.id, c))
    memberClassrooms.forEach(m => {
      if (!classroomMap.has(m.classroom.id)) {
        classroomMap.set(m.classroom.id, m.classroom)
      }
    })

    classrooms = Array.from(classroomMap.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Inspirational Quote - Teacher Only */}
          {role === 'TEACHER' && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 mb-6">
              <blockquote className="border-l-4 border-green-500 pl-4 italic text-gray-800">
                <p className="text-base">📚 "If you want to master something, teach it. The more you teach, the better you learn. Teaching is a powerful tool to learning." — Richard Feynman ✨</p>
              </blockquote>
            </div>
          )}

          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              {role === 'ADMIN' ? 'All Classrooms' : 'My Classrooms'}
            </h1>
            <div className="flex gap-3">
              <Link
                href="/teacher/calendar"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                My Calendar
              </Link>
              <Link
                href="/teacher/time-tracking"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Time Tracking
              </Link>
              <Link
                href="/teacher/classrooms/new"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Create Classroom
              </Link>
            </div>
          </div>

          {/* Welcome Instructions - Teacher Only */}
          {role === 'TEACHER' && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-6 rounded-r-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <h2 className="text-lg font-semibold text-blue-900 mb-3">
                    Welcome Teachers to Yamas (The Learning Management Systems for Creators-Lab.)
                  </h2>
                  <p className="text-sm text-blue-800 mb-3">
                    This portal allows you to perform the following functions:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
                    <li>View curriculum, and create details lesson plans</li>
                    <li>Add and remove students</li>
                    <li>Use forum to discuss with your students, please note the forum functionality does not send out email or notifications currently</li>
                    <li>Log your hours</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* Activity Tracking - Admin Only */}
          {role === 'ADMIN' && <ActivityTracking />}

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
