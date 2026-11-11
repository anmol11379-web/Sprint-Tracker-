/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          bg: '#0A090F',
          surface: '#171717',
          elevated: '#262626',
          border: '#262626',
          orange: '#f97316',
          'orange-bright': '#ff7300',
          lime: '#f2ff00',
          green: '#3DDC84',
          'green-neon': '#36ea66',
        },
      },
      keyframes: {
        taskEnter: {
          '0%': { opacity: '0', transform: 'translateY(-8px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        taskExit: {
          '0%': { opacity: '1', transform: 'translateX(0) scale(1)' },
          '100%': { opacity: '0', transform: 'translateX(16px) scale(0.96)' },
        },
        toastIn: {
          '0%': { opacity: '0', transform: 'translateY(12px) scale(0.96)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        modalIn: {
          '0%': { opacity: '0', transform: 'scale(0.96) translateY(6px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
      },
      animation: {
        'task-enter': 'taskEnter 240ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'task-exit': 'taskExit 200ms ease-in forwards',
        'toast-in': 'toastIn 220ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'modal-in': 'modalIn 200ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
    },
  },
  plugins: [],
};

