import { useMemo, useState } from 'react'
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
  const { state, actions } = usePortfolio()

  const projects = useMemo(() => state.projects || [], [state.projects])

  const [openAdd, setOpenAdd] = useState(false)
  const [editProject, setEditProject] = useState(null)
  const [previewProject, setPreviewProject] = useState(null)
  const [deleteProject, setDeleteProject] = useState(null)

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
                Add, edit, delete, upload images, and preview. Updates sync to LocalStorage and reflect instantly in your existing portfolio Projects section.
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

        {!projects.length ? (
          <div className="glass rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-7">
            <div className="text-sm font-semibold">No projects yet</div>
            <div className="mt-2 text-sm text-muted">
              Click <span className="text-text">Add Project</span> to create your first one.
            </div>
          </div>
        ) : null}

        <div className="glass rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-7">
          <div className="text-sm font-semibold">Tip</div>
          <div className="mt-2 text-sm text-muted">
            Images are stored as Base64 in LocalStorage for a frontend-only CMS. Use Settings → Export as a backup.
          </div>
        </div>
      </div>

      <ProjectFormModal
        open={openAdd}
        mode="add"
        onClose={() => setOpenAdd(false)}
        onSubmit={(payload) => {
          actions.addProject(ensureProjectForPortfolio(payload))
          setOpenAdd(false)
        }}
      />

      <ProjectFormModal
        open={Boolean(editProject)}
        mode="edit"
        initialProject={editProject}
        onClose={() => setEditProject(null)}
        onSubmit={(payload) => {
          actions.updateProject(ensureProjectForPortfolio({ ...editProject, ...payload }))
          setEditProject(null)
        }}
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
        onConfirm={() => {
          if (deleteProject?.id) actions.deleteProject(deleteProject.id)
          setDeleteProject(null)
        }}
      />
    </AdminPageTransition>
  )
}
