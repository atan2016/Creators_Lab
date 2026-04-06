import Image from 'next/image'
import PageLayout from '@/components/creators-lab/PageLayout'
import campHeroImage from '../../../assets/images/Events/camp 2026.png'
import creatorsLabJeiLogo from '../../../assets/images/creators-lab+JEI_logo.png'

export const metadata = {
  title: 'JEI Programs — Creators Lab',
  description: 'JEI partner programs at Creators Lab.',
}

export default function JEIPage() {
  return (
    <PageLayout>
      <div id="programs" style={{ background: '#f0fdf4', borderTop: '1px solid rgba(4,120,87,.06)', borderBottom: '1px solid rgba(4,120,87,.06)' }}>
        <section className="section">
          <div className="container">
            <div className="jei-header-grid" style={{ marginTop: '0.5rem', marginBottom: '2rem' }}>
              <div className="jei-header-left">
                <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2rem)', color: 'var(--green-700)', marginBottom: '0.75rem' }}>JEI Programs</h1>
                <Image
                  src={creatorsLabJeiLogo}
                  alt="Creators Lab and JEI partnership logo"
                  style={{
                    width: '100%',
                    maxWidth: '420px',
                    height: 'auto',
                    marginBottom: '0.75rem',
                    display: 'inline-block',
                  }}
                />
                <p className="muted" style={{ margin: '0 0 0.75rem', fontSize: 'clamp(1rem, 2.7vw, 1.15rem)', lineHeight: 1.6 }}>
                  <strong>Location:</strong>
                  <br />
                  JEI Learning Center at Millbrae
                  <br />
                  233 El Camino Real
                  <br />
                  Millbrae, CA 94030
                </p>
                <p className="muted" style={{ margin: '0 0 0.75rem', fontSize: 'clamp(1rem, 2.7vw, 1.15rem)', lineHeight: 1.6 }}>
                  <strong>Time:</strong> 1 - 4pm
                </p>
                <p className="muted" style={{ margin: '0 0 0.75rem', fontSize: 'clamp(1rem, 2.7vw, 1.15rem)', lineHeight: 1.6 }}>
                  <strong>Date:</strong> June 1 - July 31 weekly with July 3rd off
                </p>
                <p className="muted" style={{ margin: 0, fontSize: 'clamp(1rem, 2.7vw, 1.15rem)', lineHeight: 1.6 }}>Hands-on programs that turns ideas into impact.</p>
              </div>

              <div className="jei-header-right">
                <Image
                  src={campHeroImage}
                  alt="STEAM Summer Camp 2026"
                  style={{
                    width: '100%',
                    maxWidth: '360px',
                    height: 'auto',
                    borderRadius: '12px',
                    border: '1px solid rgba(4,120,87,.08)',
                    boxShadow: '0 6px 18px rgba(6,78,59,.04)',
                    display: 'inline-block',
                  }}
                  priority
                />
              </div>
            </div>

            <div className="jei-programs-grid" style={{ marginTop: '2rem', maxWidth: '80rem', marginLeft: 'auto', marginRight: 'auto' }}>
              <div className="card">
                <h3 style={{ marginTop: 0, color: 'var(--green-700)' }}>Fundamentals of 3D Modeling and Design with Blender (Level 1)</h3>
                <p className="muted" style={{ marginBottom: '0.5rem' }}>
                  <strong>Date:</strong> 6/1 - 6/5
                </p>
                <p className="muted" style={{ marginBottom: '0.5rem' }}>
                  <strong>Price:</strong> $350/Week
                </p>
                <p className="muted">
                  Discover the art of bringing your imagination to life! In this beginner-friendly Blender class, you&apos;ll learn how 3D characters, buildings, and entire worlds are created for animated films and video games. We&apos;ll cover the essential tools of 3D modeling and how to navigate the 3D space using Blender, a powerful free software used by creators worldwide.
                </p>
                <p className="muted" style={{ marginBottom: 0 }}>
                  You&apos;ll use your new skills to design and build your own castle, and get it printed on a 3D printer! No grades-just creativity, exploration, and the chance to share your final creation with the class.
                </p>
                <div style={{ marginTop: '1rem' }}>
                  <a
                    href="/JEI/register?program=blender-l1"
                    style={{ display: 'inline-block', padding: '0.75rem 1.25rem', background: 'var(--green-700)', color: '#fff', textDecoration: 'none', borderRadius: '8px', fontWeight: 600 }}
                  >
                    Register Now
                  </a>
                </div>
              </div>

              <div className="card">
                <h3 style={{ marginTop: 0, color: 'var(--green-700)' }}>Product Design and Prototyping with AI Tools</h3>
                <p className="muted" style={{ marginBottom: '0.5rem' }}>
                  <strong>Date:</strong> 6/8 - 6/12
                </p>
                <p className="muted" style={{ marginBottom: '0.5rem' }}>
                  <strong>Price:</strong> $350/Week
                </p>
                <p className="muted">
                  In this hands-on class, students will learn the core skills of product design and bring their ideas to life with the AI-powered IDE. They&apos;ll work both individually and collaboratively-brainstorming, designing screens, planning user flows, and building features together as a team.
                </p>
                <p className="muted" style={{ marginBottom: 0 }}>
                  By the end of the course, each student will have created their own app -a portfolio-ready project that showcases creativity, collaboration, and technical skill for college applications.
                </p>
                <div style={{ marginTop: '1rem' }}>
                  <a
                    href="/JEI/register?program=product-design-ai"
                    style={{ display: 'inline-block', padding: '0.75rem 1.25rem', background: 'var(--green-700)', color: '#fff', textDecoration: 'none', borderRadius: '8px', fontWeight: 600 }}
                  >
                    Register Now
                  </a>
                </div>
              </div>

              <div className="card">
                <h3 style={{ marginTop: 0, color: 'var(--green-700)' }}>Unity Game Design and Intro to coding with C# (Level 1)</h3>
                <p className="muted" style={{ marginBottom: '0.5rem' }}>
                  <strong>Date:</strong> 6/15 - 6/19
                </p>
                <p className="muted" style={{ marginBottom: '0.5rem' }}>
                  <strong>Price:</strong> $350/Week
                </p>
                <p className="muted">
                  Jump into the world of game creation with this beginner-friendly Unity course! Students learn the basics of 2D game design, coding, and animation while building their very own playable platformer. Using Unity and C#, students create characters, obstacles, collectibles, and a complete level-learning real coding concepts through hands-on creativity.
                </p>
                <p className="muted" style={{ marginBottom: 0 }}>
                  Perfect for beginners who want to bring their ideas to life and start their journey into game development while learning how to code!
                </p>
                <div style={{ marginTop: '1rem' }}>
                  <a
                    href="/JEI/register?program=unity-l1"
                    style={{ display: 'inline-block', padding: '0.75rem 1.25rem', background: 'var(--green-700)', color: '#fff', textDecoration: 'none', borderRadius: '8px', fontWeight: 600 }}
                  >
                    Register Now
                  </a>
                </div>
              </div>

              <div className="card">
                <h3 style={{ marginTop: 0, color: 'var(--green-700)' }}>Fundamentals of 3D Modeling and Design with Blender (Level 2)</h3>
                <p className="muted" style={{ marginBottom: '0.5rem' }}>
                  <strong>Date:</strong> 6/22 - 6/26
                </p>
                <p className="muted" style={{ marginBottom: '0.5rem' }}>
                  <strong>Price:</strong> $350/Week
                </p>
                <p className="muted" style={{ marginBottom: '0.5rem' }}>
                  <strong>Prerequisite: Fundamentals of 3D Modeling and Design with Blender (Level 1)</strong>
                </p>
                <p className="muted">
                  Take your 3D skills to the next level in this immersive Level 2 Blender camp! Students dive deeper into modeling, sculpting, materials, and lighting while learning advanced tools like modifiers, rigging basics, particle effects, and scene optimization.
                </p>
                <p className="muted" style={{ marginBottom: 0 }}>
                  Campers work on a more complex hero project-from characters to environments-and bring their designs to life with animation essentials. Perfect for students who completed Level 1, this camp boosts creativity, technical skills, and confidence in professional 3D design workflows.
                </p>
                <div style={{ marginTop: '1rem' }}>
                  <a
                    href="/JEI/register?program=blender-l2"
                    style={{ display: 'inline-block', padding: '0.75rem 1.25rem', background: 'var(--green-700)', color: '#fff', textDecoration: 'none', borderRadius: '8px', fontWeight: 600 }}
                  >
                    Register Now
                  </a>
                </div>
              </div>

              <div className="card">
                <h3 style={{ marginTop: 0, color: 'var(--green-700)' }}>Unity Game Design and Intro to coding with C# (Level 2)</h3>
                <p className="muted" style={{ marginBottom: '0.5rem' }}>
                  <strong>Date:</strong> 6/29 - 7/2
                </p>
                <p className="muted" style={{ marginBottom: '0.5rem' }}>
                  <strong>Price:</strong> $350/Week
                </p>
                <p className="muted" style={{ marginBottom: '0.5rem' }}>
                  <strong>Prerequisite: Unity Game Design Level 1</strong>
                </p>
                <p className="muted">
                  Level up your game-building skills in this advanced Unity camp! Students expand on their Level 1 foundation by creating a more complex 2D or 3D game with enhanced mechanics, polished visuals, and smarter C# scripts. They&apos;ll learn enemy AI, animations, UI menus, sound effects, and game-ready interactions while building a full playable level.
                </p>
                <p className="muted" style={{ marginBottom: 0 }}>
                  Perfect for students who completed Level 1 and are ready for deeper coding, creative design challenges, and real game-development techniques. Students leave with a more advanced project they can proudly showcase and continue improving!
                </p>
                <div style={{ marginTop: '1rem' }}>
                  <a
                    href="/JEI/register?program=unity-l2"
                    style={{ display: 'inline-block', padding: '0.75rem 1.25rem', background: 'var(--green-700)', color: '#fff', textDecoration: 'none', borderRadius: '8px', fontWeight: 600 }}
                  >
                    Register Now
                  </a>
                </div>
              </div>

              <div className="card">
                <h3 style={{ marginTop: 0, color: 'var(--green-700)' }}>Robotics - Level 1 Turn Ideas into Smart Creations with Arduino!</h3>
                <p className="muted" style={{ marginBottom: '0.5rem' }}>
                  <strong>Date:</strong> 7/6 - 7/10
                </p>
                <p className="muted" style={{ marginBottom: '0.5rem' }}>
                  <strong>Price:</strong> $550/Week
                </p>
                <p className="muted" style={{ marginBottom: 0 }}>
                  In this exciting 1-week camp, students become inventors-building circuits, writing code, and bringing their ideas to life. They&apos;ll create interactive projects like motion alarms, auto night lights, and reaction games while learning the fundamentals of electronics and programming. Perfect for beginners, this program builds confidence, creativity, and real-world STEM skills.
                </p>
                <div style={{ marginTop: '1rem' }}>
                  <a
                    href="/JEI/register?program=robotics-l1"
                    style={{ display: 'inline-block', padding: '0.75rem 1.25rem', background: 'var(--green-700)', color: '#fff', textDecoration: 'none', borderRadius: '8px', fontWeight: 600 }}
                  >
                    Register Now
                  </a>
                </div>
              </div>

              <div className="card">
                <h3 style={{ marginTop: 0, color: 'var(--green-700)' }}>Robotics - Level 2 Level Up Your Arduino Creations!</h3>
                <p className="muted" style={{ marginBottom: '0.5rem' }}>
                  <strong>Date:</strong> 7/13 - 7/17
                </p>
                <p className="muted" style={{ marginBottom: '0.5rem' }}>
                  <strong>Price:</strong> $550/Week
                </p>
                <p className="muted" style={{ marginBottom: 0 }}>
                  Ready to go beyond the basics? In this advanced Arduino camp, students build more powerful, interactive systems by combining sensors, motors, and logic. From smart security systems to automated devices, campers will tackle bigger challenges, improve their coding skills, and create a more sophisticated project they&apos;ll be proud to showcase.
                </p>
                <div style={{ marginTop: '1rem' }}>
                  <a
                    href="/JEI/register?program=robotics-l2"
                    style={{ display: 'inline-block', padding: '0.75rem 1.25rem', background: 'var(--green-700)', color: '#fff', textDecoration: 'none', borderRadius: '8px', fontWeight: 600 }}
                  >
                    Register Now
                  </a>
                </div>
              </div>

              <div className="card">
                <h3 style={{ marginTop: 0, color: 'var(--green-700)' }}>Fundamentals of 3D Modeling and Design with Blender (Level 3)</h3>
                <p className="muted" style={{ marginBottom: '0.5rem' }}>
                  <strong>Date:</strong> 7/20 - 7/24
                </p>
                <p className="muted" style={{ marginBottom: '0.5rem' }}>
                  <strong>Price:</strong> $350/Week
                </p>
                <p className="muted" style={{ marginBottom: '0.5rem' }}>
                  <strong>Prerequisite: Fundamentals of 3D Modeling and Design with Blender (Level 2)</strong>
                </p>
                <p className="muted" style={{ marginBottom: 0 }}>
                  Take your 3D skills even further in this advanced Blender camp! Students create a polished, portfolio-ready project using advanced modeling, sculpting, texturing, lighting, and animation techniques. They&apos;ll explore more complex workflows, refine details, and optimize scenes for realistic results. Perfect for students ready to produce high-quality designs and showcase professional-level 3D work.
                </p>
                <div style={{ marginTop: '1rem' }}>
                  <a
                    href="/JEI/register?program=blender-l3"
                    style={{ display: 'inline-block', padding: '0.75rem 1.25rem', background: 'var(--green-700)', color: '#fff', textDecoration: 'none', borderRadius: '8px', fontWeight: 600 }}
                  >
                    Register Now
                  </a>
                </div>
              </div>

              <div className="card">
                <h3 style={{ marginTop: 0, color: 'var(--green-700)' }}>Unity Game Design and C# Programming (Level 3)</h3>
                <p className="muted" style={{ marginBottom: '0.5rem' }}>
                  <strong>Date:</strong> 7/27 - 7/31
                </p>
                <p className="muted" style={{ marginBottom: '0.5rem' }}>
                  <strong>Price:</strong> $350/Week
                </p>
                <p className="muted" style={{ marginBottom: '0.5rem' }}>
                  <strong>Prerequisite: Unity Game Design Level 2</strong>
                </p>
                <p className="muted" style={{ marginBottom: 0 }}>
                  Take your skills to the next level in this advanced Unity camp! Students build a more complete 2D or 3D game with deeper systems like player progression, advanced AI, UI, and polished interactions. They&apos;ll strengthen C# skills, organize larger projects, and refine gameplay through testing and iteration. Perfect for students ready to create a portfolio-ready game.
                </p>
                <div style={{ marginTop: '1rem' }}>
                  <a
                    href="/JEI/register?program=unity-l3"
                    style={{ display: 'inline-block', padding: '0.75rem 1.25rem', background: 'var(--green-700)', color: '#fff', textDecoration: 'none', borderRadius: '8px', fontWeight: 600 }}
                  >
                    Register Now
                  </a>
                </div>
              </div>
            </div>

            <div className="card" style={{ marginTop: '2rem', maxWidth: '80rem', marginLeft: 'auto', marginRight: 'auto' }}>
              <h3 style={{ marginTop: 0, color: 'var(--green-700)' }}>Refunds, Credits & Program Policies</h3>

              <p className="muted" style={{ marginBottom: '0.5rem', fontWeight: 700 }}>Refunds</p>
              <p className="muted" style={{ marginTop: 0, lineHeight: 1.7 }}>
                Full refunds are available up to 30 days before the program start date, minus a 3% processing fee.
              </p>
              <p className="muted" style={{ marginTop: 0, lineHeight: 1.7 }}>
                Within 30 days of the start date, refunds are not available. However, a credit may be issued at our discretion.
              </p>

              <p className="muted" style={{ marginBottom: '0.5rem', fontWeight: 700 }}>Credits</p>
              <ul className="muted" style={{ marginTop: 0, paddingLeft: '1.25rem', lineHeight: 1.7 }}>
                <li>Credits can be applied to future Creators Lab programs</li>
                <li>Credits must be used within 6 months</li>
                <li>All credits are non-transferable and subject to availability</li>
              </ul>

              <p className="muted" style={{ marginBottom: '0.5rem', fontWeight: 700 }}>Cancellations by Creators Lab</p>
              <p className="muted" style={{ marginTop: 0, marginBottom: '0.5rem', lineHeight: 1.7 }}>
                If a program is canceled due to low enrollment or unforeseen circumstances:
              </p>
              <ul className="muted" style={{ marginTop: 0, paddingLeft: '1.25rem', lineHeight: 1.7 }}>
                <li>You will receive a full refund (no processing fee) OR</li>
                <li>The option to receive a full credit</li>
              </ul>

              <p className="muted" style={{ marginBottom: '0.5rem', fontWeight: 700 }}>Missed Classes</p>
              <ul className="muted" style={{ marginTop: 0, paddingLeft: '1.25rem', lineHeight: 1.7 }}>
                <li>No refunds or make-ups for missed classes</li>
                <li>We may provide materials or summaries when available</li>
              </ul>

              <p className="muted" style={{ marginBottom: '0.5rem', fontWeight: 700 }}>Transfers</p>
              <p className="muted" style={{ marginTop: 0, lineHeight: 1.7 }}>
                Transfer requests to another session or program may be accommodated up to 14 days before the start date, subject to availability.
              </p>

              <p className="muted" style={{ marginBottom: '0.5rem', fontWeight: 700 }}>Behavior &amp; Participation</p>
              <p className="muted" style={{ marginTop: 0, lineHeight: 1.7 }}>
                Creators Lab strives to provide a positive and respectful learning environment. We reserve the right to remove a student for disruptive behavior. In such cases, no refund will be issued.
              </p>

              <p className="muted" style={{ marginBottom: '0.5rem', fontWeight: 700 }}>Minimum Enrollment</p>
              <p className="muted" style={{ marginTop: 0, lineHeight: 1.7 }}>
                Programs require a minimum number of students. If the minimum is not met, Creators Lab may cancel or reschedule the program.
              </p>

              <p className="muted" style={{ marginBottom: '0.5rem', fontWeight: 700 }}>Agreement</p>
              <p className="muted" style={{ marginTop: 0, lineHeight: 1.7 }}>
                By registering, you agree to the terms of this policy.
              </p>

              <p className="muted" style={{ marginBottom: '0.5rem', fontWeight: 700 }}>Late Pickup</p>
              <p className="muted" style={{ marginTop: 0, lineHeight: 1.7 }}>
                A late pickup fee of $10 per 10 minutes may apply.
              </p>

              <p className="muted" style={{ marginBottom: '0.5rem', fontWeight: 700 }}>Medical/Emergency Exception</p>
              <p className="muted" style={{ marginTop: 0, marginBottom: 0, lineHeight: 1.7 }}>
                Exceptions may be considered for medical emergencies with documentation.
              </p>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  )
}
