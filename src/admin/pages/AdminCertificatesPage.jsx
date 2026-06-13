import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import AdminPageTransition from '../components/AdminPageTransition.jsx'
import { usePortfolio } from '../../context/PortfolioContext.jsx'
import AdminCertificateCard from '../components/certificates/AdminCertificateCard.jsx'
import CertificateFormModal from '../components/certificates/CertificateFormModal.jsx'
import CertificatePreviewModal from '../components/certificates/CertificatePreviewModal.jsx'
import CertificateDeleteModal from '../components/certificates/CertificateDeleteModal.jsx'

export default function AdminCertificatesPage() {
  const { state, actions } = usePortfolio()

  const certs = useMemo(() => state.certificates || [], [state.certificates])

  useEffect(() => {
    void actions?.refreshCertificates?.()
  }, [actions])

  const [openAdd, setOpenAdd] = useState(false)
  const [editCert, setEditCert] = useState(null)
  const [previewCert, setPreviewCert] = useState(null)
  const [deleteCert, setDeleteCert] = useState(null)
  const [pageError, setPageError] = useState('')

  async function handleAdd(payload) {
    setPageError('')
    const res = await actions.addCertificate(payload)
    if (res?.ok) {
      setOpenAdd(false)
    } else {
      setPageError(res?.message || 'Failed to add certificate. Check Firebase rules.')
    }
  }

  async function handleUpdate(payload) {
    setPageError('')
    const res = await actions.updateCertificate({ ...editCert, ...payload })
    if (res?.ok) {
      setEditCert(null)
    } else {
      setPageError(res?.message || 'Failed to update certificate.')
    }
  }

  async function handleDelete() {
    if (!deleteCert?.id) return
    setPageError('')
    const res = await actions.deleteCertificate(deleteCert.id)
    if (res?.ok) {
      setDeleteCert(null)
    } else {
      setPageError(res?.message || 'Failed to delete certificate.')
      setDeleteCert(null)
    }
  }

  return (
    <AdminPageTransition>
      <div className="grid gap-5">
        <div className="glass rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="chip">Certificates</div>
              <h2 className="mt-4 font-poppins text-2xl font-extrabold">
                <span className="gradient-text">Certificates Management</span>
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-muted">
                Highlight the certifications that support your professional journey.
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
              Add Certificate
            </motion.button>
          </div>

          {pageError ? (
            <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-300">
              {pageError}
            </div>
          ) : null}
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {certs.map((c) => (
            <AdminCertificateCard
              key={c.id || c.title}
              cert={c}
              onPreview={(cert) => setPreviewCert(cert)}
              onEdit={(cert) => setEditCert(cert)}
              onDelete={(cert) => setDeleteCert(cert)}
            />
          ))}
        </div>

        {!certs.length ? (
          <div className="glass rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-7">
            <div className="text-sm font-semibold">No certificates yet</div>
            <div className="mt-2 text-sm text-muted">
              Showcase your verified skills and credentials.
            </div>
          </div>
        ) : null}

        <div className="glass rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-7">
          <div className="text-sm font-semibold">Tip</div>
          <div className="mt-2 text-sm text-muted">
            Quality credentials leave a lasting professional impression.
          </div>
        </div>
      </div>

      <CertificateFormModal
        open={openAdd}
        mode="add"
        onClose={() => setOpenAdd(false)}
        onSubmit={handleAdd}
      />

      <CertificateFormModal
        open={Boolean(editCert)}
        mode="edit"
        initialCert={editCert}
        onClose={() => setEditCert(null)}
        onSubmit={handleUpdate}
      />

      <CertificatePreviewModal
        open={Boolean(previewCert)}
        cert={previewCert}
        onClose={() => setPreviewCert(null)}
      />

      <CertificateDeleteModal
        open={Boolean(deleteCert)}
        cert={deleteCert}
        onClose={() => setDeleteCert(null)}
        onConfirm={handleDelete}
      />
    </AdminPageTransition>
  )
}
