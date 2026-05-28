import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { STORAGE_KEYS } from '../storage/keys.js'
import { loadJson, saveJson } from '../storage/storage.js'
import { getDefaultPortfolioState } from '../data/defaultPortfolio.js'
import { makeId } from '../utils/ids.js'

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
      return withUpdatedMeta({
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
      })

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
  const stored = loadJson(STORAGE_KEYS.portfolio, null)
  const next = stored && typeof stored === 'object' ? { ...fallback, ...stored } : fallback
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

  useEffect(() => {
    saveJson(STORAGE_KEYS.portfolio, state)
  }, [state])

  const actions = useMemo(() => {
    return {
      replacePortfolio(payload) {
        dispatch({ type: 'PORTFOLIO_REPLACE', payload })
      },
      setProjects(payload) {
        dispatch({ type: 'PROJECTS_SET', payload })
      },
      addProject(payload) {
        dispatch({ type: 'PROJECT_ADD', payload })
      },
      updateProject(payload) {
        dispatch({ type: 'PROJECT_UPDATE', payload })
      },
      deleteProject(projectId) {
        dispatch({ type: 'PROJECT_DELETE', payload: projectId })
      },
      setCertificates(payload) {
        dispatch({ type: 'CERTIFICATES_SET', payload })
      },
      addCertificate(payload) {
        dispatch({ type: 'CERTIFICATE_ADD', payload })
      },
      updateCertificate(payload) {
        dispatch({ type: 'CERTIFICATE_UPDATE', payload })
      },
      deleteCertificate(certificateId) {
        dispatch({ type: 'CERTIFICATE_DELETE', payload: certificateId })
      },
      setSkills(payload) {
        dispatch({ type: 'SKILLS_SET', payload })
      },
      addSkillGroup(payload) {
        dispatch({ type: 'SKILL_GROUP_ADD', payload })
      },
      updateSkillGroup(payload) {
        dispatch({ type: 'SKILL_GROUP_UPDATE', payload })
      },
      deleteSkillGroup(groupId) {
        dispatch({ type: 'SKILL_GROUP_DELETE', payload: groupId })
      },
      addSkill(groupId, skill) {
        dispatch({ type: 'SKILL_ADD', payload: { groupId, skill } })
      },
      updateSkill(groupId, skill) {
        dispatch({ type: 'SKILL_UPDATE', payload: { groupId, skill } })
      },
      deleteSkill(groupId, skillId) {
        dispatch({ type: 'SKILL_DELETE', payload: { groupId, skillId } })
      },
      setAbout(payload) {
        dispatch({ type: 'ABOUT_SET', payload })
      },
      setResume(payload) {
        dispatch({ type: 'RESUME_SET', payload })
      },
      setContact(payload) {
        dispatch({ type: 'CONTACT_SET', payload })
      },

      setServices(payload) {
        dispatch({ type: 'SERVICES_SET', payload })
      },
      addService(payload) {
        dispatch({ type: 'SERVICE_ADD', payload })
      },
      updateService(payload) {
        dispatch({ type: 'SERVICE_UPDATE', payload })
      },
      deleteService(serviceId) {
        dispatch({ type: 'SERVICE_DELETE', payload: serviceId })
      },

      setAchievements(payload) {
        dispatch({ type: 'ACHIEVEMENTS_SET', payload })
      },
      addAchievement(payload) {
        dispatch({ type: 'ACHIEVEMENT_ADD', payload })
      },
      updateAchievement(payload) {
        dispatch({ type: 'ACHIEVEMENT_UPDATE', payload })
      },
      deleteAchievement(achievementId) {
        dispatch({ type: 'ACHIEVEMENT_DELETE', payload: achievementId })
      },

      setTimeline(payload) {
        dispatch({ type: 'TIMELINE_SET', payload })
      },
      addTimelineItem(payload) {
        dispatch({ type: 'TIMELINE_ADD', payload })
      },
      updateTimelineItem(payload) {
        dispatch({ type: 'TIMELINE_UPDATE', payload })
      },
      deleteTimelineItem(timelineId) {
        dispatch({ type: 'TIMELINE_DELETE', payload: timelineId })
      },
    }
  }, [])

  const value = useMemo(() => ({ state, actions }), [state, actions])

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext)
  if (!ctx) throw new Error('usePortfolio must be used within PortfolioProvider')
  return ctx
}
