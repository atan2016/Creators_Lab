'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { validateGitHubUrl } from '@/lib/github'

interface HomeworkSubmissionProps {
  homeworkId: string
  existingSubmission: any
}

export default function HomeworkSubmission({ homeworkId, existingSubmission }: HomeworkSubmissionProps) {
  const router = useRouter()
  const [githubUrl, setGithubUrl] = useState(existingSubmission?.githubUrl || '')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!githubUrl) {
      setError('GitHub URL is required')
      return
    }

    if (!validateGitHubUrl(githubUrl)) {
      setError('Invalid GitHub URL format')
      return
    }

    setLoading(true)

    try {
      const url = existingSubmission
        ? `/api/homework/${homeworkId}/submission`
        : `/api/homework/${homeworkId}/submission`
      const method = existingSubmission ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ githubUrl }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to submit homework')
        return
      }

      router.refresh()
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (existingSubmission) {
    return (
      <div>
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          <p className="font-medium">Homework Submitted</p>
          <a
            href={existingSubmission.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm underline mt-1 inline-block"
          >
            {existingSubmission.githubUrl} →
          </a>
          <p className="text-sm mt-1">
            Submitted on {new Date(existingSubmission.createdAt).toLocaleDateString()}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Update GitHub Repository URL
            </label>
            <input
              id="githubUrl"
              name="githubUrl"
              type="url"
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="https://github.com/yourusername/your-repo"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Updating...' : 'Update Submission'}
          </button>
        </form>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700 mb-2">
          GitHub Repository URL *
        </label>
        <input
          id="githubUrl"
          name="githubUrl"
          type="url"
          required
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="https://github.com/yourusername/your-repo"
          value={githubUrl}
          onChange={(e) => setGithubUrl(e.target.value)}
        />
        <p className="mt-2 text-sm text-gray-500">
          Link your GitHub repository containing your homework submission.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Submitting...' : 'Submit Homework'}
      </button>
    </form>
  )
}
