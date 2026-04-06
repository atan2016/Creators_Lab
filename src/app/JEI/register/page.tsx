'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import PageLayout from '@/components/creators-lab/PageLayout'
import { JEI_PROGRAMS } from '@/lib/jei-programs'

type ProgramOption = {
  id: string
  slug: string
  name: string
  dateLabel: string
  weeklyPrice: number
  optionLabel: string
}

function JeiRegisterPageContent() {
  const searchParams = useSearchParams()
  const presetSlug = searchParams.get('program')

  const [programs, setPrograms] = useState<ProgramOption[]>([])
  const [loadingPrograms, setLoadingPrograms] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [cancelMsg, setCancelMsg] = useState('')
  const [cancelError, setCancelError] = useState('')
  const [sendingCancelLink, setSendingCancelLink] = useState(false)

  const [parentName, setParentName] = useState('')
  const [parentEmail, setParentEmail] = useState('')
  const [parentPhone, setParentPhone] = useState('')
  const [emergencyPhone, setEmergencyPhone] = useState('')
  const [authorizedPickupName, setAuthorizedPickupName] = useState('')
  const [authorizedPickupPhone, setAuthorizedPickupPhone] = useState('')
  const [authorizedPickupRelation, setAuthorizedPickupRelation] = useState('')
  const [updatesOnly, setUpdatesOnly] = useState(false)
  const [selectedProgramId, setSelectedProgramId] = useState('')
  const [students, setStudents] = useState<string[]>([''])
  const [cancelRegistrationId, setCancelRegistrationId] = useState('')
  const [cancelEmail, setCancelEmail] = useState('')

  useEffect(() => {
    const loadPrograms = async () => {
      try {
        const response = await fetch('/api/jei/programs')
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.error || 'Failed to load programs')
        }
        setPrograms(data.programs || [])
      } catch (err: any) {
        setError(err.message || 'Unable to load JEI programs.')
      } finally {
        setLoadingPrograms(false)
      }
    }
    loadPrograms()
  }, [])

  useEffect(() => {
    if (!presetSlug || programs.length === 0) return
    const match = programs.find((p) => p.slug === presetSlug)
    if (match) setSelectedProgramId(match.id)
  }, [presetSlug, programs])

  const cleanedStudents = useMemo(() => students.map((s) => s.trim()).filter(Boolean), [students])
  const selectedProgram = useMemo(
    () => programs.find((p) => p.id === selectedProgramId) || null,
    [programs, selectedProgramId]
  )
  const total = useMemo(() => {
    if (!selectedProgram || updatesOnly) return 0
    return selectedProgram.weeklyPrice * cleanedStudents.length
  }, [selectedProgram, cleanedStudents.length, updatesOnly])

  const updateStudent = (index: number, value: string) => {
    setStudents((prev) => prev.map((name, i) => (i === index ? value : name)))
  }

  const addStudent = () => setStudents((prev) => [...prev, ''])
  const removeStudent = (index: number) => {
    setStudents((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== index)))
  }

  const submitRegistration = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSubmitting(true)
    try {
      const response = await fetch('/api/jei/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentName,
          parentEmail,
          parentPhone,
          emergencyPhone,
          authorizedPickupName,
          authorizedPickupPhone,
          authorizedPickupRelation,
          studentNames: cleanedStudents,
          selectedProgramId: updatesOnly ? undefined : selectedProgramId,
          updatesOnly,
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to submit registration')

      setSuccess(data.message || 'Registration submitted successfully.')
    } catch (err: any) {
      setError(err.message || 'Registration failed.')
    } finally {
      setSubmitting(false)
    }
  }

  const requestCancelLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setCancelError('')
    setCancelMsg('')
    setSendingCancelLink(true)
    try {
      const response = await fetch('/api/jei/register/cancel-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registrationId: cancelRegistrationId,
          parentEmail: cancelEmail,
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to send cancellation link')
      setCancelMsg(data.message || 'Cancellation link sent.')
    } catch (err: any) {
      setCancelError(err.message || 'Failed to send cancellation link.')
    } finally {
      setSendingCancelLink(false)
    }
  }

  return (
    <PageLayout>
      <section className="section">
        <div className="container">
          <div className="card" style={{ maxWidth: '960px', margin: '0 auto' }}>
            <h1 style={{ marginTop: 0, color: 'var(--green-700)' }}>JEI Registration</h1>
            <p className="muted" style={{ lineHeight: 1.6 }}>
              Complete this form to register your child(ren) for one JEI program. We will review your registration and send an invoice/payment link by email.
            </p>
            <p className="muted" style={{ lineHeight: 1.6 }}>
              Cancellation policy: full refund up to 30 days before start date minus a 3% processing fee; within 30 days, credit only. Credit expires in 1 year.
            </p>

            {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}
            {success && <div style={{ background: '#dcfce7', color: '#166534', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>{success}</div>}

            <form onSubmit={submitRegistration} style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label style={{ fontWeight: 600, color: 'var(--green-900)' }}>Parent Name *</label>
                <input value={parentName} onChange={(e) => setParentName(e.target.value)} required style={{ marginTop: '0.4rem' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ fontWeight: 600, color: 'var(--green-900)' }}>Parent Email *</label>
                  <input type="email" value={parentEmail} onChange={(e) => setParentEmail(e.target.value)} required style={{ marginTop: '0.4rem' }} />
                </div>
                <div>
                  <label style={{ fontWeight: 600, color: 'var(--green-900)' }}>Parent Phone *</label>
                  <input value={parentPhone} onChange={(e) => setParentPhone(e.target.value)} required style={{ marginTop: '0.4rem' }} />
                </div>
              </div>

              <div>
                <label style={{ fontWeight: 600, color: 'var(--green-900)' }}>Emergency Phone *</label>
                <input value={emergencyPhone} onChange={(e) => setEmergencyPhone(e.target.value)} required style={{ marginTop: '0.4rem' }} />
              </div>

              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: 'var(--green-900)' }}>
                  <input type="checkbox" checked={updatesOnly} onChange={(e) => setUpdatesOnly(e.target.checked)} />
                  Register as member for program updates only (no program selection/payment)
                </label>
              </div>

              {!updatesOnly && (
                <>
                  <div>
                    <label style={{ fontWeight: 600, color: 'var(--green-900)' }}>Select Program *</label>
                    <select
                      value={selectedProgramId}
                      onChange={(e) => setSelectedProgramId(e.target.value)}
                      required
                      disabled={loadingPrograms}
                      style={{ marginTop: '0.4rem' }}
                    >
                      <option value="">{loadingPrograms ? 'Loading programs...' : 'Choose a program'}</option>
                      {programs.map((program) => (
                        <option key={program.id} value={program.id}>
                          {program.optionLabel}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--green-900)', marginBottom: '0.5rem' }}>Students *</div>
                    {students.map((student, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <input
                          placeholder={`Student ${idx + 1} Name`}
                          value={student}
                          onChange={(e) => updateStudent(idx, e.target.value)}
                          required={idx === 0}
                        />
                        <button type="button" onClick={() => removeStudent(idx)} style={{ padding: '0.4rem 0.7rem', borderRadius: '6px', border: '1px solid #d1d5db' }}>
                          Remove
                        </button>
                      </div>
                    ))}
                    <button type="button" onClick={addStudent} style={{ padding: '0.5rem 0.8rem', borderRadius: '6px', border: '1px solid #d1d5db' }}>
                      Add Student
                    </button>
                  </div>

                  <div style={{ border: '1px solid #d1fae5', background: '#ecfdf5', borderRadius: '8px', padding: '0.75rem' }}>
                    <div style={{ color: 'var(--green-900)', fontWeight: 600 }}>Estimated Total</div>
                    <div className="muted">${total.toFixed(2)} ({cleanedStudents.length} student{cleanedStudents.length === 1 ? '' : 's'})</div>
                  </div>
                </>
              )}

              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
                <div style={{ fontWeight: 600, color: 'var(--green-900)', marginBottom: '0.5rem' }}>Authorized Pickup Contact *</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                  <input placeholder="Name" value={authorizedPickupName} onChange={(e) => setAuthorizedPickupName(e.target.value)} required={!updatesOnly} />
                  <input placeholder="Phone" value={authorizedPickupPhone} onChange={(e) => setAuthorizedPickupPhone(e.target.value)} required={!updatesOnly} />
                  <input placeholder="Relation (optional)" value={authorizedPickupRelation} onChange={(e) => setAuthorizedPickupRelation(e.target.value)} />
                </div>
              </div>

              <div>
                <button type="submit" disabled={submitting} style={{ padding: '0.8rem 1.2rem', borderRadius: '8px', border: 'none', background: 'var(--green-700)', color: '#fff', fontWeight: 600 }}>
                  {submitting ? 'Submitting...' : 'Submit Registration'}
                </button>
              </div>
            </form>
          </div>

          <div className="card" style={{ maxWidth: '960px', margin: '1.5rem auto 0' }}>
            <h2 style={{ marginTop: 0, color: 'var(--green-700)' }}>Need to Cancel?</h2>
            <p className="muted">Request a secure cancellation link by entering your registration ID and parent email.</p>
            {cancelError && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>{cancelError}</div>}
            {cancelMsg && <div style={{ background: '#dcfce7', color: '#166534', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>{cancelMsg}</div>}
            <form onSubmit={requestCancelLink} style={{ display: 'grid', gap: '1rem', maxWidth: '540px' }}>
              <input
                placeholder="Registration ID"
                value={cancelRegistrationId}
                onChange={(e) => setCancelRegistrationId(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Parent Email"
                value={cancelEmail}
                onChange={(e) => setCancelEmail(e.target.value)}
                required
              />
              <button type="submit" disabled={sendingCancelLink} style={{ padding: '0.7rem 1rem', borderRadius: '8px', border: '1px solid #d1d5db', background: '#fff', fontWeight: 600 }}>
                {sendingCancelLink ? 'Sending...' : 'Send Cancellation Link'}
              </button>
            </form>
          </div>

          <div className="card" style={{ maxWidth: '960px', margin: '1.5rem auto 0' }}>
            <h2 style={{ marginTop: 0, color: 'var(--green-700)' }}>Program Details & Payment Links</h2>
            <p className="muted" style={{ marginTop: 0 }}>
              All current JEI program descriptions, dates, and direct payment links are listed below.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              {JEI_PROGRAMS.map((program) => (
                <div key={program.slug} style={{ border: '1px solid rgba(4,120,87,.12)', borderRadius: '10px', padding: '1rem', background: '#fff' }}>
                  <h3 style={{ marginTop: 0, marginBottom: '0.6rem', color: 'var(--green-700)', fontSize: '1.05rem' }}>
                    {program.name}
                  </h3>
                  <p className="muted" style={{ margin: '0 0 0.35rem' }}>
                    <strong>Date:</strong> {program.dateLabel}
                  </p>
                  <p className="muted" style={{ margin: '0 0 0.35rem' }}>
                    <strong>Price:</strong> ${program.weeklyPrice}/Week
                  </p>
                  {program.prerequisite && (
                    <p className="muted" style={{ margin: '0 0 0.35rem' }}>
                      <strong>Prerequisite:</strong> {program.prerequisite}
                    </p>
                  )}
                  <p className="muted" style={{ margin: '0 0 0.35rem', lineHeight: 1.55 }}>
                    {program.description}
                  </p>
                  {program.details && (
                    <p className="muted" style={{ margin: 0, lineHeight: 1.55 }}>
                      {program.details}
                    </p>
                  )}
                  <div style={{ marginTop: '0.8rem' }}>
                    <a
                      href={program.stripeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'inline-block', padding: '0.6rem 0.9rem', borderRadius: '8px', background: 'var(--green-700)', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}
                    >
                      Pay This Program
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
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
