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

  return (
    <AdminPageTransition>
      <div className="grid gap-5">
        <div className="glass rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="chip">Achievements</div>
              <h2 className="mt-4 font-poppins text-2xl font-extrabold">
                <span className="gradient-text">Achievements Management</span>
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-muted">
                Add, edit, and delete Achievements. Updates sync to LocalStorage and reflect instantly in your portfolio Achievements section.
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
            <div className="text-sm font-semibold">No achievements yet</div>
            <div className="mt-2 text-sm text-muted">
              Click <span className="text-text">Add Achievement</span> to create your first one.
            </div>
          </div>
        ) : null}

        <div className="glass rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-7">
          <div className="text-sm font-semibold">Tip</div>
          <div className="mt-2 text-sm text-muted">
            Pick icons that match the card meaning for a consistent premium look.
          </div>
        </div>
      </div>

      <AchievementFormModal
        open={openAdd}
        mode="add"
        onClose={() => setOpenAdd(false)}
        onSubmit={(payload) => {
          actions.addAchievement(payload)
          setOpenAdd(false)
        }}
      />

      <AchievementFormModal
        open={Boolean(editItem)}
        mode="edit"
        initialAchievement={editItem}
        onClose={() => setEditItem(null)}
        onSubmit={(payload) => {
          actions.updateAchievement({ ...editItem, ...payload })
          setEditItem(null)
        }}
      />

      <AchievementDeleteModal
        open={Boolean(deleteItem)}
        achievement={deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={() => {
          if (deleteItem?.id) actions.deleteAchievement(deleteItem.id)
          setDeleteItem(null)
        }}
      />
    </AdminPageTransition>
  )
}
