import { motion } from 'framer-motion'
import { Github, Linkedin, Mail } from 'lucide-react'

const socials = [
  { label: 'GitHub', href: 'https://github.com/', Icon: Github },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/', Icon: Linkedin },
  { label: 'Email', href: 'mailto:mounraj@example.com', Icon: Mail },
]

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-base/40 backdrop-blur-xl">
      <div className="container-x py-10">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div>
            <div className="font-poppins text-sm font-bold">
              <span className="gradient-text">Designed & Developed</span>{' '}
              <span className="text-muted">by</span> Mounraj
            </div>
            <div className="mt-1 text-xs text-muted">© {new Date().getFullYear()} Mounraj.dev</div>
          </div>

          <div className="flex items-center gap-2">
            {socials.map(({ label, href, Icon }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="glass inline-flex h-11 w-11 items-center justify-center rounded-2xl hover:border-white/20 hover:bg-white/10"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                aria-label={label}
              >
                <Icon className="h-5 w-5" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
