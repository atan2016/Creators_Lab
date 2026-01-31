'use client'

import { useEffect, useRef } from 'react'
import Script from 'next/script'
import { toggleDescription, toggleDetails } from './ToggleDetails'

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void
      render: (element: HTMLElement, options: { sitekey: string; theme?: string }) => number
      reset: (widgetId?: number) => void
      getResponse: (widgetId?: number) => string
    }
  }
}

export default function HomePageClient() {
  const recaptchaWidgetId = useRef<number | null>(null)

  useEffect(() => {
    // Load announcements
    loadAnnouncements()
    setupDonationModal()
    setupContactForm()
    checkDonationStatus()
    setupToggleButtons()
    initializeRecaptcha()
  }, [])

  function initializeRecaptcha() {
    if (typeof window !== 'undefined' && window.grecaptcha) {
      window.grecaptcha.ready(() => {
        const container = document.getElementById('recaptcha-container')
        if (container && !recaptchaWidgetId.current) {
          const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''
          if (siteKey) {
            try {
              recaptchaWidgetId.current = window.grecaptcha.render(container, {
                sitekey: siteKey,
                theme: 'light'
              })
            } catch (error: any) {
              console.error('reCAPTCHA initialization error:', error)
              // If the error is about invalid key type, it might be a v3 key
              if (error.message && error.message.includes('Invalid key type')) {
                console.error('⚠️ reCAPTCHA Error: The site key appears to be for reCAPTCHA v3, but this form uses v2.')
                console.error('Please create a new reCAPTCHA v2 key at https://www.google.com/recaptcha/admin')
                console.error('Select: reCAPTCHA v2 → "I\'m not a robot" Checkbox')
                container.innerHTML = '<p style="color: red; font-size: 0.875rem;">⚠️ reCAPTCHA configuration error. Please contact the site administrator.</p>'
              } else {
                container.innerHTML = '<p style="color: red; font-size: 0.875rem;">⚠️ reCAPTCHA failed to load. Please refresh the page.</p>'
              }
            }
          } else {
            console.warn('reCAPTCHA site key not found. Please set NEXT_PUBLIC_RECAPTCHA_SITE_KEY in your .env file')
          }
        }
      })
    }
  }

  function setupToggleButtons() {
    // Make functions available globally
    if (typeof window !== 'undefined') {
      (window as any).toggleDescription = toggleDescription
      ;(window as any).toggleDetails = toggleDetails
    }

    // Handle description toggles using event delegation
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      const button = target.closest('[data-toggle="description"]') as HTMLElement
      if (button) {
        const targetId = button.getAttribute('data-target')
        if (targetId) {
          toggleDescription(targetId)
        }
      }
    })

    // Handle details toggles using event delegation
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      const button = target.closest('[data-toggle="details"]') as HTMLElement
      if (button) {
        const targetId = button.getAttribute('data-target')
        if (targetId) {
          toggleDetails(targetId)
        }
      }
    })
  }

  function getRecaptchaToken(): string | null {
    if (typeof window === 'undefined' || !window.grecaptcha || recaptchaWidgetId.current === null) {
      return null
    }

    try {
      const response = window.grecaptcha.getResponse(recaptchaWidgetId.current)
      return response || null
    } catch (error) {
      console.error('reCAPTCHA token error:', error)
      return null
    }
  }

  function isUpcoming(eventDate: string) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const event = new Date(eventDate + 'T00:00:00')
    return event >= today
  }

  function loadAnnouncements() {
    const announcementsContainer = document.getElementById('announcements-container')
    if (!announcementsContainer) return

    fetch('/data/announcements.json?' + Date.now())
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok')
        return response.json()
      })
      .then(data => {
        if (!data || !Array.isArray(data) || data.length === 0) return

        const upcomingEvents = data.filter((item: any) => isUpcoming(item.date))

        if (upcomingEvents.length === 0) {
          announcementsContainer.style.display = 'none'
          return
        }

        // Group Spring 2026 programs together
        const spring2026Programs = upcomingEvents.filter((event: any) => event.group === 'spring2026')
        const otherUpcoming = upcomingEvents.filter((event: any) => event.group !== 'spring2026')

        announcementsContainer.style.display = 'block'
        let html = ''

        // Display shared message for Spring 2026 programs
        if (spring2026Programs.length > 0) {
          html += '<div style="background:#fefce8;border:2px solid var(--yellow-400);border-radius:12px;padding:1.5rem;margin-bottom:2rem">'
          html += `<p style="color:var(--green-900);font-size:1.1rem;line-height:1.8;margin:0 0 1rem;font-weight:500;text-align:center">🎉✨ We're excited to announce that these programs have been officially approved by the Millbrae Rec Center—and we're going live! ✨🎉</p>`
          html += '<p style="color:var(--green-900);font-size:1.1rem;line-height:1.8;margin:0 0 1rem;font-weight:500;text-align:center">📅 Mark your calendar: Space is limited, and registration opens March 6.<br>👉 Register at: <a href="https://bit.ly/milrec" style="color:var(--green-700);text-decoration:underline;font-weight:600">bit.ly/milrec</a></p>'
          html += `<p style="color:var(--green-900);font-size:1.1rem;line-height:1.8;margin:0 0 1rem;font-weight:500;text-align:center">Can't make this session? No worries—similar programs will be offered in June as part of our half-day Summer Camps, with more advanced Level II options available as well.</p>`
          html += `<p style="color:var(--green-900);font-size:1.1rem;line-height:1.8;margin:0;font-weight:500;text-align:center">We can't wait to get started! 🚀</p>`
          html += '</div>'
          
          html += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem;margin-bottom:2rem">'
          html += spring2026Programs.map((item: any) => `
            <div style="padding:0;background:#fff;border-radius:12px;border:2px solid var(--yellow-400);box-shadow:0 4px 12px rgba(0,0,0,0.08);overflow:hidden">
              ${item.image ? `<div style="width:100%;display:flex;align-items:center;justify-content:center;background:#f9fafb;padding:0"><img src="${item.image}" alt="${item.title}" style="width:100%;height:auto;object-fit:cover;display:block;cursor:pointer" title="Click to view details" /></div>` : ''}
            </div>
          `).join('')
          html += '</div>'
        }

        // Display other upcoming events
        if (otherUpcoming.length > 0) {
          html += otherUpcoming.map((item: any) => `
            <div style="padding:1.5rem;background:#fff;border-radius:12px;border:2px solid var(--yellow-400);margin-bottom:1rem;box-shadow:0 4px 12px rgba(0,0,0,0.08)">
              <div style="text-align:center;margin-bottom:1rem">
                <h2 style="margin:0 0 0.5rem;color:var(--green-700);font-size:1.5rem;font-weight:700">${item.title}</h2>
                ${item.subtitle ? `<h3 style="margin:0 0 0.5rem;color:var(--green-900);font-size:1.2rem;font-weight:600">${item.subtitle}</h3>` : ''}
                ${item.tagline ? `<p style="margin:0 0 1rem;color:var(--green-700);font-size:1rem;font-weight:500;font-style:italic">${item.tagline}</p>` : ''}
              </div>
              ${item.description ? `<div style="color:var(--muted);font-size:0.95rem;line-height:1.7;margin-bottom:1.5rem">${item.description}</div>` : ''}
              ${item.actionUrl ? `<div style="text-align:center">
                <a href="${item.actionUrl}" style="display:inline-block;padding:0.875rem 2rem;background:var(--green-700);color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:1rem;transition:background 0.3s ease">${item.action || 'Learn More'}</a>
              </div>` : ''}
            </div>
          `).join('')
        }

        html += `
          <div style="text-align:center;margin-top:1rem;padding-top:1rem;border-top:1px solid rgba(4,120,87,0.1)">
            <a href="/events" style="color:var(--green-700);text-decoration:underline;font-weight:500">View All Events →</a>
          </div>
        `

        announcementsContainer.innerHTML = html
      })
      .catch(error => {
        console.error('Error loading announcements:', error)
      })
  }

  function setupDonationModal() {
    let selectedAmount: number | null = null

    const donationModal = document.getElementById('donationModal')
    const donateBtn = document.getElementById('donateBtn')
    const closeDonationModal = document.getElementById('closeDonationModal')
    const proceedDonation = document.getElementById('proceedDonation') as HTMLButtonElement
    const customAmountInput = document.getElementById('customAmount') as HTMLInputElement
    const donationAmountBtns = document.querySelectorAll('.donation-amount-btn')

    if (donateBtn) {
      donateBtn.addEventListener('click', () => {
        if (donationModal) {
          donationModal.style.display = 'flex'
          document.body.style.overflow = 'hidden'
        }
      })
    }

    function closeModal() {
      if (donationModal) {
        donationModal.style.display = 'none'
        document.body.style.overflow = ''
        selectedAmount = null
        if (customAmountInput) customAmountInput.value = ''
        if (proceedDonation) proceedDonation.disabled = true
        donationAmountBtns.forEach(btn => {
          const b = btn as HTMLElement
          b.style.background = '#fff'
          b.style.color = 'var(--green-700)'
        })
      }
    }

    if (closeDonationModal) {
      closeDonationModal.addEventListener('click', closeModal)
    }

    if (donationModal) {
      donationModal.addEventListener('click', (e) => {
        if (e.target === donationModal) closeModal()
      })
    }

    donationAmountBtns.forEach(btn => {
      btn.addEventListener('click', function(this: HTMLElement) {
        selectedAmount = parseFloat(this.dataset.amount || '0')
        if (customAmountInput) customAmountInput.value = ''
        if (proceedDonation) proceedDonation.disabled = false

        donationAmountBtns.forEach(b => {
          const be = b as HTMLElement
          be.style.background = '#fff'
          be.style.color = 'var(--green-700)'
        })
        const be = this as HTMLElement
        be.style.background = 'var(--green-700)'
        be.style.color = '#fff'
      })
    })

    if (customAmountInput) {
      customAmountInput.addEventListener('input', function() {
        const value = parseFloat(this.value)
        if (value && value > 0) {
          selectedAmount = value
          if (proceedDonation) proceedDonation.disabled = false
          donationAmountBtns.forEach(btn => {
            const b = btn as HTMLElement
            b.style.background = '#fff'
            b.style.color = 'var(--green-700)'
          })
        } else {
          selectedAmount = null
          if (proceedDonation) proceedDonation.disabled = true
        }
      })
    }

    if (proceedDonation) {
      proceedDonation.addEventListener('click', async function() {
        if (!selectedAmount || selectedAmount <= 0) {
          alert('Please select or enter a donation amount')
          return
        }

        const btn = this as HTMLButtonElement
        btn.disabled = true
        btn.textContent = 'Processing...'

        try {
          const response = await fetch('/api/create-checkout-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: selectedAmount, currency: 'usd' })
          })

          const contentType = response.headers.get('content-type')
          if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text()
            console.error('Non-JSON response:', text.substring(0, 200))
            throw new Error(`Server returned ${response.status}: ${response.statusText}`)
          }

          const data = await response.json()

          if (response.ok && data.url) {
            window.location.href = data.url
          } else {
            throw new Error(data.error || 'Failed to create checkout session')
          }
        } catch (error: any) {
          console.error('Donation error:', error)
          alert('There was an error processing your donation. ' + (error.message || 'Please try again or contact us at info@creatorslab.com'))
          btn.disabled = false
          btn.textContent = 'Proceed to Payment'
        }
      })
    }
  }

  function setupContactForm() {
    const contactForm = document.getElementById('contactForm') as HTMLFormElement
    if (!contactForm) return

    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault()

      const name = (document.getElementById('name') as HTMLInputElement)?.value
      const email = (document.getElementById('email') as HTMLInputElement)?.value
      const category = (document.getElementById('category') as HTMLSelectElement)?.value
      const message = (document.getElementById('message') as HTMLTextAreaElement)?.value

      if (!name || !email || !category || !message) {
        alert('Please fill in all fields.')
        return
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        alert('❌ Please enter a valid email address.')
        return
      }

      // Verify reCAPTCHA
      const recaptchaToken = getRecaptchaToken()
      if (!recaptchaToken) {
        alert('❌ Please complete the reCAPTCHA verification.')
        return
      }

      try {
        const response = await fetch('https://formspree.io/f/xrbyadrb', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            email,
            category,
            message,
            'g-recaptcha-response': recaptchaToken,
            subject: `Contact Form Submission from ${name} - ${category}`,
            _replyto: email,
            _subject: `New message from ${name} - ${category} - CreatorsLab Contact Form`
          })
        })

        if (response.ok) {
          contactForm.reset()
          // Reset reCAPTCHA
          if (recaptchaWidgetId.current !== null && window.grecaptcha) {
            window.grecaptcha.reset(recaptchaWidgetId.current)
          }
          alert('✅ Thank you for your message! We\'ll get back to you soon.')
        } else {
          alert('❌ There was an error sending your message. Please try again or email us directly at info@creatorslab.com')
        }
      } catch (error) {
        console.error('Form submission error:', error)
        alert('❌ There was an error sending your message. Please try again or email us directly at info@creatorslab.com')
      }
    })
  }

  function checkDonationStatus() {
    const urlParams = new URLSearchParams(window.location.search)
    const donationStatus = urlParams.get('donation')
    const donationSuccessModal = document.getElementById('donationSuccessModal')

    if (donationStatus === 'success' && donationSuccessModal) {
      donationSuccessModal.style.display = 'flex'
      document.body.style.overflow = 'hidden'
      window.history.replaceState({}, document.title, window.location.pathname)
    } else if (donationStatus === 'cancelled') {
      window.history.replaceState({}, document.title, window.location.pathname)
    }

    // Setup success modal close handlers
    const closeSuccessModal = document.getElementById('closeSuccessModal')
    const closeSuccessModalBtn = document.getElementById('closeSuccessModalBtn')

    function closeSuccessModalFunc() {
      if (donationSuccessModal) {
        donationSuccessModal.style.display = 'none'
        document.body.style.overflow = ''
      }
    }

    if (closeSuccessModal) {
      closeSuccessModal.addEventListener('click', closeSuccessModalFunc)
    }

    if (closeSuccessModalBtn) {
      closeSuccessModalBtn.addEventListener('click', closeSuccessModalFunc)
    }

    if (donationSuccessModal) {
      donationSuccessModal.addEventListener('click', (e) => {
        if (e.target === donationSuccessModal) closeSuccessModalFunc()
      })
    }
  }

  return (
    <>
      <Script src="https://cdn.jsdelivr.net/npm/fuse.js@7.0.0" strategy="lazyOnload" />
      <Script src="/search.js" strategy="lazyOnload" />
      <Script
        src="https://www.google.com/recaptcha/api.js"
        strategy="lazyOnload"
        onLoad={() => {
          // Re-initialize reCAPTCHA after script loads
          setTimeout(() => {
            initializeRecaptcha()
          }, 100)
        }}
      />
      <div id="announcements-container" style={{ display: 'none' }} />
    </>
  )
}
