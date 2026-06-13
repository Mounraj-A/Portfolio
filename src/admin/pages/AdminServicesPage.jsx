import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import AdminPageTransition from '../components/AdminPageTransition.jsx'
import { usePortfolio } from '../../context/PortfolioContext.jsx'
import AdminServiceCard from '../components/services/AdminServiceCard.jsx'
import ServiceFormModal from '../components/services/ServiceFormModal.jsx'
import ServiceDeleteModal from '../components/services/ServiceDeleteModal.jsx'

export default function AdminServicesPage() {
  const { state, actions } = usePortfolio()
  const items = useMemo(() => state.services || [], [state.services])

  const [openAdd, setOpenAdd] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [deleteItem, setDeleteItem] = useState(null)
  const [pageError, setPageError] = useState('')

  async function handleAdd(payload) {
    setPageError('')
    const res = await actions.addService(payload)
    if (res?.ok) {
      setOpenAdd(false)
    } else {
      setPageError(res?.message || 'Failed to add service. Check Firebase rules.')
    }
  }

  async function handleUpdate(payload) {
    setPageError('')
    const res = await actions.updateService({ ...editItem, ...payload })
    if (res?.ok) {
      setEditItem(null)
    } else {
      setPageError(res?.message || 'Failed to update service.')
    }
  }

  async function handleDelete() {
    if (!deleteItem?.id) return
    setPageError('')
    const res = await actions.deleteService(deleteItem.id)
    if (res?.ok) {
      setDeleteItem(null)
    } else {
      setPageError(res?.message || 'Failed to delete service.')
      setDeleteItem(null)
    }
  }

  return (
    <AdminPageTransition>
      <div className="grid gap-5">
        <div className="glass rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="chip">Services</div>
              <h2 className="mt-4 font-poppins text-2xl font-extrabold">
                <span className="gradient-text">Services Management</span>
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-muted">
                Highlight the key services, solutions, and expertise you offer to clients and employers.
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
              Add Service
            </motion.button>
          </div>

          {pageError ? (
            <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-300">
              {pageError}
            </div>
          ) : null}
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map((s) => (
            <AdminServiceCard
              key={s.id || s.title}
              service={s}
              onEdit={(item) => setEditItem(item)}
              onDelete={(item) => setDeleteItem(item)}
            />
          ))}
        </div>

        {!items.length ? (
          <div className="glass rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-7">
            <div className="text-sm font-semibold">No services added yet</div>
            <div className="mt-2 text-sm text-muted">
              Showcase what you do best.
            </div>
          </div>
        ) : null}

        <div className="glass rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-7">
          <div className="text-sm font-semibold">Tip</div>
          <div className="mt-2 text-sm text-muted">
            Focus on value, not features. Describe the outcomes you deliver, not just the tasks you perform.
          </div>
        </div>
      </div>

      <ServiceFormModal
        open={openAdd}
        mode="add"
        onClose={() => setOpenAdd(false)}
        onSubmit={handleAdd}
      />

      <ServiceFormModal
        open={Boolean(editItem)}
        mode="edit"
        initialService={editItem}
        onClose={() => setEditItem(null)}
        onSubmit={handleUpdate}
      />

      <ServiceDeleteModal
        open={Boolean(deleteItem)}
        service={deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={handleDelete}
      />
    </AdminPageTransition>
  )
}
