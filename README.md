# Mounraj.dev — Premium Portfolio

A modern premium developer portfolio built with **React + Vite**, **Tailwind CSS**, and **Framer Motion**.

## Tech
- React + Vite
- Tailwind CSS
- Framer Motion
- react-icons + lucide-react
# EmailJS configuration (client-side)
# Create an EmailJS account: https://www.emailjs.com/
# Then create a service + email template, and paste the IDs here.

VITE_EMAILJS_SERVICE_ID=service_4qkc3wk
VITE_EMAILJS_TEMPLATE_ID=template_geh2nng
VITE_EMAILJS_PUBLIC_KEY=aTE5GnIS38OiBsnBA

# Optional: set this if your EmailJS template uses `to_email`
VITE_CONTACT_TO_EMAIL=mounraj9025@gmail.com

## Getting Started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Customize
- Update project/skills data in `src/data/`
- Replace placeholder images in `src/assets/images/`
- Replace `public/resume.pdf` with your real resume

## Contact Form (EmailJS)
This project is wired to send mail using **EmailJS** from the client.

1) Copy env file:
```bash
cp .env.example .env
```

2) In EmailJS, ensure your template variables match what the app sends:
- `from_name`
- `reply_to`
- `message`
- `to_email` (optional)

3) Restart the dev server after updating `.env`.
