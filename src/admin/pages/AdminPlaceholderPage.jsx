import AdminPageTransition from '../components/AdminPageTransition.jsx'

export default function AdminPlaceholderPage({ title }) {
  return (
    <AdminPageTransition>
      <div className="glass rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-7">
        <div className="chip">{title}</div>
        <h2 className="mt-4 font-poppins text-2xl font-extrabold">
          <span className="gradient-text">{title} Management</span>
        </h2>
        <p className="mt-2 text-sm text-muted">
          Architecture is ready. CRUD forms will be implemented next without changing your portfolio UI.
        </p>
      </div>
    </AdminPageTransition>
  )
}
