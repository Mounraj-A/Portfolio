import { useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Upload, RefreshCcw, Lock } from 'lucide-react'
import AdminPageTransition from '../components/AdminPageTransition.jsx'
import GlassCard from '../../components/GlassCard.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { usePortfolio } from '../../context/PortfolioContext.jsx'
import { downloadJson, removeKey } from '../../storage/storage.js'
import { STORAGE_KEYS } from '../../storage/keys.js'
import { getDefaultPortfolioState } from '../../data/defaultPortfolio.js'
import SkillsDeleteModal from '../components/skills/SkillsDeleteModal.jsx'

export default function AdminSettingsPage() {
  const { actions: authActions } = useAuth()
  const { state, actions: portfolioActions } = usePortfolio()

  const inputRef = useRef(null)
  const [dataStatus, setDataStatus] = useState('')
  const [securityStatus, setSecurityStatus] = useState('')
  const [pw, setPw] = useState({ current: '', next: '' })

  const [confirmReset, setConfirmReset] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)

  const lastUpdated = useMemo(() => {
    const raw = state?.meta?.lastUpdated
    if (!raw) return ''
    const d = new Date(raw)
    return Number.isNaN(d.getTime()) ? String(raw) : d.toLocaleString()
  }, [state?.meta?.lastUpdated])

  function onExport() {
    downloadJson(`portfolio-export-${Date.now()}.json`, state)
    setDataStatus('Exported portfolio JSON.')
    window.setTimeout(() => setDataStatus(''), 2000)
  }

  function onReset() {
    portfolioActions.replacePortfolio(getDefaultPortfolioState())
    setDataStatus('Portfolio data reset to defaults.')
    window.setTimeout(() => setDataStatus(''), 2500)
  }

  async function onImportFile(file) {
    setDataStatus('')
    try {
      const text = await file.text()
      const parsed = JSON.parse(text)
      if (!parsed || typeof parsed !== 'object') {
        setDataStatus('Invalid JSON file.')
        return
      }
      portfolioActions.replacePortfolio(parsed)
      setDataStatus('Imported portfolio data successfully.')
      window.setTimeout(() => setDataStatus(''), 2500)
    } catch (e) {
      setDataStatus(e?.message ? `Failed to import: ${e.message}` : 'Failed to import JSON.')
    }
  }

  function onImportClick() {
    inputRef.current?.click()
  }

  function onClearLocalStorage() {
    removeKey(STORAGE_KEYS.portfolio)
    portfolioActions.replacePortfolio(getDefaultPortfolioState())
    setDataStatus('Cleared saved storage and loaded defaults.')
    window.setTimeout(() => setDataStatus(''), 2500)
  }

  function onChangePassword(e) {
    e.preventDefault()
    setSecurityStatus('')
    const res = authActions.changePassword({
      currentPassword: pw.current,
      newPassword: pw.next,
    })
    if (!res.ok) {
      setSecurityStatus(res.message || 'Failed to change password')
      return
    }
    setPw({ current: '', next: '' })
    setSecurityStatus('Admin password updated.')
    window.setTimeout(() => setSecurityStatus(''), 2500)
  }

  return (
    <AdminPageTransition>
      <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <GlassCard className="p-6 sm:p-7 hover:border-white/20">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="chip">Data</div>
              <div className="mt-4 font-poppins text-xl font-extrabold">
                <span className="gradient-text">Import / Export</span>
              </div>
              <div className="mt-2 text-sm text-muted">
                Backup and restore your portfolio data (LocalStorage).
              </div>
              {lastUpdated ? (
                <div className="mt-3 text-[11px] text-muted/70">Last updated: {lastUpdated}</div>
              ) : null}
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <motion.button
              type="button"
              className="btn-secondary w-full justify-center"
              onClick={onExport}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download className="h-4 w-4" />
              Export JSON
            </motion.button>

            <motion.button
              type="button"
              className="btn-primary w-full justify-center"
              onClick={onImportClick}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Upload className="h-4 w-4" />
              Import JSON
            </motion.button>

            <motion.button
              type="button"
              className="btn-secondary w-full justify-center"
              onClick={() => setConfirmReset(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RefreshCcw className="h-4 w-4" />
              Reset Defaults
            </motion.button>

            <motion.button
              type="button"
              className="btn-secondary w-full justify-center"
              onClick={() => setConfirmClear(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Clear Saved Key
            </motion.button>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) onImportFile(file)
              e.target.value = ''
            }}
          />

          {dataStatus ? <div className="mt-4 text-xs text-muted">{dataStatus}</div> : null}
        </GlassCard>

        <GlassCard className="p-6 sm:p-7 hover:border-white/20">
          <div className="chip">Security</div>
          <div className="mt-4 font-poppins text-xl font-extrabold">
            <span className="gradient-text">Change Password</span>
          </div>
          <div className="mt-2 text-sm text-muted">
            Frontend-only auth for now (stored in LocalStorage).
          </div>

          <form onSubmit={onChangePassword} className="mt-6 grid gap-4">
            <div>
              <label className="text-xs font-semibold text-muted">Current password</label>
              <input
                type="password"
                value={pw.current}
                onChange={(e) => setPw((p) => ({ ...p, current: e.target.value }))}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-text placeholder:text-muted/60 outline-none transition focus:border-accentCyan/60 focus:shadow-glowCyan"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted">New password</label>
              <input
                type="password"
                value={pw.next}
                onChange={(e) => setPw((p) => ({ ...p, next: e.target.value }))}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-text placeholder:text-muted/60 outline-none transition focus:border-accentCyan/60 focus:shadow-glowCyan"
                required
              />
            </div>

            <motion.button
              type="submit"
              className="btn-primary mt-1 w-full justify-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Lock className="h-4 w-4" />
              Update Password
            </motion.button>
          </form>

          {securityStatus ? (
            <div className="mt-4 text-xs text-muted">{securityStatus}</div>
          ) : null}
        </GlassCard>
      </div>

      <SkillsDeleteModal
        open={confirmReset}
        title="Reset portfolio data"
        description="This will overwrite your saved portfolio data with defaults. You can export a backup JSON first."
        onClose={() => setConfirmReset(false)}
        onConfirm={() => {
          onReset()
          setConfirmReset(false)
        }}
      />

      <SkillsDeleteModal
        open={confirmClear}
        title="Clear saved storage"
        description="This removes the saved portfolio LocalStorage key and loads defaults immediately."
        onClose={() => setConfirmClear(false)}
        onConfirm={() => {
          onClearLocalStorage()
          setConfirmClear(false)
        }}
      />
    </AdminPageTransition>
  )
}
