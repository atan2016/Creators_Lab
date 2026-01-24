import Image from 'next/image'
import Link from 'next/link'
import PageLayout from '@/components/creators-lab/PageLayout'

export const metadata = {
  title: 'About Us — CreatorsLab',
  description: 'Learn about CreatorsLab and our mission to empower the next generation of innovators.',
}

export default function AboutPage() {
  return (
    <PageLayout>
      <div style={{ color: 'var(--green-900)' }}>
        <div style={{ background: '#f0fdf4', borderTop: '1px solid rgba(4,120,87,.06)', borderBottom: '1px solid rgba(4,120,87,.06)' }}>
          <section className="section two">
            <div className="container">
              <div>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>About Us</h1>
                <p className="muted" style={{ fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>We are a team of seasoned entrepreneurs with a passion for building ventures and empowering the next generation. Over the years, we've launched and grown companies across different industries — learning firsthand what it takes to turn ideas into reality.</p>
                <p className="muted" style={{ fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>Now, we're channeling that experience into something bigger: helping teens discover the world of entrepreneurship at an early age. We believe the skills that matter most for the future aren't just coding or business plans — they're creativity, problem-solving, adaptability, and the confidence to think differently.</p>
                <p className="muted" style={{ fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>AI is transforming every field, and we see it as a powerful creative partner. By integrating AI-driven tools into our programs, we give teens the chance to explore, innovate, and build faster than ever before. Whether it's prototyping an app, designing a brand, or pitching a new idea, we make entrepreneurship hands-on, fun, and future-focused.</p>
                <p className="muted" style={{ fontSize: '1.1rem', lineHeight: 1.6 }}>Our mission is simple: equip young people with the mindset and tools to create, lead, and thrive in a world shaped by innovation.</p>
              </div>
              <div></div>
            </div>
          </section>
        </div>

        <section className="section">
          <div className="container">
            <div className="card" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <Image
                  src="/assets/images/FKO_Selfie.png"
                  alt="Ashley Tan"
                  width={120}
                  height={120}
                  style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--green-700)' }}
                />
                <div>
                  <h2 style={{ color: 'var(--green-700)', marginTop: 0, marginBottom: '0.5rem' }}>Ashley Tan</h2>
                  <p style={{ color: 'var(--green-700)', fontWeight: 600, margin: 0 }}>Founder & Program Lead</p>
                </div>
              </div>
              <p className="muted" style={{ fontSize: '1rem', lineHeight: 1.6, marginBottom: '1rem' }}>Ashley Tan is a lifelong learner, technologist, and entrepreneur passionate about empowering the next generation to create boldly and think differently. With over 20 years of experience building products, teams, and companies across the tech industry, Ashley brings a unique blend of engineering expertise and human-centered design to CreatorsLab.</p>
              <p className="muted" style={{ fontSize: '1rem', lineHeight: 1.6, marginBottom: '1rem' }}>She holds a BS in Computer Engineering from Rensselaer Polytechnic Institute and an MS in Information Management and Systems from UC Berkeley, where she collaborated across disciplines to explore how technology can drive innovation and positive change.</p>
              <p className="muted" style={{ fontSize: '1rem', lineHeight: 1.6, marginBottom: '1rem' }}>As a mother of two teenage boys, Ashley saw firsthand the potential of AI to transform how teens learn, create, and express themselves. She founded CreatorsLab to help young people shift from being consumers of technology to creators of it — building confidence, community, and entrepreneurial skills along the way.</p>
              <p className="muted" style={{ fontSize: '1rem', lineHeight: 1.6 }}>At CreatorsLab, Ashley leads the design and delivery of programs that blend AI, STEM, and entrepreneurship, inspiring teens to dream big, build boldly, and innovate fearlessly — one community, one project, one young creator at a time.</p>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="card" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <Image
                  src="/assets/images/mike_profile.png"
                  alt="Mike Voytovich"
                  width={120}
                  height={120}
                  style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--green-700)' }}
                />
                <div>
                  <h2 style={{ color: 'var(--green-700)', marginTop: 0, marginBottom: '0.5rem' }}>Mike Voytovich</h2>
                  <p style={{ color: 'var(--green-700)', fontWeight: 600, margin: 0 }}>Technical Mentor & Co-Founder</p>
                </div>
              </div>
              <p className="muted" style={{ fontSize: '1rem', lineHeight: 1.6, marginBottom: '1rem' }}>Mike Voytovich is a hands-on engineer, innovator, and mentor passionate about bridging technology and real-world impact. Currently a Member of Technical Staff at OpenAI, Mike brings over 15 years of experience designing and building embedded systems, IoT products, and AI-driven solutions.</p>
              <p className="muted" style={{ fontSize: '1rem', lineHeight: 1.6, marginBottom: '1rem' }}>Before joining OpenAI, Mike founded Rokk Research, where he led prototyping and firmware development for cutting-edge IoT and AI applications. His earlier career includes key technical roles at Currant, PayPal, and Duff Research, where he helped create connected devices and intelligent platforms that combined software, hardware, and data science.</p>
              <p className="muted" style={{ fontSize: '1rem', lineHeight: 1.6 }}>At CreatorsLab, Mike helps teens unlock their curiosity and creativity through hands-on learning. He mentors students to see technology not just as a tool, but as a way to build meaningful solutions for their communities — embodying the lab's mission to inspire the next generation of makers and innovators.</p>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <h2 style={{ color: 'var(--green-700)', textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>Student Outreach and Instructor</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginTop: '2rem' }} className="student-profiles-grid">
                <div className="card" style={{ padding: '2rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <Image
                      src="/assets/images/hugo_profile.JPEG"
                      alt="Hugo"
                      width={120}
                      height={120}
                      style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--green-700)', marginBottom: '1rem' }}
                    />
                    <h3 style={{ color: 'var(--green-700)', marginTop: 0, marginBottom: '0.5rem', textAlign: 'center' }}>Hugo</h3>
                    <p style={{ color: 'var(--green-700)', fontWeight: 600, margin: 0, textAlign: 'center' }}>Student Outreach and Instructor</p>
                  </div>
                  <p className="muted" style={{ fontSize: '1rem', lineHeight: 1.6, textAlign: 'center' }}>Hugo is a junior at Mills High School with a strong passion for AI and entrepreneurship. He is an active community leader and serves on the Millbrae Youth Advisory Committee, where he helps bring student voices into local decision-making.</p>
                </div>

                <div className="card" style={{ padding: '2rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <Image
                      src="/assets/images/max_profile.png"
                      alt="Max"
                      width={120}
                      height={120}
                      style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--green-700)', marginBottom: '1rem' }}
                    />
                    <h3 style={{ color: 'var(--green-700)', marginTop: 0, marginBottom: '0.5rem', textAlign: 'center' }}>Max</h3>
                    <p style={{ color: 'var(--green-700)', fontWeight: 600, margin: 0, textAlign: 'center' }}>Student Outreach and Instructor</p>
                  </div>
                  <p className="muted" style={{ fontSize: '1rem', lineHeight: 1.6, textAlign: 'center' }}>Max is a sophomore at Mills High School, a student-athlete, Boy Scout, and an avid gamer whenever he can find spare time. He loves building, tinkering, and learning new skills — and he'll be the TA for Blender and Unity classes this Spring. Max is also a certified soccer referee and an active member of the local AYSO community.</p>
                </div>

                <Link href="/#contact" className="card" style={{ padding: '2rem', cursor: 'pointer', transition: 'transform 0.2s ease', textDecoration: 'none', display: 'block' }} 
                     title="Interested in joining? Click on Contact Us to submit a request">
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
                    <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '3px solid var(--green-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', background: '#f0fdf4' }}>
                      <span style={{ fontSize: '4rem', color: 'var(--green-700)', fontWeight: 'bold' }}>?</span>
                    </div>
                    <p style={{ color: 'var(--muted)', fontSize: '0.9rem', textAlign: 'center', marginTop: '1rem' }}>Interested in joining? Click on Contact Us to submit a request</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  )
}
