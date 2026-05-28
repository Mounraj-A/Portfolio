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
                Add, edit, and delete Services. Updates sync to LocalStorage and reflect instantly in your portfolio Services section.
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
            <div className="text-sm font-semibold">No services yet</div>
            <div className="mt-2 text-sm text-muted">
              Click <span className="text-text">Add Service</span> to create your first one.
            </div>
          </div>
        ) : null}

        <div className="glass rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-7">
          <div className="text-sm font-semibold">Tip</div>
          <div className="mt-2 text-sm text-muted">
            Use short titles and concise descriptions for the best card layout.
          </div>
        </div>
      </div>

      <ServiceFormModal
        open={openAdd}
        mode="add"
        onClose={() => setOpenAdd(false)}
        onSubmit={(payload) => {
          actions.addService(payload)
          setOpenAdd(false)
        }}
      />

      <ServiceFormModal
        open={Boolean(editItem)}
        mode="edit"
        initialService={editItem}
        onClose={() => setEditItem(null)}
        onSubmit={(payload) => {
          actions.updateService({ ...editItem, ...payload })
          setEditItem(null)
        }}
      />

      <ServiceDeleteModal
        open={Boolean(deleteItem)}
        service={deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={() => {
          if (deleteItem?.id) actions.deleteService(deleteItem.id)
          setDeleteItem(null)
        }}
      />
    </AdminPageTransition>
  )
}
