import { FaReact, FaHtml5, FaCss3Alt, FaJs, FaGitAlt } from 'react-icons/fa'
import { SiTailwindcss, SiSpringboot, SiMysql, SiMongodb, SiPostman, SiPython } from 'react-icons/si'
import { Code2, Database, Wrench, Brain } from 'lucide-react'

export const skillGroups = [
  {
    title: 'Frontend',
    icon: FaReact,
    items: [
      { name: 'HTML', level: 90, Icon: FaHtml5 },
      { name: 'CSS', level: 85, Icon: FaCss3Alt },
      { name: 'JavaScript', level: 88, Icon: FaJs },
      { name: 'React', level: 86, Icon: FaReact },
      { name: 'Tailwind CSS', level: 84, Icon: SiTailwindcss },
    ],
  },
  {
    title: 'Backend',
    icon: Code2,
    items: [
      { name: 'Java', level: 78, Icon: Code2 },
      { name: 'Spring Boot', level: 72, Icon: SiSpringboot },
      { name: 'REST API', level: 82, Icon: Code2 },
    ],
  },
  {
    title: 'Database',
    icon: Database,
    items: [
      { name: 'MySQL', level: 76, Icon: SiMysql },
      { name: 'MongoDB', level: 74, Icon: SiMongodb },
    ],
  },
  {
    title: 'Tools',
    icon: Wrench,
    items: [
      { name: 'GitHub', level: 85, Icon: FaGitAlt },
      { name: 'VS Code', level: 92, Icon: Wrench },
      { name: 'Postman', level: 80, Icon: SiPostman },
    ],
  },
  {
    title: 'AI / ML',
    icon: Brain,
    items: [
      { name: 'Python', level: 80, Icon: SiPython },
      { name: 'Machine Learning', level: 70, Icon: Brain },
    ],
  },
]
