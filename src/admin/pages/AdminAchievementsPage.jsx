import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import AdminPageTransition from '../components/AdminPageTransition.jsx'
import { usePortfolio } from '../../context/PortfolioContext.jsx'
import AdminAchievementCard from '../components/achievements/AdminAchievementCard.jsx'
import AchievementFormModal from '../components/achievements/AchievementFormModal.jsx'
import AchievementDeleteModal from '../components/achievements/AchievementDeleteModal.jsx'

export default function AdminAchievementsPage() {
  const { state, actions } = usePortfolio()
  const items = useMemo(() => state.achievements || [], [state.achievements])

  const [openAdd, setOpenAdd] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [deleteItem, setDeleteItem] = useState(null)
  const [pageError, setPageError] = useState('')

  async function handleAdd(payload) {
    setPageError('')
    const res = await actions.addAchievement(payload)
    if (res?.ok) {
      setOpenAdd(false)
    } else {
      setPageError(res?.message || 'Failed to add achievement. Check Firebase rules.')
    }
  }

  async function handleUpdate(payload) {
    setPageError('')
    const res = await actions.updateAchievement({ ...editItem, ...payload })
    if (res?.ok) {
      setEditItem(null)
    } else {
      setPageError(res?.message || 'Failed to update achievement.')
    }
  }

  async function handleDelete() {
    if (!deleteItem?.id) return
    setPageError('')
    const res = await actions.deleteAchievement(deleteItem.id)
    if (res?.ok) {
      setDeleteItem(null)
    } else {
      setPageError(res?.message || 'Failed to delete achievement.')
      setDeleteItem(null)
    }
  }

  return (
    <AdminPageTransition>
      <div className="grid gap-5">
        <div className="glass rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="chip">Achievements</div>
              <h2 className="mt-4 font-poppins text-2xl font-extrabold">
                <span className="gradient-text">Build your success story</span>
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-muted">
                Highlight notable accomplishments, certifications, awards, leadership experiences, and milestones that demonstrate your expertise, dedication, and professional growth.
              </p>
            </div>

            <motion.button
              type="button"
              onClick={() => setOpenAdd(true)}
              className="btn-primary justify-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="h-4 w-4" />
              Add Achievement
            </motion.button>
          </div>

          {pageError ? (
            <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-300">
              {pageError}
            </div>
          ) : null}
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {items.map((a) => (
            <AdminAchievementCard
              key={a.id || a.title}
              achievement={a}
              onEdit={(item) => setEditItem(item)}
              onDelete={(item) => setDeleteItem(item)}
            />
          ))}
        </div>

        {!items.length ? (
          <div className="glass rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-7">
            <div className="text-sm font-semibold">No achievements added yet</div>
            <div className="mt-2 text-sm text-muted">
              Every certification earned, challenge completed, and project delivered contributes to your professional identity. Start documenting your milestones to showcase your growth.
            </div>
          </div>
        ) : null}

        <div className="glass rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-7">
          <div className="text-sm font-semibold">Tip</div>
          <div className="mt-2 text-sm text-muted">
            Include achievements that validate your expertise—such as certifications, hackathons, internships, academic distinctions, open-source contributions, and successful project deliveries.
          </div>
        </div>
      </div>

      <AchievementFormModal
        open={openAdd}
        mode="add"
        onClose={() => setOpenAdd(false)}
        onSubmit={handleAdd}
      />

      <AchievementFormModal
        open={Boolean(editItem)}
        mode="edit"
        initialAchievement={editItem}
        onClose={() => setEditItem(null)}
        onSubmit={handleUpdate}
      />

      <AchievementDeleteModal
        open={Boolean(deleteItem)}
        achievement={deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={handleDelete}
      />
    </AdminPageTransition>
  )
}
