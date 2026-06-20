import {
  Code2,
  ShoppingCart,
  Brain,
  Database,
  Globe,
  Cpu,
  Bot,
  BarChart3,
  Server,
  BookOpen,
  GraduationCap,
  Briefcase,
  Rocket,
} from 'lucide-react'

/**
 * Maps an iconKey (stored in Firestore) → a lucide-react icon component.
 * Add new entries here whenever you need a new project icon.
 */
const PROJECT_ICON_REGISTRY = {
  code:           Code2,
  'shopping-cart': ShoppingCart,
  brain:          Brain,
  database:       Database,
  globe:          Globe,
  cpu:            Cpu,
  bot:            Bot,
  chart:          BarChart3,
  server:         Server,
  book:           BookOpen,
  graduationcap:  GraduationCap,
  briefcase:      Briefcase,
  rocket:         Rocket,
}

/**
 * Returns the icon component for the given key.
 * Falls back to Code2 so the UI never crashes on unknown/missing keys.
 *
 * @param {string|undefined} key
 * @returns {React.ComponentType}
 */
export function getProjectIcon(key) {
  if (!key) return Code2
  return PROJECT_ICON_REGISTRY[key] ?? Code2
}

/**
 * Ordered list of { value, label } pairs for the admin dropdown.
 */
export const PROJECT_ICON_OPTIONS = [
  { value: 'code',           label: 'Code' },
  { value: 'shopping-cart',  label: 'Shopping Cart' },
  { value: 'brain',          label: 'Brain' },
  { value: 'database',       label: 'Database' },
  { value: 'globe',          label: 'Globe' },
  { value: 'cpu',            label: 'CPU' },
  { value: 'bot',            label: 'Robot' },
  { value: 'chart',          label: 'Chart' },
  { value: 'server',         label: 'Server' },
  { value: 'book',           label: 'Book' },
  { value: 'graduationcap',  label: 'Graduation Cap' },
  { value: 'briefcase',      label: 'Briefcase' },
  { value: 'rocket',         label: 'Rocket' },
]
