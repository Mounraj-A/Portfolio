import {
  FaReact,
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaGitAlt,
} from 'react-icons/fa'
import {
  SiTailwindcss,
  SiSpringboot,
  SiMysql,
  SiMongodb,
  SiPostman,
  SiPython,
} from 'react-icons/si'
import {
  Code2,
  Database,
  Wrench,
  Brain,
  LayoutDashboard,
  FolderKanban,
  Award,
  User,
  FileText,
  Mail,
  Github,
  Linkedin,
  Settings,
  Layout,
  Server,
  Layers3,
  Smartphone,
  Sparkles,
  Trophy,
  GraduationCap,
  Users,
  Briefcase,
  History,
} from 'lucide-react'

const registry = {
  // Skill icons
  react: FaReact,
  html: FaHtml5,
  css: FaCss3Alt,
  javascript: FaJs,
  git: FaGitAlt,
  tailwind: SiTailwindcss,
  springboot: SiSpringboot,
  mysql: SiMysql,
  mongodb: SiMongodb,
  postman: SiPostman,
  python: SiPython,
  code2: Code2,
  database: Database,
  wrench: Wrench,
  brain: Brain,

  // Admin sidebar icons
  dashboard: LayoutDashboard,
  projects: FolderKanban,
  certificates: Award,
  skills: Brain,
  about: User,
  resume: FileText,
  contact: Mail,
  settings: Settings,

  // Portfolio sections (Services / Achievements / Timeline)
  services: Layers3,
  achievements: Trophy,
  timeline: History,

  // Service icons
  layout: Layout,
  server: Server,
  layers3: Layers3,
  smartphone: Smartphone,
  sparkles: Sparkles,

  // Achievement icons
  trophy: Trophy,
  graduationcap: GraduationCap,
  users: Users,
  briefcase: Briefcase,

  // Footer/social
  github: Github,
  linkedin: Linkedin,
  mail: Mail,
}

export function getIconByKey(key, fallbackKey = 'code2') {
  return registry[key] || registry[fallbackKey] || Code2
}

export function listIconKeys() {
  return Object.keys(registry).sort()
}
