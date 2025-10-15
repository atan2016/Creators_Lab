import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Mail, Phone, MapPin, User } from "lucide-react";

const Section = ({ children, className = "" }) => (
  <section className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>{children}</section>
);

export default function CreatorsLabSite() {
  return (
    <div className="font-sans text-green-900 bg-white">
      {/* NAVBAR */}
      <header className="sticky top-0 z-40 bg-white border-b border-green-100">
        <Section className="flex items-center justify-between py-3">
          <a href="#home" className="flex items-center gap-2 font-semibold text-xl text-green-900">
            <Sparkles className="text-green-700 size-6" /> Creators<span className="text-yellow-400">Lab</span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {["Programs","About","Mentors","Contact","Login"].map(link => (
              <a key={link} href={`#${link.toLowerCase()}`} className="hover:text-yellow-400 transition-colors">{link}</a>
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
              AI, STEM & <br /> Entrepreneurship <span className="italic text-yellow-400">for</span> Teens
            </h1>
            <p className="mt-4 text-lg max-w-prose">
              Empowering young innovators to build confidently with AI tools, explore STEM foundations, and think like entrepreneurs through hands-on creative coding experiences.
            </p>
            <div className="mt-6">
              <Button className="bg-white text-green-700 hover:bg-green-50 rounded-xl">Explore Programs</Button>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <div className="rounded-xl overflow-hidden shadow-xl border-4 border-white">
              <img src="https://images.unsplash.com/photo-1596495577886-d920f1fb7238?q=80&w=1600&auto=format&fit=crop" alt="Teens collaborating on AI and STEM projects" className="w-full h-[420px] object-cover" />
            </div>
          </motion.div>
        </Section>
      </div>

      {/* PROGRAMS */}
      <Section id="programs" className="py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-green-900">Programs</h2>
          <p className="text-green-800/70 mt-2">Explore our hands-on learning experiences designed to spark creativity and innovation.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 mt-10">
          <Card className="rounded-xl border border-green-200 hover:shadow-lg transition-shadow bg-white">
            <CardHeader>
              <CardTitle className="text-green-900">Vibe Coding 101</CardTitle>
            </CardHeader>
            <CardContent className="text-green-800/80 space-y-3">
              <p>Learn to communicate with AI tools using natural language. Understand how prompts, logic, and creativity come together to create something new.</p>
              <ul className="list-disc ml-5">
                <li>Prompt design and creative AI coding</li>
                <li>Building small projects collaboratively</li>
                <li>Showcase ideas at Demo Day</li>
              </ul>
            </CardContent>
          </Card>
          <Card className="rounded-xl border border-green-200 hover:shadow-lg transition-shadow bg-white">
            <CardHeader>
              <CardTitle className="text-green-900">STEM Lab</CardTitle>
            </CardHeader>
            <CardContent className="text-green-800/80 space-y-3">
              <p>Dive into science, technology, and engineering principles through interactive experiments and digital design challenges.</p>
              <ul className="list-disc ml-5">
                <li>STEM challenges and discovery learning</li>
                <li>Group experiments and creative prototyping</li>
                <li>Encourage design thinking and iteration</li>
              </ul>
            </CardContent>
          </Card>
          <Card className="rounded-xl border border-green-200 hover:shadow-lg transition-shadow bg-white">
            <CardHeader>
              <CardTitle className="text-green-900">Teen Venture Studio</CardTitle>
            </CardHeader>
            <CardContent className="text-green-800/80 space-y-3">
              <p>Transform ideas into startups. Learn teamwork, market research, and pitching in a safe, inspiring environment.</p>
              <ul className="list-disc ml-5">
                <li>Team collaboration and problem solving</li>
                <li>Pitching to real entrepreneurs</li>
                <li>Hands-on mentorship from industry experts</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* ABOUT */}
      <div id="about" className="bg-green-50 border-y border-green-100">
        <Section className="py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h3 className="text-3xl font-bold text-green-900">About CreatorsLab</h3>
            <p className="text-green-800/80 mt-2">
              CreatorsLab is an enrichment program for teens designed by seasoned entrepreneurs and engineers. We merge creativity, coding, and entrepreneurial thinking so students can explore how AI and STEM shape the world around them.
            </p>
            <p className="text-green-800/80 mt-4">
              Our mission is to inspire lifelong learners who are ready to build, innovate, and lead with purpose.
            </p>
          </div>
          <div>
            <img src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?q=80&w=1600&auto=format&fit=crop" alt="Teens brainstorming ideas together" className="rounded-xl border border-green-200 shadow-lg" />
          </div>
        </Section>
      </div>

      {/* MENTORS */}
      <Section id="mentors" className="py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h3 className="text-3xl md:text-4xl font-bold text-green-900">Meet Our Mentors</h3>
          <p className="text-green-800/70 mt-2">Our mentors bring experience from technology, entrepreneurship, and education to guide every student’s journey.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 mt-10">
          {[ 
            { name: "Ashley Tan", role: "Program Lead – Venture Studio", img: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=1200&auto=format&fit=crop" },
            { name: "Ryland Chen", role: "AI & Coding Mentor", img: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?q=80&w=1200&auto=format&fit=crop" },
            { name: "Priya Patel", role: "Design & Product Coach", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop" },
          ].map((m, i) => (
            <Card key={i} className="rounded-xl border border-green-200 overflow-hidden bg-white">
              <img src={m.img} alt={m.name} className="w-full h-56 object-cover" />
              <CardContent className="p-5 text-center">
                <h4 className="font-semibold text-green-900">{m.name}</h4>
                <p className="text-green-800/70 text-sm">{m.role}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* CONTACT */}
      <div id="contact" className="bg-green-50 border-t border-green-100">
        <Section className="py-16 grid md:grid-cols-2 gap-10 items-start">
          <div>
            <h3 className="text-3xl font-bold text-green-900">Contact Us</h3>
            <p className="text-green-800/80 mt-2">We’d love to hear from you! Reach out for program details, partnerships, or scholarship information.</p>
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
            <p className="text-center text-sm text-green-800/70 mt-2">Don’t have an account? <a href="#enroll" className="text-yellow-500 hover:text-yellow-400">Sign up</a></p>
          </form>
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="bg-green-700 text-white py-8">
        <Section className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-semibold"><Sparkles className="text-yellow-400 size-5" /> CreatorsLab</div>
          <div className="text-sm">© {new Date().getFullYear()} Rokk Research LLC • All rights reserved.</div>
          <div className="flex items-center gap-4 text-sm">
            <a href="#privacy" className="hover:text-yellow-400">Privacy</a>
            <a href="#terms" className="hover:text-yellow-400">Terms</a>
          </div>
        </Section>
      </footer>
    </div>
  );
}
