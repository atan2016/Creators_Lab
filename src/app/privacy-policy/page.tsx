import PageLayout from '@/components/creators-lab/PageLayout'

export const metadata = {
  title: 'Privacy Policy — Creators Lab',
  description: 'Creators Lab privacy policy and data practices.',
}

export default function PrivacyPolicyPage() {
  return (
    <PageLayout>
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '56ch', margin: '0 auto 2rem' }}>
            <h1 style={{ color: 'var(--green-700)', fontSize: '2.5rem', marginBottom: '0.75rem' }}>Privacy Policy</h1>
            <p className="muted" style={{ fontSize: '1.05rem', lineHeight: 1.6 }}>
              Creators Lab (a DBA of Rokk Research LLC)
            </p>
            <p className="muted" style={{ marginTop: '0.5rem', fontSize: '0.95rem' }}>
              Effective Date: [Insert Date]
            </p>
          </div>

          <div className="card">
            <p className="muted" style={{ lineHeight: 1.7 }}>
              Creators Lab (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) respects your privacy and is committed to protecting the personal information of our students, parents, and website visitors. This Privacy Policy explains how we collect, use, and safeguard your information.
            </p>

            <h2 style={{ color: 'var(--green-700)', marginTop: 0 }}>1. Information We Collect</h2>
            <p className="muted" style={{ marginBottom: '0.5rem', lineHeight: 1.7 }}>We may collect the following types of information:</p>
            <p className="muted" style={{ marginBottom: '0.5rem' }}><strong>a. Personal Information</strong></p>
            <ul style={{ paddingLeft: '1.25rem', marginTop: 0, lineHeight: 1.7 }}>
              <li>Parent/guardian name</li>
              <li>Student name and age</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Billing and payment information</li>
              <li>Emergency contact details</li>
            </ul>
            <p className="muted" style={{ marginBottom: '0.5rem' }}><strong>b. Program Information</strong></p>
            <ul style={{ paddingLeft: '1.25rem', marginTop: 0, lineHeight: 1.7 }}>
              <li>Enrollment details</li>
              <li>Student interests, projects, or learning progress</li>
              <li>Photos or videos (only with consent)</li>
            </ul>
            <p className="muted" style={{ marginBottom: '0.5rem' }}><strong>c. Technical Information</strong></p>
            <ul style={{ paddingLeft: '1.25rem', marginTop: 0, lineHeight: 1.7 }}>
              <li>IP address</li>
              <li>Browser type and device</li>
              <li>Website usage data (via analytics tools)</li>
            </ul>

            <h2 style={{ color: 'var(--green-700)', marginTop: '1.5rem' }}>2. How We Use Information</h2>
            <p className="muted" style={{ marginBottom: '0.5rem', lineHeight: 1.7 }}>We use your information to:</p>
            <ul style={{ paddingLeft: '1.25rem', lineHeight: 1.7 }}>
              <li>Register students for programs</li>
              <li>Communicate about classes, schedules, and updates</li>
              <li>Process payments securely</li>
              <li>Improve our programs and curriculum</li>
              <li>Ensure student safety and appropriate placement</li>
              <li>Send occasional updates about new programs (you may opt out anytime)</li>
            </ul>

            <h2 style={{ color: 'var(--green-700)', marginTop: '1.5rem' }}>3. Payments</h2>
            <p className="muted" style={{ lineHeight: 1.7 }}>
              We use third-party payment processors (e.g., Stripe) to handle transactions.
              <br />
              We do not store full credit card information on our servers.
            </p>

            <h2 style={{ color: 'var(--green-700)', marginTop: '1.5rem' }}>4. Sharing of Information</h2>
            <p className="muted" style={{ lineHeight: 1.7 }}>
              We do not sell or rent your personal information.
            </p>
            <p className="muted" style={{ marginBottom: '0.5rem', lineHeight: 1.7 }}>We may share information with:</p>
            <ul style={{ paddingLeft: '1.25rem', lineHeight: 1.7 }}>
              <li>Service providers (payment processors, scheduling tools)</li>
              <li>Instructors (limited to what is necessary for teaching and safety)</li>
              <li>Legal authorities if required by law</li>
            </ul>

            <h2 style={{ color: 'var(--green-700)', marginTop: '1.5rem' }}>5. Children&apos;s Privacy</h2>
            <p className="muted" style={{ lineHeight: 1.7 }}>
              Creators Lab provides programs for minors under 18. We only collect personal information with parent or guardian consent.
              <br />
              <br />
              We comply with applicable child privacy laws, including the Children&apos;s Online Privacy Protection Act (COPPA).
            </p>
            <p className="muted" style={{ marginBottom: '0.5rem', lineHeight: 1.7 }}>Parents/guardians may:</p>
            <ul style={{ paddingLeft: '1.25rem', lineHeight: 1.7 }}>
              <li>Request access to their child&apos;s data</li>
              <li>Request deletion of their child&apos;s data</li>
            </ul>

            <h2 style={{ color: 'var(--green-700)', marginTop: '1.5rem' }}>6. Photos and Media</h2>
            <p className="muted" style={{ lineHeight: 1.7 }}>
              We may take photos or videos during classes for educational or promotional purposes.
            </p>
            <p className="muted" style={{ marginBottom: '0.5rem', lineHeight: 1.7 }}>We will:</p>
            <ul style={{ paddingLeft: '1.25rem', lineHeight: 1.7 }}>
              <li>Obtain consent before using identifiable images</li>
              <li>Allow parents to opt out at any time</li>
            </ul>

            <h2 style={{ color: 'var(--green-700)', marginTop: '1.5rem' }}>7. Data Security</h2>
            <p className="muted" style={{ marginBottom: '0.5rem', lineHeight: 1.7 }}>
              We take reasonable measures to protect your information, including:
            </p>
            <ul style={{ paddingLeft: '1.25rem', lineHeight: 1.7 }}>
              <li>Secure payment processing</li>
              <li>Limited access to personal data</li>
              <li>Use of trusted platforms and tools</li>
            </ul>
            <p className="muted" style={{ lineHeight: 1.7 }}>However, no system is 100% secure.</p>

            <h2 style={{ color: 'var(--green-700)', marginTop: '1.5rem' }}>8. Data Retention</h2>
            <p className="muted" style={{ lineHeight: 1.7 }}>
              We retain personal information only as long as necessary to:
            </p>
            <ul style={{ paddingLeft: '1.25rem', lineHeight: 1.7 }}>
              <li>Provide services</li>
              <li>Meet legal or accounting requirements</li>
            </ul>

            <h2 style={{ color: 'var(--green-700)', marginTop: '1.5rem' }}>9. Your Rights</h2>
            <p className="muted" style={{ marginBottom: '0.5rem', lineHeight: 1.7 }}>You may:</p>
            <ul style={{ paddingLeft: '1.25rem', lineHeight: 1.7 }}>
              <li>Request access to your data</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your data</li>
              <li>Opt out of marketing communications</li>
            </ul>
            <p className="muted" style={{ lineHeight: 1.7 }}>
              To make a request, contact us at:
              <br />
              <span role="img" aria-label="email">📧</span> [Insert Email Address]
            </p>

            <h2 style={{ color: 'var(--green-700)', marginTop: '1.5rem' }}>10. Third-Party Services</h2>
            <p className="muted" style={{ marginBottom: '0.5rem', lineHeight: 1.7 }}>
              Our website may use third-party tools such as:
            </p>
            <ul style={{ paddingLeft: '1.25rem', lineHeight: 1.7 }}>
              <li>Analytics (e.g., Google Analytics)</li>
              <li>Payment processors (e.g., Stripe)</li>
            </ul>
            <p className="muted" style={{ lineHeight: 1.7 }}>These services have their own privacy policies.</p>

            <h2 style={{ color: 'var(--green-700)', marginTop: '1.5rem' }}>11. Changes to This Policy</h2>
            <p className="muted" style={{ marginBottom: 0, lineHeight: 1.7 }}>
              We may update this Privacy Policy from time to time. Updates will be posted on this page with a revised effective date.
            </p>

            <h2 style={{ color: 'var(--green-700)', marginTop: '1.5rem' }}>12. Contact Us</h2>
            <p className="muted" style={{ marginBottom: 0, lineHeight: 1.7 }}>
              If you have questions about this Privacy Policy, please contact:
              <br />
              <br />
              Creators Lab
              <br />
              <span role="img" aria-label="email">📧</span> <a href="mailto:info@creators-lab.org" style={{ color: 'var(--yellow-400)', textDecoration: 'none', fontWeight: 600 }}>info@creators-lab.org</a>
              <br />
              <span role="img" aria-label="website">🌐</span> creators-lab.org
              <br />
              <span role="img" aria-label="location">📍</span> Millbrae, California
            </p>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}
