'use client'

import { useEffect } from 'react'

export default function ResourcesClient() {
  useEffect(() => {
    function loadNewsFeed() {
      const newsContainer = document.getElementById('news-container')
      
      if (!newsContainer) {
        console.error('News container not found')
        return
      }

      fetch('/news-feed.json?' + Date.now())
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok')
          }
          return response.text()
        })
        .then(data => {
          try {
            const trimmedData = data.trim()
            if (!trimmedData || trimmedData.startsWith('//') || trimmedData.startsWith('/*')) {
              newsContainer.innerHTML = '<div style="text-align:center;padding:2rem;color:var(--muted)">No news updates available at this time.</div>'
              return
            }

            const newsData = JSON.parse(data)
            
            if (!newsData || !Array.isArray(newsData) || newsData.length === 0) {
              newsContainer.innerHTML = '<div style="text-align:center;padding:2rem;color:var(--muted)">No news updates available at this time.</div>'
              return
            }

            newsContainer.innerHTML = newsData.map((item: any) => `
              <div style="border:1px solid rgba(4,120,87,.1);border-radius:8px;padding:1.5rem;background:#fff">
                <h3 style="margin:0 0 0.75rem;color:var(--green-700);font-size:1.1rem">
                  <a href="${item.url}" target="_blank" rel="noopener noreferrer" style="color:var(--green-700);text-decoration:none">${item.title}</a>
                </h3>
                <p style="margin:0 0 0.75rem;color:var(--muted);line-height:1.6">${item.description}</p>
                <div style="display:flex;justify-content:space-between;align-items:center">
                  <span style="color:var(--muted);font-size:0.9rem">Source: ${item.source}</span>
                  <a href="${item.url}" target="_blank" rel="noopener noreferrer" style="color:var(--yellow-400);text-decoration:none;font-weight:500">Read More →</a>
                </div>
              </div>
            `).join('')
          } catch (error) {
            console.error('Error parsing news data:', error)
            newsContainer.innerHTML = '<div style="text-align:center;padding:2rem;color:var(--muted)">Unable to load news feed at this time.</div>'
          }
        })
        .catch(error => {
          console.error('Error loading news feed:', error)
          newsContainer.innerHTML = '<div style="text-align:center;padding:2rem;color:var(--muted)">Unable to load news feed at this time.</div>'
        })
    }

    loadNewsFeed()
  }, [])

  return null
}
