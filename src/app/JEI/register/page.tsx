'use client'

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import PageLayout from '@/components/creators-lab/PageLayout'
import { JEI_PROGRAMS, formatProgramOptionLabel } from '@/lib/jei-programs'

type ProgramSelectionMode = 'id' | 'slug'

type ProgramOption = {
  id?: string
  slug: string
  name: string
  dateLabel: string
  weeklyPrice: number
  optionLabel: string
  stripeUrl?: string | null
}

const STUDENT_AGE_MIN = 5
const STUDENT_AGE_MAX = 18
const STUDENT_AGE_OPTIONS = Array.from(
  { length: STUDENT_AGE_MAX - STUDENT_AGE_MIN + 1 },
  (_, i) => STUDENT_AGE_MIN + i
)

type SavedStudent = { id: string; firstName: string; lastName: string; age: number | null }

/** selection: '' = not chosen yet, 'new' = manual entry, else saved JeiParentStudent id */
type StudentSlotFields = {
  selection: string
  firstName: string
  lastName: string
  age: string
}

type ProgramBlock = {
  id: string
  /** Select value: program id (id mode) or slug (slug mode). */
  programValue: string
  students: StudentSlotFields[]
}

type SuccessBatchItem = {
  registrationId: string
  programName: string | null
  studentCount: number
  totalAmountCents: number
  /** Opens /JEI/pay → Stripe Checkout with the correct total for all students. */
  paymentUrl: string | null
}

const inputClass = 'form-input'

function parseStudentAge(value: string): number | null {
  const n = Number(value)
  if (!Number.isInteger(n) || n < STUDENT_AGE_MIN || n > STUDENT_AGE_MAX) return null
  return n
}

const emptyStudent = (): StudentSlotFields => ({
  selection: '',
  firstName: '',
  lastName: '',
  age: '',
})

function createProgramBlock(): ProgramBlock {
  return {
    id: `blk_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
    programValue: '',
    students: [emptyStudent()],
  }
}

function JeiRegisterPageContent() {
  const searchParams = useSearchParams()
  const presetSlug = searchParams.get('program')

  const [programs, setPrograms] = useState<ProgramOption[]>([])
  const [programSelection, setProgramSelection] = useState<ProgramSelectionMode>('id')
  const [loadingPrograms, setLoadingPrograms] = useState(true)
  const [loadWarning, setLoadWarning] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [successBatch, setSuccessBatch] = useState<{
    items: SuccessBatchItem[]
    grandTotalCents: number
  } | null>(null)
  /** Legacy single-program success (API without programGroups). */
  const [legacySuccess, setLegacySuccess] = useState<{
    paymentUrl: string | null
    programName: string
    dateLabel: string
    weeklyPrice: number
    studentCount: number
    total: number
  } | null>(null)

  const [parentFirstName, setParentFirstName] = useState('')
  const [parentLastName, setParentLastName] = useState('')
  const [parentEmail, setParentEmail] = useState('')
  const [parentPhone, setParentPhone] = useState('')
  const [emergencyPhone, setEmergencyPhone] = useState('')
  const [authorizedPickupName, setAuthorizedPickupName] = useState('')
  const [authorizedPickupPhone, setAuthorizedPickupPhone] = useState('')
  const [authorizedPickupRelation, setAuthorizedPickupRelation] = useState('')
  const [programBlocks, setProgramBlocks] = useState<ProgramBlock[]>(() => [createProgramBlock()])
  const [savedStudents, setSavedStudents] = useState<SavedStudent[]>([])
  const [loadingSavedStudents, setLoadingSavedStudents] = useState(false)

  const presetFromSeed = useMemo(
    () => (presetSlug ? JEI_PROGRAMS.find((p) => p.slug === presetSlug) : undefined),
    [presetSlug]
  )

  const resolveSlugFromValue = useCallback(
    (programValue: string): string | null => {
      if (!programValue) return null
      const p = programs.find((x) =>
        programSelection === 'id' ? x.id === programValue : x.slug === programValue
      )
      return p?.slug ?? null
    },
    [programs, programSelection]
  )

  const getProgramOptionForValue = useCallback(
    (programValue: string): ProgramOption | null => {
      if (!programValue) return null
      return (
        programs.find((x) =>
          programSelection === 'id' ? x.id === programValue : x.slug === programValue
        ) ?? null
      )
    },
    [programs, programSelection]
  )

  useEffect(() => {
    const loadPrograms = async () => {
      setLoadWarning('')
      try {
        const response = await fetch('/api/jei/programs')
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.error || 'Failed to load programs')
        }
        const mode: ProgramSelectionMode = data.programSelection === 'slug' ? 'slug' : 'id'
        setProgramSelection(mode)
        setPrograms(data.programs || [])
        if (data.usedStaticFallback) {
          setLoadWarning(
            'Program list is showing the published schedule (database unavailable). You can still complete the form; registration is saved when the database is reachable.'
          )
        }
      } catch {
        const fallback: ProgramOption[] = JEI_PROGRAMS.map((p) => ({
          slug: p.slug,
          name: p.name,
          dateLabel: p.dateLabel,
          weeklyPrice: p.weeklyPrice,
          optionLabel: formatProgramOptionLabel(p),
          stripeUrl: p.stripeUrl,
        }))
        setPrograms(fallback)
        setProgramSelection('slug')
        setLoadWarning('Could not reach the server for programs. Using the schedule below; try again if registration fails.')
      } finally {
        setLoadingPrograms(false)
      }
    }
    loadPrograms()
  }, [])

  useEffect(() => {
    if (!presetSlug || programs.length === 0) return
    const match = programs.find((p) => p.slug === presetSlug)
    if (!match) return
    setProgramBlocks((blocks) => {
      if (!blocks.length) return blocks
      if (blocks[0].programValue) return blocks
      const v = programSelection === 'id' && match.id ? match.id : presetSlug
      return [{ ...blocks[0], programValue: v }, ...blocks.slice(1)]
    })
  }, [presetSlug, programs, programSelection])

  useEffect(() => {
    const email = parentEmail.trim().toLowerCase()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setSavedStudents([])
      return
    }
    let cancelled = false
    setLoadingSavedStudents(true)
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/jei/parent-students?email=${encodeURIComponent(email)}`)
        const data = await res.json()
        if (!cancelled && res.ok && Array.isArray(data.students)) {
          setSavedStudents(data.students)
        } else if (!cancelled) {
          setSavedStudents([])
        }
      } catch {
        if (!cancelled) setSavedStudents([])
      } finally {
        if (!cancelled) setLoadingSavedStudents(false)
      }
    }, 450)
    return () => {
      cancelled = true
      clearTimeout(t)
    }
  }, [parentEmail])

  useEffect(() => {
    setProgramBlocks((prev) =>
      prev.map((b) => ({
        ...b,
        students: b.students.map((row) => {
          if (row.selection !== 'new' && row.selection !== '' && row.selection) {
            const ok = savedStudents.some((s) => s.id === row.selection)
            if (!ok) {
              return { selection: 'new', firstName: '', lastName: '', age: '' }
            }
          }
          return row
        }),
      }))
    )
  }, [savedStudents])

  const submissionProgramGroups = useMemo(() => {
    const groups: {
      programSlug: string
      students: (
        | { savedStudentId: string; age: number }
        | { firstName: string; lastName: string; age: number }
      )[]
    }[] = []
    for (const block of programBlocks) {
      const slug = resolveSlugFromValue(block.programValue)
      const students: (
        | { savedStudentId: string; age: number }
        | { firstName: string; lastName: string; age: number }
      )[] = []
      for (const s of block.students) {
        if (s.selection === '') continue
        if (s.selection === 'new') {
          const age = parseStudentAge(s.age)
          const f = s.firstName.trim()
          const l = s.lastName.trim()
          if (!f || !l || age === null) continue
          students.push({ firstName: f, lastName: l, age })
        } else {
          const age = parseStudentAge(s.age)
          if (age === null) continue
          students.push({ savedStudentId: s.selection, age })
        }
      }
      if (!slug || students.length === 0) continue
      groups.push({ programSlug: slug, students })
    }
    return groups
  }, [programBlocks, resolveSlugFromValue])

  /** Ensures extra program rows are not half-filled and then silently ignored. */
  const validateProgramBlocks = useCallback((): string | null => {
    for (let i = 0; i < programBlocks.length; i++) {
      const block = programBlocks[i]
      const slug = resolveSlugFromValue(block.programValue)
      let completeCount = 0
      for (let j = 0; j < block.students.length; j++) {
        const s = block.students[j]
        if (s.selection === '') {
          const touched = s.firstName.trim() || s.lastName.trim() || s.age
          if (touched) {
            return `Program ${i + 1}, student ${j + 1}: choose a saved student or “+ Add new child”.`
          }
          continue
        }
        if (s.selection === 'new') {
          const f = s.firstName.trim()
          const l = s.lastName.trim()
          const age = parseStudentAge(s.age)
          if ((f || l) && (!f || !l)) {
            return `Program ${i + 1}, student ${j + 1}: enter both first and last name, or pick a saved student.`
          }
          if (f && l && age === null) {
            return `Program ${i + 1}, student ${j + 1}: select an age (${STUDENT_AGE_MIN}–${STUDENT_AGE_MAX}).`
          }
          if (f && l && age !== null) completeCount += 1
          continue
        }
        const age = parseStudentAge(s.age)
        if (age === null) {
          return `Program ${i + 1}, student ${j + 1}: select an age (${STUDENT_AGE_MIN}–${STUDENT_AGE_MAX}).`
        }
        completeCount += 1
      }
      if (slug && completeCount === 0) {
        return `Program ${i + 1}: add at least one student for the program you selected, or remove that program block.`
      }
      if (!slug && completeCount > 0) {
        return `Program ${i + 1}: select which program these students are attending.`
      }
    }
    return null
  }, [programBlocks, resolveSlugFromValue])

  const estimatedGrandTotal = useMemo(() => {
    let sum = 0
    let count = 0
    for (const block of programBlocks) {
      const opt = getProgramOptionForValue(block.programValue)
      if (!opt) continue
      let n = 0
      for (const s of block.students) {
        if (s.selection === 'new') {
          if (
            s.firstName.trim() &&
            s.lastName.trim() &&
            parseStudentAge(s.age) !== null
          ) {
            n += 1
          }
        } else if (s.selection !== '') {
          if (parseStudentAge(s.age) !== null) n += 1
        }
      }
      sum += opt.weeklyPrice * n
      count += n
    }
    return { dollars: sum, studentCount: count }
  }, [programBlocks, getProgramOptionForValue])

  const updateBlockProgram = (blockId: string, programValue: string) => {
    setProgramBlocks((prev) =>
      prev.map((b) => (b.id === blockId ? { ...b, programValue } : b))
    )
  }

  const updateBlockStudent = (
    blockId: string,
    studentIndex: number,
    field: keyof StudentSlotFields,
    value: string
  ) => {
    setProgramBlocks((prev) =>
      prev.map((b) => {
        if (b.id !== blockId) return b
        const nextStudents = b.students.map((row, i) =>
          i === studentIndex ? { ...row, [field]: value } : row
        )
        return { ...b, students: nextStudents }
      })
    )
  }

  const setStudentSlotSelection = (blockId: string, studentIndex: number, value: string) => {
    setProgramBlocks((prev) =>
      prev.map((b) => {
        if (b.id !== blockId) return b
        const nextStudents = b.students.map((row, i) => {
          if (i !== studentIndex) return row
          if (value === '') {
            return { selection: '', firstName: '', lastName: '', age: '' }
          }
          if (value === 'new') {
            return { selection: 'new', firstName: '', lastName: '', age: '' }
          }
          const saved = savedStudents.find((x) => x.id === value)
          if (saved) {
            return {
              selection: value,
              firstName: saved.firstName,
              lastName: saved.lastName,
              age: saved.age != null ? String(saved.age) : '',
            }
          }
          return { ...row, selection: value }
        })
        return { ...b, students: nextStudents }
      })
    )
  }

  const addStudentToBlock = (blockId: string) => {
    setProgramBlocks((prev) =>
      prev.map((b) => (b.id === blockId ? { ...b, students: [...b.students, emptyStudent()] } : b))
    )
  }

  const removeStudentFromBlock = (blockId: string, studentIndex: number) => {
    setProgramBlocks((prev) =>
      prev.map((b) => {
        if (b.id !== blockId) return b
        if (b.students.length === 1) return b
        return {
          ...b,
          students: b.students.filter((_, i) => i !== studentIndex),
        }
      })
    )
  }

  const addProgramBlock = () => setProgramBlocks((prev) => [...prev, createProgramBlock()])

  const removeProgramBlock = (blockId: string) => {
    setProgramBlocks((prev) => (prev.length === 1 ? prev : prev.filter((b) => b.id !== blockId)))
  }

  const submitRegistration = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSuccessBatch(null)
    setLegacySuccess(null)
    setSubmitting(true)
    try {
      const blockError = validateProgramBlocks()
      if (blockError) throw new Error(blockError)
      if (submissionProgramGroups.length === 0) {
        throw new Error(
          'Choose at least one program and add at least one student (saved child or new, with age) for each program.'
        )
      }

      const response = await fetch('/api/jei/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentFirstName,
          parentLastName,
          parentEmail,
          parentPhone,
          emergencyPhone,
          authorizedPickupName,
          authorizedPickupPhone,
          authorizedPickupRelation,
          programGroups: submissionProgramGroups,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        const base = data.error || 'Failed to submit registration'
        const debug =
          process.env.NODE_ENV === 'development' && typeof data.debug === 'string' ? ` — ${data.debug}` : ''
        throw new Error(base + debug)
      }

      setSuccess(data.message || 'Registration submitted successfully.')

      if (Array.isArray(data.programGroups) && data.programGroups.length > 0) {
        setSuccessBatch({
          items: data.programGroups.map((g: SuccessBatchItem & { programSlug?: string; stripeUrl?: string | null }) => ({
            registrationId: g.registrationId,
            programName: g.programName,
            studentCount: g.studentCount,
            totalAmountCents: g.totalAmountCents,
            paymentUrl: g.paymentUrl ?? g.stripeUrl ?? null,
          })),
          grandTotalCents: data.grandTotalCents ?? 0,
        })
        setLegacySuccess(null)
      } else if (data.registrationId) {
        const opt = getProgramOptionForValue(programBlocks[0]?.programValue ?? '')
        setLegacySuccess({
          paymentUrl: data.paymentUrl ?? data.stripeUrl ?? null,
          programName: opt?.name ?? 'Program',
          dateLabel: opt?.dateLabel ?? '',
          weeklyPrice: opt?.weeklyPrice ?? 0,
          studentCount: submissionProgramGroups[0]?.students.length ?? 0,
          total: (opt?.weeklyPrice ?? 0) * (submissionProgramGroups[0]?.students.length ?? 0),
        })
        setSuccessBatch(null)
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed.')
    } finally {
      setSubmitting(false)
    }
  }

  const selectValueForProgram = (p: ProgramOption) =>
    programSelection === 'id' ? p.id ?? p.slug : p.slug

  const showSuccessModal = Boolean(success && (successBatch !== null || legacySuccess !== null))

  const closeSuccessModal = useCallback(() => {
    setSuccess('')
    setSuccessBatch(null)
    setLegacySuccess(null)
  }, [])

  useEffect(() => {
    if (!showSuccessModal) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSuccessModal()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [showSuccessModal, closeSuccessModal])

  return (
    <PageLayout>
      <>
      <section className="section">
        <div className="container">
          <div className="card" style={{ maxWidth: '960px', margin: '0 auto' }}>
            <h1 style={{ marginTop: 0, color: 'var(--green-700)' }}>JEI Registration</h1>

            {presetFromSeed && (
              <div
                style={{
                  marginBottom: '1.25rem',
                  padding: '0.85rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(4,120,87,0.25)',
                  background: '#f0fdf4',
                }}
              >
                <p className="muted" style={{ margin: 0, lineHeight: 1.55, color: 'var(--green-900)' }}>
                  Your link starts the first program as <strong>{presetFromSeed.name}</strong>. Add more programs with{' '}
                  <strong>Add another program</strong> if you are signing up for additional weeks or courses.
                </p>
              </div>
            )}

            {presetSlug && !presetFromSeed && (
              <div
                style={{
                  marginBottom: '1rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  background: '#fef3c7',
                  color: '#92400e',
                }}
              >
                We don&apos;t recognize program code <strong>{presetSlug}</strong> in the link. Choose programs from the lists below.
              </div>
            )}

            <p className="muted" style={{ lineHeight: 1.6 }}>
              Enter your email above first—children you&apos;ve registered before appear in each program&apos;s{' '}
              <strong>Student</strong> dropdown so you don&apos;t have to re-type them. You can still choose{' '}
              <strong>+ Add new child</strong> anytime. For each program, pick the camp or course and who is attending. Use{' '}
              <strong>Add another program</strong> for more weeks or courses on one form, then pay with each Stripe link.
            </p>
            <p className="muted" style={{ lineHeight: 1.6 }}>
              Cancellation policy: full refund up to 30 days before start date minus a 3% processing fee; within 30 days, credit
              only. Credit expires in 1 year. To cancel, please email{' '}
              <a href="mailto:info@creators-lab.org" style={{ color: 'var(--green-700)', fontWeight: 600 }}>
                info@creators-lab.org
              </a>
              .
            </p>

            {loadWarning && (
              <div
                style={{
                  background: '#fef9c3',
                  color: '#854d0e',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  lineHeight: 1.55,
                }}
              >
                {loadWarning}
              </div>
            )}

            {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}

            <form onSubmit={submitRegistration} style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <label htmlFor="jei-parent-first" style={{ fontWeight: 600, color: 'var(--green-900)', display: 'block' }}>
                    Parent First Name *
                  </label>
                  <input
                    id="jei-parent-first"
                    type="text"
                    className={inputClass}
                    autoComplete="given-name"
                    value={parentFirstName}
                    onChange={(e) => setParentFirstName(e.target.value)}
                    required
                    style={{ marginTop: '0.4rem' }}
                  />
                </div>
                <div>
                  <label htmlFor="jei-parent-last" style={{ fontWeight: 600, color: 'var(--green-900)', display: 'block' }}>
                    Parent Last Name *
                  </label>
                  <input
                    id="jei-parent-last"
                    type="text"
                    className={inputClass}
                    autoComplete="family-name"
                    value={parentLastName}
                    onChange={(e) => setParentLastName(e.target.value)}
                    required
                    style={{ marginTop: '0.4rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div>
                  <label htmlFor="jei-parent-email" style={{ fontWeight: 600, color: 'var(--green-900)', display: 'block' }}>
                    Parent Email *
                  </label>
                  <input
                    id="jei-parent-email"
                    type="email"
                    className={inputClass}
                    autoComplete="email"
                    value={parentEmail}
                    onChange={(e) => setParentEmail(e.target.value)}
                    required
                    style={{ marginTop: '0.4rem' }}
                  />
                </div>
                <div>
                  <label htmlFor="jei-parent-phone" style={{ fontWeight: 600, color: 'var(--green-900)', display: 'block' }}>
                    Parent Phone *
                  </label>
                  <input
                    id="jei-parent-phone"
                    type="tel"
                    className={inputClass}
                    autoComplete="tel"
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    required
                    style={{ marginTop: '0.4rem' }}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="jei-emergency-phone" style={{ fontWeight: 600, color: 'var(--green-900)', display: 'block' }}>
                  Emergency Phone *
                </label>
                <input
                  id="jei-emergency-phone"
                  type="tel"
                  className={inputClass}
                  autoComplete="tel"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  required
                  style={{ marginTop: '0.4rem' }}
                />
              </div>

              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
                <div style={{ fontWeight: 600, color: 'var(--green-900)', marginBottom: '0.5rem' }}>Programs &amp; students *</div>
                <p className="muted" style={{ margin: '0 0 0.5rem', fontSize: '0.95rem', lineHeight: 1.5 }}>
                  Each block is one program. Pick saved children (from your email) or add new, then add another block for a
                  different program.
                </p>
                {loadingSavedStudents && (
                  <p className="muted" style={{ margin: '0 0 1rem', fontSize: '0.9rem' }}>
                    Loading saved students for your email…
                  </p>
                )}
                {!loadingSavedStudents &&
                  parentEmail.includes('@') &&
                  savedStudents.length === 0 &&
                  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parentEmail.trim()) && (
                    <p className="muted" style={{ margin: '0 0 1rem', fontSize: '0.9rem' }}>
                      No saved children yet for this email—they will be saved after your first successful registration.
                    </p>
                  )}

                {programBlocks.map((block, blockIdx) => (
                  <div
                    key={block.id}
                    style={{
                      marginBottom: '1.5rem',
                      padding: '1rem',
                      borderRadius: '10px',
                      border: '1px solid rgba(4,120,87,0.15)',
                      background: '#fafefa',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.5rem',
                        marginBottom: '0.75rem',
                      }}
                    >
                      <span style={{ fontWeight: 700, color: 'var(--green-800)' }}>Program {blockIdx + 1}</span>
                      {programBlocks.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeProgramBlock(block.id)}
                          style={{ padding: '0.35rem 0.65rem', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.9rem' }}
                        >
                          Remove program
                        </button>
                      )}
                    </div>

                    <label htmlFor={`jei-program-${block.id}`} style={{ fontWeight: 600, color: 'var(--green-900)', display: 'block' }}>
                      Select program *
                    </label>
                    <select
                      id={`jei-program-${block.id}`}
                      className={inputClass}
                      value={block.programValue}
                      onChange={(e) => updateBlockProgram(block.id, e.target.value)}
                      disabled={loadingPrograms}
                      style={{ marginTop: '0.4rem', marginBottom: '1rem' }}
                    >
                      <option value="">{loadingPrograms ? 'Loading programs...' : 'Choose a program'}</option>
                      {programs.map((program) => (
                        <option key={program.slug} value={selectValueForProgram(program)}>
                          {program.optionLabel}
                        </option>
                      ))}
                    </select>

                    <div style={{ fontWeight: 600, color: 'var(--green-900)', marginBottom: '0.35rem' }}>Students in this program</div>
                    {block.students.map((student, idx) => {
                      const isNew = student.selection === 'new'
                      const isSaved =
                        student.selection !== '' && student.selection !== 'new'
                      return (
                        <div key={`${block.id}-s-${idx}`} style={{ marginBottom: '0.85rem' }}>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.35rem', color: 'var(--green-900)' }}>
                            Student {idx + 1}
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: '0.75rem',
                              alignItems: 'flex-end',
                            }}
                          >
                            <div style={{ flex: '1 1 200px', minWidth: 0 }}>
                              <label
                                htmlFor={`jei-${block.id}-st-${idx}-pick`}
                                style={{
                                  display: 'block',
                                  fontWeight: 600,
                                  color: 'var(--green-900)',
                                  fontSize: '0.85rem',
                                  marginBottom: '0.35rem',
                                }}
                              >
                                Student
                              </label>
                              <select
                                id={`jei-${block.id}-st-${idx}-pick`}
                                className={inputClass}
                                value={student.selection === '' ? '' : student.selection === 'new' ? 'new' : student.selection}
                                onChange={(e) => setStudentSlotSelection(block.id, idx, e.target.value)}
                                aria-label={`Student ${idx + 1} — saved or new`}
                              >
                                <option value="">Choose…</option>
                                <option value="new">+ Add new child</option>
                                {savedStudents.map((s) => (
                                  <option key={s.id} value={s.id}>
                                    {s.firstName} {s.lastName}
                                    {s.age != null ? ` · age ${s.age}` : ''}
                                  </option>
                                ))}
                              </select>
                            </div>
                            {isNew && (
                              <>
                                <div style={{ flex: '1 1 120px', minWidth: 0 }}>
                                  <label
                                    htmlFor={`jei-${block.id}-st-${idx}-f`}
                                    style={{
                                      display: 'block',
                                      fontWeight: 600,
                                      color: 'var(--green-900)',
                                      fontSize: '0.85rem',
                                      marginBottom: '0.35rem',
                                    }}
                                  >
                                    First name
                                  </label>
                                  <input
                                    id={`jei-${block.id}-st-${idx}-f`}
                                    type="text"
                                    className={inputClass}
                                    autoComplete="given-name"
                                    value={student.firstName}
                                    onChange={(e) => updateBlockStudent(block.id, idx, 'firstName', e.target.value)}
                                  />
                                </div>
                                <div style={{ flex: '1 1 120px', minWidth: 0 }}>
                                  <label
                                    htmlFor={`jei-${block.id}-st-${idx}-l`}
                                    style={{
                                      display: 'block',
                                      fontWeight: 600,
                                      color: 'var(--green-900)',
                                      fontSize: '0.85rem',
                                      marginBottom: '0.35rem',
                                    }}
                                  >
                                    Last name
                                  </label>
                                  <input
                                    id={`jei-${block.id}-st-${idx}-l`}
                                    type="text"
                                    className={inputClass}
                                    autoComplete="family-name"
                                    value={student.lastName}
                                    onChange={(e) => updateBlockStudent(block.id, idx, 'lastName', e.target.value)}
                                  />
                                </div>
                              </>
                            )}
                            {(isNew || isSaved) && (
                              <div style={{ flex: '0 0 auto', width: '5.75rem' }}>
                                <label
                                  htmlFor={`jei-${block.id}-st-${idx}-age`}
                                  style={{
                                    display: 'block',
                                    fontWeight: 600,
                                    color: 'var(--green-900)',
                                    fontSize: '0.85rem',
                                    marginBottom: '0.35rem',
                                  }}
                                >
                                  Age
                                </label>
                                <select
                                  id={`jei-${block.id}-st-${idx}-age`}
                                  className={inputClass}
                                  value={student.age}
                                  onChange={(e) => updateBlockStudent(block.id, idx, 'age', e.target.value)}
                                  aria-label={`Student ${idx + 1} age`}
                                >
                                  <option value="">—</option>
                                  {STUDENT_AGE_OPTIONS.map((ageOpt) => (
                                    <option key={ageOpt} value={String(ageOpt)}>
                                      {ageOpt}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={() => removeStudentFromBlock(block.id, idx)}
                              style={{
                                flexShrink: 0,
                                padding: '0.5rem 0.7rem',
                                borderRadius: '6px',
                                border: '1px solid #d1d5db',
                                marginBottom: '0.05rem',
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      )
                    })}
                    <button
                      type="button"
                      onClick={() => addStudentToBlock(block.id)}
                      style={{ padding: '0.5rem 0.8rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
                    >
                      Add student to this program
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addProgramBlock}
                  style={{
                    padding: '0.6rem 1rem',
                    borderRadius: '8px',
                    border: '2px dashed rgba(4,120,87,0.35)',
                    background: '#fff',
                    color: 'var(--green-800)',
                    fontWeight: 600,
                    width: '100%',
                  }}
                >
                  + Add another program
                </button>
              </div>

              <div style={{ border: '1px solid #d1fae5', background: '#ecfdf5', borderRadius: '8px', padding: '0.75rem' }}>
                <div style={{ color: 'var(--green-900)', fontWeight: 600 }}>Estimated total (all programs)</div>
                <div className="muted">
                  ${estimatedGrandTotal.dollars.toFixed(2)} ({estimatedGrandTotal.studentCount} student
                  {estimatedGrandTotal.studentCount === 1 ? '' : 's'} total)
                </div>
              </div>

              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
                <div style={{ fontWeight: 600, color: 'var(--green-900)', marginBottom: '0.35rem', lineHeight: 1.45 }}>
                  Other authorized pickup contact <span style={{ fontWeight: 500 }}>(optional)</span>
                </div>
                <p className="muted" style={{ margin: '0 0 0.75rem', fontSize: '0.95rem', lineHeight: 1.5 }}>
                  If someone other than the registered parent may pick up, enter their name and phone. Leave blank if only the
                  parent will pick up.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label htmlFor="jei-pickup-name" style={{ display: 'block', fontWeight: 600, color: 'var(--green-900)', fontSize: '0.9rem', marginBottom: '0.35rem' }}>
                      Name
                    </label>
                    <input
                      id="jei-pickup-name"
                      type="text"
                      className={inputClass}
                      placeholder="Full name"
                      value={authorizedPickupName}
                      onChange={(e) => setAuthorizedPickupName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="jei-pickup-phone" style={{ display: 'block', fontWeight: 600, color: 'var(--green-900)', fontSize: '0.9rem', marginBottom: '0.35rem' }}>
                      Phone
                    </label>
                    <input
                      id="jei-pickup-phone"
                      type="tel"
                      className={inputClass}
                      placeholder="Phone number"
                      value={authorizedPickupPhone}
                      onChange={(e) => setAuthorizedPickupPhone(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="jei-pickup-relation" style={{ display: 'block', fontWeight: 600, color: 'var(--green-900)', fontSize: '0.9rem', marginBottom: '0.35rem' }}>
                      Relation (optional)
                    </label>
                    <input
                      id="jei-pickup-relation"
                      type="text"
                      className={inputClass}
                      placeholder="e.g. grandparent, nanny"
                      value={authorizedPickupRelation}
                      onChange={(e) => setAuthorizedPickupRelation(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <button type="submit" disabled={submitting} style={{ padding: '0.8rem 1.2rem', borderRadius: '8px', border: 'none', background: 'var(--green-700)', color: '#fff', fontWeight: 600 }}>
                  {submitting ? 'Submitting...' : 'Submit Registration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {showSuccessModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="jei-success-modal-title"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            backgroundColor: 'rgba(15, 23, 42, 0.55)',
          }}
          onClick={closeSuccessModal}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '34rem',
              maxHeight: 'min(90vh, 640px)',
              overflow: 'auto',
              borderRadius: '12px',
              border: '1px solid rgba(22, 101, 52, 0.35)',
              background: '#ecfdf5',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
              color: '#166534',
              padding: '1.25rem 1.35rem',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '0.75rem',
                marginBottom: '0.75rem',
              }}
            >
              <h2
                id="jei-success-modal-title"
                style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: 'var(--green-800)' }}
              >
                Registration saved
              </h2>
              <button
                type="button"
                onClick={closeSuccessModal}
                aria-label="Close"
                style={{
                  flexShrink: 0,
                  width: '2.25rem',
                  height: '2.25rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(22, 101, 52, 0.35)',
                  background: '#fff',
                  color: 'var(--green-900)',
                  fontSize: '1.25rem',
                  lineHeight: 1,
                  cursor: 'pointer',
                }}
              >
                ×
              </button>
            </div>
            <p style={{ margin: '0 0 1rem', lineHeight: 1.55 }}>{success}</p>
            <p className="muted" style={{ margin: '0 0 1rem', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Have a promotion or coupon code? Enter it on the Stripe checkout page after you open the payment link.
            </p>

            {successBatch && (
              <div style={{ borderTop: '1px solid rgba(22, 101, 52, 0.25)', paddingTop: '0.85rem' }}>
                <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Your registrations</div>
                {successBatch.items.map((item, i) => (
                  <div
                    key={item.registrationId}
                    style={{
                      marginBottom: '1rem',
                      paddingBottom: '1rem',
                      borderBottom: i < successBatch.items.length - 1 ? '1px solid rgba(22, 101, 52, 0.2)' : undefined,
                    }}
                  >
                    <div style={{ lineHeight: 1.5 }}>
                      <strong>{item.programName ?? 'Program'}</strong> — {item.studentCount} student
                      {item.studentCount === 1 ? '' : 's'} — ${(item.totalAmountCents / 100).toFixed(2)}
                    </div>
                    <div className="muted" style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>
                      Registration ID: {item.registrationId}
                    </div>
                    {item.paymentUrl ? (
                      <a
                        href={item.paymentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-block',
                          marginTop: '0.5rem',
                          padding: '0.6rem 1rem',
                          borderRadius: '8px',
                          background: 'var(--green-700)',
                          color: '#fff',
                          textDecoration: 'none',
                          fontWeight: 600,
                        }}
                      >
                        Pay this program with Stripe
                      </a>
                    ) : (
                      <p style={{ margin: '0.5rem 0 0', fontSize: '0.95rem' }}>
                        No payment link for this line — email{' '}
                        <a href="mailto:info@creators-lab.org" style={{ color: 'var(--green-900)', fontWeight: 600 }}>
                          info@creators-lab.org
                        </a>
                      </p>
                    )}
                  </div>
                ))}
                <div style={{ fontWeight: 700, marginTop: '0.5rem' }}>
                  Combined estimated total: ${(successBatch.grandTotalCents / 100).toFixed(2)}
                </div>
              </div>
            )}

            {legacySuccess && !successBatch && (
              <div style={{ borderTop: '1px solid rgba(22, 101, 52, 0.25)', paddingTop: '0.85rem', color: '#14532d' }}>
                <div style={{ fontWeight: 700, marginBottom: '0.35rem' }}>Your registration</div>
                <div style={{ lineHeight: 1.5 }}>
                  <strong>Program:</strong> {legacySuccess.programName}
                </div>
                <div style={{ lineHeight: 1.5 }}>
                  <strong>Dates:</strong> {legacySuccess.dateLabel}
                </div>
                <div style={{ lineHeight: 1.5 }}>
                  <strong>Students:</strong> {legacySuccess.studentCount} — <strong>Estimated total:</strong> $
                  {legacySuccess.total.toFixed(2)}
                </div>
                {legacySuccess.paymentUrl ? (
                  <a
                    href={legacySuccess.paymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-block',
                      marginTop: '0.85rem',
                      padding: '0.75rem 1.1rem',
                      borderRadius: '8px',
                      background: 'var(--green-700)',
                      color: '#fff',
                      textDecoration: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Pay with Stripe
                  </a>
                ) : (
                  <p style={{ margin: '0.75rem 0 0', lineHeight: 1.5 }}>
                    Email{' '}
                    <a href="mailto:info@creators-lab.org" style={{ color: 'var(--green-900)', fontWeight: 600 }}>
                      info@creators-lab.org
                    </a>{' '}
                    for payment help.
                  </p>
                )}
              </div>
            )}

            <div style={{ marginTop: '1.15rem', paddingTop: '1rem', borderTop: '1px solid rgba(22, 101, 52, 0.2)' }}>
              <button
                type="button"
                onClick={closeSuccessModal}
                style={{
                  padding: '0.55rem 1.1rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(22, 101, 52, 0.45)',
                  background: '#fff',
                  color: 'var(--green-900)',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      </>
    </PageLayout>
  )
}

export default function JeiRegisterPage() {
  return (
    <Suspense fallback={<PageLayout><section className="section"><div className="container"><div className="card">Loading registration form...</div></div></section></PageLayout>}>
      <JeiRegisterPageContent />
    </Suspense>
  )
}
