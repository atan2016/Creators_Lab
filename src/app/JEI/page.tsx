import Image from 'next/image'
import PageLayout from '@/components/creators-lab/PageLayout'
import campHeroImage from '../../../assets/images/Events/camp 2026 (1).png'

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
            <table style={{ width: '100%', marginTop: '0.5rem', marginBottom: '2rem', borderCollapse: 'separate', borderSpacing: 0 }}>
              <tbody>
                <tr>
                  <td style={{ width: '58%', verticalAlign: 'top', paddingRight: '1.5rem', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '2rem', color: 'var(--green-700)', marginBottom: '0.75rem' }}>JEI Programs</h1>
                    <p className="muted" style={{ margin: '0 0 0.75rem', fontSize: '1.15rem', lineHeight: 1.6 }}>
                      <strong>Location:</strong>
                      <br />
                      JEI Learning Center at Millbrae
                      <br />
                      233 El Camino Real
                      <br />
                      Millbrae, CA 94030
                    </p>
                    <p className="muted" style={{ margin: '0 0 0.75rem', fontSize: '1.15rem', lineHeight: 1.6 }}>
                      <strong>Time:</strong> 1 - 4pm
                    </p>
                    <p className="muted" style={{ margin: '0 0 0.75rem', fontSize: '1.15rem', lineHeight: 1.6 }}>
                      <strong>Date:</strong> June 1 - July 31 weekly with July 3rd off
                    </p>
                    <p className="muted" style={{ margin: 0, fontSize: '1.15rem', lineHeight: 1.6 }}>Hands-on programs that turns ideas into impact.</p>
                  </td>
                  <td style={{ width: '42%', verticalAlign: 'top', textAlign: 'left' }}>
                    <Image
                      src={campHeroImage}
                      alt="STEAM Summer Camp 2026"
                      style={{
                        width: '92%',
                        maxWidth: '340px',
                        height: 'auto',
                        borderRadius: '12px',
                        border: '1px solid rgba(4,120,87,.08)',
                        boxShadow: '0 6px 18px rgba(6,78,59,.04)',
                        display: 'inline-block',
                      }}
                      priority
                    />
                  </td>
                </tr>
              </tbody>
            </table>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridAutoFlow: 'row', gap: '1.5rem', marginTop: '2rem', maxWidth: '80rem', marginLeft: 'auto', marginRight: 'auto' }}>
              <div className="card">
                <h3 style={{ marginTop: 0, color: 'var(--green-700)' }}>3D Product Design with Blender (Level 1)</h3>
                <p className="muted" style={{ marginBottom: '0.5rem' }}>
                  <strong>Date:</strong> 6/1 - 6/5
                </p>
                <p className="muted">
                  Discover the art of bringing your imagination to life! In this beginner-friendly Blender class, you&apos;ll learn how 3D characters, buildings, and entire worlds are created for animated films and video games. We&apos;ll cover the essential tools of 3D modeling and how to navigate the 3D space using Blender, a powerful free software used by creators worldwide.
                </p>
                <p className="muted" style={{ marginBottom: 0 }}>
                  You&apos;ll use your new skills to design and build your own castle, and get it printed on a 3D printer! No grades-just creativity, exploration, and the chance to share your final creation with the class.
                </p>
                <div style={{ marginTop: '1rem' }}>
                  <a
                    href="https://buy.stripe.com/dRm00d0iP3XT6tT1b68k80a"
                    target="_blank"
                    rel="noopener noreferrer"
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
                <p className="muted">
                  In this hands-on class, students will learn the core skills of product design and bring their ideas to life with the AI-powered IDE. They&apos;ll work both individually and collaboratively-brainstorming, designing screens, planning user flows, and building features together as a team.
                </p>
                <p className="muted" style={{ marginBottom: 0 }}>
                  By the end of the course, each student will have created their own app -a portfolio-ready project that showcases creativity, collaboration, and technical skill for college applications.
                </p>
                <div style={{ marginTop: '1rem' }}>
                  <a
                    href="https://buy.stripe.com/9B6fZb5D9amhbOd7zu8k80c"
                    target="_blank"
                    rel="noopener noreferrer"
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
                <p className="muted">
                  Jump into the world of game creation with this beginner-friendly Unity course! Students learn the basics of 2D game design, coding, and animation while building their very own playable platformer. Using Unity and C#, students create characters, obstacles, collectibles, and a complete level-learning real coding concepts through hands-on creativity.
                </p>
                <p className="muted" style={{ marginBottom: 0 }}>
                  Perfect for beginners who want to bring their ideas to life and start their journey into game development while learning how to code!
                </p>
                <div style={{ marginTop: '1rem' }}>
                  <a
                    href="https://buy.stripe.com/bJe9AN8Pl7a57xX3je8k80b"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'inline-block', padding: '0.75rem 1.25rem', background: 'var(--green-700)', color: '#fff', textDecoration: 'none', borderRadius: '8px', fontWeight: 600 }}
                  >
                    Register Now
                  </a>
                </div>
              </div>

              <div className="card">
                <h3 style={{ marginTop: 0, color: 'var(--green-700)' }}>3D Product Design with Blender (Level 2)</h3>
                <p className="muted" style={{ marginBottom: '0.5rem' }}>
                  <strong>Date:</strong> 6/22 - 6/26
                </p>
                <p className="muted" style={{ marginBottom: '0.5rem' }}>
                  <strong>Prerequisite: 3D Product Design with Blender (Level 1)</strong>
                </p>
                <p className="muted">
                  Take your 3D skills to the next level in this immersive Level 2 Blender camp! Students dive deeper into modeling, sculpting, materials, and lighting while learning advanced tools like modifiers, rigging basics, particle effects, and scene optimization.
                </p>
                <p className="muted" style={{ marginBottom: 0 }}>
                  Campers work on a more complex hero project-from characters to environments-and bring their designs to life with animation essentials. Perfect for students who completed Level 1, this camp boosts creativity, technical skills, and confidence in professional 3D design workflows.
                </p>
                <div style={{ marginTop: '1rem' }}>
                  <a
                    href="https://buy.stripe.com/eVq9AN5D92TP4lL0728k804"
                    target="_blank"
                    rel="noopener noreferrer"
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
                    href="https://buy.stripe.com/5kQeV76Hd7a55pP8Dy8k805"
                    target="_blank"
                    rel="noopener noreferrer"
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
                <p className="muted" style={{ marginBottom: 0 }}>
                  In this exciting 1-week camp, students become inventors-building circuits, writing code, and bringing their ideas to life. They&apos;ll create interactive projects like motion alarms, auto night lights, and reaction games while learning the fundamentals of electronics and programming. Perfect for beginners, this program builds confidence, creativity, and real-world STEM skills.
                </p>
                <div style={{ marginTop: '1rem' }}>
                  <a
                    href="https://buy.stripe.com/bJefZb3v16616tT4ni8k806"
                    target="_blank"
                    rel="noopener noreferrer"
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
                <p className="muted" style={{ marginBottom: 0 }}>
                  Ready to go beyond the basics? In this advanced Arduino camp, students build more powerful, interactive systems by combining sensors, motors, and logic. From smart security systems to automated devices, campers will tackle bigger challenges, improve their coding skills, and create a more sophisticated project they&apos;ll be proud to showcase.
                </p>
                <div style={{ marginTop: '1rem' }}>
                  <a
                    href="https://buy.stripe.com/4gMaER3v1cupcSh3je8k807"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'inline-block', padding: '0.75rem 1.25rem', background: 'var(--green-700)', color: '#fff', textDecoration: 'none', borderRadius: '8px', fontWeight: 600 }}
                  >
                    Register Now
                  </a>
                </div>
              </div>

              <div className="card">
                <h3 style={{ marginTop: 0, color: 'var(--green-700)' }}>3D Product Design with Blender (Level 3)</h3>
                <p className="muted" style={{ marginBottom: '0.5rem' }}>
                  <strong>Date:</strong> 7/20 - 7/24
                </p>
                <p className="muted" style={{ marginBottom: '0.5rem' }}>
                  <strong>Prerequisite: 3D Product Design with Blender (Level 2)</strong>
                </p>
                <p className="muted" style={{ marginBottom: 0 }}>
                  Take your 3D skills even further in this advanced Blender camp! Students create a polished, portfolio-ready project using advanced modeling, sculpting, texturing, lighting, and animation techniques. They&apos;ll explore more complex workflows, refine details, and optimize scenes for realistic results. Perfect for students ready to produce high-quality designs and showcase professional-level 3D work.
                </p>
                <div style={{ marginTop: '1rem' }}>
                  <a
                    href="https://buy.stripe.com/6oUdR35D90LH19zcTO8k808"
                    target="_blank"
                    rel="noopener noreferrer"
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
                  <strong>Prerequisite: Unity Game Design Level 2</strong>
                </p>
                <p className="muted" style={{ marginBottom: 0 }}>
                  Take your skills to the next level in this advanced Unity camp! Students build a more complete 2D or 3D game with deeper systems like player progression, advanced AI, UI, and polished interactions. They&apos;ll strengthen C# skills, organize larger projects, and refine gameplay through testing and iteration. Perfect for students ready to create a portfolio-ready game.
                </p>
                <div style={{ marginTop: '1rem' }}>
                  <a
                    href="https://buy.stripe.com/8x2cMZ3v11PLg4tg608k809"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'inline-block', padding: '0.75rem 1.25rem', background: 'var(--green-700)', color: '#fff', textDecoration: 'none', borderRadius: '8px', fontWeight: 600 }}
                  >
                    Register Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  )
}
