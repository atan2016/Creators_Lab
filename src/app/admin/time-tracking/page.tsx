import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Layout from '@/components/ui/Layout'
import AdminTimeTrackingView from '@/components/admin/AdminTimeTrackingView'
import Link from 'next/link'

export const metadata = {
  title: 'Time Tracking — CreatorsLab LMS (Yamas)',
  description: 'View and manage all instructor time entries.',
}

export default async function AdminTimeTrackingPage() {
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
          <AdminTimeTrackingView />
        </div>
      </div>
    </Layout>
  )
}
