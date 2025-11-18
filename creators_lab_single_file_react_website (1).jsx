import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Mail, Phone, MapPin } from "lucide-react";

const Section = ({ id, children, className = "" }) => (
  <section id={id} className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>{children}</section>
);

export default function CreatorsLabSite() {
  return (
    <div className="font-sans text-green-900 bg-white scroll-smooth">
      {/* NAVBAR */}
      <header className="sticky top-0 z-40 bg-white border-b border-green-100">
        <Section className="flex items-center justify-between py-3">
          <a href="#home" className="flex items-center gap-2 font-semibold text-xl text-green-900">
            <Sparkles className="text-green-700 size-6" /> Creators<span className="text-yellow-400">Lab</span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {["programs","why","community","about","mentors","resources","contact","login"].map(link => (
              <a key={link} href={`#${link}`} className="hover:text-yellow-400 transition-colors">{link.charAt(0).toUpperCase()+link.slice(1)}</a>
            ))}
          </nav>
          <Button asChild size="sm" className="bg-green-700 hover:bg-green-800 rounded-xl text-white">
            <a href="#login">Login</a>
          </Button>
        </Section>
      </header>

      {/* HERO */}
      <div id="home" className="bg-green-700 text-white">
        <Section className="grid md:grid-cols-2 items-center py-20 gap-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Empowering Teens to Dream Big, Build Boldly & Innovate Fearlessly
            </h1>
            <p className="mt-4 text-lg max-w-prose">
              Our mission is to equip teens with the creativity, confidence, and entrepreneurial mindset to thrive in a world shaped by AI and innovation — one community, one project, one young creator at a time.
            </p>
            <div className="mt-6 flex gap-3">
              <Button className="bg-white text-green-700 hover:bg-green-50 rounded-xl"><a href="#programs">Explore Programs</a></Button>
              <Button className="border border-white text-white hover:bg-green-800 rounded-xl" variant="outline"><a href="#community">Join Our Community</a></Button>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <div className="rounded-xl overflow-hidden shadow-xl border-4 border-white">
              <img src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?q=80&w=1600&auto=format&fit=crop" alt="Teens collaborating in a community center" className="w-full h-[420px] object-cover" />
            </div>
          </motion.div>
        </Section>
      </div>

      {/* WHY */}
      <Section id="why" className="py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-green-900">Why Learn AI, Vibe Coding & Entrepreneurship?</h2>
          <p className="text-green-800/80 mt-4">
            Teens today are surrounded by technology — but few learn how to create with it. We help students turn curiosity into capability, building confidence, collaboration, and real-world problem solving.
          </p>
          <div className="mt-6 grid md:grid-cols-3 gap-6">
            <div className="bg-green-50 p-6 rounded-xl border border-green-100 shadow-sm">
              <h4 className="font-semibold text-green-900 mb-2">Creativity over Consumption</h4>
              <p className="text-green-800/70 text-sm">Shift from passive screen time to purposeful making and building.</p>
            </div>
            <div className="bg-green-50 p-6 rounded-xl border border-green-100 shadow-sm">
              <h4 className="font-semibold text-green-900 mb-2">Confidence through Projects</h4>
              <p className="text-green-800/70 text-sm">Every cohort ships something — and presents it with pride.</p>
            </div>
            <div className="bg-green-50 p-6 rounded-xl border border-green-100 shadow-sm">
              <h4 className="font-semibold text-green-900 mb-2">AI as a Partner</h4>
              <p className="text-green-800/70 text-sm">Learn to guide AI tools thoughtfully to accelerate learning and creativity.</p>
            </div>
          </div>
          <div className="mt-10">
            <iframe className="mx-auto rounded-xl shadow-md" width="560" height="315" src="https://www.youtube.com/embed/zgAmNwe45Yo" title="AI Future at 13? Vibe-Coding" allowFullScreen></iframe>
          </div>
        </div>
      </Section>

      {/* COMMUNITY */}
      <div id="community" className="bg-green-50 border-y border-green-100">
        <Section className="py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h3 className="text-3xl font-bold text-green-900">Powered by Community. Built for the Next Generation.</h3>
            <p className="text-green-800/80 mt-2">We partner with local community centers so access isn’t a barrier. Learning happens close to home, where projects strengthen neighborhoods and inspire families.</p>
            <p className="text-green-800/80 mt-4">Join a local cohort in Millbrae, San Bruno, or San Mateo — or invite us to your community center.</p>
          </div>
          <div>
            <img src="https://images.unsplash.com/photo-1596495577886-d920f1fb7238?q=80&w=1600&auto=format&fit=crop" alt="Teens collaborating at a rec center" className="rounded-xl border border-green-200 shadow-lg" />
          </div>
        </Section>
      </div>

      {/* PROGRAMS */}
      <Section id="programs" className="py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-green-900">Programs</h2>
          <p className="text-green-800/70 mt-2">Hands-on programs that turn ideas into impact.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 mt-10">
          {[{title:"Vibe Coding 101 (12–14)",desc:"Natural-language coding, git basics, and MVP design. Weekly 90‑min sessions.",image:"https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1600&auto=format&fit=crop"},{title:"Vibe Coding 101 (14–16)",desc:"Problem definition, prototyping, databases primer, and mini‑showcases.",image:"https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1600&auto=format&fit=crop"},{title:"Teen Venture Studio (14–18)",desc:"Teamwork, negotiation, lean canvas, prototyping, and pitch day.",image:"https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1600&auto=format&fit=crop"}].map((p,i)=>(
            <Card key={i} className="rounded-xl border border-green-200 overflow-hidden bg-white hover:shadow-lg">
              <img src={p.image} alt={p.title} className="w-full h-56 object-cover" />
              <CardHeader><CardTitle className="text-green-900">{p.title}</CardTitle></CardHeader>
              <CardContent className="text-green-800/80 text-sm">{p.desc}</CardContent>
            </Card>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {[{title:"Advanced Vibe Coding",desc:"Go deeper: build with LLMs and services; explore MCP servers. (Prereq: Vibe Coding 101)",image:"https://images.unsplash.com/photo-1554891074-8c0c9c51e85e?q=80&w=1600&auto=format&fit=crop"},{title:"Summer Camp — 1 Week (Half Day)",desc:"Daily builds, git collaboration, and MVP showcase. 9:00–12:30.",image:"https://images.unsplash.com/photo-1485815457792-d1a966f9ef3f?q=80&w=1600&auto=format&fit=crop"}].map((p,i)=>(
            <Card key={i} className="rounded-xl border border-green-200 overflow-hidden bg-white hover:shadow-lg">
              <img src={p.image} alt={p.title} className="w-full h-56 object-cover" />
              <CardHeader><CardTitle className="text-green-900">{p.title}</CardTitle></CardHeader>
              <CardContent className="text-green-800/80 text-sm">{p.desc}</CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* ABOUT */}
      <div id="about" className="bg-green-50 border-y border-green-100">
        <Section className="py-16 grid md:grid-cols-2 gap-10 items-start">
          <div>
            <h3 className="text-3xl font-bold text-green-900">About CreatorsLab</h3>
            <p className="text-green-800/80 mt-2">We’re seasoned entrepreneurs bringing real-world experience into community spaces where teens can create and grow. AI is a creative partner — and we teach young minds to use it responsibly and imaginatively.</p>
            <p className="text-green-800/80 mt-4">Our mission is to equip young people with the mindset and tools to create, lead, and thrive in a world shaped by innovation.</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-green-900 mb-3">About Ashley</h3>
            <p className="text-green-800/80 mb-2">Ashley Tan is a technologist and entrepreneur with 20+ years building products and teams. She holds a BS in Computer Engineering (RPI) and an MS in Information Management & Systems (UC Berkeley). Inspired by her teens’ curiosity, she started CreatorsLab to help young people use AI as a tool for creativity, not just consumption.</p>
          </div>
        </Section>
      </div>

      {/* MENTORS */}
      <Section id="mentors" className="py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h3 className="text-3xl md:text-4xl font-bold text-green-900">Meet Our Mentors</h3>
          <p className="text-green-800/70 mt-2">Builders, educators, and entrepreneurs who love mentoring teens.</p>
        </div>
        <div className="grid md:grid-cols-4 gap-6 mt-10">
          {[ 
            { name: "Ashley Tan", role: "Program Lead – Venture Studio", img: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=1200&auto=format&fit=crop" },
            { name: "Ryland Chen", role: "AI & Coding Mentor", img: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?q=80&w=1200&auto=format&fit=crop" },
            { name: "Priya Patel", role: "Design & Product Coach", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop" },
            { name: "Mike Voytovich", role: "Technical Mentor & Co‑Founder", img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop" }
          ].map((m, i) => (
            <Card key={i} className="rounded-xl border border-green-200 overflow-hidden bg-white">
              <img src={m.img} alt={m.name} className="w-full h-56 object-cover" />
              <CardContent className="p-5 text-center">
                <h4 className="font-semibold text-green-900">{m.name}</h4>
                <p className="text-green-800/70 text-sm">{m.role}</p>
                {m.name === "Mike Voytovich" && (
                  <p className="text-green-800/70 text-sm mt-3 text-left">
                    Mike is a hands‑on engineer and mentor. Now a <strong>Member of Technical Staff at OpenAI</strong>, he has 15+ years building embedded systems, IoT products, and AI‑driven solutions. Previously, he founded <strong>Rokk Research</strong> and held key roles at <strong>Currant, PayPal,</strong> and <strong>Duff Research</strong>. At CreatorsLab, he helps teens unlock the maker mindset and apply technology to real community needs.
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* RESOURCES */}
      <Section id="resources" className="py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-green-900">Resources & Food for Thought</h3>
          <p className="text-green-800/70 mt-2">Curated ideas for families and budding builders.</p>
        </div>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <Card className="rounded-xl border border-green-200 bg-green-50 p-6">
            <CardTitle className="text-green-900 mb-3">For Parents</CardTitle>
            <p className="text-green-800/80 mb-3">Why it's important for your kids to learn about AI and entrepreneurship.</p>
            <a href="https://youtube.com/shorts/zgAmNwe45Yo?si=zCDRT5paE5bwAUuO" className="text-yellow-500 hover:text-yellow-400 underline">Watch: AI Future at 13? (Vibe‑Coding)</a>
          </Card>
          <Card className="rounded-xl border border-green-200 bg-green-50 p-6">
            <CardTitle className="text-green-900 mb-3">Learning Resources</CardTitle>
            <ul className="list-disc list-inside text-green-800/80 space-y-1 text-sm">
              <li><a href="https://www.youtube.com/watch?v=IPYeCltXpxw" className="text-yellow-500 hover:text-yellow-400 underline">Start with Why – Simon Sinek</a></li>
              <li><a href="https://www.youtube.com/watch?v=fEvKo90qBns" className="text-yellow-500 hover:text-yellow-400 underline">Lean Startup – Eric Ries</a></li>
              <li>Design Thinking: How to Design Breakthrough Inventions</li>
              <li>Entrepreneurial vs. Traditional Engineering</li>
            </ul>
          </Card>
          <Card className="rounded-xl border border-green-200 bg-green-50 p-6">
            <CardTitle className="text-green-900 mb-3">Development Tools</CardTitle>
            <p className="text-green-800/80 mb-3">AI-powered coding environments we use in our programs.</p>
            <ul className="list-disc list-inside text-green-800/80 space-y-1 text-sm">
              <li><a href="https://windsurf.dev" className="text-yellow-500 hover:text-yellow-400 underline">IDE (Interactive Development Environment)</a> - AI-powered development environment</li>
              <li><a href="https://cursor.sh" className="text-yellow-500 hover:text-yellow-400 underline">Cursor IDE</a> - AI code editor with chat assistance</li>
              <li><a href="https://github.com" className="text-yellow-500 hover:text-yellow-400 underline">GitHub</a> - Code collaboration and version control</li>
            </ul>
          </Card>
        </div>
      </Section>

      {/* CONTACT */}
      <div id="contact" className="bg-green-50 border-t border-green-100">
        <Section className="py-16 grid md:grid-cols-2 gap-10 items-start">
          <div>
            <h3 className="text-3xl font-bold text-green-900">Contact Us</h3>
            <p className="text-green-800/80 mt-2">We’d love to hear from you about programs, partnerships, or volunteer opportunities.</p>
            <div className="mt-6 space-y-3 text-green-800/80 text-sm">
              <div className="flex items-center gap-2"><Mail className="text-green-700 size-4" /> hello@creators-lab.org</div>
              <div className="flex items-center gap-2"><Phone className="text-green-700 size-4" /> (800) 555‑0199</div>
              <div className="flex items-center gap-2"><MapPin className="text-green-700 size-4" /> Millbrae • San Mateo County, CA</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-green-200 shadow-sm">
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <Input placeholder="Your Name" required />
              <Input placeholder="Email" type="email" required />
              <Textarea placeholder="Message" rows={5} />
              <Button type="submit" className="w-full bg-green-700 hover:bg-green-800 text-white rounded-xl">Send Message</Button>
            </form>
          </div>
        </Section>
      </div>

      {/* LOGIN */}
      <Section id="login" className="py-16">
        <div className="max-w-md mx-auto bg-green-50 border border-green-100 p-8 rounded-xl shadow-sm">
          <h3 className="text-2xl font-bold text-center text-green-900 mb-4">Member Login</h3>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <Input placeholder="Email" type="email" required />
            <Input placeholder="Password" type="password" required />
            <Button type="submit" className="w-full bg-green-700 hover:bg-green-800 text-white rounded-xl">Login</Button>
            <p className="text-center text-sm text-green-800/70 mt-2">Don’t have an account? <a href="#programs" className="text-yellow-500 hover:text-yellow-400">Explore programs</a></p>
          </form>
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="bg-green-700 text-white py-8">
        <Section className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-semibold"><Sparkles className="text-yellow-400 size-5" /> CreatorsLab</div>
          <div className="text-sm">© {new Date().getFullYear()} Rokk Research LLC • All rights reserved.</div>
          <div className="flex items-center gap-4 text-sm">
            <a href="#home" className="hover:text-yellow-400">Back to top</a>
          </div>
        </Section>
      </footer>
    </div>
  );
}
