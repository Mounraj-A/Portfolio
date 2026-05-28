import smartInventory from '../assets/images/project-smart-inventory.svg'
import avSnacks from '../assets/images/project-av-snacks.svg'
import accounting from '../assets/images/project-accounting.svg'
import tractor from '../assets/images/project-tractor.svg'
import museum from '../assets/images/project-museum-chatbot.svg'
import pricePrediction from '../assets/images/project-price-prediction.svg'

export const projects = [
  {
    id: 'smart-inventory',
    title: 'Smart Inventory Management System',
    description:
      'AI-assisted inventory tracking with role-based access, dashboards, and low-stock intelligence.',
    longDescription:
      'A modern inventory platform designed for clarity and speed. Includes real-time stock views, alerts, analytics dashboards, and streamlined CRUD flows. Built with a clean architecture and production-ready UI patterns.',
    tech: ['React', 'Tailwind', 'Node', 'MongoDB'],
    githubUrl: 'https://github.com/Mounraj-A',
    liveUrl: 'https://github.com/Mounraj-A',
    image: smartInventory,
    highlights: [
      'Low-stock alerts and trend insights',
      'Responsive dashboard UI with glass cards',
      'Secure role-based access patterns',
    ],
  },
  {
    id: 'av-snacks',
    title: 'AV Snacks Website',
    description:
      'Premium snack brand landing + product experience with smooth sections, ordering CTA, and SEO-friendly layout.',
    longDescription:
      'A modern, conversion-focused website experience with a clean product showcase, fast load times, and elegant motion. Designed with mobile-first UX and reusable component patterns.',
    tech: ['React', 'Vite', 'Tailwind', 'Framer Motion'],
    githubUrl: 'https://github.com/Mounraj-A',
    liveUrl: 'https://github.com/Mounraj-A',
    image: avSnacks,
    highlights: [
      'SaaS-style premium landing patterns',
      'Fast, responsive and accessible layout',
      'Reusable sections and card components',
    ],
  },
  {
    id: 'accounting',
    title: 'Accounting System',
    description:
      'Accounting workflows with invoices, ledger views, and report generation in a clean, modern UI.',
    longDescription:
      'A structured accounting system focused on usability and correctness. Provides intuitive screens for transactions, summaries, and export-ready reporting.',
    tech: ['Java', 'REST API', 'MySQL', 'React'],
    githubUrl: 'https://github.com/Mounraj-A',
    liveUrl: 'https://github.com/Mounraj-A',
    image: accounting,
    highlights: ['Invoice and ledger modules', 'Report generation UX', 'Data validation flows'],
  },
  {
    id: 'tractor',
    title: 'Tractor Management App',
    description:
      'Management app for tracking tractor maintenance, schedules, and operational metrics.',
    longDescription:
      'A practical management application with clean CRUD workflows and responsive layouts. Built to be easily extensible with analytics and reminders.',
    tech: ['React', 'Tailwind', 'REST API'],
    githubUrl: 'https://github.com/Mounraj-A',
    liveUrl: 'https://github.com/Mounraj-A',
    image: tractor,
    highlights: ['Maintenance schedule flows', 'Responsive admin UI', 'Extensible architecture'],
  },
  {
    id: 'museum-chatbot',
    title: 'Museum Chatbot',
    description:
      'AI-powered chatbot that helps visitors explore exhibits, FAQs, and curated recommendations.',
    longDescription:
      'A chatbot experience designed for natural discovery. Includes guided prompts, contextual answers, and an interface that feels like a modern AI assistant.',
    tech: ['Python', 'NLP', 'Machine Learning'],
    githubUrl: 'https://github.com/Mounraj-A',
    liveUrl: 'https://github.com/Mounraj-A',
    image: museum,
    highlights: ['Context-aware assistance', 'Curated recommendations UX', 'Clean conversational UI'],
  },
  {
    id: 'price-prediction',
    title: 'Price Prediction Project',
    description:
      'ML model for predicting prices with feature engineering and evaluation dashboards.',
    longDescription:
      'A machine learning project focused on building a reliable baseline, improving accuracy with feature engineering, and showcasing results with readable visuals.',
    tech: ['Python', 'Machine Learning', 'Data Science'],
    githubUrl: 'https://github.com/Mounraj-A',
    liveUrl: 'https://github.com/Mounraj-A',
    image: pricePrediction,
    highlights: ['Feature engineering pipeline', 'Model evaluation and iteration', 'Result visualization patterns'],
  },
]
