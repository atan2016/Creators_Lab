'use client'

import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Navbar() {
  const { data: session } = useSession()
  const router = useRouter()
  const [showMenu, setShowMenu] = useState(false)

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push('/login')
  }

  if (!session) return null

  const role = (session.user as any).role
  const dashboardPath = role === 'ADMIN' ? '/admin' : role === 'TEACHER' ? '/teacher' : '/student'

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href={dashboardPath} className="text-xl font-bold text-blue-600">
                Afterschool LMS
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href={dashboardPath}
                className="border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Dashboard
              </Link>
              {/* CreatorsLab Navigation Links */}
              <div className="relative group">
                <button className="text-gray-700 hover:text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium hover:border-gray-300">
                  CreatorsLab
                  <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1">
                    <Link href="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Home
                    </Link>
                    <Link href="/about" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      About
                    </Link>
                    <Link href="/what-we-teach" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      What We Teach
                    </Link>
                    <Link href="/showcase" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Showcase
                    </Link>
                    <Link href="/resources" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Resources
                    </Link>
                    <Link href="/events" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Events
                    </Link>
                    <Link href="/careers" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Careers
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">
              {session.user?.name} ({role})
            </span>
            <button
              onClick={handleSignOut}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-medium"
            >
              Sign out
            </button>
          </div>
        </div>
        {/* Mobile menu */}
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href={dashboardPath}
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Dashboard
            </Link>
            <div>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 flex items-center justify-between"
              >
                CreatorsLab
                <svg className={`h-4 w-4 transition-transform ${showMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showMenu && (
                <div className="pl-4 space-y-1">
                  <Link href="/" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50">
                    Home
                  </Link>
                  <Link href="/about" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50">
                    About
                  </Link>
                  <Link href="/what-we-teach" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50">
                    What We Teach
                  </Link>
                  <Link href="/showcase" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50">
                    Showcase
                  </Link>
                  <Link href="/resources" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50">
                    Resources
                  </Link>
                  <Link href="/events" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50">
                    Events
                  </Link>
                  <Link href="/careers" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50">
                    Careers
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
