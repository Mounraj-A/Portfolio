import { useMemo, useState } from 'react'
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

  const [openAdd, setOpenAdd] = useState(false)
  const [editCert, setEditCert] = useState(null)
  const [previewCert, setPreviewCert] = useState(null)
  const [deleteCert, setDeleteCert] = useState(null)

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
                Add, edit, delete, upload images, and preview. Updates sync to LocalStorage and reflect instantly in your portfolio Certifications section.
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
              Click <span className="text-text">Add Certificate</span> to create your first one.
            </div>
          </div>
        ) : null}

        <div className="glass rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-7">
          <div className="text-sm font-semibold">Tip</div>
          <div className="mt-2 text-sm text-muted">
            Certificate images are stored as Base64 in LocalStorage. Use Settings → Export as a backup.
          </div>
        </div>
      </div>

      <CertificateFormModal
        open={openAdd}
        mode="add"
        onClose={() => setOpenAdd(false)}
        onSubmit={(payload) => {
          actions.addCertificate(payload)
          setOpenAdd(false)
        }}
      />

      <CertificateFormModal
        open={Boolean(editCert)}
        mode="edit"
        initialCert={editCert}
        onClose={() => setEditCert(null)}
        onSubmit={(payload) => {
          actions.updateCertificate({ ...editCert, ...payload })
          setEditCert(null)
        }}
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
        onConfirm={() => {
          if (deleteCert?.id) actions.deleteCertificate(deleteCert.id)
          setDeleteCert(null)
        }}
      />
    </AdminPageTransition>
  )
}
