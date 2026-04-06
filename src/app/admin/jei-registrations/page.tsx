import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Layout from '@/components/ui/Layout'

const statuses = [
  'PENDING_REVIEW',
  'INVOICED',
  'PAID',
  'CANCELLED_REFUNDED',
  'CANCELLED_CREDITED',
]

async function updateStatus(formData: FormData) {
  'use server'
  const session = await auth()
  if (!session || (session.user as any).role !== 'ADMIN') return
  const db: any = prisma as any
  const id = String(formData.get('id') || '')
  const status = String(formData.get('status') || '')
  if (!id || !statuses.includes(status)) return

  await db.jeiRegistration.update({
    where: { id },
    data: {
      status,
      reviewedById: (session.user as any).id,
      reviewedAt: new Date(),
      paidAt: status === 'PAID' ? new Date() : null,
    },
  })
}

export default async function AdminJeiRegistrationsPage() {
  const session = await auth()
  if (!session || (session.user as any).role !== 'ADMIN') {
    redirect('/login')
  }

  const db: any = prisma as any
  const registrations = await db.jeiRegistration.findMany({
    include: { students: true, authorizedPickup: true, selectedProgram: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">JEI Registrations</h1>

          <div className="space-y-4">
            {registrations.length === 0 && (
              <div className="bg-white shadow rounded-lg p-6 text-sm text-gray-500">
                No JEI registrations yet.
              </div>
            )}

            {registrations.map((reg: any) => (
              <div key={reg.id} className="bg-white shadow rounded-lg p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{reg.parentName}</h2>
                    <p className="text-sm text-gray-600">{reg.parentEmail} • {reg.parentPhone}</p>
                    <p className="text-sm text-gray-600">Emergency: {reg.emergencyPhone}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Program: {reg.selectedProgramName || 'Updates-only'}
                    </p>
                    <p className="text-sm text-gray-600">
                      Students: {reg.studentCount} • Total: ${(reg.totalAmountCents / 100).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">Created: {new Date(reg.createdAt).toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-1">Registration ID: {reg.id}</p>
                    {reg.students.length > 0 && (
                      <p className="text-sm text-gray-700 mt-2">
                        Student(s): {reg.students.map((s: any) => s.name).join(', ')}
                      </p>
                    )}
                    {reg.authorizedPickup.length > 0 && (
                      <p className="text-sm text-gray-700">
                        Pickup: {reg.authorizedPickup[0].name} ({reg.authorizedPickup[0].phone})
                      </p>
                    )}
                  </div>

                  <form action={updateStatus} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={reg.id} />
                    <select
                      name="status"
                      defaultValue={reg.status}
                      className="border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      className="px-3 py-1.5 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Save
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}
