import { Clock3, FolderKanban, Award, Sparkles } from 'lucide-react'
import AdminPageTransition from '../components/AdminPageTransition.jsx'
import AdminStatCard from '../components/AdminStatCard.jsx'
import { usePortfolio } from '../../context/PortfolioContext.jsx'

export default function AdminDashboardPage() {
  const { state } = usePortfolio()

  const totalProjects = state.projects?.length || 0
  const totalCertificates = state.certificates?.length || 0

  const totalSkills = (state.skills?.groups || []).reduce(
    (sum, g) => sum + (g.items?.length || 0),
    0
  )

  const lastUpdated = state.meta?.lastUpdated
    ? new Date(state.meta.lastUpdated).toLocaleString()
    : '—'

  return (
    <AdminPageTransition>
      <div className="grid gap-5">
        <div className="glass rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-7">
          <div className="chip">Overview</div>
          <div className="mt-4 font-poppins text-2xl font-extrabold">
            <span className="gradient-text">Portfolio CMS</span>
          </div>
          <div className="mt-2 text-sm text-muted">
            Monitor your portfolio and manage content with real-time updates.
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <AdminStatCard label="Projects Showcase" value={totalProjects} Icon={FolderKanban} />
          <AdminStatCard label="Certifications" value={totalCertificates} Icon={Award} />
          <AdminStatCard label="Core Skills" value={totalSkills} Icon={Sparkles} />
          <AdminStatCard label="Latest Activity" value={lastUpdated} Icon={Clock3} />
        </div>

        <div className="glass rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-7">
          <div className="text-sm font-semibold">Portfolio Overview</div>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>Showcase impactful projects and achievements</li>
            <li>Maintain a professional and up-to-date portfolio</li>
            <li>Highlight technical expertise and certifications</li>
            <li>Manage media assets with confidence</li>
            <li>Keep your portfolio synchronized and secure</li>
          </ul>
        </div>
      </div>
    </AdminPageTransition>
  )
}
