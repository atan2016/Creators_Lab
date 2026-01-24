'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AddStudentModal from './AddStudentModal'

interface AddStudentButtonProps {
  classroomId: string
}

export default function AddStudentButton({ classroomId }: AddStudentButtonProps) {
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()

  const handleSuccess = () => {
    router.refresh()
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="text-sm text-blue-600 hover:text-blue-700"
      >
        Add Student
      </button>
      {showModal && (
        <AddStudentModal
          classroomId={classroomId}
          onClose={() => setShowModal(false)}
          onSuccess={handleSuccess}
        />
      )}
    </>
  )
}
