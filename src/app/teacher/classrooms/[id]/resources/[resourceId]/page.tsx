import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Layout from '@/components/ui/Layout'
import ResourceView from '@/components/resource/ResourceView'
import Link from 'next/link'

export default async function TeacherResourcePage({
  params,
}: {
  params: { id: string; resourceId: string }
}) {
  const session = await auth()

  if (!session || ((session.user as any).role !== 'TEACHER' && (session.user as any).role !== 'ADMIN')) {
    redirect('/login')
  }

  const resource = await prisma.resource.findUnique({
    where: { id: params.resourceId },
    include: {
      classroom: true,
      createdBy: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          copies: true,
        },
      },
    },
  })

  if (!resource || resource.classroomId !== params.id) {
    redirect(`/teacher/classrooms/${params.id}`)
  }

  const userId = (session.user as any).id
  if (resource.classroom.creatorId !== userId && (session.user as any).role !== 'ADMIN') {
    redirect('/teacher')
  }

  // Get homework submissions if this is homework
  let submissions = []
  if (resource.type === 'HOMEWORK') {
    submissions = await prisma.homeworkSubmission.findMany({
      where: { homeworkId: params.resourceId },
      include: {
        student: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-4">
            <Link
              href={`/teacher/classrooms/${params.id}`}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              ← Back to Classroom
            </Link>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{resource.title}</h1>
              <p className="mt-2 text-sm text-gray-500">
                by {resource.createdBy.name} • {resource.type.replace('_', ' ')}
              </p>
              {resource._count.copies > 0 && (
                <p className="mt-1 text-sm text-gray-500">
                  {resource._count.copies} student{resource._count.copies !== 1 ? 's' : ''} copied this resource
                </p>
              )}
            </div>

            {resource.description && (
              <p className="text-gray-700 mb-6">{resource.description}</p>
            )}

            <ResourceView resource={resource} />

            {resource.type === 'HOMEWORK' && (
              <div className="mt-8 border-t pt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Submissions ({submissions.length})
                </h2>
                {submissions.length === 0 ? (
                  <p className="text-gray-500">No submissions yet.</p>
                ) : (
                  <div className="space-y-4">
                    {submissions.map((submission) => (
                      <div key={submission.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-gray-900">{submission.student.name}</div>
                            <div className="text-sm text-gray-500">{submission.student.email}</div>
                            <a
                              href={submission.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700 text-sm mt-2 inline-block"
                            >
                              {submission.githubUrl} →
                            </a>
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(submission.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
