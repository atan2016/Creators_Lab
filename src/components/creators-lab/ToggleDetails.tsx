'use client'

export function toggleDetails(detailsId: string) {
  if (typeof window === 'undefined') return
  
  const details = document.getElementById(detailsId)
  const button = details?.previousElementSibling as HTMLElement
  
  if (!details || !button) return
  
  if (details.style.display === 'none' || details.style.display === '') {
    details.style.display = 'block'
    button.textContent = 'Hide Details ↑'
  } else {
    details.style.display = 'none'
    button.textContent = 'Show Detailed Curriculum ↓'
  }
}

export function toggleDescription(descId: string) {
  if (typeof window === 'undefined') return
  
  const description = document.getElementById(descId)
  const button = description?.previousElementSibling as HTMLElement
  
  if (!description || !button) return
  
  if (description.style.display === 'none' || description.style.display === '') {
    description.style.display = 'block'
    button.textContent = 'Hide Details ↑'
  } else {
    description.style.display = 'none'
    button.textContent = 'Show Details ↓'
  }
}

// Make functions available globally for onclick handlers
if (typeof window !== 'undefined') {
  (window as any).toggleDetails = toggleDetails
  ;(window as any).toggleDescription = toggleDescription
}
