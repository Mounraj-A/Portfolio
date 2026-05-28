import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import AdminPageTransition from '../components/AdminPageTransition.jsx'
import { usePortfolio } from '../../context/PortfolioContext.jsx'
import AdminTimelineCard from '../components/timeline/AdminTimelineCard.jsx'
import TimelineFormModal from '../components/timeline/TimelineFormModal.jsx'
import TimelineDeleteModal from '../components/timeline/TimelineDeleteModal.jsx'

export default function AdminTimelinePage() {
  const { state, actions } = usePortfolio()
  const items = useMemo(() => state.timeline || [], [state.timeline])

  const [openAdd, setOpenAdd] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [deleteItem, setDeleteItem] = useState(null)

  return (
    <AdminPageTransition>
      <div className="grid gap-5">
        <div className="glass rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="chip">Timeline</div>
              <h2 className="mt-4 font-poppins text-2xl font-extrabold">
                <span className="gradient-text">Timeline Management</span>
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-muted">
                Add, edit, and delete Timeline items. Updates sync to LocalStorage and reflect instantly in your portfolio Timeline section.
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
              Add Item
            </motion.button>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map((t) => (
            <AdminTimelineCard
              key={t.id || t.title}
              item={t}
              onEdit={(item) => setEditItem(item)}
              onDelete={(item) => setDeleteItem(item)}
            />
          ))}
        </div>

        {!items.length ? (
          <div className="glass rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-7">
            <div className="text-sm font-semibold">No timeline items yet</div>
            <div className="mt-2 text-sm text-muted">
              Click <span className="text-text">Add Item</span> to create your first one.
            </div>
          </div>
        ) : null}

        <div className="glass rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-7">
          <div className="text-sm font-semibold">Tip</div>
          <div className="mt-2 text-sm text-muted">
            Keep the year short (e.g. 2024) and the description concise.
          </div>
        </div>
      </div>

      <TimelineFormModal
        open={openAdd}
        mode="add"
        onClose={() => setOpenAdd(false)}
        onSubmit={(payload) => {
          actions.addTimelineItem(payload)
          setOpenAdd(false)
        }}
      />

      <TimelineFormModal
        open={Boolean(editItem)}
        mode="edit"
        initialItem={editItem}
        onClose={() => setEditItem(null)}
        onSubmit={(payload) => {
          actions.updateTimelineItem({ ...editItem, ...payload })
          setEditItem(null)
        }}
      />

      <TimelineDeleteModal
        open={Boolean(deleteItem)}
        item={deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={() => {
          if (deleteItem?.id) actions.deleteTimelineItem(deleteItem.id)
          setDeleteItem(null)
        }}
      />
    </AdminPageTransition>
  )
}
