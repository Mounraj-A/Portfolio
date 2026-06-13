import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import AdminPageTransition from '../components/AdminPageTransition.jsx'
import { usePortfolio } from '../../context/PortfolioContext.jsx'
import AdminProjectCard from '../components/projects/AdminProjectCard.jsx'
import ProjectFormModal from '../components/projects/ProjectFormModal.jsx'
import ProjectDeleteModal from '../components/projects/ProjectDeleteModal.jsx'
import ProjectPreviewModal from '../components/projects/ProjectPreviewModal.jsx'

function ensureProjectForPortfolio(p) {
  const title = String(p.title || '').trim()
  const description = String(p.description || '').trim()
  const tech = Array.isArray(p.tech) ? p.tech : []

  return {
    ...p,
    title,
    description,
    tech,
    longDescription: String(p.longDescription || description || '').trim(),
    highlights: Array.isArray(p.highlights) ? p.highlights : [],
  }
}

export default function AdminProjectsPage() {
  const { state, actions, status } = usePortfolio()

  const projects = useMemo(() => state.projects || [], [state.projects])

  const [openAdd, setOpenAdd] = useState(false)
  const [editProject, setEditProject] = useState(null)
  const [previewProject, setPreviewProject] = useState(null)
  const [deleteProject, setDeleteProject] = useState(null)
  const [pageError, setPageError] = useState('')

  useEffect(() => {
    void actions.refreshProjects?.()
  }, [actions])

  async function handleAdd(payload) {
    setPageError('')
    const res = await actions.addProject(ensureProjectForPortfolio(payload))
    if (res?.ok) {
      setOpenAdd(false)
    } else {
      setPageError(res?.message || 'Failed to add project. Check Firebase rules.')
    }
  }

  async function handleUpdate(payload) {
    setPageError('')
    const res = await actions.updateProject(ensureProjectForPortfolio({ ...editProject, ...payload }))
    if (res?.ok) {
      setEditProject(null)
    } else {
      setPageError(res?.message || 'Failed to update project.')
    }
  }

  async function handleDelete() {
    if (!deleteProject?.id) return
    setPageError('')
    const res = await actions.deleteProject(deleteProject.id)
    if (res?.ok) {
      setDeleteProject(null)
    } else {
      setPageError(res?.message || 'Failed to delete project.')
      setDeleteProject(null)
    }
  }

  return (
    <AdminPageTransition>
      <div className="grid gap-5">
        <div className="glass rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="chip">Projects</div>
              <h2 className="mt-4 font-poppins text-2xl font-extrabold">
                <span className="gradient-text">Projects Management</span>
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-muted">
                Present meaningful projects that reflect your expertise and problem-solving ability.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <motion.button
                type="button"
                onClick={() => setOpenAdd(true)}
                className="btn-primary justify-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus className="h-4 w-4" />
                Add Project
              </motion.button>
            </div>
          </div>

          {pageError ? (
            <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-300">
              {pageError}
            </div>
          ) : null}
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {projects.map((p) => (
            <AdminProjectCard
              key={p.id}
              project={p}
              onPreview={(proj) => setPreviewProject(proj)}
              onEdit={(proj) => setEditProject(proj)}
              onDelete={(proj) => setDeleteProject(proj)}
            />
          ))}
        </div>

        {!projects.length && !status?.bootstrapping ? (
          <div className="glass rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-7">
            <div className="text-sm font-semibold">No projects yet</div>
            <div className="mt-2 text-sm text-muted">
              Showcase the work you're most proud of.
            </div>
          </div>
        ) : null}

        <div className="glass rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-7">
          <div className="text-sm font-semibold">Tip</div>
          <div className="mt-2 text-sm text-muted">
            Quality projects speak louder than quantity.
          </div>
        </div>
      </div>

      <ProjectFormModal
        open={openAdd}
        mode="add"
        onClose={() => setOpenAdd(false)}
        onSubmit={handleAdd}
      />

      <ProjectFormModal
        open={Boolean(editProject)}
        mode="edit"
        initialProject={editProject}
        onClose={() => setEditProject(null)}
        onSubmit={handleUpdate}
      />

      <ProjectPreviewModal
        open={Boolean(previewProject)}
        project={previewProject}
        onClose={() => setPreviewProject(null)}
      />

      <ProjectDeleteModal
        open={Boolean(deleteProject)}
        project={deleteProject}
        onClose={() => setDeleteProject(null)}
        onConfirm={handleDelete}
      />
    </AdminPageTransition>
  )
}
