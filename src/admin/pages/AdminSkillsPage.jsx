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
  const [editSkill, setEditSkill] = useState(null) // { group, skill }
  const [deleteSkill, setDeleteSkill] = useState(null) // { group, skill }

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
                Create and manage skill groups and skill items. Updates sync to LocalStorage and reflect instantly in your portfolio Skills section.
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
              Click <span className="text-text">Add Group</span> to create your first category.
            </div>
          </div>
        ) : null}

        <div className="glass rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-7">
          <div className="text-sm font-semibold">Tip</div>
          <div className="mt-2 text-sm text-muted">
            Icons use <span className="text-text">iconKey</span> values from your registry. Level is a 0–100 percentage.
          </div>
        </div>
      </div>

      <SkillGroupFormModal
        open={openAddGroup}
        mode="add"
        onClose={() => setOpenAddGroup(false)}
        onSubmit={(payload) => {
          actions.addSkillGroup({ ...payload, items: [] })
          setOpenAddGroup(false)
        }}
      />

      <SkillGroupFormModal
        open={Boolean(editGroup)}
        mode="edit"
        initialGroup={editGroup}
        onClose={() => setEditGroup(null)}
        onSubmit={(payload) => {
          actions.updateSkillGroup({ ...editGroup, ...payload, items: editGroup?.items || [] })
          setEditGroup(null)
        }}
      />

      <SkillFormModal
        open={Boolean(addSkillGroup)}
        mode="add"
        groupTitle={addSkillGroup?.title}
        onClose={() => setAddSkillGroup(null)}
        onSubmit={(payload) => {
          if (addSkillGroup?.id) actions.addSkill(addSkillGroup.id, payload)
          setAddSkillGroup(null)
        }}
      />

      <SkillFormModal
        open={Boolean(editSkill)}
        mode="edit"
        groupTitle={editSkill?.group?.title}
        initialSkill={editSkill?.skill}
        onClose={() => setEditSkill(null)}
        onSubmit={(payload) => {
          if (editSkill?.group?.id) actions.updateSkill(editSkill.group.id, { ...editSkill.skill, ...payload })
          setEditSkill(null)
        }}
      />

      <SkillsDeleteModal
        open={Boolean(deleteGroup)}
        title="Delete group"
        description={
          deleteGroup
            ? `This will remove “${deleteGroup.title}” and all its skills from your portfolio.`
            : ''
        }
        onClose={() => setDeleteGroup(null)}
        onConfirm={() => {
          if (deleteGroup?.id) actions.deleteSkillGroup(deleteGroup.id)
          setDeleteGroup(null)
        }}
      />

      <SkillsDeleteModal
        open={Boolean(deleteSkill)}
        title="Delete skill"
        description={
          deleteSkill
            ? `This will remove “${deleteSkill.skill?.name}” from “${deleteSkill.group?.title}”.`
            : ''
        }
        onClose={() => setDeleteSkill(null)}
        onConfirm={() => {
          if (deleteSkill?.group?.id && deleteSkill?.skill?.id) {
            actions.deleteSkill(deleteSkill.group.id, deleteSkill.skill.id)
          }
          setDeleteSkill(null)
        }}
      />
    </AdminPageTransition>
  )
}
