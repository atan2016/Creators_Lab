'use client'

import { useCallback, useState, type CSSProperties } from 'react'

const btnStyle: CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'var(--yellow-400)',
  textDecoration: 'underline',
  fontWeight: 500,
  cursor: 'pointer',
  padding: 0,
  fontSize: '0.9rem',
}

type Props = {
  mode: 'description' | 'details'
  panelId: string
  previewId?: string
}

/**
 * Toggles a sibling panel by id (homepage program cards). Uses React onClick so
 * behavior does not depend on document delegation or Text-node click targets.
 */
export default function ProgramExpandButton({ mode, panelId, previewId }: Props) {
  const [open, setOpen] = useState(false)

  const onClick = useCallback(() => {
    setOpen((wasOpen) => {
      const next = !wasOpen
      const panel = document.getElementById(panelId)
      const preview = previewId ? document.getElementById(previewId) : null
      if (panel) {
        panel.style.display = next ? 'block' : 'none'
      }
      if (preview) {
        preview.classList.toggle('is-expanded', next)
      }
      return next
    })
  }, [panelId, previewId])

  const label =
    mode === 'description'
      ? open
        ? 'Hide Details ↑'
        : 'Show Details ↓'
      : open
        ? 'Hide Details ↑'
        : 'Show Detailed Curriculum ↓'

  return (
    <button type="button" onClick={onClick} style={btnStyle}>
      {label}
    </button>
  )
}
