import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import AdminPageTransition from '../components/AdminPageTransition.jsx'
import { usePortfolio } from '../../context/PortfolioContext.jsx'
import AdminSkillGroupCard from '../components/skills/AdminSkillGroupCard.jsx'
import SkillGroupFormModal from '../components/skills/SkillGroupFormModal.jsx'
import SkillFormModal from '../components/skills/SkillFormModal.jsx'
import SkillsDeleteModal from '../components/skills/SkillsDeleteModal.jsx'

export default function AdminSkillsPage() {
  const { state, actions } = usePortfolio()

  const groups = useMemo(() => state.skills?.groups || [], [state.skills])

  const [openAddGroup, setOpenAddGroup] = useState(false)
  const [editGroup, setEditGroup] = useState(null)
  const [deleteGroup, setDeleteGroup] = useState(null)

  const [addSkillGroup, setAddSkillGroup] = useState(null)
  const [editSkill, setEditSkill] = useState(null)
  const [deleteSkill, setDeleteSkill] = useState(null)

  const [pageError, setPageError] = useState('')

  async function handleAddGroup(payload) {
    setPageError('')
    const res = await actions.addSkillGroup({ ...payload, items: [] })
    if (res?.ok) {
      setOpenAddGroup(false)
    } else {
      setPageError(res?.message || 'Failed to add skill group. Check Firebase rules.')
    }
  }

  async function handleUpdateGroup(payload) {
    setPageError('')
    const res = await actions.updateSkillGroup({ ...editGroup, ...payload, items: editGroup?.items || [] })
    if (res?.ok) {
      setEditGroup(null)
    } else {
      setPageError(res?.message || 'Failed to update skill group.')
    }
  }

  async function handleDeleteGroup() {
    if (!deleteGroup?.id) return
    setPageError('')
    const res = await actions.deleteSkillGroup(deleteGroup.id)
    if (res?.ok) {
      setDeleteGroup(null)
    } else {
      setPageError(res?.message || 'Failed to delete skill group.')
      setDeleteGroup(null)
    }
  }

  async function handleAddSkill(payload) {
    if (!addSkillGroup?.id) return
    setPageError('')
    const res = await actions.addSkill(addSkillGroup.id, payload)
    if (res?.ok) {
      setAddSkillGroup(null)
    } else {
      setPageError(res?.message || 'Failed to add skill. Check Firebase rules.')
    }
  }

  async function handleUpdateSkill(payload) {
    if (!editSkill?.group?.id) return
    setPageError('')
    const res = await actions.updateSkill(editSkill.group.id, { ...editSkill.skill, ...payload })
    if (res?.ok) {
      setEditSkill(null)
    } else {
      setPageError(res?.message || 'Failed to update skill.')
    }
  }

  async function handleDeleteSkill() {
    if (!deleteSkill?.group?.id || !deleteSkill?.skill?.id) return
    setPageError('')
    const res = await actions.deleteSkill(deleteSkill.group.id, deleteSkill.skill.id)
    if (res?.ok) {
      setDeleteSkill(null)
    } else {
      setPageError(res?.message || 'Failed to delete skill.')
      setDeleteSkill(null)
    }
  }

  return (
    <AdminPageTransition>
      <div className="grid gap-5">
        <div className="glass rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="chip">Skills</div>
              <h2 className="mt-4 font-poppins text-2xl font-extrabold">
                <span className="gradient-text">Skills Management</span>
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-muted">
                Present your technical strengths with clarity and confidence.
              </p>
            </div>

            <motion.button
              type="button"
              onClick={() => setOpenAddGroup(true)}
              className="btn-primary justify-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="h-4 w-4" />
              Add Group
            </motion.button>
          </div>

          {pageError ? (
            <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-300">
              {pageError}
            </div>
          ) : null}
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {groups.map((g) => (
            <AdminSkillGroupCard
              key={g.id}
              group={g}
              onAddSkill={(group) => setAddSkillGroup(group)}
              onEditGroup={(group) => setEditGroup(group)}
              onDeleteGroup={(group) => setDeleteGroup(group)}
              onEditSkill={(group, skill) => setEditSkill({ group, skill })}
              onDeleteSkill={(group, skill) => setDeleteSkill({ group, skill })}
            />
          ))}
        </div>

        {!groups.length ? (
          <div className="glass rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-7">
            <div className="text-sm font-semibold">No skill groups yet</div>
            <div className="mt-2 text-sm text-muted">
              Organize your expertise by creating your first skill category.
            </div>
          </div>
        ) : null}

        <div className="glass rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-7">
          <div className="text-sm font-semibold">Tip</div>
          <div className="mt-2 text-sm text-muted">Focus on skills you actively use and continuously improve.
          </div>
        </div>
      </div>

      <SkillGroupFormModal
        open={openAddGroup}
        mode="add"
        onClose={() => setOpenAddGroup(false)}
        onSubmit={handleAddGroup}
      />

      <SkillGroupFormModal
        open={Boolean(editGroup)}
        mode="edit"
        initialGroup={editGroup}
        onClose={() => setEditGroup(null)}
        onSubmit={handleUpdateGroup}
      />

      <SkillFormModal
        open={Boolean(addSkillGroup)}
        mode="add"
        groupTitle={addSkillGroup?.title}
        onClose={() => setAddSkillGroup(null)}
        onSubmit={handleAddSkill}
      />

      <SkillFormModal
        open={Boolean(editSkill)}
        mode="edit"
        groupTitle={editSkill?.group?.title}
        initialSkill={editSkill?.skill}
        onClose={() => setEditSkill(null)}
        onSubmit={handleUpdateSkill}
      />

      <SkillsDeleteModal
        open={Boolean(deleteGroup)}
        title="Delete group"
        description={
          deleteGroup
            ? `This will remove "${deleteGroup.title}" and all its skills from your portfolio.`
            : ''
        }
        onClose={() => setDeleteGroup(null)}
        onConfirm={handleDeleteGroup}
      />

      <SkillsDeleteModal
        open={Boolean(deleteSkill)}
        title="Delete skill"
        description={
          deleteSkill
            ? `This will remove "${deleteSkill.skill?.name}" from "${deleteSkill.group?.title}".`
            : ''
        }
        onClose={() => setDeleteSkill(null)}
        onConfirm={handleDeleteSkill}
      />
    </AdminPageTransition>
  )
}
