import Link from 'next/link'
import PageLayout from '@/components/creators-lab/PageLayout'
import ResourcesClient from '@/components/creators-lab/ResourcesClient'

export const metadata = {
  title: 'Resources — For Parents',
  description: 'Essential information, tools, and insights for parents and students.',
}

export default function ResourcesPage() {
  return (
    <PageLayout>
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '56ch', margin: '0 auto 3rem' }}>
            <h1 style={{ color: 'var(--green-700)', fontSize: '2.5rem', marginBottom: '1rem' }}>Resources</h1>
            <p className="muted" style={{ fontSize: '1.125rem', lineHeight: 1.6 }}>
              Essential information, tools, and insights for parents and students. Stay updated with the latest trends in AI education and access the resources you need to support your child's learning journey.
            </p>
          </div>

          <div className="card">
            <h2 style={{ color: 'var(--green-700)', marginTop: 0, marginBottom: '1.5rem' }}>Industry News & Insights</h2>
            <p className="muted" style={{ marginBottom: '2rem' }}>Stay updated with the latest trends in AI education, vibe coding, and tech innovation.</p>
            
            <div id="news-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)' }}>Loading news feed...</div>
            </div>
          </div>

          <div className="card" style={{ background: '#f0fdf4', padding: '2rem' }}>
            <h2 style={{ color: 'var(--green-700)', marginTop: 0 }}>Why it's important for your kids</h2>
            <div style={{ fontSize: '1rem', lineHeight: 1.8 }}>
              <p style={{ marginBottom: '1rem' }}>In today's rapidly evolving digital landscape, understanding AI and modern development practices isn't just beneficial—it's essential. Here's why our approach matters:</p>
              <ul style={{ paddingLeft: '1.5rem' }}>
                <li style={{ marginBottom: '0.5rem' }}><strong>Future-Ready Skills:</strong> AI is transforming every industry. Students who understand AI tools will have a significant advantage in their careers.</li>
                <li style={{ marginBottom: '0.5rem' }}><strong>Critical Thinking:</strong> Learning to work with AI develops problem-solving skills and teaches students to think critically about technology.</li>
                <li style={{ marginBottom: '0.5rem' }}><strong>Creativity & Innovation:</strong> AI tools amplify human creativity, allowing students to build more sophisticated projects and explore new possibilities.</li>
                <li style={{ marginBottom: '0.5rem' }}><strong>Real-World Application:</strong> Our students build actual projects that solve real problems, not just theoretical exercises.</li>
                <li style={{ marginBottom: '0.5rem' }}><strong>Ethical Understanding:</strong> We teach responsible AI use, helping students understand both the power and limitations of these tools.</li>
              </ul>
            </div>
          </div>

          <div className="card">
            <h2 style={{ color: 'var(--green-700)', marginTop: 0 }}>Third Party Tools</h2>
            <div style={{ fontSize: '1rem', lineHeight: 1.8 }}>
              <p style={{ marginBottom: '1rem' }}>We introduce students to industry-standard tools that professionals use every day:</p>
              <ul style={{ paddingLeft: '1.5rem' }}>
                <li style={{ marginBottom: '0.5rem' }}><strong>GitHub:</strong> Version control and collaboration platform for code management</li>
                <li style={{ marginBottom: '0.5rem' }}><strong>Windsurf IDE (Interactive Development Environment):</strong> AI-powered development environment for efficient coding</li>
                <li style={{ marginBottom: '0.5rem' }}><strong>Cursor IDE:</strong> Advanced AI code editor for enhanced productivity</li>
                <li style={{ marginBottom: '0.5rem' }}><strong>Lovable:</strong> AI-powered app development platform for rapid prototyping</li>
                <li style={{ marginBottom: '0.5rem' }}><strong>Figma:</strong> Collaborative design and prototyping tool for digital products</li>
                <li style={{ marginBottom: '0.5rem' }}><strong>Blender:</strong> Professional 3D modeling and animation software</li>
                <li style={{ marginBottom: '0.5rem' }}><strong>Unity:</strong> Game development engine for creating interactive experiences</li>
                <li style={{ marginBottom: '0.5rem' }}><strong>OpenAI API:</strong> Integration with AI models for intelligent applications</li>
                <li style={{ marginBottom: '0.5rem' }}><strong>Vercel/Netlify:</strong> Modern deployment platforms for web applications</li>
              </ul>
              <p style={{ marginTop: '1rem', fontStyle: 'italic' }}>All tools are introduced and used in a supervised, age-appropriate way. Instructors will walk students through account setup, environment configuration, and responsible tool use. Depending on the class, students may or may not use all the tools listed.</p>
            </div>
          </div>

          <div className="card" style={{ background: '#f0fdf4', padding: '2rem' }}>
            <h2 style={{ color: 'var(--green-700)', marginTop: 0 }}>Learning Resources</h2>
            <div style={{ fontSize: '1rem', lineHeight: 1.8 }}>
              <p style={{ marginBottom: '1rem' }}>Essential videos for understanding entrepreneurship and innovation:</p>
              <ul style={{ paddingLeft: '1.5rem' }}>
                <li style={{ marginBottom: '0.5rem' }}><a href="https://youtu.be/u4ZoJKF_VuA" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--yellow-400)', textDecoration: 'none', fontWeight: 500 }}>Start with Why – Simon Sinek</a></li>
                <li style={{ marginBottom: '0.5rem' }}><a href="https://www.youtube.com/watch?v=fEvKo90qBns" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--yellow-400)', textDecoration: 'none', fontWeight: 500 }}>Lean Startup – Eric Ries</a></li>
                <li style={{ marginBottom: '0.5rem' }}><a href="https://www.youtube.com/watch?v=UF8uR6Z6KLc" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--yellow-400)', textDecoration: 'none', fontWeight: 500 }}>How Great Leaders Inspire Action – Simon Sinek</a></li>
              </ul>
            </div>
          </div>

          <div className="card">
            <h2 style={{ color: 'var(--green-700)', marginTop: 0, marginBottom: '1.5rem' }}>👨‍👩‍👧 Parent FAQ</h2>
            <p className="muted" style={{ marginBottom: '2rem', fontSize: '1rem', lineHeight: 1.6 }}>
              At Creators-Lab, we know that choosing the right enrichment program for your child is an important decision. Below are answers to common questions from parents and guardians about how we keep learning engaging, safe, and meaningful.
            </p>
            
            <div style={{ fontSize: '1rem', lineHeight: 1.8 }}>
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: 'var(--green-700)', marginBottom: '0.75rem' }}>💻 Do students need prior coding experience?</h3>
                <p style={{ margin: 0 }}>No experience is required. We meet students where they are — beginners learn core concepts through guided AI tools, while more advanced students are encouraged to take on leadership and creative roles.</p>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: 'var(--green-700)', marginBottom: '0.75rem' }}>🧒 What age groups are the programs designed for?</h3>
                <ul style={{ paddingLeft: '1.5rem', marginBottom: '0.75rem' }}>
                  <li style={{ marginBottom: '0.5rem' }}><strong>Vibe Coding:</strong> Ages 12–17 (Separate sessions for 12–14 and 15–17 based on experience level)</li>
                  <li style={{ marginBottom: '0.5rem' }}><strong>Teen Venture Studio:</strong> Ages 14–17 (High School)</li>
                </ul>
                <p style={{ margin: 0 }}>Each class is age-appropriate, project-based, and emphasizes teamwork and creativity.</p>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: 'var(--green-700)', marginBottom: '0.75rem' }}>🔒 How do you protect student privacy and data?</h3>
                <p style={{ marginBottom: '0.75rem' }}>Student safety and privacy are top priorities.</p>
                <ul style={{ paddingLeft: '1.5rem', marginBottom: '0.75rem' }}>
                  <li style={{ marginBottom: '0.5rem' }}>We use secure, age-appropriate tools with limited data sharing.</li>
                  <li style={{ marginBottom: '0.5rem' }}>Students are taught to avoid entering personal or identifying information into AI tools.</li>
                  <li style={{ marginBottom: '0.5rem' }}>All activities are supervised by instructors.</li>
                  <li style={{ marginBottom: '0.5rem' }}>Projects are saved locally or within school-managed accounts whenever possible.</li>
                </ul>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: 'var(--green-700)', marginBottom: '0.75rem' }}>💬 What is the class size and environment like?</h3>
                <p style={{ margin: 0 }}>We keep classes small (typically 12–16 students) to ensure personalized attention and mentorship.<br /><br />The environment is collaborative, supportive, and inclusive — designed to encourage curiosity and creativity in every learner.</p>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: 'var(--green-700)', marginBottom: '0.75rem' }}>💡 How is this different from other coding programs?</h3>
                <p style={{ margin: 0 }}>Most coding camps focus only on syntax or pre-scripted projects. Creators-Lab teaches AI-powered creation and entrepreneurship — students learn how to think like innovators, not just coders.<br /><br />We blend design, technology, and teamwork to prepare students for a world where creativity and problem-solving matter as much as technical skill.</p>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: 'var(--green-700)', marginBottom: '0.75rem' }}>⏰ What if my child misses a class?</h3>
                <p style={{ margin: 0 }}>Each session includes a recap and project checkpoint, so students can easily catch up. Instructors and assistants are available to help during class time to ensure everyone stays on track.</p>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: 'var(--green-700)', marginBottom: '0.75rem' }}>💬 How can parents get involved or stay updated?</h3>
                <p style={{ marginBottom: '0.75rem' }}>We love parent involvement!</p>
                <ul style={{ paddingLeft: '1.5rem', marginBottom: '0.75rem' }}>
                  <li style={{ marginBottom: '0.5rem' }}>Attend Demo Days, where students present their final projects.</li>
                  <li style={{ marginBottom: '0.5rem' }}>Subscribe to our newsletter for updates on new programs and student highlights.</li>
                  <li style={{ marginBottom: '0.5rem' }}>Follow us on social media or visit <a href="https://creators-lab.org" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--yellow-400)', textDecoration: 'none', fontWeight: 500 }}>creators-lab.org</a> for upcoming events and community workshops.</li>
                </ul>
              </div>

              <div style={{ marginBottom: 0 }}>
                <h3 style={{ color: 'var(--green-700)', marginBottom: '0.75rem' }}>🧩 Who do I contact for more information?</h3>
                <p style={{ margin: 0 }}>You can reach us anytime through our <Link href="/#contact" style={{ color: 'var(--yellow-400)', textDecoration: 'none', fontWeight: 500 }}>Contact Us form</Link><br /><br />We're happy to answer questions or help you decide which program is right for your child.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ResourcesClient />
    </PageLayout>
  )
}
