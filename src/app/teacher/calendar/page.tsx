import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Layout from '@/components/ui/Layout'
import InstructorCalendar from '@/components/admin/InstructorCalendar'
import Link from 'next/link'

export default async function TeacherCalendarPage() {
  const session = await auth()

  if (!session || ((session.user as any).role !== 'TEACHER' && (session.user as any).role !== 'ADMIN')) {
    redirect('/login')
  }

  const userId = (session.user as any).id

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-4">
            <Link
              href="/teacher"
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              ← Back to Dashboard
            </Link>
          </div>

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">My Teaching Schedule</h1>
            <p className="mt-2 text-sm text-gray-500">
              View your teaching schedule with classes you are assigned to teach.
            </p>
          </div>

          <InstructorCalendar isAdmin={false} instructorId={userId} />
        </div>
      </div>
    </Layout>
  )
}
