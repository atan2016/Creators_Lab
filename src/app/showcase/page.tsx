import PageLayout from '@/components/creators-lab/PageLayout'
import ShowcaseClient from '@/components/creators-lab/ShowcaseClient'

export const metadata = {
  title: 'Student Showcase - CreatorsLab',
  description: 'Discover the incredible projects created by our students.',
}

export default function ShowcasePage() {
  return (
    <PageLayout>
      <main>
        <section className="section">
          <div className="container">
            <div style={{ textAlign: 'center', maxWidth: '56ch', margin: '0 auto 3rem' }}>
              <h1 style={{ color: 'var(--green-700)', fontSize: '2.5rem', marginBottom: '1rem' }}>Student Showcase</h1>
              <p className="muted" style={{ fontSize: '1.125rem', lineHeight: 1.6 }}>
                Discover the incredible projects that can be created at the end of programs. From innovative websites to engaging mobile apps and exciting games, see what's possible when creativity meets technology.
              </p>
            </div>

            <div className="filter-section">
              <h2 className="sr-only">Filter Projects</h2>
              <div className="filter-buttons">
                <button className="filter-btn active" data-filter="all">All</button>
                <button className="filter-btn" data-filter="websites">Website</button>
                <button className="filter-btn" data-filter="apps">Mobile App</button>
                <button className="filter-btn" data-filter="games">Game</button>
                <button className="filter-btn" data-filter="web-apps">Web App</button>
              </div>
            </div>

            <div className="projects-grid" id="projectsGrid">
              <div className="project-card" data-category="websites">
                <div className="project-image" style={{ background: 'url(/student-showcase/src/assets/eco-connect.webp) center/cover', position: 'relative' }} role="img" aria-label="Eco-Connect: Community Recycling Platform project screenshot">
                  <div className="project-type-label website">Website</div>
                </div>
                <div className="project-content">
                  <h3 className="project-title">Eco-Connect: Community Recycling Platform</h3>
                  <div className="project-course">AI Vibe Coding 101</div>
                  <p className="project-description">A web application designed to connect community members for easier recycling and waste reduction. Features include local drop-off points, material sorting guides, and community events.</p>
                </div>
              </div>

              <div className="project-card" data-category="apps">
                <div className="project-image" style={{ background: 'url(/student-showcase/src/assets/study-buddy.webp) center/cover', position: 'relative' }} role="img" aria-label="Study Buddy: AI-Powered Learning Assistant project screenshot">
                  <div className="project-type-label mobile-app">Mobile App</div>
                </div>
                <div className="project-content">
                  <h3 className="project-title">Study Buddy: AI-Powered Learning Assistant</h3>
                  <div className="project-course">Advanced Vibe Coding</div>
                  <p className="project-description">An iOS and Android application that uses AI to create personalized study schedules, generate practice quizzes, and provide instant feedback on learning progress.</p>
                </div>
              </div>

              <div className="project-card" data-category="games">
                <div className="project-image" style={{ background: 'url(/student-showcase/src/assets/galactic-guardian.webp) center/cover', position: 'relative' }} role="img" aria-label="Galactic Guardian: A Space Adventure game screenshot">
                  <div className="project-type-label game">Game</div>
                </div>
                <div className="project-content">
                  <h3 className="project-title">Galactic Guardian: A Space Adventure</h3>
                  <div className="project-course">AI Vibe Coding 101</div>
                  <p className="project-description">A 2D arcade-style game where players navigate a spaceship through asteroid fields, collect power-ups, and defeat alien invaders. Developed using Python and Pygame.</p>
                </div>
              </div>

              <div className="project-card" data-category="websites">
                <div className="project-image" style={{ background: 'url(/student-showcase/src/assets/pet-pal.webp) center/cover', position: 'relative' }} role="img" aria-label="Pet Pal: Adoptable Animal Finder project screenshot">
                  <div className="project-type-label website">Website</div>
                </div>
                <div className="project-content">
                  <h3 className="project-title">Pet Pal: Adoptable Animal Finder</h3>
                  <div className="project-course">AI Vibe Coding 101</div>
                  <p className="project-description">A web platform connecting families with adoptable pets. Features advanced search filters, pet profiles, and streamlined adoption process with AI-powered matching.</p>
                </div>
              </div>

              <div className="project-card" data-category="apps">
                <div className="project-image" style={{ background: 'url(/student-showcase/src/assets/task_master.png) center/cover', position: 'relative' }} role="img" aria-label="Task Master: AI-Powered Productivity app screenshot">
                  <div className="project-type-label mobile-app">Mobile App</div>
                </div>
                <div className="project-content">
                  <h3 className="project-title">Task Master: AI-Powered Productivity</h3>
                  <div className="project-course">Advanced Vibe Coding</div>
                  <p className="project-description">A smart productivity app that uses AI to prioritize tasks, suggest optimal work schedules, and provide personalized productivity insights and recommendations.</p>
                </div>
              </div>

              <div className="project-card" data-category="apps">
                <div className="project-image" style={{ background: 'url(/student-showcase/src/assets/restaurant_finder_1.PNG) center/cover', position: 'relative' }} role="img" aria-label="Restaurant Finder: Travel Dining Companion app screenshot">
                  <div className="project-type-label mobile-app">Mobile App</div>
                </div>
                <div className="project-content">
                  <h3 className="project-title">Restaurant Finder: Travel Dining Companion</h3>
                  <div className="project-course">AI Vibe Coding 101</div>
                  <p className="project-description">A mobile app that helps users find their desirable restaurants along their travel path within a customizable distance. Features real-time location tracking, restaurant ratings, and personalized recommendations based on cuisine preferences and dietary restrictions.</p>
                </div>
              </div>

              <div className="project-card" data-category="games">
                <div className="project-image" style={{ background: 'url(/student-showcase/src/assets/code_quest.png) center/cover', position: 'relative' }} role="img" aria-label="Code Quest: Programming Adventure game screenshot">
                  <div className="project-type-label game">Game</div>
                </div>
                <div className="project-content">
                  <h3 className="project-title">Code Quest: Programming Adventure</h3>
                  <div className="project-course">AI Vibe Coding 101</div>
                  <p className="project-description">An educational game that teaches programming concepts through interactive puzzles and challenges. Players solve coding problems to progress through levels and unlock new abilities.</p>
                </div>
              </div>

              <div className="project-card" data-category="web-apps">
                <div className="project-image" style={{ background: 'url(/student-showcase/src/assets/photorestoration_icon.png) center/cover', position: 'relative' }} role="img" aria-label="Image Enhancer web application screenshot">
                  <div className="project-type-label web-app">Web App</div>
                </div>
                <div className="project-content">
                  <h3 className="project-title">Image Enhancer</h3>
                  <div className="project-course">Advanced Vibe Coding</div>
                  <p className="project-description">Bring your photos back to life with AI. Choose from multiple enhancement models, upload your image, and get a beautifully restored result—sharp, natural, and never distorted like the other AI tools. Learn how to monetize your applications.</p>
                  <a href="https://imageenhancer.creators-lab.org/" target="_blank" rel="noopener noreferrer" className="view-project-btn" aria-label="View Production Project (opens in new window)">
                    View Production Project
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <ShowcaseClient />
    </PageLayout>
  )
}
