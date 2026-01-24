'use client'

import { Resource } from '@prisma/client'
import GitHubResourceView from './GitHubResourceView'
import { useMemo } from 'react'

interface ResourceViewProps {
  resource: Resource
}

export default function ResourceView({ resource }: ResourceViewProps) {
  // Parse markdown-style links and URLs - must be called before early returns
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
