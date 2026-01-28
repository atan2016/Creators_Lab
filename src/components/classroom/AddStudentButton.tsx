'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import AddStudentModal from './AddStudentModal'

interface AddStudentButtonProps {
  classroomId: string
}

export default function AddStudentButton({ classroomId }: AddStudentButtonProps) {
  const [showModal, setShowModal] = useState(false)
  const [showTeacherModal, setShowTeacherModal] = useState(false)
  const router = useRouter()
  const { data: session } = useSession()
  const isAdmin = (session?.user as any)?.role === 'ADMIN'

  const handleSuccess = () => {
    router.refresh()
  }

  return (
    <>
      <div className="flex gap-2">
        <button
          onClick={() => setShowModal(true)}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          Add Student
        </button>
        {isAdmin && (
          <button
            onClick={() => setShowTeacherModal(true)}
            className="text-sm text-green-600 hover:text-green-700"
          >
            Add Teacher
          </button>
        )}
      </div>
      {showModal && (
        <AddStudentModal
          classroomId={classroomId}
          onClose={() => setShowModal(false)}
          onSuccess={handleSuccess}
          memberType="STUDENT"
        />
      )}
      {showTeacherModal && (
        <AddStudentModal
          classroomId={classroomId}
          onClose={() => setShowTeacherModal(false)}
          onSuccess={handleSuccess}
          memberType="TEACHER"
        />
      )}
    </>
  )
}
