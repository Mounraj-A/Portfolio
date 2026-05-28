import { motion } from 'framer-motion'
import { getIconByKey } from '../../utils/iconRegistry.js'
import { usePortfolio } from '../../context/PortfolioContext.jsx'

export default function Footer() {
  const { state } = usePortfolio()
  const socials = state.contact?.footerSocials || []

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
            {socials.map(({ label, href, iconKey }) => {
              const Icon = getIconByKey(iconKey, 'mail')
              return (
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
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}
