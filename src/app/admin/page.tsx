import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Layout from '@/components/ui/Layout'
import GoogleDriveManager from '@/components/admin/GoogleDriveManager'
import UserManager from '@/components/admin/UserManager'
import LocationManager from '@/components/admin/LocationManager'
import ScheduleManager from '@/components/admin/ScheduleManager'
import Link from 'next/link'

export default async function AdminDashboard() {
  const session = await auth()

  if (!session || (session.user as any).role !== 'ADMIN') {
    redirect('/login')
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  })

  const stats = {
    totalUsers: await prisma.user.count(),
    teachers: await prisma.user.count({ where: { role: 'TEACHER' } }),
    students: await prisma.user.count({ where: { role: 'STUDENT' } }),
    classrooms: await prisma.classroom.count(),
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-4 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-2xl font-bold text-gray-900">{stats.totalUsers}</div>
                    <div className="text-sm text-gray-500">Total Users</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="text-2xl font-bold text-gray-900">{stats.teachers}</div>
                <div className="text-sm text-gray-500">Teachers</div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="text-2xl font-bold text-gray-900">{stats.students}</div>
                <div className="text-sm text-gray-500">Students</div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="text-2xl font-bold text-gray-900">{stats.classrooms}</div>
                <div className="text-sm text-gray-500">Classrooms</div>
              </div>
            </div>
          </div>

          {/* User Management */}
          <UserManager />

          {/* Document Drive Links */}
          <GoogleDriveManager />

          {/* Locations Management */}
          <LocationManager />

          {/* Schedules Management */}
          <ScheduleManager />

          {/* Calendar View */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md mb-6">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Instructor Calendar</h3>
              <p className="mt-2 text-sm text-gray-500">
                View instructor schedules in a calendar format with conflict detection.
              </p>
              <div className="mt-4">
                <Link
                  href="/admin/calendar"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  View Calendar
                </Link>
              </div>
            </div>
          </div>

          {/* Time Tracking */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md mb-6">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Time Tracking</h3>
              <p className="mt-2 text-sm text-gray-500">
                View and manage all instructor time entries with filtering, summaries, and statistics.
              </p>
              <div className="mt-4">
                <Link
                  href="/admin/time-tracking"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                  View Time Tracking
                </Link>
              </div>
            </div>
          </div>

          {/* Classrooms Link */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md mb-6">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Classrooms</h3>
              <p className="mt-2 text-sm text-gray-500">
                View and manage all classrooms in the system.
              </p>
              <div className="mt-4 flex gap-3">
                <Link
                  href="/teacher/classrooms/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                  Create New Classroom
                </Link>
                <Link
                  href="/teacher"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  View All Classrooms
                </Link>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">All Users</h3>
            </div>
            <ul className="divide-y divide-gray-200">
              {users.map((user) => (
                <li key={user.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                          user.role === 'TEACHER' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {user.role}
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  )
}
