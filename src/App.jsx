import Navbar from './components/Navbar/Navbar.jsx'
import Hero from './components/Hero/Hero.jsx'
import About from './components/About/About.jsx'
import Skills from './components/Skills/Skills.jsx'
import Services from './components/Services/Services.jsx'
import Projects from './components/Projects/Projects.jsx'
import Timeline from './components/Timeline/Timeline.jsx'
import Certifications from './components/Certifications/Certifications.jsx'
import Achievements from './components/Achievements/Achievements.jsx'
import Resume from './components/Resume/Resume.jsx'
import Contact from './components/Contact/Contact.jsx'
import Footer from './components/Footer/Footer.jsx'
import DevToolsGuard from './components/DevToolsGuard.jsx'
import { useSecurity } from './hooks/useSecurity.js'

export default function App() {
  // Apply all client-side security protections on the public portfolio
  useSecurity({ enabled: true })

  return (
    <div className="min-h-screen bg-base">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-hero-radial" />
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-[0.18] [background-size:48px_48px] bg-grid" />

      {/* DevTools detection — production only deterrent */}
      <DevToolsGuard />

      <Navbar />

      <main>
        <Hero />
        <About />
        <Skills />
        <Services />
        <Projects />
        <Timeline />
        <Certifications />
        <Achievements />
        <Resume />
        <Contact />
      </main>

      <Footer />
    </div>
  )
}
