import { projects as defaultProjects } from './projects.js'
import certNptel from '../assets/images/cert-nptel.svg'
import certCoursera from '../assets/images/cert-coursera.svg'
import certInfosysJava from '../assets/images/cert-infosys-java.svg'
import certAIWorkshop from '../assets/images/cert-ai-workshop.svg'
import certDataScience from '../assets/images/cert-data-science-internship.svg'
import resumePreview from '../assets/images/resume-preview.svg'

const defaultCertificates = [
  {
    id: 'cert-nptel',
    title: 'NPTEL',
    organization: 'NPTEL',
    description: 'Computer Science coursework and certifications',
    image: certNptel,
  },
  {
    id: 'cert-coursera',
    title: 'Coursera',
    organization: 'Coursera',
    description: 'Skill-focused specializations and projects',
    image: certCoursera,
  },
  {
    id: 'cert-infosys-java',
    title: 'Infosys Java',
    organization: 'Infosys',
    description: 'Java fundamentals and practical programming',
    image: certInfosysJava,
  },
  {
    id: 'cert-ai-workshop',
    title: 'AI Workshop',
    organization: 'Workshop',
    description: 'Hands-on sessions on AI concepts and tools',
    image: certAIWorkshop,
  },
  {
    id: 'cert-data-science-internship',
    title: 'Data Science Internship',
    organization: 'Internship',
    description: 'Applied data workflows and learning',
    image: certDataScience,
  },
]

const defaultSkills = {
  groups: [
    {
      id: 'skills-frontend',
      title: 'Frontend',
      groupIconKey: 'react',
      items: [
        { id: 'skill-html', name: 'HTML', level: 90, iconKey: 'html' },
        { id: 'skill-css', name: 'CSS', level: 85, iconKey: 'css' },
        { id: 'skill-js', name: 'JavaScript', level: 88, iconKey: 'javascript' },
        { id: 'skill-react', name: 'React', level: 86, iconKey: 'react' },
        { id: 'skill-tailwind', name: 'Tailwind CSS', level: 84, iconKey: 'tailwind' },
      ],
    },
    {
      id: 'skills-backend',
      title: 'Backend',
      groupIconKey: 'code2',
      items: [
        { id: 'skill-java', name: 'Java', level: 78, iconKey: 'code2' },
        { id: 'skill-spring', name: 'Spring Boot', level: 72, iconKey: 'springboot' },
        { id: 'skill-rest', name: 'REST API', level: 82, iconKey: 'code2' },
      ],
    },
    {
      id: 'skills-database',
      title: 'Database',
      groupIconKey: 'database',
      items: [
        { id: 'skill-mysql', name: 'MySQL', level: 76, iconKey: 'mysql' },
        { id: 'skill-mongo', name: 'MongoDB', level: 74, iconKey: 'mongodb' },
      ],
    },
    {
      id: 'skills-tools',
      title: 'Tools',
      groupIconKey: 'wrench',
      items: [
        { id: 'skill-github', name: 'GitHub', level: 85, iconKey: 'git' },
        { id: 'skill-vscode', name: 'VS Code', level: 92, iconKey: 'wrench' },
        { id: 'skill-postman', name: 'Postman', level: 80, iconKey: 'postman' },
      ],
    },
    {
      id: 'skills-aiml',
      title: 'AI / ML',
      groupIconKey: 'brain',
      items: [
        { id: 'skill-python', name: 'Python', level: 80, iconKey: 'python' },
        { id: 'skill-ml', name: 'Machine Learning', level: 70, iconKey: 'brain' },
      ],
    },
  ],
}

const defaultAbout = {
  sectionHeader: {
    eyebrow: 'About',
    title: 'Building products with clarity and craft',
    subtitle:
      'Computer Science Engineering student and full stack developer focused on clean UI, scalable systems, and AI-powered experiences.',
  },
  heroName: 'Mounraj',
  paragraph:
    'I’m a Computer Science Engineering student passionate about building modern web applications with clean UI, responsive design, and scalable backend systems. I enjoy working with React, Tailwind CSS, Java, and AI-based technologies to create fast and user-friendly digital experiences.',
  infoCards: {
    collegeLabel: 'College',
    collegeValue: 'CSE (Engineering)',
    careerGoalLabel: 'Career Goal',
    careerGoalValue: 'Full Stack + AI Engineer',
    interestsLabel: 'Interests',
    interestsValue: 'UI/UX, Systems, ML',
    mindsetLabel: 'Mindset',
    mindsetValue: 'Learn → Build → Ship',
  },
}

const defaultResume = {
  previewImage: resumePreview,
  pdfUrl: '/resume.pdf',
}

const defaultContact = {
  sectionHeader: {
    eyebrow: 'Contact',
    title: 'Let’s build something premium',
    subtitle: 'Send a message for collaborations, internships, or project discussions.',
  },
  direct: {
    email: 'mounraj9025@gmail.com',
    phone: '+91 90259 82858',
    location: 'India',
  },
  social: {
    github: 'https://github.com/Mounraj-A',
    linkedin: 'https://www.linkedin.com/in/mounraj-a-9a5258328/',
  },
  footerSocials: [
    { label: 'GitHub', href: 'https://github.com/Mounraj-A', iconKey: 'github' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/mounraj-a-9a5258328/', iconKey: 'linkedin' },
    { label: 'Email', href: 'mailto:mounraj9025@gmail.com', iconKey: 'mail' },
  ],
}

const defaultServices = [
  {
    id: 'service-frontend',
    title: 'Frontend Development',
    desc: 'Premium UI with React + Tailwind, glassmorphism, and smooth interactions.',
    iconKey: 'layout',
  },
  {
    id: 'service-backend',
    title: 'Backend APIs',
    desc: 'Clean REST APIs with structured layers, validation, and scalable patterns.',
    iconKey: 'server',
  },
  {
    id: 'service-fullstack',
    title: 'Full Stack Applications',
    desc: 'End-to-end apps with modern architecture, responsive UX, and data flows.',
    iconKey: 'layers3',
  },
  {
    id: 'service-responsive',
    title: 'Responsive Web Design',
    desc: 'Mobile-first layouts that feel consistent on every screen size.',
    iconKey: 'smartphone',
  },
  {
    id: 'service-ai',
    title: 'AI Integration',
    desc: 'AI-driven features like chatbots, recommendations, and automation.',
    iconKey: 'sparkles',
  },
]

const defaultAchievements = [
  {
    id: 'ach-hackathons',
    title: 'Hackathons',
    desc: 'Built fast prototypes under time constraints and learned to ship quickly.',
    iconKey: 'trophy',
  },
  {
    id: 'ach-workshops',
    title: 'Workshops',
    desc: 'Participated in AI and development workshops to sharpen fundamentals.',
    iconKey: 'users',
  },
  {
    id: 'ach-certifications',
    title: 'Certifications',
    desc: 'Completed structured courses to build strong, job-ready skills.',
    iconKey: 'graduationcap',
  },
  {
    id: 'ach-internships',
    title: 'Internships',
    desc: 'Explored real-world workflows in data science and applied learning.',
    iconKey: 'briefcase',
  },
]

const defaultTimeline = [
  {
    id: 'timeline-2024-react',
    year: '2024',
    title: 'Started React Development',
    desc: 'Focused on modern UI patterns, component architecture, and clean UX flows.',
  },
  {
    id: 'timeline-2024-accounting',
    year: '2024',
    title: 'Built Accounting System',
    desc: 'Worked on structured modules, validation, and usable screens for real workflows.',
  },
  {
    id: 'timeline-2025-ai',
    year: '2025',
    title: 'AI & ML Projects',
    desc: 'Explored machine learning, chatbot systems, and practical data-driven features.',
  },
  {
    id: 'timeline-2025-spring',
    year: '2025',
    title: 'Learning Spring Boot',
    desc: 'Building backend services, REST APIs, and scalable server-side patterns.',
  },
]

export function getDefaultPortfolioState() {
  const now = new Date().toISOString()
  return {
    meta: { lastUpdated: now },
    projects: defaultProjects,
    certificates: defaultCertificates,
    skills: defaultSkills,
    about: defaultAbout,
    resume: defaultResume,
    contact: defaultContact,
    services: defaultServices,
    achievements: defaultAchievements,
    timeline: defaultTimeline,
  }
}
