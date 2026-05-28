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
            Manage content via Context + LocalStorage. Changes reflect instantly on the portfolio.
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <AdminStatCard label="Total Projects" value={totalProjects} Icon={FolderKanban} />
          <AdminStatCard label="Total Certificates" value={totalCertificates} Icon={Award} />
          <AdminStatCard label="Total Skills" value={totalSkills} Icon={Sparkles} />
          <AdminStatCard label="Last Updated" value={lastUpdated} Icon={Clock3} />
        </div>

        <div className="glass rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-7">
          <div className="text-sm font-semibold">Next steps</div>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>Projects CRUD management (implemented)</li>
            <li>Certificates CRUD management (implemented)</li>
            <li>Skills CRUD forms (coming next)</li>
            <li>Image/PDF uploads stored as Base64 in LocalStorage</li>
            <li>Import/Export for backups via Settings</li>
          </ul>
        </div>
      </div>
    </AdminPageTransition>
  )
}
