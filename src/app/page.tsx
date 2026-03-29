import Link from 'next/link'
import Image from 'next/image'
import PageLayout from '@/components/creators-lab/PageLayout'
import HomePageClient from '@/components/creators-lab/HomePageClient'
import ProgramExpandButton from '@/components/creators-lab/ProgramExpandButton'

export const metadata = {
  title: 'Creators Lab — Enrich Youth Innovations',
  description: 'Empower the next generation to dream big, build boldly, and innovate fearlessly.',
}

export default function Home() {
  return (
    <PageLayout>
      <div
        id="home"
        className="hero"
        style={{
          /* Hex — not var(): if variables are unset during HMR/FOUC, var() invalidates the whole declaration and white text disappears on a white page */
          background: '#047857',
          color: '#fff',
          padding: '2rem 0',
        }}
      >
        <section>
          <div
            className="container"
            style={{
              maxWidth: '80rem',
              marginLeft: 'auto',
              marginRight: 'auto',
              padding: '1rem 1.5rem',
            }}
          >
            <div className="home-hero-grid">
              <div style={{ minWidth: 0 }}>
                <h1
                  style={{
                    color: '#fff',
                    fontSize: 'clamp(2rem, 5vw, 3rem)',
                    margin: '0 0 0.8rem',
                    lineHeight: 1.05,
                    fontWeight: 700,
                  }}
                >
                  Empower Youth Innovations
                </h1>
                <p className="muted" style={{ color: 'rgba(255, 255, 255, 0.95)', lineHeight: 1.6 }}>
                  At Creators Lab, we empower the next generation to dream big, build boldly, and innovate fearlessly. Our mission is to equip teens with the creativity, confidence, and entrepreneurial mindset to thrive in a world shaped by AI and innovation — one community, one project, one young creator at a time.
                </p>
                <div style={{ marginTop: '1rem', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <Link
                    className="btn"
                    href="#programs"
                    style={{
                      background: '#fff',
                      color: '#047857',
                      padding: '0.75rem 1rem',
                      borderRadius: '999px',
                      fontWeight: 600,
                      textDecoration: 'none',
                      display: 'inline-block',
                      border: 'none',
                    }}
                  >
                    Explore Programs
                  </Link>
                  <button
                    className="btn"
                    id="donateBtn"
                    type="button"
                    style={{
                      cursor: 'pointer',
                      background: '#fff',
                      color: '#047857',
                      padding: '0.75rem 1rem',
                      borderRadius: '999px',
                      fontWeight: 600,
                      border: 'none',
                    }}
                  >
                    Donate
                  </button>
                </div>
              </div>
              <div style={{ minWidth: 0 }}>
                <Image
                  className="img-hero"
                  src="/assets/images/hero_image_teens.png"
                  alt="Teenagers learning with AI"
                  width={800}
                  height={420}
                  style={{ width: '100%', height: 'auto', objectFit: 'cover', borderRadius: '12px' }}
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      <div id="why" style={{ background: '#fff', color: '#064e3b', padding: '2rem 0' }}>
        <section>
          <div className="container">
            <div style={{ textAlign: 'center', maxWidth: '56ch', margin: '0 auto 2rem' }}>
              <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#064e3b' }}>Why Creators Lab?</h2>
              <p style={{ fontSize: '1.25rem', lineHeight: 1.6, color: 'rgba(6, 78, 59, 0.7)' }}>
                We provide the tools, community, and guidance young innovators need to succeed in the AI era.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
                gap: '2rem',
                maxWidth: '80rem',
                margin: '0 auto',
              }}
            >
              <div style={{ textAlign: 'center', minWidth: 0 }}>
                <div style={{ width: '80px', height: '80px', margin: '0 auto 1rem', background: 'rgba(4,120,87,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2">
                    <path d="M12 2a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.389 5.389 0 0 1-3.14-9.8A9 9 0 0 0 12 2z"/>
                    <circle cx="12" cy="10" r="3"/>
                    <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41"/>
                  </svg>
                </div>
                <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'rgba(6, 78, 59, 0.7)' }}>
                  Use cutting-edge AI tools to code faster and more creatively than ever before.
                </p>
              </div>

              <div style={{ textAlign: 'center', minWidth: 0 }}>
                <div style={{ width: '80px', height: '80px', margin: '0 auto 1rem', background: 'rgba(4,120,87,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87m-4-12a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'rgba(6, 78, 59, 0.7)' }}>
                  Work in teams, learn git workflows, and build real products together.
                </p>
              </div>

              <div style={{ textAlign: 'center', minWidth: 0 }}>
                <div style={{ width: '80px', height: '80px', margin: '0 auto 1rem', background: 'rgba(4,120,87,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <circle cx="12" cy="12" r="6"/>
                    <circle cx="12" cy="12" r="2"/>
                  </svg>
                </div>
                <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'rgba(6, 78, 59, 0.7)' }}>
                  Focus on practical entrepreneurship, problem-solving, and presentation skills.
                </p>
              </div>

              <div style={{ textAlign: 'center', minWidth: 0 }}>
                <div style={{ width: '80px', height: '80px', margin: '0 auto 1rem', background: 'rgba(4,120,87,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                  </svg>
                </div>
                <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'rgba(6, 78, 59, 0.7)' }}>
                  Develop creativity, adaptability, and the confidence to think differently.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div id="programs" style={{ background: '#f0fdf4', borderTop: '1px solid rgba(4,120,87,.06)', borderBottom: '1px solid rgba(4,120,87,.06)' }}>
        <section className="section">
          <div className="container">
            <div style={{ textAlign: 'center', maxWidth: '56ch', margin: '0 auto' }}>
              <h2 style={{ fontSize: '1.75rem' }}>Programs</h2>
              <p className="muted">Hands-on programs that turn ideas into impact.</p>
              <p className="muted" style={{ marginTop: '0.5rem', color: 'var(--yellow-400)', fontWeight: 500 }}>
                Register for Millbrae Recreation Programs click on{' '}
                <a
                  href="https://secure.rec1.com/CA/millbrae-ca/catalog"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--yellow-400)', fontWeight: 500, textDecoration: 'underline' }}
                >
                  here
                </a>
                .
                <br />
                Register for JEI Learning Center programs click on{' '}
                <Link href="/JEI" style={{ color: 'var(--yellow-400)', fontWeight: 500, textDecoration: 'underline' }}>
                  here
                </Link>
                .
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginTop: '2rem', maxWidth: '80rem', marginLeft: 'auto', marginRight: 'auto' }}>
              {/* Program Card 1: Blender Level 1 */}
              <div className="card">
                <h3 style={{ marginTop: 0, color: 'var(--green-700)' }}>3D Product Design with Blender (Level 1)</h3>
                <div id="blender-l1-preview" className="program-card-desc-preview muted">
                  <p>Discover the art of bringing your imagination to life! In this beginner-friendly Blender class, you&apos;ll learn how 3D characters, buildings, and entire worlds are created for animated films and video games. We&apos;ll cover the essential tools of 3D modeling and how to navigate the 3D space using Blender, a powerful free software used by creators worldwide.</p>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <ProgramExpandButton mode="description" panelId="blender-l1-desc" previewId="blender-l1-preview" />
                  <div id="blender-l1-desc" style={{ display: 'none', marginTop: '0.5rem', color: 'var(--muted)', lineHeight: 1.6 }}>
                    You&apos;ll use your new skills to design and build your own castle, and get it printed on a 3D printer! No grades—just creativity, exploration, and the chance to share your final creation with the class.
                  </div>
                </div>
                <Link href="/what-we-teach" style={{ color: 'var(--yellow-400)', textDecoration: 'underline', fontWeight: 500 }}>Learn more about What We Teach →</Link>
              </div>

              {/* Program Card 2: Blender Level 2 */}
              <div className="card">
                <h3 style={{ marginTop: 0, color: 'var(--green-700)' }}>3D Product Design with Blender (Level 2)</h3>
                <p className="muted" style={{ marginBottom: '0.5rem' }}><strong>Prerequisite: 3D Product Design with Blender (Level 1)</strong></p>
                <div id="blender-l2-preview" className="program-card-desc-preview muted">
                  <p>Take your 3D skills to the next level in this immersive Level 2 Blender camp! Students dive deeper into modeling, sculpting, materials, and lighting while learning advanced tools like modifiers, rigging basics, particle effects, and scene optimization.</p>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <ProgramExpandButton mode="description" panelId="blender-l2-desc" previewId="blender-l2-preview" />
                  <div id="blender-l2-desc" style={{ display: 'none', marginTop: '0.5rem', color: 'var(--muted)', lineHeight: 1.6 }}>
                    Campers work on a more complex hero project—from characters to environments—and bring their designs to life with animation essentials. Perfect for students who completed Level 1, this camp boosts creativity, technical skills, and confidence in professional 3D design workflows.
                  </div>
                </div>
                <Link href="/what-we-teach" style={{ color: 'var(--yellow-400)', textDecoration: 'underline', fontWeight: 500 }}>Learn more about What We Teach →</Link>
              </div>

              {/* Program Card 3: Unity Level 1 */}
              <div className="card">
                <h3 style={{ marginTop: 0, color: 'var(--green-700)' }}>Unity Game Design and Intro to coding with C# (Level 1)</h3>
                <div id="unity-l1-preview" className="program-card-desc-preview muted">
                  <p>Jump into the world of game creation with this beginner-friendly Unity course! Students learn the basics of 2D game design, coding, and animation while building their very own playable platformer. Using Unity and C#, students create characters, obstacles, collectibles, and a complete level—learning real coding concepts through hands-on creativity.</p>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <ProgramExpandButton mode="description" panelId="unity-l1-desc" previewId="unity-l1-preview" />
                  <div id="unity-l1-desc" style={{ display: 'none', marginTop: '0.5rem', color: 'var(--muted)', lineHeight: 1.6 }}>
                    Perfect for beginners who want to bring their ideas to life and start their journey into game development while learning how to code!
                  </div>
                </div>
                <Link href="/what-we-teach" style={{ color: 'var(--yellow-400)', textDecoration: 'underline', fontWeight: 500 }}>Learn more about What We Teach →</Link>
              </div>

              {/* Program Card 4: Unity Level 2 */}
              <div className="card">
                <h3 style={{ marginTop: 0, color: 'var(--green-700)' }}>Unity Game Design and Intro to coding with C# (Level 2)</h3>
                <p className="muted" style={{ marginBottom: '0.5rem' }}><strong>Prerequisite: Unity Game Design Level 1</strong></p>
                <div id="unity-l2-preview" className="program-card-desc-preview muted">
                  <p>Level up your game-building skills in this advanced Unity camp! Students expand on their Level 1 foundation by creating a more complex 2D or 3D game with enhanced mechanics, polished visuals, and smarter C# scripts. They&apos;ll learn enemy AI, animations, UI menus, sound effects, and game-ready interactions while building a full playable level.</p>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <ProgramExpandButton mode="description" panelId="unity-l2-desc" previewId="unity-l2-preview" />
                  <div id="unity-l2-desc" style={{ display: 'none', marginTop: '0.5rem', color: 'var(--muted)', lineHeight: 1.6 }}>
                    Perfect for students who completed Level 1 and are ready for deeper coding, creative design challenges, and real game-development techniques. Students leave with a more advanced project they can proudly showcase and continue improving!
                  </div>
                </div>
                <Link href="/what-we-teach" style={{ color: 'var(--yellow-400)', textDecoration: 'underline', fontWeight: 500 }}>Learn more about What We Teach →</Link>
              </div>

              {/* Program Card 5: Figma */}
              <div className="card">
                <h3 style={{ marginTop: 0, color: 'var(--green-700)' }}>Product Design with Figma and Prototyping with AI Tools</h3>
                <div id="figma-preview" className="program-card-desc-preview muted">
                  <p>In this hands-on class, students will learn the core skills of digital product design using Figma and bring their ideas to life with the AI-powered IDE, Cursor. They&apos;ll work both individually and collaboratively—brainstorming, designing screens, planning user flows, and building features together as a team.</p>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <ProgramExpandButton mode="description" panelId="figma-desc" previewId="figma-preview" />
                  <div id="figma-desc" style={{ display: 'none', marginTop: '0.5rem', color: 'var(--muted)', lineHeight: 1.6 }}>
                    By the end of the course, each student will have created their own functional Study Buddy app that helps users stay organized and study more effectively—a portfolio-ready project that showcases creativity, collaboration, and technical skill for college applications.
                  </div>
                </div>
                <Link href="/what-we-teach" style={{ color: 'var(--yellow-400)', textDecoration: 'underline', fontWeight: 500 }}>Learn more about What We Teach →</Link>
              </div>

              {/* Program Card 6: Design Thinking with AI */}
              <div className="card">
                <h3 style={{ marginTop: 0, color: 'var(--green-700)' }}>Design Thinking with AI</h3>
                <div id="vibe101-preview" className="program-card-desc-preview muted" style={{ marginBottom: '0.75rem' }}>
                  <p>Perfect for beginners! Learn to code using AI as your creative partner. You&apos;ll describe what you want to build in plain English, and AI tools like Cursor IDE (Interactive Development Environment) will help generate the code.</p>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <ProgramExpandButton mode="details" panelId="vibe101-details" previewId="vibe101-preview" />
                  <div id="vibe101-details" style={{ display: 'none', marginTop: '1rem', padding: '1rem', background: '#f9fafb', borderRadius: '8px', borderLeft: '4px solid var(--green-700)' }}>
                    <h5 style={{ color: 'var(--green-700)', margin: '0 0 0.75rem', fontSize: '1rem' }}>Curriculum:</h5>
                    <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                      <li><strong>Week 1:</strong> Intro to AI in Daily Life - Scavenger hunt, AI demos, intro to IDE (Interactive Development Environment)</li>
                      <li><strong>Week 2:</strong> Setup IDE (Interactive Development Environment) & brainstorm project ideas</li>
                      <li><strong>Week 3:</strong> Present PRD (Product Requirements Document), define MVP</li>
                      <li><strong>Week 4:</strong> Design a website - planning, mockup, wireframe, troubleshooting</li>
                      <li><strong>Week 5:</strong> Mini showcase & intro to databases</li>
                      <li><strong>Week 6:</strong> Mini showcase & intro to mobile app development</li>
                      <li><strong>Week 7:</strong> Lab time to finish the project</li>
                      <li><strong>Week 8:</strong> Demo Day 🥳</li>
                    </ul>
                  </div>
                </div>
                <Link href="/what-we-teach" style={{ color: 'var(--yellow-400)', textDecoration: 'underline', fontWeight: 500 }}>Learn more about What We Teach →</Link>
              </div>

              {/* Program Card 7: Advanced Vibe Coding */}
              <div className="card">
                <h3 style={{ marginTop: 0, color: 'var(--green-700)' }}>Advanced Vibe Coding</h3>
                <p className="muted" style={{ marginBottom: '0.5rem' }}><strong>Prerequisite: AI Vibe Coding 101</strong></p>
                <div id="advanced-preview" className="program-card-desc-preview muted" style={{ marginBottom: '0.75rem' }}>
                  <p>Take your coding skills to the next level! Dive deeper into AI-powered development, advanced frameworks, and complex project architecture.</p>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <ProgramExpandButton mode="details" panelId="advanced-details" previewId="advanced-preview" />
                  <div id="advanced-details" style={{ display: 'none', marginTop: '1rem', padding: '1rem', background: '#f9fafb', borderRadius: '8px', borderLeft: '4px solid var(--green-700)' }}>
                    <h5 style={{ color: 'var(--green-700)', margin: '0 0 0.75rem', fontSize: '1rem' }}>Advanced Project Focus:</h5>
                    <p style={{ margin: '0 0 0.75rem', color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>In this program, you'll:</p>
                    <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                      <li>Build a Large Language Model (LLM) from scratch</li>
                      <li>Create your own MCP (Model Context Protocol) server from scratch</li>
                      <li>Explore integration with external services and APIs</li>
                      <li>Work on advanced AI-powered projects with real-world applications</li>
                      <li>Implement advanced debugging and optimization techniques</li>
                      <li>Deploy complex applications to production environments</li>
                    </ul>
                  </div>
                </div>
                <Link href="/what-we-teach" style={{ color: 'var(--yellow-400)', textDecoration: 'underline', fontWeight: 500 }}>Learn more about What We Teach →</Link>
              </div>

              {/* Program Card 8: Teen Venture Studio */}
              <div className="card">
                <h3 style={{ marginTop: 0, color: 'var(--green-700)' }}>Teen Venture Studio</h3>
                <div id="venture-preview" className="program-card-desc-preview muted" style={{ marginBottom: '0.75rem' }}>
                  <p>Transform from coder to entrepreneur! Build a real startup with a team, create a business plan, and pitch to industry experts at Demo Day.</p>
                </div>
                <div style={{ background: '#fefce8', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid var(--yellow-400)' }}>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--green-700)', fontWeight: 500 }}>
                    📝 <strong>Application Required:</strong> This program requires an application. <a href="https://forms.gle/nu6qJjX9hNWPE2E76" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--green-700)', textDecoration: 'underline', fontWeight: 600 }}>Apply here →</a>
                  </p>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <ProgramExpandButton mode="details" panelId="venture-details" previewId="venture-preview" />
                  <div id="venture-details" style={{ display: 'none', marginTop: '1rem', padding: '1rem', background: '#f9fafb', borderRadius: '8px', borderLeft: '4px solid var(--green-700)' }}>
                    <h5 style={{ color: 'var(--green-700)', margin: '0 0 0.75rem', fontSize: '1rem' }}>Entrepreneurship journey:</h5>
                    <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                      <li><strong>Week 1:</strong> Kickoff & Team Formation - Icebreakers, team formation, intro to Lean Startup & Design Thinking</li>
                      <li><strong>Week 2:</strong> Brainstorming & Ideation - Generate ideas, define problem statements, user interviews</li>
                      <li><strong>Week 3:</strong> Business Model & Role Definition - Build Lean Canvas, assign team roles, draft team charter</li>
                      <li><strong>Week 4:</strong> Prototyping & Validation - Low-fidelity prototypes, speed-testing, pivot or persevere</li>
                      <li><strong>Week 5:</strong> MVP Development - Build working prototype with AI coding tools, document progress</li>
                      <li><strong>Week 6:</strong> Storytelling & Pitching 101 - Build compelling pitch deck, public speaking drills</li>
                      <li><strong>Week 7:</strong> Pitch Practice & Feedback - Full run-through, peer & mentor feedback, iteration</li>
                      <li><strong>Week 8:</strong> Demo Day 🎤 - Present to parents, peers, and industry experts. Awards & celebration!</li>
                    </ul>
                  </div>
                </div>
                <div style={{ background: '#f0fdf4', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--green-700)', fontWeight: 500 }}>🎯 Demo Day: Present your startup to industry experts and potential investors!</p>
                </div>
                <Link href="/what-we-teach" style={{ color: 'var(--yellow-400)', textDecoration: 'underline', fontWeight: 500 }}>Learn more about What We Teach →</Link>
              </div>

              {/* Program Card 9: Vibe Coding Summer Camp */}
              <div className="card">
                <h3 style={{ marginTop: 0, color: 'var(--green-700)' }}>Vibe Coding Summer Camp</h3>
                <div id="summer-preview" className="program-card-desc-preview muted" style={{ marginBottom: '0.75rem' }}>
                  <p>Perfect introduction to AI-powered coding! Students are grouped by skill level. Build a complete project from idea to deployment.</p>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <ProgramExpandButton mode="details" panelId="summer-details" previewId="summer-preview" />
                  <div id="summer-details" style={{ display: 'none', marginTop: '1rem', padding: '1rem', background: '#f9fafb', borderRadius: '8px', borderLeft: '4px solid var(--green-700)' }}>
                    <div style={{ marginBottom: '1rem' }}>
                      <h5 style={{ color: 'var(--green-700)', margin: '0 0 0.5rem', fontSize: '1rem' }}>Daily rhythm:</h5>
                      <p style={{ margin: '0 0 0.75rem', color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                        Each day balances warm-ups, mini-lessons, guided labs, project work, and share-outs.
                      </p>
                    </div>
                    <h5 style={{ color: 'var(--green-700)', margin: '0 0 0.75rem', fontSize: '1rem' }}>Program sessions:</h5>
                    <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                      <li><strong>Day 1:</strong> Welcome to Vibe Coding + AI Basics - Icebreaker, intro to natural language programming, create first Git repo</li>
                      <li><strong>Day 2:</strong> Collaboration with Git + Idea Brainstorm - Git basics (clone, commit, push, pull), intro to MVP, brainstorm product ideas in teams</li>
                      <li><strong>Day 3:</strong> Prototyping with AI Tools - Build first version of MVP with AI coding help, document progress in Git</li>
                      <li><strong>Day 4:</strong> Iteration + User Feedback - Test & improve MVP, role-play user feedback, presentation skills workshop</li>
                      <li><strong>Day 5:</strong> Demo Day 🎤 - Teams present 5-minute pitch (Problem → Solution → Demo → Next Steps), awards & celebration!</li>
                    </ul>
                  </div>
                </div>
                <div style={{ background: '#fefce8', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid var(--yellow-400)' }}>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--green-700)', fontWeight: 500 }}>☀️ Perfect for summer learning! Students leave with a working project and new AI coding skills.</p>
                </div>
                <Link href="/what-we-teach" style={{ color: 'var(--yellow-400)', textDecoration: 'underline', fontWeight: 500 }}>Learn more about What We Teach →</Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section id="contact" style={{ backgroundColor: '#f9fafb', padding: '3rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h3 style={{ marginTop: 0, color: 'var(--green-700)', fontSize: '2rem', fontWeight: 700 }}>Contact Us</h3>
            <p style={{ color: 'var(--muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>Get in touch with us to learn more about our programs or ask any questions.</p>
          </div>
          
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <form id="contactForm" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <input type="text" id="name" name="name" placeholder="Your Name" required style={{ flex: 1, minWidth: '200px', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '1rem' }} />
                <input type="email" id="email" name="email" placeholder="Your Email" required style={{ flex: 1, minWidth: '200px', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '1rem' }} />
              </div>
              <select id="category" name="category" required style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '1rem', background: '#fff' }}>
                <option value="">Select Category</option>
                <option value="Program Questions">Program Questions</option>
                <option value="Feedback">Feedback</option>
                <option value="Technical Support">Technical Support</option>
                <option value="Volunteering">Volunteering</option>
                <option value="Partnership">Partnership</option>
                <option value="Other">Other</option>
              </select>
              <textarea id="message" name="message" placeholder="Your Message" rows={5} required style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '1rem', resize: 'vertical', minHeight: '120px' }} />
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--green-700)' }}>
                  Human Verification *
                </label>
                <div id="recaptcha-container" />
              </div>
              <button type="submit" style={{ background: 'var(--green-700)', color: '#fff', padding: '0.75rem 1.5rem', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', transition: 'background 0.3s ease' }}>Send Message</button>
            </form>
          </div>
        </div>
      </section>

      {/* Donation Modal */}
      <div id="donationModal" style={{ display: 'none', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 1000, alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: '#fff', borderRadius: '12px', padding: '2rem', maxWidth: '500px', width: '90%', margin: '2rem auto', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0, color: 'var(--green-700)', fontSize: '1.5rem' }}>Support Creators Lab</h3>
            <button id="closeDonationModal" style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--muted)', padding: 0, width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Close">&times;</button>
          </div>
          <p style={{ color: 'var(--muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>Your donation helps us empower the next generation of innovators. Every contribution makes a difference!</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <button className="donation-amount-btn" data-amount="25" style={{ padding: '0.75rem', border: '2px solid var(--green-700)', background: '#fff', color: 'var(--green-700)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.3s ease' }}>$25</button>
            <button className="donation-amount-btn" data-amount="50" style={{ padding: '0.75rem', border: '2px solid var(--green-700)', background: '#fff', color: 'var(--green-700)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.3s ease' }}>$50</button>
            <button className="donation-amount-btn" data-amount="100" style={{ padding: '0.75rem', border: '2px solid var(--green-700)', background: '#fff', color: 'var(--green-700)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.3s ease' }}>$100</button>
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="customAmount" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--green-700)' }}>Custom Amount</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: 'var(--muted)' }}>$</span>
              <input type="number" id="customAmount" placeholder="Enter amount" min="1" step="0.01" style={{ flex: 1, padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '1rem' }} />
            </div>
          </div>
          <button id="proceedDonation" style={{ width: '100%', padding: '0.75rem 1.5rem', background: 'var(--green-700)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', transition: 'background 0.3s ease' }} disabled>Proceed to Payment</button>
          <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '1rem', textAlign: 'center' }}>Secure payment powered by Stripe</p>
        </div>
      </div>

      {/* Donation Success Modal */}
      <div id="donationSuccessModal" style={{ display: 'none', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 1001, alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: '#fff', borderRadius: '12px', padding: '2.5rem', maxWidth: '550px', width: '90%', margin: '2rem auto', boxShadow: '0 10px 40px rgba(0,0,0,0.2)', textAlign: 'center', position: 'relative' }}>
          <button id="closeSuccessModal" style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--muted)', padding: 0, width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Close">&times;</button>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ margin: '0 0 1rem', color: 'var(--green-700)', fontSize: '2.5rem', fontWeight: 700, letterSpacing: '2px' }}>THANK YOU</h2>
          </div>
          
          <p style={{ color: 'var(--muted)', marginBottom: '1.5rem', lineHeight: 1.7, fontSize: '1.1rem' }}>
            Thank you for making a donation to Creators Lab! Your generous gift helps us empower the next generation of innovators and entrepreneurs.
          </p>
          
          <p style={{ color: 'var(--muted)', marginBottom: '2rem', lineHeight: 1.7, fontSize: '0.95rem' }}>
            You will receive a receipt via email that you can use for tax purposes. Your transaction will appear on your card statement as &quot;Creators Lab&quot;.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
            <a href="https://www.facebook.com/profile.php?id=61582517454567" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '0.875rem 2rem', background: '#1877F2', color: '#fff', textDecoration: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '1rem', transition: 'background 0.3s ease', textAlign: 'center' }}>
              Follow us on Facebook
            </a>
            <button id="closeSuccessModalBtn" style={{ padding: '0.875rem 2rem', background: 'var(--green-700)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', transition: 'background 0.3s ease' }}>
              Close
            </button>
          </div>
        </div>
      </div>

      <HomePageClient />
    </PageLayout>
  )
}
