'use client'

import { useState } from 'react'
import CreatePostModal from './CreatePostModal'

interface CreatePostButtonProps {
  classroomId: string
  isTeacher: boolean
}

export default function CreatePostButton({ classroomId, isTeacher }: CreatePostButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
      >
        {isTeacher ? 'New Post / Announcement' : 'New Post'}
      </button>
      {isOpen && (
        <CreatePostModal
          classroomId={classroomId}
          isTeacher={isTeacher}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
