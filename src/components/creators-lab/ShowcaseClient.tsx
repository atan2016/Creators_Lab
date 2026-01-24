'use client'

import { useEffect } from 'react'

export default function ShowcaseClient() {
  useEffect(() => {
    const filterButtons = document.querySelectorAll('.filter-btn')
    const projectCards = document.querySelectorAll('.project-card')

    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        filterButtons.forEach(btn => btn.classList.remove('active'))
        ;(this as HTMLElement).classList.add('active')

        const filter = (this as HTMLElement).getAttribute('data-filter')

        projectCards.forEach(card => {
          if (filter === 'all' || card.getAttribute('data-category') === filter) {
            ;(card as HTMLElement).style.display = 'block'
          } else {
            ;(card as HTMLElement).style.display = 'none'
          }
        })
      })
    })
  }, [])

  return null
}
