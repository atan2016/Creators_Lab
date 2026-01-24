'use client'

import { Resource } from '@prisma/client'
import GitHubResourceView from './GitHubResourceView'
import { useMemo } from 'react'

interface ResourceViewProps {
  resource: Resource
}

export default function ResourceView({ resource }: ResourceViewProps) {
  if (resource.type === 'GITHUB_LINK' && resource.githubUrl) {
    return <GitHubResourceView githubUrl={resource.githubUrl} />
  }

  if (resource.type === 'GOOGLE_DRIVE_LINK' && resource.googleDriveUrl) {
    return (
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <svg
            className="w-8 h-8 text-blue-600"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M7.71 3.5L1.15 20l4.71 1.35L12.86 3.5H7.71zm6.28 0l-6.56 16.5 4.71 1.35L18.14 3.5h-4.15z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900">Google Drive Resource</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Click the link below to open this file or folder in Google Drive.
        </p>
        <a
          href={resource.googleDriveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M7.71 3.5L1.15 20l4.71 1.35L12.86 3.5H7.71zm6.28 0l-6.56 16.5 4.71 1.35L18.14 3.5h-4.15z" />
          </svg>
          Open in Google Drive
        </a>
        <div className="mt-4">
          <p className="text-xs text-gray-500">URL:</p>
          <p className="text-xs text-gray-400 break-all mt-1">{resource.googleDriveUrl}</p>
        </div>
      </div>
    )
  }

  // Parse markdown-style links and URLs
  const renderContent = useMemo(() => {
    if (!resource.content) return null

    // Simple markdown link parser: [text](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
    const urlRegex = /(https?:\/\/[^\s]+)/g

    let content = resource.content
    const parts: (string | JSX.Element)[] = []
    let lastIndex = 0
    let match

    // Find all markdown links
    const links: Array<{ start: number; end: number; text: string; url: string }> = []
    while ((match = linkRegex.exec(content)) !== null) {
      links.push({
        start: match.index,
        end: match.index + match[0].length,
        text: match[1],
        url: match[2],
      })
    }

    // Build parts array
    if (links.length === 0) {
      // No links, just check for plain URLs
      const urlMatches = Array.from(content.matchAll(urlRegex))
      if (urlMatches.length === 0) {
        return <pre className="whitespace-pre-wrap text-sm text-gray-800">{content}</pre>
      }

      let urlLastIndex = 0
      urlMatches.forEach((urlMatch) => {
        if (urlMatch.index !== undefined) {
          if (urlLastIndex < urlMatch.index) {
            parts.push(content.substring(urlLastIndex, urlMatch.index))
          }
          const url = urlMatch[0]
          parts.push(
            <a
              key={urlLastIndex}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 underline"
            >
              {url}
            </a>
          )
          urlLastIndex = urlMatch.index + url.length
        }
      })
      if (urlLastIndex < content.length) {
        parts.push(content.substring(urlLastIndex))
      }
      return <div className="text-sm text-gray-800 whitespace-pre-wrap">{parts}</div>
    }

    // Handle markdown links
    links.forEach((link, index) => {
      if (lastIndex < link.start) {
        parts.push(content.substring(lastIndex, link.start))
      }
      parts.push(
        <a
          key={index}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-700 underline"
        >
          {link.text}
        </a>
      )
      lastIndex = link.end
    })
    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex))
    }

    return <div className="text-sm text-gray-800 whitespace-pre-wrap">{parts}</div>
  }, [resource.content])

  return (
    <div className="prose max-w-none">
      <div className="bg-gray-50 rounded-lg p-4">{renderContent}</div>
    </div>
  )
}
