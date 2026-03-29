'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type ClassroomOption = { id: string; name: string }

type SyllabusRow = {
  date: string
  activities: string
  prework: string | null
  lectureInfo: string | null
}

type TemplateSource = {
  id: string
  name: string
  description: string | null
  googleDriveUrl: string | null
  syllabus: SyllabusRow[]
  resourceCount: number
  scheduleCount: number
}

type Instructor = { id: string; name: string; email: string; role: string }

function toInputDate(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toISOString().slice(0, 10)
}

export default function DuplicateClassroomPanel() {
  const [classrooms, setClassrooms] = useState<ClassroomOption[]>([])
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [sourceId, setSourceId] = useState('')
  const [template, setTemplate] = useState<TemplateSource | null>(null)
  const [newName, setNewName] = useState('')
  const [creatorId, setCreatorId] = useState('')
  const [syllabusDates, setSyllabusDates] = useState<string[]>([])
  const [loadingList, setLoadingList] = useState(true)
  const [loadingTemplate, setLoadingTemplate] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState<{ id: string; name: string; inviteCode: string } | null>(
    null
  )

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [cRes, tRes, aRes] = await Promise.all([
          fetch('/api/classrooms'),
          fetch('/api/admin/users?role=TEACHER'),
          fetch('/api/admin/users?role=ADMIN'),
        ])
        const cData = await cRes.json()
        const tData = await tRes.json()
        const aData = await aRes.json()
        if (!cancelled && cData.classrooms) {
          setClassrooms(cData.classrooms.map((x: { id: string; name: string }) => ({ id: x.id, name: x.name })))
        }
        if (!cancelled) {
          const teachers = tData.users || []
          const admins = aData.users || []
          const byId = new Map<string, Instructor>()
          ;[...teachers, ...admins].forEach((u: Instructor) => byId.set(u.id, u))
          setInstructors(Array.from(byId.values()).sort((a, b) => a.name.localeCompare(b.name)))
        }
      } catch {
        if (!cancelled) setError('Failed to load classrooms or instructors')
      } finally {
        if (!cancelled) setLoadingList(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!sourceId) {
      setTemplate(null)
      setNewName('')
      setSyllabusDates([])
      setSuccess(null)
      return
    }
    let cancelled = false
    setLoadingTemplate(true)
    setError('')
    setSuccess(null)
    fetch(`/api/admin/classrooms/${sourceId}/duplicate`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return
        if (!data.source) {
          setError(data.error || 'Failed to load classroom')
          setTemplate(null)
          return
        }
        setTemplate(data.source)
        setNewName(`${data.source.name} (Copy)`)
        setSyllabusDates(data.source.syllabus.map((r: SyllabusRow) => toInputDate(r.date)))
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load classroom template')
      })
      .finally(() => {
        if (!cancelled) setLoadingTemplate(false)
      })
    return () => {
      cancelled = true
    }
  }, [sourceId])

  const updateSyllabusDate = (index: number, value: string) => {
    setSyllabusDates((prev) => {
      const next = [...prev]
      next[index] = value
      return next
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(null)
    if (!sourceId || !template) return
    if (!newName.trim()) {
      setError('Enter a name for the new classroom')
      return
    }
    if (!creatorId) {
      setError('Select an instructor')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch(`/api/admin/classrooms/${sourceId}/duplicate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName.trim(),
          creatorId,
          syllabusDates:
            template.syllabus.length > 0
              ? template.syllabus.map((_, i) => {
                  const d = syllabusDates[i]
                  return d ? `${d}T12:00:00.000Z` : null
                })
              : undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Duplicate failed')
        return
      }
      setSuccess(data.classroom)
      setSourceId('')
      setTemplate(null)
      setNewName('')
      setCreatorId('')
      setSyllabusDates([])
    } catch {
      setError('Request failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (loadingList) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-md mb-6 p-6">
        <p className="text-sm text-gray-500">Loading…</p>
      </div>
    )
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md mb-6">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Duplicate classroom</h3>
        <p className="mt-2 text-sm text-gray-500">
          Copy an existing classroom with a new name and instructor. Description, Document Drive link,
          syllabus content (with dates you set), course materials, and schedules are copied. Students,
          forum posts, and homework submissions are not copied.
        </p>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        {success && (
          <div className="mb-4 rounded-md bg-green-50 border border-green-200 text-green-800 px-4 py-3 text-sm">
            Created <strong>{success.name}</strong> (invite code <code>{success.inviteCode}</code>).
            <Link
              href={`/teacher/classrooms/${success.id}`}
              className="ml-2 text-green-700 underline font-medium"
            >
              Open classroom
            </Link>
          </div>
        )}
        {error && (
          <div className="mb-4 rounded-md bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4 max-w-3xl">
          <div>
            <label htmlFor="dup-source" className="block text-sm font-medium text-gray-700 mb-1">
              Classroom to copy
            </label>
            <select
              id="dup-source"
              value={sourceId}
              onChange={(e) => setSourceId(e.target.value)}
              className="block w-full max-w-md border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm"
            >
              <option value="">Select a classroom…</option>
              {classrooms.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {loadingTemplate && <p className="text-sm text-gray-500">Loading syllabus…</p>}

          {template && !loadingTemplate && (
            <>
              <p className="text-sm text-gray-600">
                Copying {template.resourceCount} resource(s) and {template.scheduleCount} schedule
                block(s). Schedules will be assigned to the new instructor you choose below.
              </p>
              <div>
                <label htmlFor="dup-name" className="block text-sm font-medium text-gray-700 mb-1">
                  New classroom name *
                </label>
                <input
                  id="dup-name"
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="block w-full max-w-md border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm"
                />
              </div>
              <div>
                <label htmlFor="dup-instructor" className="block text-sm font-medium text-gray-700 mb-1">
                  Instructor (classroom creator) *
                </label>
                <select
                  id="dup-instructor"
                  required
                  value={creatorId}
                  onChange={(e) => setCreatorId(e.target.value)}
                  className="block w-full max-w-md border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm"
                >
                  <option value="">Select instructor…</option>
                  {instructors.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.email}) — {u.role}
                    </option>
                  ))}
                </select>
              </div>

              {template.syllabus.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Syllabus dates</h4>
                  <p className="text-xs text-gray-500 mb-2">
                    Adjust session dates for the new offering. Activities and notes are unchanged.
                  </p>
                  <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-md divide-y divide-gray-100">
                    {template.syllabus.map((row, i) => (
                      <div key={i} className="flex flex-wrap items-center gap-3 px-3 py-2 text-sm">
                        <input
                          type="date"
                          value={syllabusDates[i] || ''}
                          onChange={(e) => updateSyllabusDate(i, e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1"
                        />
                        <span className="text-gray-600 line-clamp-1 flex-1 min-w-[12rem]">
                          {row.activities.slice(0, 80)}
                          {row.activities.length > 80 ? '…' : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
              >
                {submitting ? 'Creating…' : 'Create duplicate classroom'}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  )
}
