import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Layout from '@/components/ui/Layout'
import TimeTrackingView from '@/components/teacher/TimeTrackingView'
import Link from 'next/link'

export const metadata = {
  title: 'Time Tracking — CreatorsLab LMS (Yamas)',
  description: 'Track your work hours and time spent.',
}

export default async function TimeTrackingPage() {
  const session = await auth()

  if (!session || ((session.user as any).role !== 'TEACHER' && (session.user as any).role !== 'ADMIN')) {
    redirect('/login')
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-4">
            <Link
              href="/teacher"
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              ← Back to My Classrooms
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Time Tracking</h1>
          <TimeTrackingView />
        </div>
      </div>
    </Layout>
  )
}
