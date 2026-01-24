'use client'

import { useEffect, useState } from 'react'
import { getGitHubRepoInfo } from '@/lib/github'

interface GitHubResourceViewProps {
  githubUrl: string
}

export default function GitHubResourceView({ githubUrl }: GitHubResourceViewProps) {
  const [repoInfo, setRepoInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRepoInfo() {
      try {
        const info = await getGitHubRepoInfo(githubUrl)
        setRepoInfo(info)
      } catch (error) {
        console.error('Error fetching GitHub repo info:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRepoInfo()
  }, [githubUrl])

  if (loading) {
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-gray-500">Loading repository information...</p>
      </div>
    )
  }

  if (!repoInfo) {
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-700"
        >
          {githubUrl} →
        </a>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{repoInfo.name}</h3>
          {repoInfo.description && (
            <p className="text-gray-600 mb-4">{repoInfo.description}</p>
          )}
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>⭐ {repoInfo.stars}</span>
            <span>🍴 {repoInfo.forks}</span>
            <span>Updated {new Date(repoInfo.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
        <a
          href={repoInfo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          View on GitHub →
        </a>
      </div>
    </div>
  )
}
