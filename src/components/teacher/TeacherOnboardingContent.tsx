export default function TeacherOnboardingContent() {
  return (
    <div className="bg-white shadow rounded-lg p-6 sm:p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Creators-Lab!</h2>
      <p className="text-gray-600 mb-6">
        We&apos;re excited to have you joining the team and looking forward to our partnership.
      </p>
      <p className="text-gray-600 mb-8">
        Below is the list of onboarding tasks need to be completed before you can start instructing.
      </p>

      <div className="space-y-8">
        {/* TB Test */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">TB Test</h3>
          <p className="text-gray-600 mb-4">
            Rokk Research LLC covers the cost of TB clearance (up to $35). These costs are considered
            a company investment in each new hire.
          </p>
          <p className="text-gray-600 mb-4">
            To submit a reimbursement{' '}
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSdr_chJ_1amfKzZhHje-RRxiZXs4pjOsKGayFocg053Ltm_PQ/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              here
            </a>
            , the fee will be reimbursed on your next paycheck.
          </p>
          <p className="text-gray-600 mb-2">
            The link to the TB document is{' '}
            <a
              href="https://drive.google.com/file/d/1_FyL4Qx0Xh-akrhWz3dOYRV2hI1NMVMR/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              here
            </a>
            . If you have completed the TB test within the past 4 years and it was negative, please
            have your health care physician sign the form and email a copy of the form to{' '}
            <a href="mailto:info@creators-lab.com" className="text-blue-600 hover:underline">
              info@creators-lab.com
            </a>
            .
          </p>
        </section>

        {/* Mandated Reporter Training */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Mandated Reporter Training Video and Exam
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-600 mb-4">
            <li>
              Go to the Mandated Reporter Training Website:{' '}
              <a
                href="https://mandatedreportertraining.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                https://mandatedreportertraining.com/
              </a>
            </li>
            <li>CLICK &quot;Start Now&quot; in the upper right-hand corner</li>
            <li>CLICK on the &quot;I Need Training for&quot; drop-down menu and SELECT &quot;Myself&quot;</li>
            <li>Input your information and CLICK &quot;Create Account&quot;</li>
            <li>SELECT &quot;California&quot; for State</li>
            <li>SELECT &quot;Education&quot; for Industry</li>
            <li>SELECT &quot;Other&quot; for Profession</li>
            <li>FILL OUT First Name, Last Name, Email, and Password</li>
            <li>TYPE &quot;Creators Lab&quot; for Organization Name</li>
            <li>TYPE &quot;94030&quot; for Zip Code</li>
            <li>CLICK &quot;Create Account&quot;</li>
            <li>Complete email verification and login</li>
            <li>CLICK &quot;Add Training&quot; (or &quot;Browse Training&quot;)</li>
            <li>SELECT &quot;Mandated Reporting - Child Abuse | CA - General Training&quot;</li>
            <li>Scroll down and SELECT &quot;Add Training&quot;</li>
            <li>SELECT &quot;Start Course&quot;</li>
            <li>Complete the course</li>
            <li>Once the course is complete, CLICK &quot;Exit Course&quot;</li>
            <li>On the following screen CLICK &quot;Start Exam&quot;</li>
            <li>Complete the exam, a passing score of 80% is required</li>
            <li>DO NOT exit the exam, take a SCREENSHOT of the passing score</li>
            <li>Save the screenshot as a PDF</li>
            <li>Print your name, sign, and date the SCREENSHOT/PDF</li>
            <li>
              Email the signed screenshot to{' '}
              <a href="mailto:info@creators-lab.org" className="text-blue-600 hover:underline">
                info@creators-lab.org
              </a>
            </li>
          </ol>
        </section>

        {/* Live Scan */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Scan</h3>
          <p className="text-gray-600">More information to come</p>
        </section>
      </div>
    </div>
  )
}
