import Script from 'next/script'
import Link from 'next/link'
import Image from 'next/image'
import HomePageClient from '@/components/creators-lab/HomePageClient'

export const metadata = {
  title: 'CreatorsLab — Enrich Youth Innovations',
  description: 'Empower the next generation to dream big, build boldly, and innovate fearlessly.',
}

export default function Home() {
  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-85L4ZPPPP0"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-85L4ZPPPP0');
        `}
      </Script>

      <header>
        <div className="container nav" style={{ justifyContent: 'space-between' }}>
          <Link className="brand" href="#home" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Image
              src="/assets/images/creatorslab_logo.png"
              alt="CreatorsLab"
              width={150}
              height={59}
              style={{ height: '3.69140625em', display: 'inline-block', verticalAlign: 'middle', marginRight: '12px' }}
            />
          </Link>
          <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link href="/" style={{ textDecoration: 'none', color: 'var(--green-900)', fontSize: '1rem', fontWeight: 500 }}>Home</Link>
            <Link href="/what-we-teach" style={{ textDecoration: 'none', color: 'var(--green-900)', fontSize: '1rem', fontWeight: 500 }}>What We Teach</Link>
            <Link href="#programs" style={{ textDecoration: 'none', color: 'var(--green-900)', fontSize: '1rem', fontWeight: 500 }}>Explore Programs</Link>
            <Link href="/showcase" style={{ textDecoration: 'none', color: 'var(--green-900)', fontSize: '1rem', fontWeight: 500 }}>Showcase</Link>
            <Link href="/resources" style={{ textDecoration: 'none', color: 'var(--green-900)', fontSize: '1rem', fontWeight: 500 }}>Resources</Link>
            <Link href="/events" style={{ textDecoration: 'none', color: 'var(--green-900)', fontSize: '1rem', fontWeight: 500 }}>Events</Link>
            <Link href="#contact" style={{ textDecoration: 'none', color: 'var(--green-900)', fontSize: '1rem', fontWeight: 500 }}>Contact Us</Link>
            <div className="search-container">
              <div className="search-icon" id="searchIcon" aria-label="Search">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="search-input-wrapper" id="searchInputWrapper">
                <input type="text" className="search-input" id="searchInput" placeholder="Search..." aria-label="Search input" />
                <div className="search-results" id="searchResults"></div>
              </div>
            </div>
          </nav>
        </div>
      </header>

      <div id="home" className="hero">
        <section>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'center' }}>
              <div>
                <h1>Empower Youth Innovations</h1>
                <p className="muted">At CreatorsLab, we empower the next generation to dream big, build boldly, and innovate fearlessly. Our mission is to equip teens with the creativity, confidence, and entrepreneurial mindset to thrive in a world shaped by AI and innovation — one community, one project, one young creator at a time.</p>
                <div style={{ marginTop: '1rem', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <Link className="btn" href="#programs">Explore Programs</Link>
                  <button className="btn" id="donateBtn" style={{ cursor: 'pointer' }}>Donate</button>
                </div>
              </div>
              <div>
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

      <div id="announcements" style={{ background: '#fefce8', borderTop: '1px solid var(--yellow-400)', borderBottom: '1px solid var(--yellow-400)', padding: '1.5rem 0' }}>
        <div className="container">
          <div id="announcements-container" style={{ display: 'none' }} />
        </div>
      </div>

      <div id="why" style={{ background: '#fff', color: 'var(--green-900)', padding: '2rem 0' }}>
        <section>
          <div className="container">
            <div style={{ textAlign: 'center', maxWidth: '56ch', margin: '0 auto 2rem' }}>
              <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Why CreatorsLab?</h2>
              <p style={{ fontSize: '1.25rem', lineHeight: 1.6, color: 'var(--muted)' }}>We provide the tools, community, and guidance young innovators need to succeed in the AI era.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', maxWidth: '80rem', margin: '0 auto' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '80px', height: '80px', margin: '0 auto 1rem', background: 'rgba(4,120,87,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--green-700)" strokeWidth="2">
                    <path d="M12 2a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.389 5.389 0 0 1-3.14-9.8A9 9 0 0 0 12 2z"/>
                    <circle cx="12" cy="10" r="3"/>
                    <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41"/>
                  </svg>
                </div>
                <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--muted)' }}>Use cutting-edge AI tools to code faster and more creatively than ever before.</p>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '80px', height: '80px', margin: '0 auto 1rem', background: 'rgba(4,120,87,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--green-700)" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87m-4-12a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--muted)' }}>Work in teams, learn git workflows, and build real products together.</p>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '80px', height: '80px', margin: '0 auto 1rem', background: 'rgba(4,120,87,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--green-700)" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <circle cx="12" cy="12" r="6"/>
                    <circle cx="12" cy="12" r="2"/>
                  </svg>
                </div>
                <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--muted)' }}>Focus on practical entrepreneurship, problem-solving, and presentation skills.</p>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '80px', height: '80px', margin: '0 auto 1rem', background: 'rgba(4,120,87,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--green-700)" strokeWidth="2">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                  </svg>
                </div>
                <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--muted)' }}>Develop creativity, adaptability, and the confidence to think differently.</p>
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
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', margin: '2rem 0', flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'center' }}>
                <h4 style={{ color: 'var(--green-700)', marginBottom: '0.5rem' }}>Required Equipment</h4>
                <p className="muted" style={{ margin: 0 }}>Mac or Windows PC</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <h4 style={{ color: 'var(--green-700)', marginBottom: '0.5rem' }}>In-Person Classes</h4>
                <p className="muted" style={{ margin: 0 }}>477 Lincoln Circle</p>
                <p className="muted" style={{ margin: 0 }}>Millbrae, CA 94030</p>
                <a href="https://maps.google.com/?q=477+Lincoln+Circle+Millbrae+CA+94030" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--yellow-400)', textDecoration: 'none', fontSize: '0.9rem' }}>View Map</a>
              </div>
              <div style={{ textAlign: 'center' }}>
                <h4 style={{ color: 'var(--green-700)', marginBottom: '0.5rem' }}>Register for Classes</h4>
                <a href="https://secure.rec1.com/CA/millbrae-ca/catalog" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--yellow-400)', textDecoration: 'none', fontSize: '0.9rem' }}>Millbrae Recreation Portal</a>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginTop: '1.5rem', maxWidth: '80rem', marginLeft: 'auto', marginRight: 'auto' }}>
              {/* Program Card 1: Blender Level 1 */}
              <div className="card">
                <h3 style={{ marginTop: 0, color: 'var(--green-700)' }}>3D Product Design with Blender (Level 1)</h3>
                <p className="muted" style={{ marginBottom: '0.5rem' }}><strong>Ages 12-17 • 8 weeks • 90-minute sessions</strong></p>
                <p className="muted" style={{ marginBottom: '0.5rem' }}>Discover the art of bringing your imagination to life! In this beginner-friendly Blender class, you'll learn how 3D characters, buildings, and entire worlds are created for animated films and video games. We'll cover the essential tools of 3D modeling and how to navigate the 3D space using Blender, a powerful free software used by creators worldwide.</p>
                <div style={{ marginBottom: '1rem' }}>
                  <button data-toggle="description" data-target="blender-l1-desc" style={{ background: 'none', border: 'none', color: 'var(--yellow-400)', textDecoration: 'underline', fontWeight: 500, cursor: 'pointer', padding: 0, fontSize: '0.9rem' }}>
                    Show Details ↓
                  </button>
                  <div id="blender-l1-desc" style={{ display: 'none', marginTop: '0.5rem', color: 'var(--muted)', lineHeight: 1.6 }}>
                    Over eight weeks, you'll use your new skills to design and build your own castle, and get it printed on a 3D printer! No grades—just creativity, exploration, and the chance to share your final creation with the class.
                  </div>
                </div>
                <Link href="/what-we-teach" style={{ color: 'var(--yellow-400)', textDecoration: 'underline', fontWeight: 500 }}>Learn more about What We Teach →</Link>
              </div>

              {/* Program Card 2: Blender Level 2 */}
              <div className="card">
                <h3 style={{ marginTop: 0, color: 'var(--green-700)' }}>🏰 3D Product Design with Blender: Create Your Own 3D Castle! (Level 2)</h3>
                <p className="muted" style={{ marginBottom: '0.5rem' }}><strong>Ages 12-17 • 5 days • 3 hours each • Prerequisite: 3D Product Design with Blender (Level 1)</strong></p>
                <p className="muted" style={{ marginBottom: '0.5rem' }}>Take your 3D skills to the next level in this immersive Level 2 Blender camp! Over five days (3 hours each), students dive deeper into modeling, sculpting, materials, and lighting while learning advanced tools like modifiers, rigging basics, particle effects, and scene optimization.</p>
                <div style={{ marginBottom: '1rem' }}>
                  <button data-toggle="description" data-target="blender-l2-desc" style={{ background: 'none', border: 'none', color: 'var(--yellow-400)', textDecoration: 'underline', fontWeight: 500, cursor: 'pointer', padding: 0, fontSize: '0.9rem' }}>
                    Show Details ↓
                  </button>
                  <div id="blender-l2-desc" style={{ display: 'none', marginTop: '0.5rem', color: 'var(--muted)', lineHeight: 1.6 }}>
                    Campers work on a more complex hero project—from characters to environments—and bring their designs to life with animation essentials. Perfect for students who completed Level 1, this camp boosts creativity, technical skills, and confidence in professional 3D design workflows.
                  </div>
                </div>
                <Link href="/what-we-teach" style={{ color: 'var(--yellow-400)', textDecoration: 'underline', fontWeight: 500 }}>Learn more about What We Teach →</Link>
              </div>

              {/* Program Card 3: Unity Level 1 */}
              <div className="card">
                <h3 style={{ marginTop: 0, color: 'var(--green-700)' }}>Unity Game Design and Intro to coding with C# (Level 1)</h3>
                <p className="muted" style={{ marginBottom: '0.5rem' }}><strong>Ages 12-17 • 8 weeks • 90-minute sessions</strong></p>
                <p className="muted" style={{ marginBottom: '0.5rem' }}>Jump into the world of game creation with this beginner-friendly Unity course! Over 8 fun weeks, students learn the basics of 2D game design, coding, and animation while building their very own playable platformer. Using Unity and C#, students create characters, obstacles, collectibles, and a complete level—learning real coding concepts through hands-on creativity.</p>
                <div style={{ marginBottom: '1rem' }}>
                  <button data-toggle="description" data-target="unity-l1-desc" style={{ background: 'none', border: 'none', color: 'var(--yellow-400)', textDecoration: 'underline', fontWeight: 500, cursor: 'pointer', padding: 0, fontSize: '0.9rem' }}>
                    Show Details ↓
                  </button>
                  <div id="unity-l1-desc" style={{ display: 'none', marginTop: '0.5rem', color: 'var(--muted)', lineHeight: 1.6 }}>
                    Perfect for beginners who want to bring their ideas to life and start their journey into game development while learning how to code!
                  </div>
                </div>
                <Link href="/what-we-teach" style={{ color: 'var(--yellow-400)', textDecoration: 'underline', fontWeight: 500 }}>Learn more about What We Teach →</Link>
              </div>

              {/* Program Card 4: Unity Level 2 */}
              <div className="card">
                <h3 style={{ marginTop: 0, color: 'var(--green-700)' }}>Unity Game Design and Intro to coding with C# (Level 2)</h3>
                <p className="muted" style={{ marginBottom: '0.5rem' }}><strong>Ages 12-17 • 5 days • 3 hours each • Prerequisite: Unity Game Design Level 1</strong></p>
                <p className="muted" style={{ marginBottom: '0.5rem' }}>Level up your game-building skills in this advanced Unity camp! Over five days (3 hours each), students expand on their Level 1 foundation by creating a more complex 2D or 3D game with enhanced mechanics, polished visuals, and smarter C# scripts. They'll learn enemy AI, animations, UI menus, sound effects, and game-ready interactions while building a full playable level.</p>
                <div style={{ marginBottom: '1rem' }}>
                  <button data-toggle="description" data-target="unity-l2-desc" style={{ background: 'none', border: 'none', color: 'var(--yellow-400)', textDecoration: 'underline', fontWeight: 500, cursor: 'pointer', padding: 0, fontSize: '0.9rem' }}>
                    Show Details ↓
                  </button>
                  <div id="unity-l2-desc" style={{ display: 'none', marginTop: '0.5rem', color: 'var(--muted)', lineHeight: 1.6 }}>
                    Perfect for students who completed Level 1 and are ready for deeper coding, creative design challenges, and real game-development techniques. Students leave with a more advanced project they can proudly showcase and continue improving!
                  </div>
                </div>
                <Link href="/what-we-teach" style={{ color: 'var(--yellow-400)', textDecoration: 'underline', fontWeight: 500 }}>Learn more about What We Teach →</Link>
              </div>

              {/* Program Card 5: Figma */}
              <div className="card">
                <h3 style={{ marginTop: 0, color: 'var(--green-700)' }}>Product Design with Figma and Prototyping with AI Tools</h3>
                <p className="muted" style={{ marginBottom: '0.5rem' }}><strong>Ages 12-17 • 8 weeks • 90-minute sessions</strong></p>
                <p className="muted" style={{ marginBottom: '0.5rem' }}>In this hands-on class, students will learn the core skills of digital product design using Figma and bring their ideas to life with the AI-powered IDE, Cursor. Over the 8-week program, they'll work both individually and collaboratively—brainstorming, designing screens, planning user flows, and building features together as a team.</p>
                <div style={{ marginBottom: '1rem' }}>
                  <button data-toggle="description" data-target="figma-desc" style={{ background: 'none', border: 'none', color: 'var(--yellow-400)', textDecoration: 'underline', fontWeight: 500, cursor: 'pointer', padding: 0, fontSize: '0.9rem' }}>
                    Show Details ↓
                  </button>
                  <div id="figma-desc" style={{ display: 'none', marginTop: '0.5rem', color: 'var(--muted)', lineHeight: 1.6 }}>
                    By the end of the course, each student will have created their own functional Study Buddy app that helps users stay organized and study more effectively—a portfolio-ready project that showcases creativity, collaboration, and technical skill for college applications.
                  </div>
                </div>
                <Link href="/what-we-teach" style={{ color: 'var(--yellow-400)', textDecoration: 'underline', fontWeight: 500 }}>Learn more about What We Teach →</Link>
              </div>

              {/* Program Card 6: Design Thinking with AI */}
              <div className="card">
                <h3 style={{ marginTop: 0, color: 'var(--green-700)' }}>Design Thinking with AI</h3>
                <p className="muted" style={{ marginBottom: '0.5rem' }}><strong>Ages 12-17 • 8 weeks • 90-minute sessions</strong></p>
                <p className="muted" style={{ marginBottom: '0.75rem' }}>Perfect for beginners! Learn to code using AI as your creative partner. You'll describe what you want to build in plain English, and AI tools like Cursor IDE (Interactive Development Environment) will help generate the code.</p>
                <div style={{ marginBottom: '1rem' }}>
                  <button data-toggle="details" data-target="vibe101-details" style={{ background: 'none', border: 'none', color: 'var(--yellow-400)', textDecoration: 'underline', fontWeight: 500, cursor: 'pointer', padding: 0, fontSize: '0.9rem' }}>
                    Show Detailed Curriculum ↓
                  </button>
                  <div id="vibe101-details" style={{ display: 'none', marginTop: '1rem', padding: '1rem', background: '#f9fafb', borderRadius: '8px', borderLeft: '4px solid var(--green-700)' }}>
                    <h5 style={{ color: 'var(--green-700)', margin: '0 0 0.75rem', fontSize: '1rem' }}>8-Week Curriculum:</h5>
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
                <p className="muted" style={{ marginBottom: '0.5rem' }}><strong>Ages 14-17 • 8 weeks • Prerequisite: AI Vibe Coding 101</strong></p>
                <p className="muted" style={{ marginBottom: '0.75rem' }}>Take your coding skills to the next level! Dive deeper into AI-powered development, advanced frameworks, and complex project architecture.</p>
                <div style={{ marginBottom: '1rem' }}>
                  <button data-toggle="details" data-target="advanced-details" style={{ background: 'none', border: 'none', color: 'var(--yellow-400)', textDecoration: 'underline', fontWeight: 500, cursor: 'pointer', padding: 0, fontSize: '0.9rem' }}>
                    Show Detailed Curriculum ↓
                  </button>
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
                <p className="muted" style={{ marginBottom: '0.5rem' }}><strong>Ages 14-17 • 8 weeks • Application Required</strong></p>
                <p className="muted" style={{ marginBottom: '0.75rem' }}>Transform from coder to entrepreneur! Build a real startup with a team, create a business plan, and pitch to industry experts at Demo Day.</p>
                <div style={{ background: '#fefce8', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid var(--yellow-400)' }}>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--green-700)', fontWeight: 500 }}>
                    📝 <strong>Application Required:</strong> This program requires an application. <a href="https://forms.gle/nu6qJjX9hNWPE2E76" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--green-700)', textDecoration: 'underline', fontWeight: 600 }}>Apply here →</a>
                  </p>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <button data-toggle="details" data-target="venture-details" style={{ background: 'none', border: 'none', color: 'var(--yellow-400)', textDecoration: 'underline', fontWeight: 500, cursor: 'pointer', padding: 0, fontSize: '0.9rem' }}>
                    Show Detailed Curriculum ↓
                  </button>
                  <div id="venture-details" style={{ display: 'none', marginTop: '1rem', padding: '1rem', background: '#f9fafb', borderRadius: '8px', borderLeft: '4px solid var(--green-700)' }}>
                    <h5 style={{ color: 'var(--green-700)', margin: '0 0 0.75rem', fontSize: '1rem' }}>8-Week Entrepreneurship Journey:</h5>
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
                <p className="muted" style={{ marginBottom: '0.5rem' }}><strong>Ages 12-17 • 1 Week • Half-Day Program (9:00 AM – 12:30 PM)</strong></p>
                <p className="muted" style={{ marginBottom: '0.75rem' }}>Perfect introduction to AI-powered coding! Students are grouped by skill and age. Build a complete project from idea to deployment in just one week.</p>
                <div style={{ marginBottom: '1rem' }}>
                  <button data-toggle="details" data-target="summer-details" style={{ background: 'none', border: 'none', color: 'var(--yellow-400)', textDecoration: 'underline', fontWeight: 500, cursor: 'pointer', padding: 0, fontSize: '0.9rem' }}>
                    Show Detailed Curriculum ↓
                  </button>
                  <div id="summer-details" style={{ display: 'none', marginTop: '1rem', padding: '1rem', background: '#f9fafb', borderRadius: '8px', borderLeft: '4px solid var(--green-700)' }}>
                    <div style={{ marginBottom: '1rem' }}>
                      <h5 style={{ color: 'var(--green-700)', margin: '0 0 0.5rem', fontSize: '1rem' }}>Daily Schedule Format:</h5>
                      <p style={{ margin: '0 0 0.75rem', color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                        <strong>Warm-up (15m) → Mini-lesson (30m) → Guided lab (60m) → Break (15m) → Project work (75m) → Share-out (15m)</strong>
                      </p>
                    </div>
                    <h5 style={{ color: 'var(--green-700)', margin: '0 0 0.75rem', fontSize: '1rem' }}>5-Day Intensive Program:</h5>
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

      <footer>
        <section>
          <div className="container">
            <div className="footer-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                <Link href="/about" style={{ color: '#fff', textDecoration: 'none' }}>About Us</Link>
                <Link href="/careers" style={{ color: '#fff', textDecoration: 'none' }}>Careers</Link>
                <Link href="/login" style={{ color: '#fff', textDecoration: 'none' }}>Member Login</Link>
                <a href="https://www.facebook.com/profile.php?id=61582517454567" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }} aria-label="Follow us on Facebook">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </div>
              <div className="center">© {new Date().getFullYear()} Creators Lab (a Rokk Research LLC company) • All rights reserved. • EIN: 83-4291515</div>
              <div style={{ display: 'flex', gap: '12px' }}><Link href="#home" style={{ color: '#fff' }}>Back to top</Link></div>
            </div>
          </div>
        </section>
      </footer>

      {/* Donation Modal */}
      <div id="donationModal" style={{ display: 'none', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 1000, alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: '#fff', borderRadius: '12px', padding: '2rem', maxWidth: '500px', width: '90%', margin: '2rem auto', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0, color: 'var(--green-700)', fontSize: '1.5rem' }}>Support CreatorsLab</h3>
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
            Thank you for making a donation to CreatorsLab! Your generous gift helps us empower the next generation of innovators and entrepreneurs.
          </p>
          
          <p style={{ color: 'var(--muted)', marginBottom: '2rem', lineHeight: 1.7, fontSize: '0.95rem' }}>
            You will receive a receipt via email that you can use for tax purposes. Your transaction will appear on your card statement as &quot;CreatorsLab&quot;.
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
    </>
  )
}
