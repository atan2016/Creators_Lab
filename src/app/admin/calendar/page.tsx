import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Layout from '@/components/ui/Layout'
import InstructorCalendar from '@/components/admin/InstructorCalendar'
import ConflictAlerts from '@/components/admin/ConflictAlerts'
import Link from 'next/link'

export default async function AdminCalendarPage() {
  const session = await auth()

  if (!session || (session.user as any).role !== 'ADMIN') {
    redirect('/login')
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-4">
            <Link
              href="/admin"
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              ← Back to Admin Dashboard
            </Link>
          </div>

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Instructor Calendar</h1>
            <p className="mt-2 text-sm text-gray-500">
              View and manage instructor schedules across all locations. Conflicts are highlighted in red.
            </p>
          </div>

          <ConflictAlerts />
          <InstructorCalendar isAdmin={true} />
        </div>
      </div>
    </Layout>
  )
}
