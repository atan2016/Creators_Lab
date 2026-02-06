import Link from 'next/link'
import PageLayout from '@/components/creators-lab/PageLayout'

export const metadata = {
  title: 'Careers — CreatorsLab',
  description: 'Join our team and help us empower the next generation of creators, innovators, and entrepreneurs.',
}

export default function CareersPage() {
  return (
    <PageLayout includeSearch={false}>
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '56ch', margin: '0 auto 3rem' }}>
            <h1 style={{ color: 'var(--green-700)', fontSize: '2.5rem', marginBottom: '1rem' }}>Join Our Team</h1>
            <p className="muted" style={{ fontSize: '1.125rem', lineHeight: 1.6 }}>
              Help us empower the next generation of creators, innovators, and entrepreneurs. We're looking for passionate educators who want to make a real impact.
            </p>
          </div>

          <div className="card">
            <div className="job-header">
              <div className="job-icon">💼</div>
              <div style={{ flex: 1 }}>
                <h2 className="job-title">Founding Board Member – Grant & Nonprofit Strategy</h2>
                <div className="job-meta">
                  <div><strong>Role Type:</strong> Founding Board Member (Volunteer, Unpaid)</div>
                  <div><strong>Term:</strong> 2–3 years (renewable)</div>
                  <div><strong>Time Commitment:</strong> ~4–6 hours/month</div>
                  <div><strong>Location:</strong> Bay Area preferred | Remote considered</div>
                </div>
              </div>
            </div>

            <div className="job-section">
              <h3>About Creators Lab</h3>
              <p>Creators Lab is a youth-focused nonprofit dedicated to empowering students (ages 11–18) through hands-on STEAM education, creative technology, AI literacy, and design thinking. Our mission is to make emerging technologies accessible, ethical, and empowering—preparing young people to become confident creators and problem-solvers in an AI-driven world.</p>
            </div>

            <div className="job-section">
              <h3>Why This Role Matters</h3>
              <p>As a Founding Board Member, you will help shape Creators Lab at its earliest and most influential stage. The Grant & Nonprofit Strategy Lead plays a critical role in building the organization&apos;s funding foundation, nonprofit infrastructure, and long-term sustainability.</p>
            </div>

            <div className="job-section">
              <h3>Key Responsibilities</h3>
              <ul>
                <li>Help establish strong nonprofit governance, policies, and best practices</li>
                <li>Shape Creators Lab&apos;s grant and public funding strategy from the ground up</li>
                <li>Identify and prioritize grant opportunities (foundation, government, education-focused)</li>
                <li>Advise on grant readiness, impact measurement, and reporting frameworks</li>
                <li>Review and provide feedback on grant proposals and narratives</li>
                <li>Support partnerships with school districts, public agencies, and education organizations</li>
                <li>Serve as a strategic advisor and thought partner to the Founder</li>
              </ul>
            </div>

            <div className="job-section">
              <h3>Ideal Background</h3>
              <ul>
                <li>Experience founding, leading, or serving in leadership roles at a nonprofit</li>
                <li>Proven success securing grants, ideally in youth, education, STEAM, or workforce development</li>
                <li>Familiarity with foundations, government grants, and education funding ecosystems</li>
                <li>Strong understanding of nonprofit operations and compliance</li>
                <li>Passion for equity, access, and youth education</li>
              </ul>
            </div>

            <div className="job-section">
              <h3>What You&apos;ll Gain</h3>
              <ul>
                <li>Foundational influence on a growing nonprofit&apos;s mission and direction</li>
                <li>Opportunity to leave a lasting impact on youth STEAM education</li>
                <li>Recognition as a Founding Board Member</li>
                <li>Deep personal fulfillment through community impact</li>
              </ul>
            </div>

            <div className="apply-box">
              <strong>👉 To Apply:</strong> Send your resume, a brief statement of interest, and relevant experience to <a href="mailto:info@creators-lab.org?subject=Founding Board Member - Grant & Nonprofit Strategy">info@creators-lab.org</a> with subject line: <strong>Founding Board Member - Grant & Nonprofit Strategy</strong>.
            </div>
          </div>

          <div className="card">
            <div className="job-header">
              <div className="job-icon">🤝</div>
              <div style={{ flex: 1 }}>
                <h2 className="job-title">Founding Board Member – Corporate Partnerships & Fundraising</h2>
                <div className="job-meta">
                  <div><strong>Role Type:</strong> Founding Board Member (Volunteer, Unpaid)</div>
                  <div><strong>Term:</strong> 2–3 years (renewable)</div>
                  <div><strong>Time Commitment:</strong> ~4–6 hours/month</div>
                  <div><strong>Location:</strong> Bay Area preferred | Remote considered</div>
                </div>
              </div>
            </div>

            <div className="job-section">
              <h3>About Creators Lab</h3>
              <p>Creators Lab equips young people with the skills, confidence, and ethical grounding to thrive in a technology-driven future. Through hands-on STEAM programs and industry-connected learning, we bridge education and real-world innovation.</p>
            </div>

            <div className="job-section">
              <h3>Why This Role Matters</h3>
              <p>The Corporate Partnerships & Fundraising Lead will help define how Creators Lab engages with corporations, sponsors, and industry partners. As a Founding Board Member, you&apos;ll play a pivotal role in shaping sustainable fundraising models and partnerships that directly expand access to youth education.</p>
            </div>

            <div className="job-section">
              <h3>Key Responsibilities</h3>
              <ul>
                <li>Help design Creators Lab&apos;s corporate fundraising and partnership strategy</li>
                <li>Leverage professional networks to introduce potential corporate partners and sponsors</li>
                <li>Shape partnership offerings (program sponsorships, employee volunteering, in-kind support)</li>
                <li>Advise on donor engagement and long-term relationship building</li>
                <li>Support fundraising campaigns, events, and pitch development</li>
                <li>Act as an ambassador for Creators Lab within professional and community networks</li>
              </ul>
            </div>

            <div className="job-section">
              <h3>Ideal Background</h3>
              <ul>
                <li>Experience working with corporations on fundraising, partnerships, or corporate philanthropy</li>
                <li>Background in business development, partnerships, or social impact initiatives</li>
                <li>Strong professional network within technology, engineering, or innovation-driven industries</li>
                <li>Strategic mindset with a willingness to support execution</li>
                <li>Commitment to youth education and workforce development</li>
              </ul>
            </div>

            <div className="job-section">
              <h3>What You&apos;ll Gain</h3>
              <ul>
                <li>A seat at the table during Creators Lab&apos;s formative years</li>
                <li>Opportunity to connect industry resources with meaningful community impact</li>
                <li>Recognition as a Founding Board Member</li>
                <li>Long-term legacy in shaping youth access to STEAM education</li>
              </ul>
            </div>

            <div className="apply-box">
              <strong>👉 To Apply:</strong> Send your resume, a brief statement of interest, and relevant experience to <a href="mailto:info@creators-lab.org?subject=Founding Board Member - Corporate Partnerships & Fundraising">info@creators-lab.org</a> with subject line: <strong>Founding Board Member - Corporate Partnerships & Fundraising</strong>.
            </div>
          </div>

          <div className="card">
            <div className="job-header">
              <div className="job-icon">🎨</div>
              <div style={{ flex: 1 }}>
                <h2 className="job-title">Part-Time Instructor – Product Design & Development (Figma)</h2>
                <div className="job-meta">
                  <strong>Location:</strong> Hybrid / Millbrae, CA<br />
                  <strong>Commitment:</strong> 5–10 hrs/week | Part-Time<br />
                  <strong>Compensation:</strong> $35–$60/hr (DOE)
                </div>
              </div>
            </div>

            <div className="job-section">
              <h3>About Creators Lab</h3>
              <p>At Creators Lab, we empower the next generation to dream big, build boldly, and innovate fearlessly. Our teen innovation programs combine creativity, technology, and entrepreneurship — helping students design products and experiences that shape the future.</p>
            </div>

            <div className="job-section">
              <h3>About the Role</h3>
              <p>We're looking for a Product Design & Development Instructor with hands-on experience in Figma, UI/UX design, and digital prototyping to teach and mentor students (ages 12–17). You'll guide them through the full design process — from brainstorming and wireframing to creating interactive app prototypes.</p>
            </div>

            <div className="job-section">
              <h3>What You'll Do</h3>
              <ul>
                <li>Teach and mentor small groups of students on design thinking and Figma fundamentals.</li>
                <li>Lead project-based sessions where students create app or web prototypes.</li>
                <li>Encourage collaboration, iteration, and storytelling in design.</li>
                <li>Provide real-world insights into product design careers and workflows.</li>
                <li>Help refine our evolving "Vibe Coding" curriculum.</li>
              </ul>
            </div>

            <div className="job-section">
              <h3>What You Bring</h3>
              <ul>
                <li>Strong command of Figma, UI/UX principles, and digital design workflows.</li>
                <li>Experience in product design, UI/UX, or front-end prototyping.</li>
                <li>A creative, patient, and inspiring teaching style.</li>
                <li>Prior teaching, mentoring, or youth engagement experience is a plus.</li>
              </ul>
            </div>

            <div className="job-section">
              <h3>Bonus Skills</h3>
              <ul>
                <li>Familiarity with no-code or low-code tools (e.g., Glide, Bubble, Lovable).</li>
                <li>Basic knowledge of HTML/CSS or app publishing.</li>
              </ul>
            </div>

            <div className="job-section">
              <h3>Why Join Us</h3>
              <ul>
                <li>Shape young creators' confidence and problem-solving skills.</li>
                <li>Flexible schedule and supportive team culture.</li>
                <li>Opportunities to co-create new workshops and future programs.</li>
              </ul>
            </div>

            <div className="apply-box">
              <strong>👉 To Apply:</strong> Send a short intro, portfolio (if available), and your teaching availability to <a href="mailto:info@creators-lab.org?subject=Figma Instructor Application" style={{ color: 'var(--green-700)', fontWeight: 600 }}>info@creators-lab.org</a> with subject line: <strong>Figma Instructor Application</strong>.
            </div>
          </div>

          <div className="card">
            <div className="job-header">
              <div className="job-icon">🎮</div>
              <div style={{ flex: 1 }}>
                <h2 className="job-title">Part-Time Instructor – Game Design & Development (Unity + Blender)</h2>
                <div className="job-meta">
                  <strong>Location:</strong> Hybrid / Millbrae, CA<br />
                  <strong>Commitment:</strong> 5–10 hrs/week | Part-Time<br />
                  <strong>Compensation:</strong> $35–$60/hr (DOE)
                </div>
              </div>
            </div>

            <div className="job-section">
              <h3>About Creators Lab</h3>
              <p>Creators Lab inspires students to explore AI, game design, and creative technology through hands-on learning. We believe in empowering teens to become creators — not just consumers — of technology.</p>
            </div>

            <div className="job-section">
              <h3>About the Role</h3>
              <p>We're seeking a Game Design & Development Instructor with experience in Unity and Blender to teach foundational 3D game creation and animation. You'll guide students through designing environments, modeling simple characters, and coding interactive mechanics.</p>
            </div>

            <div className="job-section">
              <h3>What You'll Do</h3>
              <ul>
                <li>Teach fundamentals of Unity, C# scripting, and game logic.</li>
                <li>Help students design and build playable mini-games.</li>
                <li>Introduce Blender basics for modeling and animation.</li>
                <li>Foster teamwork and creativity through project-based learning.</li>
                <li>Inspire students with examples from modern games and indie design.</li>
              </ul>
            </div>

            <div className="job-section">
              <h3>What You Bring</h3>
              <ul>
                <li>Experience building or teaching with Unity and Blender.</li>
                <li>Strong grasp of game design principles and creative storytelling.</li>
                <li>Enthusiasm for teaching and mentoring youth.</li>
                <li>Excellent communication and patience with beginners.</li>
              </ul>
            </div>

            <div className="job-section">
              <h3>Bonus Skills</h3>
              <ul>
                <li>Familiarity with VR/AR tools or 2D game engines.</li>
                <li>Portfolio or playable projects to showcase your work.</li>
              </ul>
            </div>

            <div className="job-section">
              <h3>Why Join Us</h3>
              <ul>
                <li>Empower teens to bring their game ideas to life.</li>
                <li>Flexible schedule and creative teaching environment.</li>
                <li>Collaborate with other instructors shaping the future of tech education.</li>
              </ul>
            </div>

            <div className="apply-box">
              <strong>👉 To Apply:</strong> Email <a href="mailto:info@creators-lab.org?subject=Unity Instructor Application" style={{ color: 'var(--green-700)', fontWeight: 600 }}>info@creators-lab.org</a> with a short intro, portfolio link (if available), and subject line: <strong>Unity Instructor Application</strong>.
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}
