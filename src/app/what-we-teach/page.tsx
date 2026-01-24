import PageLayout from '@/components/creators-lab/PageLayout'

export const metadata = {
  title: 'What We Teach — For Parents & Students',
  description: 'Discover the core concepts that make our programs unique.',
}

export default function WhatWeTeachPage() {
  return (
    <PageLayout>
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '56ch', margin: '0 auto 3rem' }}>
            <h1 style={{ color: 'var(--green-700)', fontSize: '2.5rem', marginBottom: '1rem' }}>What We Teach</h1>
            <p className="muted" style={{ fontSize: '1.125rem', lineHeight: 1.6 }}>
              Discover the core concepts that make our programs unique. We blend cutting-edge technology with creative thinking to help students build the future, while providing parents with the information they need to support their children's learning journey.
            </p>
          </div>

          <div className="card">
            <div className="concept-header">
              <div className="concept-icon">💻</div>
              <div style={{ flex: 1 }}>
                <h2 className="concept-title">Vibe Coding</h2>
                <p className="concept-subtitle">Coding with AI as your creative partner</p>
              </div>
            </div>

            <div className="concept-section">
              <h3>What is Vibe Coding?</h3>
              <p>Vibe Coding is our revolutionary approach to programming that combines human creativity with AI assistance. Instead of writing every line of code from scratch, you'll learn to work alongside AI tools like Cursor IDE (Interactive Development Environment) to build amazing projects faster and more creatively.</p>
              
              <div className="highlight-box">
                <strong>Think of it like this:</strong> Instead of painting every brushstroke yourself, you're directing an AI assistant to help you create your masterpiece while you focus on the big picture and creative vision.
              </div>
            </div>

            <div className="concept-section">
              <h3>How It Works</h3>
              <ul>
                <li><strong>You describe what you want to build</strong> - Using plain English, you tell the AI your ideas</li>
                <li><strong>AI helps generate the code</strong> - Tools like Cursor IDE (Interactive Development Environment) create the technical foundation</li>
                <li><strong>You refine and customize</strong> - You make it uniquely yours with your own creative touches</li>
                <li><strong>You learn by doing</strong> - Each project teaches you new coding concepts and problem-solving skills</li>
              </ul>
            </div>
          </div>

          <div className="card">
            <div className="concept-header">
              <div className="concept-icon">🚀</div>
              <div style={{ flex: 1 }}>
                <h2 className="concept-title">Entrepreneurship & Design Thinking</h2>
                <p className="concept-subtitle">Building real solutions for real problems</p>
              </div>
            </div>

            <div className="concept-section">
              <h3>What is Design Thinking?</h3>
              <p>Design Thinking is a problem-solving approach that puts people at the center. Students learn to identify real problems, understand user needs, brainstorm creative solutions, build prototypes, and test their ideas with real users.</p>
            </div>

            <div className="concept-section">
              <h3>What is Entrepreneurship?</h3>
              <p>Entrepreneurship at CreatorsLab isn't just about starting a business—it's about developing an innovative mindset. Students learn to identify opportunities, take calculated risks, iterate on ideas, and present their work confidently.</p>
            </div>
          </div>

          <div className="card">
            <div className="concept-header">
              <div className="concept-icon">🤝</div>
              <div style={{ flex: 1 }}>
                <h2 className="concept-title">Collaboration & Teamwork</h2>
                <p className="concept-subtitle">Building together, learning together</p>
              </div>
            </div>

            <div className="concept-section">
              <h3>Why Collaboration Matters</h3>
              <p>In the real world, great products are built by teams. Students learn to work together using industry-standard tools like GitHub for version control, communicate effectively, give and receive feedback, and contribute to shared projects.</p>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}
