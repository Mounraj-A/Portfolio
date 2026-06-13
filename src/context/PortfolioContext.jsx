import { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import { getDefaultPortfolioState } from '../data/defaultPortfolio.js'
import { makeId } from '../utils/ids.js'
import {
  fetchProjects,
  addProject as createProject,
  updateProject as editProject,
  deleteProject as removeProject,
} from '../services/projectService.js'
import {
  fetchServices,
  addService as createService,
  updateService as editService,
  deleteService as removeService,
} from '../services/serviceService.js'
import {
  fetchAchievements,
  addAchievement as createAchievement,
  updateAchievement as editAchievement,
  deleteAchievement as removeAchievement,
} from '../services/achievementService.js'
import {
  fetchCertificates,
  addCertificate as createCertificate,
  updateCertificate as editCertificate,
  deleteCertificate as removeCertificate,
} from '../services/certificateService.js'
import {
  fetchTimeline,
  addTimeline as createTimelineItem,
  updateTimeline as editTimelineItem,
  deleteTimeline as removeTimelineItem,
} from '../services/timelineService.js'
import {
  fetchSkillGroups,
  addSkillGroup as createSkillGroup,
  updateSkillGroup as editSkillGroup,
  deleteSkillGroup as removeSkillGroup,
  addSkill as createSkill,
  updateSkill as editSkill,
  deleteSkill as removeSkill,
} from '../services/skillsService.js'
import { fetchAbout, updateAbout } from '../services/aboutService.js'
import { fetchContact, updateContact } from '../services/contactService.js'
import { fetchResume, updateResume } from '../services/resumeService.js'
import { fetchMeta, updateMeta } from '../services/metaService.js'
import { replacePortfolioInFirestore } from '../services/portfolioSyncService.js'

const PortfolioContext = createContext(null)

function withUpdatedMeta(state) {
  return {
    ...state,
    meta: {
      ...(state.meta || {}),
      lastUpdated: new Date().toISOString(),
    },
  }
}

function normalizeProject(raw) {
  const project = raw && typeof raw === 'object' ? raw : {}
  const title = String(project.title || '').trim()
  const description = String(project.description || '').trim()
  const tech = Array.isArray(project.tech)
    ? project.tech
    : typeof project.tech === 'string'
      ? project.tech.split(',')
      : []

  return {
    id: String(project.id || makeId('project')),
    title,
    description,
    longDescription: String(project.longDescription || description || '').trim(),
    highlights: Array.isArray(project.highlights) ? project.highlights : [],
    tech: tech
      .map((t) => String(t).trim())
      .filter(Boolean)
      .filter((t, idx, arr) => arr.indexOf(t) === idx),
    githubUrl: String(project.githubUrl || '').trim(),
    liveUrl: String(project.liveUrl || '').trim(),
    image: String(project.image || '').trim(),
  }
}

function normalizeCertificate(raw) {
  const cert = raw && typeof raw === 'object' ? raw : {}
  const title = String(cert.title || '').trim()
  return {
    id: String(cert.id || makeId('cert')),
    title,
    organization: String(cert.organization || '').trim(),
    description: String(cert.description || cert.note || '').trim(),
    note: String(cert.note || '').trim(),
    image: String(cert.image || '').trim(),
  }
}

function normalizeService(raw) {
  const s = raw && typeof raw === 'object' ? raw : {}
  return {
    id: String(s.id || makeId('service')),
    title: String(s.title || '').trim(),
    desc: String(s.desc || s.description || '').trim(),
    iconKey: String(s.iconKey || 'layout').trim() || 'layout',
  }
}

function normalizeAchievement(raw) {
  const a = raw && typeof raw === 'object' ? raw : {}
  return {
    id: String(a.id || makeId('ach')),
    title: String(a.title || '').trim(),
    desc: String(a.desc || a.description || '').trim(),
    iconKey: String(a.iconKey || 'trophy').trim() || 'trophy',
  }
}

function normalizeTimelineItem(raw) {
  const t = raw && typeof raw === 'object' ? raw : {}
  return {
    id: String(t.id || makeId('timeline')),
    year: String(t.year || '').trim(),
    title: String(t.title || '').trim(),
    desc: String(t.desc || t.description || '').trim(),
  }
}

function clamp(num, min, max) {
  const n = Number(num)
  if (Number.isNaN(n)) return min
  return Math.min(max, Math.max(min, n))
}

function normalizeSkillItem(raw) {
  const item = raw && typeof raw === 'object' ? raw : {}
  const name = String(item.name || '').trim()
  return {
    id: String(item.id || makeId('skill')),
    name,
    level: clamp(item.level ?? 0, 0, 100),
    iconKey: String(item.iconKey || 'code2').trim() || 'code2',
  }
}

function normalizeSkillGroup(raw) {
  const group = raw && typeof raw === 'object' ? raw : {}
  const title = String(group.title || '').trim()
  const items = Array.isArray(group.items) ? group.items.map(normalizeSkillItem) : []
  return {
    id: String(group.id || makeId('skills')),
    title,
    groupIconKey: String(group.groupIconKey || 'react').trim() || 'react',
    items,
  }
}

function normalizeSkills(raw) {
  const skills = raw && typeof raw === 'object' ? raw : {}
  const groups = Array.isArray(skills.groups) ? skills.groups.map(normalizeSkillGroup) : []
  return { groups }
}

function normalizeAbout(raw) {
  const about = raw && typeof raw === 'object' ? raw : {}
  const sectionHeader = about.sectionHeader && typeof about.sectionHeader === 'object' ? about.sectionHeader : {}
  const infoCards = about.infoCards && typeof about.infoCards === 'object' ? about.infoCards : {}

  return {
    sectionHeader: {
      eyebrow: String(sectionHeader.eyebrow || '').trim(),
      title: String(sectionHeader.title || '').trim(),
      subtitle: String(sectionHeader.subtitle || '').trim(),
    },
    heroName: String(about.heroName || '').trim(),
    paragraph: String(about.paragraph || '').trim(),
    infoCards: {
      collegeLabel: String(infoCards.collegeLabel || '').trim(),
      collegeValue: String(infoCards.collegeValue || '').trim(),
      careerGoalLabel: String(infoCards.careerGoalLabel || '').trim(),
      careerGoalValue: String(infoCards.careerGoalValue || '').trim(),
      interestsLabel: String(infoCards.interestsLabel || '').trim(),
      interestsValue: String(infoCards.interestsValue || '').trim(),
      mindsetLabel: String(infoCards.mindsetLabel || '').trim(),
      mindsetValue: String(infoCards.mindsetValue || '').trim(),
    },
  }
}

function normalizeResume(raw) {
  const resume = raw && typeof raw === 'object' ? raw : {}
  return {
    previewImage: String(resume.previewImage || '').trim(),
    pdfUrl: String(resume.pdfUrl || '').trim(),
  }
}

function normalizeFooterSocial(raw) {
  const s = raw && typeof raw === 'object' ? raw : {}
  return {
    label: String(s.label || '').trim(),
    href: String(s.href || '').trim(),
    iconKey: String(s.iconKey || 'mail').trim() || 'mail',
  }
}

function normalizeContact(raw) {
  const contact = raw && typeof raw === 'object' ? raw : {}
  const sectionHeader =
    contact.sectionHeader && typeof contact.sectionHeader === 'object' ? contact.sectionHeader : {}
  const direct = contact.direct && typeof contact.direct === 'object' ? contact.direct : {}
  const social = contact.social && typeof contact.social === 'object' ? contact.social : {}

  const footerSocialsRaw = Array.isArray(contact.footerSocials) ? contact.footerSocials : []
  const footerSocials = footerSocialsRaw
    .map(normalizeFooterSocial)
    .filter((s) => s.label && s.href)
    .filter((s, idx, arr) => arr.findIndex((x) => x.label === s.label) === idx)

  return {
    sectionHeader: {
      eyebrow: String(sectionHeader.eyebrow || '').trim(),
      title: String(sectionHeader.title || '').trim(),
      subtitle: String(sectionHeader.subtitle || '').trim(),
    },
    direct: {
      email: String(direct.email || '').trim(),
      phone: String(direct.phone || '').trim(),
      location: String(direct.location || '').trim(),
    },
    social: {
      github: String(social.github || '').trim(),
      linkedin: String(social.linkedin || '').trim(),
    },
    footerSocials,
  }
}

function portfolioReducer(state, action) {
  switch (action.type) {
    case 'PORTFOLIO_REPLACE':
      return {
        ...action.payload,
        projects: Array.isArray(action.payload?.projects)
          ? action.payload.projects.map(normalizeProject)
          : action.payload?.projects,
        certificates: Array.isArray(action.payload?.certificates)
          ? action.payload.certificates.map(normalizeCertificate)
          : action.payload?.certificates,
        skills: action.payload?.skills ? normalizeSkills(action.payload.skills) : action.payload?.skills,
        about: action.payload?.about ? normalizeAbout(action.payload.about) : action.payload?.about,
        resume: action.payload?.resume ? normalizeResume(action.payload.resume) : action.payload?.resume,
        contact: action.payload?.contact ? normalizeContact(action.payload.contact) : action.payload?.contact,
        services: Array.isArray(action.payload?.services)
          ? action.payload.services.map(normalizeService)
          : action.payload?.services,
        achievements: Array.isArray(action.payload?.achievements)
          ? action.payload.achievements.map(normalizeAchievement)
          : action.payload?.achievements,
        timeline: Array.isArray(action.payload?.timeline)
          ? action.payload.timeline.map(normalizeTimelineItem)
          : action.payload?.timeline,
        meta: action.payload?.meta || state?.meta || { lastUpdated: '' },
      }

    case 'PROJECTS_SET':
      return withUpdatedMeta({
        ...state,
        projects: Array.isArray(action.payload)
          ? action.payload.map(normalizeProject)
          : action.payload,
      })

    case 'PROJECT_ADD': {
      const next = [normalizeProject(action.payload), ...(state.projects || [])]
      return withUpdatedMeta({ ...state, projects: next })
    }

    case 'PROJECT_UPDATE': {
      const updated = normalizeProject(action.payload)
      const next = (state.projects || []).map((p) => (p.id === updated.id ? { ...p, ...updated } : p))
      return withUpdatedMeta({ ...state, projects: next })
    }

    case 'PROJECT_DELETE': {
      const id = String(action.payload || '')
      const next = (state.projects || []).filter((p) => p.id !== id)
      return withUpdatedMeta({ ...state, projects: next })
    }

    case 'CERTIFICATES_SET':
      return withUpdatedMeta({
        ...state,
        certificates: Array.isArray(action.payload)
          ? action.payload.map(normalizeCertificate)
          : action.payload,
      })

    case 'CERTIFICATE_ADD': {
      const next = [normalizeCertificate(action.payload), ...(state.certificates || [])]
      return withUpdatedMeta({ ...state, certificates: next })
    }

    case 'CERTIFICATE_UPDATE': {
      const updated = normalizeCertificate(action.payload)
      const next = (state.certificates || []).map((c) =>
        c.id === updated.id ? { ...c, ...updated } : c
      )
      return withUpdatedMeta({ ...state, certificates: next })
    }

    case 'CERTIFICATE_DELETE': {
      const id = String(action.payload || '')
      const next = (state.certificates || []).filter((c) => c.id !== id)
      return withUpdatedMeta({ ...state, certificates: next })
    }

    case 'SKILLS_SET':
      return withUpdatedMeta({ ...state, skills: normalizeSkills(action.payload) })

    case 'SKILL_GROUP_ADD': {
      const next = {
        groups: [normalizeSkillGroup(action.payload), ...(state.skills?.groups || [])],
      }
      return withUpdatedMeta({ ...state, skills: next })
    }

    case 'SKILL_GROUP_UPDATE': {
      const updated = normalizeSkillGroup(action.payload)
      const next = {
        groups: (state.skills?.groups || []).map((g) =>
          g.id === updated.id ? { ...g, ...updated } : g
        ),
      }
      return withUpdatedMeta({ ...state, skills: next })
    }

    case 'SKILL_GROUP_DELETE': {
      const groupId = String(action.payload || '')
      const next = {
        groups: (state.skills?.groups || []).filter((g) => g.id !== groupId),
      }
      return withUpdatedMeta({ ...state, skills: next })
    }

    case 'SKILL_ADD': {
      const { groupId, skill } = action.payload || {}
      const id = String(groupId || '')
      const next = {
        groups: (state.skills?.groups || []).map((g) => {
          if (g.id !== id) return g
          return { ...g, items: [normalizeSkillItem(skill), ...(g.items || [])] }
        }),
      }
      return withUpdatedMeta({ ...state, skills: next })
    }

    case 'SKILL_UPDATE': {
      const { groupId, skill } = action.payload || {}
      const id = String(groupId || '')
      const updated = normalizeSkillItem(skill)
      const next = {
        groups: (state.skills?.groups || []).map((g) => {
          if (g.id !== id) return g
          return {
            ...g,
            items: (g.items || []).map((s) => (s.id === updated.id ? { ...s, ...updated } : s)),
          }
        }),
      }
      return withUpdatedMeta({ ...state, skills: next })
    }

    case 'SKILL_DELETE': {
      const { groupId, skillId } = action.payload || {}
      const id = String(groupId || '')
      const sid = String(skillId || '')
      const next = {
        groups: (state.skills?.groups || []).map((g) => {
          if (g.id !== id) return g
          return { ...g, items: (g.items || []).filter((s) => s.id !== sid) }
        }),
      }
      return withUpdatedMeta({ ...state, skills: next })
    }

    case 'ABOUT_SET':
      return withUpdatedMeta({ ...state, about: normalizeAbout(action.payload) })

    case 'RESUME_SET':
      return withUpdatedMeta({ ...state, resume: normalizeResume(action.payload) })

    case 'CONTACT_SET':
      return withUpdatedMeta({ ...state, contact: normalizeContact(action.payload) })

    case 'SERVICES_SET':
      return withUpdatedMeta({
        ...state,
        services: Array.isArray(action.payload) ? action.payload.map(normalizeService) : action.payload,
      })

    case 'SERVICE_ADD': {
      const next = [normalizeService(action.payload), ...(state.services || [])]
      return withUpdatedMeta({ ...state, services: next })
    }

    case 'SERVICE_UPDATE': {
      const updated = normalizeService(action.payload)
      const next = (state.services || []).map((s) => (s.id === updated.id ? { ...s, ...updated } : s))
      return withUpdatedMeta({ ...state, services: next })
    }

    case 'SERVICE_DELETE': {
      const id = String(action.payload || '')
      const next = (state.services || []).filter((s) => s.id !== id)
      return withUpdatedMeta({ ...state, services: next })
    }

    case 'ACHIEVEMENTS_SET':
      return withUpdatedMeta({
        ...state,
        achievements: Array.isArray(action.payload)
          ? action.payload.map(normalizeAchievement)
          : action.payload,
      })

    case 'ACHIEVEMENT_ADD': {
      const next = [normalizeAchievement(action.payload), ...(state.achievements || [])]
      return withUpdatedMeta({ ...state, achievements: next })
    }

    case 'ACHIEVEMENT_UPDATE': {
      const updated = normalizeAchievement(action.payload)
      const next = (state.achievements || []).map((a) =>
        a.id === updated.id ? { ...a, ...updated } : a
      )
      return withUpdatedMeta({ ...state, achievements: next })
    }

    case 'ACHIEVEMENT_DELETE': {
      const id = String(action.payload || '')
      const next = (state.achievements || []).filter((a) => a.id !== id)
      return withUpdatedMeta({ ...state, achievements: next })
    }

    case 'TIMELINE_SET':
      return withUpdatedMeta({
        ...state,
        timeline: Array.isArray(action.payload)
          ? action.payload.map(normalizeTimelineItem)
          : action.payload,
      })

    case 'TIMELINE_ADD': {
      const next = [normalizeTimelineItem(action.payload), ...(state.timeline || [])]
      return withUpdatedMeta({ ...state, timeline: next })
    }

    case 'TIMELINE_UPDATE': {
      const updated = normalizeTimelineItem(action.payload)
      const next = (state.timeline || []).map((t) => (t.id === updated.id ? { ...t, ...updated } : t))
      return withUpdatedMeta({ ...state, timeline: next })
    }

    case 'TIMELINE_DELETE': {
      const id = String(action.payload || '')
      const next = (state.timeline || []).filter((t) => t.id !== id)
      return withUpdatedMeta({ ...state, timeline: next })
    }

    default:
      return state
  }
}

function createInitialState() {
  const fallback = getDefaultPortfolioState()
  const next = fallback
  return {
    ...next,
    projects: Array.isArray(next.projects) ? next.projects.map(normalizeProject) : next.projects,
    certificates: Array.isArray(next.certificates)
      ? next.certificates.map(normalizeCertificate)
      : next.certificates,
    skills: normalizeSkills(next.skills),
    about: normalizeAbout(next.about),
    resume: normalizeResume(next.resume),
    contact: normalizeContact(next.contact),
    services: Array.isArray(next.services) ? next.services.map(normalizeService) : next.services,
    achievements: Array.isArray(next.achievements)
      ? next.achievements.map(normalizeAchievement)
      : next.achievements,
    timeline: Array.isArray(next.timeline) ? next.timeline.map(normalizeTimelineItem) : next.timeline,
  }
}

export function PortfolioProvider({ children }) {
  const [state, dispatch] = useReducer(portfolioReducer, undefined, createInitialState)

  const [status, setStatus] = useState({
    bootstrapping: true,
    error: '',
    lastAction: '',
    busy: false,
  })

  async function refreshAll() {
    setStatus((s) => ({ ...s, bootstrapping: true, error: '' }))
    try {
      const settled = await Promise.allSettled([
        fetchProjects(),
        fetchServices(),
        fetchAchievements(),
        fetchCertificates(),
        fetchTimeline(),
        fetchSkillGroups(),
        fetchAbout(),
        fetchContact(),
        fetchResume(),
        fetchMeta(),
      ])

      const getValue = (index, fallback) =>
        settled[index]?.status === 'fulfilled' ? settled[index].value : fallback

      const errors = settled
        .filter((r) => r.status === 'rejected')
        .map((r) => r.reason?.message || String(r.reason))
        .filter(Boolean)

      const projects = getValue(0, state.projects || [])
      const services = getValue(1, state.services || [])
      const achievements = getValue(2, state.achievements || [])
      const certificates = getValue(3, state.certificates || [])
      const timeline = getValue(4, state.timeline || [])
      const skillsGroups = getValue(5, state.skills?.groups || [])
      const about = getValue(6, state.about || {})
      const contact = getValue(7, state.contact || {})
      const resume = getValue(8, state.resume || {})
      const meta = getValue(9, state.meta || {})

      dispatch({
        type: 'PORTFOLIO_REPLACE',
        payload: {
          meta,
          projects,
          services,
          achievements,
          certificates,
          timeline,
          skills: { groups: skillsGroups },
          about,
          contact,
          resume,
        },
      })

      if (errors.length) {
        setStatus((s) => ({
          ...s,
          error: `Some data failed to load: ${errors[0]}`,
        }))
      }
    } catch (e) {
      setStatus((s) => ({ ...s, error: e?.message || 'Failed to load Firestore data' }))
    } finally {
      setStatus((s) => ({ ...s, bootstrapping: false }))
    }
  }

  useEffect(() => {
    void refreshAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const actions = useMemo(() => {
    return {
      async reloadFromFirestore() {
        await refreshAll()
        return { ok: true }
      },

      async resetToDefaults() {
        setStatus((s) => ({ ...s, busy: true, lastAction: 'reset', error: '' }))
        try {
          const defaults = getDefaultPortfolioState()
          await replacePortfolioInFirestore(defaults)
          await refreshAll()
          return { ok: true }
        } catch (e) {
          setStatus((s) => ({ ...s, error: e?.message || 'Failed to reset portfolio' }))
          return { ok: false, message: e?.message || 'Failed to reset portfolio' }
        } finally {
          setStatus((s) => ({ ...s, busy: false }))
        }
      },

      async importPortfolio(payload) {
        setStatus((s) => ({ ...s, busy: true, lastAction: 'import', error: '' }))
        try {
          await replacePortfolioInFirestore(payload)
          await refreshAll()
          return { ok: true }
        } catch (e) {
          setStatus((s) => ({ ...s, error: e?.message || 'Failed to import portfolio' }))
          return { ok: false, message: e?.message || 'Failed to import portfolio' }
        } finally {
          setStatus((s) => ({ ...s, busy: false }))
        }
      },

      async refreshProjects() {
        try {
          const projects = await fetchProjects()
          dispatch({ type: 'PROJECTS_SET', payload: projects })
          return { ok: true }
        } catch (e) {
          setStatus((s) => ({ ...s, error: e?.message || 'Failed to refresh projects' }))
          return { ok: false, message: e?.message || 'Failed to refresh projects' }
        }
      },

      async addProject(payload) {
        setStatus((s) => ({ ...s, lastAction: 'project:add', error: '' }))
        try {
          const created = await createProject(payload)
          dispatch({ type: 'PROJECT_ADD', payload: created })
          await updateMeta({ lastUpdated: new Date().toISOString() })
          return { ok: true, data: created }
        } catch (e) {
          setStatus((s) => ({ ...s, error: e?.message || 'Failed to add project' }))
          return { ok: false, message: e?.message || 'Failed to add project' }
        }
      },

      async updateProject(payload) {
        const projectId = payload?.id
        if (!projectId) return { ok: false, message: 'Missing project id' }
        setStatus((s) => ({ ...s, lastAction: 'project:update', error: '' }))
        try {
          const updated = await editProject(projectId, payload)
          dispatch({ type: 'PROJECT_UPDATE', payload: updated })
          await updateMeta({ lastUpdated: new Date().toISOString() })
          return { ok: true, data: updated }
        } catch (e) {
          setStatus((s) => ({ ...s, error: e?.message || 'Failed to update project' }))
          return { ok: false, message: e?.message || 'Failed to update project' }
        }
      },

      async deleteProject(projectId) {
        if (!projectId) return { ok: false, message: 'Missing project id' }
        setStatus((s) => ({ ...s, lastAction: 'project:delete', error: '' }))
        try {
          await removeProject(projectId)
          dispatch({ type: 'PROJECT_DELETE', payload: projectId })
          await updateMeta({ lastUpdated: new Date().toISOString() })
          return { ok: true }
        } catch (e) {
          setStatus((s) => ({ ...s, error: e?.message || 'Failed to delete project' }))
          return { ok: false, message: e?.message || 'Failed to delete project' }
        }
      },

      async refreshCertificates() {
        try {
          const certs = await fetchCertificates()
          dispatch({ type: 'CERTIFICATES_SET', payload: certs })
          return { ok: true }
        } catch (e) {
          setStatus((s) => ({ ...s, error: e?.message || 'Failed to refresh certificates' }))
          return { ok: false, message: e?.message || 'Failed to refresh certificates' }
        }
      },

      async addCertificate(payload) {
        setStatus((s) => ({ ...s, lastAction: 'certificate:add', error: '' }))
        try {
          const created = await createCertificate(payload)
          dispatch({ type: 'CERTIFICATE_ADD', payload: created })
          await updateMeta({ lastUpdated: new Date().toISOString() })
          return { ok: true, data: created }
        } catch (e) {
          setStatus((s) => ({ ...s, error: e?.message || 'Failed to add certificate' }))
          return { ok: false, message: e?.message || 'Failed to add certificate' }
        }
      },

      async updateCertificate(payload) {
        const certificateId = payload?.id
        if (!certificateId) return { ok: false, message: 'Missing certificate id' }
        setStatus((s) => ({ ...s, lastAction: 'certificate:update', error: '' }))
        try {
          const updated = await editCertificate(certificateId, payload)
          dispatch({ type: 'CERTIFICATE_UPDATE', payload: updated })
          await updateMeta({ lastUpdated: new Date().toISOString() })
          return { ok: true, data: updated }
        } catch (e) {
          setStatus((s) => ({ ...s, error: e?.message || 'Failed to update certificate' }))
          return { ok: false, message: e?.message || 'Failed to update certificate' }
        }
      },

      async deleteCertificate(certificateId) {
        if (!certificateId) return { ok: false, message: 'Missing certificate id' }
        setStatus((s) => ({ ...s, lastAction: 'certificate:delete', error: '' }))
        try {
          await removeCertificate(certificateId)
          dispatch({ type: 'CERTIFICATE_DELETE', payload: certificateId })
          await updateMeta({ lastUpdated: new Date().toISOString() })
          return { ok: true }
        } catch (e) {
          setStatus((s) => ({ ...s, error: e?.message || 'Failed to delete certificate' }))
          return { ok: false, message: e?.message || 'Failed to delete certificate' }
        }
      },

      async refreshServices() {
        try {
          const items = await fetchServices()
          dispatch({ type: 'SERVICES_SET', payload: items })
          return { ok: true }
        } catch (e) {
          setStatus((s) => ({ ...s, error: e?.message || 'Failed to refresh services' }))
          return { ok: false, message: e?.message || 'Failed to refresh services' }
        }
      },

      async addService(payload) {
        setStatus((s) => ({ ...s, lastAction: 'service:add', error: '' }))
        try {
          const created = await createService(payload)
          dispatch({ type: 'SERVICE_ADD', payload: created })
          await updateMeta({ lastUpdated: new Date().toISOString() })
          return { ok: true, data: created }
        } catch (e) {
          setStatus((s) => ({ ...s, error: e?.message || 'Failed to add service' }))
          return { ok: false, message: e?.message || 'Failed to add service' }
        }
      },

      async updateService(payload) {
        const serviceId = payload?.id
        if (!serviceId) return { ok: false, message: 'Missing service id' }
        setStatus((s) => ({ ...s, lastAction: 'service:update', error: '' }))
        try {
          const updated = await editService(serviceId, payload)
          dispatch({ type: 'SERVICE_UPDATE', payload: updated })
          await updateMeta({ lastUpdated: new Date().toISOString() })
          return { ok: true, data: updated }
        } catch (e) {
          setStatus((s) => ({ ...s, error: e?.message || 'Failed to update service' }))
          return { ok: false, message: e?.message || 'Failed to update service' }
        }
      },

      async deleteService(serviceId) {
        if (!serviceId) return { ok: false, message: 'Missing service id' }
        setStatus((s) => ({ ...s, lastAction: 'service:delete', error: '' }))
        try {
          await removeService(serviceId)
          dispatch({ type: 'SERVICE_DELETE', payload: serviceId })
          await updateMeta({ lastUpdated: new Date().toISOString() })
          return { ok: true }
        } catch (e) {
          setStatus((s) => ({ ...s, error: e?.message || 'Failed to delete service' }))
          return { ok: false, message: e?.message || 'Failed to delete service' }
        }
      },

      async refreshAchievements() {
        try {
          const items = await fetchAchievements()
          dispatch({ type: 'ACHIEVEMENTS_SET', payload: items })
          return { ok: true }
        } catch (e) {
          setStatus((s) => ({ ...s, error: e?.message || 'Failed to refresh achievements' }))
          return { ok: false, message: e?.message || 'Failed to refresh achievements' }
        }
      },

      async addAchievement(payload) {
        setStatus((s) => ({ ...s, lastAction: 'achievement:add', error: '' }))
        try {
          const created = await createAchievement(payload)
          dispatch({ type: 'ACHIEVEMENT_ADD', payload: created })
          await updateMeta({ lastUpdated: new Date().toISOString() })
          return { ok: true, data: created }
        } catch (e) {
          setStatus((s) => ({ ...s, error: e?.message || 'Failed to add achievement' }))
          return { ok: false, message: e?.message || 'Failed to add achievement' }
        }
      },

      async updateAchievement(payload) {
        const achievementId = payload?.id
        if (!achievementId) return { ok: false, message: 'Missing achievement id' }
        setStatus((s) => ({ ...s, lastAction: 'achievement:update', error: '' }))
        try {
          const updated = await editAchievement(achievementId, payload)
          dispatch({ type: 'ACHIEVEMENT_UPDATE', payload: updated })
          await updateMeta({ lastUpdated: new Date().toISOString() })
          return { ok: true, data: updated }
        } catch (e) {
          setStatus((s) => ({ ...s, error: e?.message || 'Failed to update achievement' }))
          return { ok: false, message: e?.message || 'Failed to update achievement' }
        }
      },

      async deleteAchievement(achievementId) {
        if (!achievementId) return { ok: false, message: 'Missing achievement id' }
        setStatus((s) => ({ ...s, lastAction: 'achievement:delete', error: '' }))
        try {
          await removeAchievement(achievementId)
          dispatch({ type: 'ACHIEVEMENT_DELETE', payload: achievementId })
          await updateMeta({ lastUpdated: new Date().toISOString() })
          return { ok: true }
        } catch (e) {
          setStatus((s) => ({ ...s, error: e?.message || 'Failed to delete achievement' }))
          return { ok: false, message: e?.message || 'Failed to delete achievement' }
        }
      },

      async refreshTimeline() {
        try {
          const items = await fetchTimeline()
          dispatch({ type: 'TIMELINE_SET', payload: items })
          return { ok: true }
        } catch (e) {
          setStatus((s) => ({ ...s, error: e?.message || 'Failed to refresh timeline' }))
          return { ok: false, message: e?.message || 'Failed to refresh timeline' }
        }
      },

      async addTimelineItem(payload) {
        setStatus((s) => ({ ...s, lastAction: 'timeline:add', error: '' }))
        try {
          const created = await createTimelineItem(payload)
          dispatch({ type: 'TIMELINE_ADD', payload: created })
          await updateMeta({ lastUpdated: new Date().toISOString() })
          return { ok: true, data: created }
        } catch (e) {
          setStatus((s) => ({ ...s, error: e?.message || 'Failed to add timeline item' }))
          return { ok: false, message: e?.message || 'Failed to add timeline item' }
        }
      },

      async updateTimelineItem(payload) {
        const timelineId = payload?.id
        if (!timelineId) return { ok: false, message: 'Missing timeline id' }
        setStatus((s) => ({ ...s, lastAction: 'timeline:update', error: '' }))
        try {
          const updated = await editTimelineItem(timelineId, payload)
          dispatch({ type: 'TIMELINE_UPDATE', payload: updated })
          await updateMeta({ lastUpdated: new Date().toISOString() })
          return { ok: true, data: updated }
        } catch (e) {
          setStatus((s) => ({ ...s, error: e?.message || 'Failed to update timeline item' }))
          return { ok: false, message: e?.message || 'Failed to update timeline item' }
        }
      },

      async deleteTimelineItem(timelineId) {
        if (!timelineId) return { ok: false, message: 'Missing timeline id' }
        setStatus((s) => ({ ...s, lastAction: 'timeline:delete', error: '' }))
        try {
          await removeTimelineItem(timelineId)
          dispatch({ type: 'TIMELINE_DELETE', payload: timelineId })
          await updateMeta({ lastUpdated: new Date().toISOString() })
          return { ok: true }
        } catch (e) {
          setStatus((s) => ({ ...s, error: e?.message || 'Failed to delete timeline item' }))
          return { ok: false, message: e?.message || 'Failed to delete timeline item' }
        }
      },

      async refreshSkills() {
        try {
          const groups = await fetchSkillGroups()
          dispatch({ type: 'SKILLS_SET', payload: { groups } })
          return { ok: true }
        } catch (e) {
          setStatus((s) => ({ ...s, error: e?.message || 'Failed to refresh skills' }))
          return { ok: false, message: e?.message || 'Failed to refresh skills' }
        }
      },

      async addSkillGroup(payload) {
        setStatus((s) => ({ ...s, lastAction: 'skillGroup:add', error: '' }))
        try {
          const created = await createSkillGroup(payload)
          dispatch({ type: 'SKILL_GROUP_ADD', payload: created })
          await updateMeta({ lastUpdated: new Date().toISOString() })
          return { ok: true, data: created }
        } catch (e) {
          setStatus((s) => ({ ...s, error: e?.message || 'Failed to add skill group' }))
          return { ok: false, message: e?.message || 'Failed to add skill group' }
        }
      },

      async updateSkillGroup(payload) {
        const groupId = payload?.id
        if (!groupId) return { ok: false, message: 'Missing group id' }
        setStatus((s) => ({ ...s, lastAction: 'skillGroup:update', error: '' }))
        try {
          const updated = await editSkillGroup(groupId, payload)
          dispatch({ type: 'SKILL_GROUP_UPDATE', payload: updated })
          await updateMeta({ lastUpdated: new Date().toISOString() })
          return { ok: true, data: updated }
        } catch (e) {
          setStatus((s) => ({ ...s, error: e?.message || 'Failed to update skill group' }))
          return { ok: false, message: e?.message || 'Failed to update skill group' }
        }
      },

      async deleteSkillGroup(groupId) {
        if (!groupId) return { ok: false, message: 'Missing group id' }
        setStatus((s) => ({ ...s, lastAction: 'skillGroup:delete', error: '' }))
        try {
          await removeSkillGroup(groupId)
          dispatch({ type: 'SKILL_GROUP_DELETE', payload: groupId })
          await updateMeta({ lastUpdated: new Date().toISOString() })
          return { ok: true }
        } catch (e) {
          setStatus((s) => ({ ...s, error: e?.message || 'Failed to delete skill group' }))
          return { ok: false, message: e?.message || 'Failed to delete skill group' }
        }
      },

      async addSkill(groupId, skill) {
        if (!groupId) return { ok: false, message: 'Missing group id' }
        setStatus((s) => ({ ...s, lastAction: 'skill:add', error: '' }))
        try {
          const res = await createSkill(groupId, skill)
          dispatch({ type: 'SKILL_ADD', payload: res })
          await updateMeta({ lastUpdated: new Date().toISOString() })
          return { ok: true, data: res }
        } catch (e) {
          setStatus((s) => ({ ...s, error: e?.message || 'Failed to add skill' }))
          return { ok: false, message: e?.message || 'Failed to add skill' }
        }
      },

      async updateSkill(groupId, skill) {
        if (!groupId || !skill?.id) return { ok: false, message: 'Missing skill id' }
        setStatus((s) => ({ ...s, lastAction: 'skill:update', error: '' }))
        try {
          const res = await editSkill(groupId, skill.id, skill)
          dispatch({ type: 'SKILL_UPDATE', payload: res })
          await updateMeta({ lastUpdated: new Date().toISOString() })
          return { ok: true, data: res }
        } catch (e) {
          setStatus((s) => ({ ...s, error: e?.message || 'Failed to update skill' }))
          return { ok: false, message: e?.message || 'Failed to update skill' }
        }
      },

      async deleteSkill(groupId, skillId) {
        if (!groupId || !skillId) return { ok: false, message: 'Missing skill id' }
        setStatus((s) => ({ ...s, lastAction: 'skill:delete', error: '' }))
        try {
          const res = await removeSkill(groupId, skillId)
          dispatch({ type: 'SKILL_DELETE', payload: res })
          await updateMeta({ lastUpdated: new Date().toISOString() })
          return { ok: true, data: res }
        } catch (e) {
          setStatus((s) => ({ ...s, error: e?.message || 'Failed to delete skill' }))
          return { ok: false, message: e?.message || 'Failed to delete skill' }
        }
      },

      async setAbout(payload) {
        setStatus((s) => ({ ...s, lastAction: 'about:update', error: '' }))
        try {
          const updated = await updateAbout(payload)
          dispatch({ type: 'ABOUT_SET', payload: updated })
          await updateMeta({ lastUpdated: new Date().toISOString() })
          return { ok: true, data: updated }
        } catch (e) {
          setStatus((s) => ({ ...s, error: e?.message || 'Failed to update about' }))
          return { ok: false, message: e?.message || 'Failed to update about' }
        }
      },

      async setContact(payload) {
        setStatus((s) => ({ ...s, lastAction: 'contact:update', error: '' }))
        try {
          const updated = await updateContact(payload)
          dispatch({ type: 'CONTACT_SET', payload: updated })
          await updateMeta({ lastUpdated: new Date().toISOString() })
          return { ok: true, data: updated }
        } catch (e) {
          setStatus((s) => ({ ...s, error: e?.message || 'Failed to update contact' }))
          return { ok: false, message: e?.message || 'Failed to update contact' }
        }
      },

      async setResume(payload) {
        setStatus((s) => ({ ...s, lastAction: 'resume:update', error: '' }))
        try {
          const updated = await updateResume(payload)
          dispatch({ type: 'RESUME_SET', payload: updated })
          await updateMeta({ lastUpdated: new Date().toISOString() })
          return { ok: true, data: updated }
        } catch (e) {
          setStatus((s) => ({ ...s, error: e?.message || 'Failed to update resume' }))
          return { ok: false, message: e?.message || 'Failed to update resume' }
        }
      },
    }
  }, [])

  const value = useMemo(() => ({ state, actions, status }), [state, actions, status])

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext)
  if (!ctx) throw new Error('usePortfolio must be used within PortfolioProvider')
  return ctx
}
