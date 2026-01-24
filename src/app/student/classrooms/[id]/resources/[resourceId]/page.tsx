import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Layout from '@/components/ui/Layout'
import ResourceView from '@/components/resource/ResourceView'
import CopyResourceButton from '@/components/resource/CopyResourceButton'
import HomeworkSubmission from '@/components/resource/HomeworkSubmission'

export default async function StudentResourcePage({
  params,
}: {
  params: { id: string; resourceId: string }
}) {
  const session = await auth()

  if (!session || ((session.user as any).role !== 'STUDENT' && (session.user as any).role !== 'ADMIN')) {
    redirect('/login')
  }

  const userId = (session.user as any).id

  const resource = await prisma.resource.findUnique({
    where: { id: params.resourceId },
    include: {
      classroom: true,
      createdBy: {
        select: {
          name: true,
        },
      },
    },
  })

  if (!resource || resource.classroomId !== params.id) {
    redirect(`/student/classrooms/${params.id}`)
  }

  // Check if user is a member
  const membership = await prisma.classroomMember.findUnique({
    where: {
      classroomId_userId: {
        classroomId: params.id,
        userId,
      },
    },
  })

  if (!membership && (session.user as any).role !== 'ADMIN') {
    redirect('/student')
  }

  // Check if already copied
  const hasCopied = await prisma.resourceCopy.findUnique({
    where: {
      resourceId_userId: {
        resourceId: params.resourceId,
        userId,
      },
    },
  })

  // Check if homework submission exists
  let homeworkSubmission = null
  if (resource.type === 'HOMEWORK') {
    homeworkSubmission = await prisma.homeworkSubmission.findUnique({
      where: {
        homeworkId_studentId: {
          homeworkId: params.resourceId,
          studentId: userId,
        },
      },
    })
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{resource.title}</h1>
                <p className="mt-2 text-sm text-gray-500">
                  by {resource.createdBy.name} • {resource.type.replace('_', ' ')}
                </p>
              </div>
              {!hasCopied && resource.type !== 'HOMEWORK' && (
                <CopyResourceButton resourceId={resource.id} />
              )}
            </div>

            {resource.description && (
              <p className="text-gray-700 mb-6">{resource.description}</p>
            )}

            <ResourceView resource={resource} />

            {resource.type === 'HOMEWORK' && (
              <div className="mt-8 border-t pt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Submit Homework</h2>
                <HomeworkSubmission
                  homeworkId={resource.id}
                  existingSubmission={homeworkSubmission}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
