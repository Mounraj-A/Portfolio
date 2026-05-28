/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: '#0B1120',
        ink: '#0B1120',
        surface: '#111827',
        card: 'rgba(255,255,255,0.05)',
        text: '#F9FAFB',
        muted: '#9CA3AF',
        accentCyan: '#22D3EE',
        accentBlue: '#3B82F6',
        accentPurple: '#A855F7',
      },
      fontFamily: {
        inter: ['Inter', 'ui-sans-serif', 'system-ui'],
        poppins: ['Poppins', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        glowCyan: '0 0 35px rgba(34, 211, 238, 0.22)',
        glowBlue: '0 0 40px rgba(59, 130, 246, 0.22)',
        glowPurple: '0 0 45px rgba(168, 85, 247, 0.22)',
      },
      backgroundImage: {
        'hero-radial':
          'radial-gradient(800px circle at 10% 10%, rgba(34, 211, 238, 0.14), transparent 45%), radial-gradient(900px circle at 90% 0%, rgba(168, 85, 247, 0.14), transparent 45%), radial-gradient(900px circle at 50% 100%, rgba(59, 130, 246, 0.12), transparent 45%)',
        grid:
          'linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.65' },
          '50%': { opacity: '0.95' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 7s ease-in-out infinite',
        pulseGlow: 'pulseGlow 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
