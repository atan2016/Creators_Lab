'use client'

import { useState } from 'react'
import TeacherOnboardingContent from './TeacherOnboardingContent'

export default function TeacherPageTabs({ children }: { children: React.ReactNode }) {
  const [tab, setTab] = useState<'dashboard' | 'onboarding'>('dashboard')

  return (
    <div>
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex gap-8" aria-label="Tabs">
          <button
            onClick={() => setTab('dashboard')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 text-sm font-medium ${
              tab === 'dashboard'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setTab('onboarding')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 text-sm font-medium ${
              tab === 'onboarding'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            Onboarding
          </button>
        </nav>
      </div>

      {tab === 'dashboard' ? children : <TeacherOnboardingContent />}
    </div>
  )
}
