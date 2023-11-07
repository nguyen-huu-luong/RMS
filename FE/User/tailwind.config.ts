import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      backgroundColor: {
        'primary': '#EA6A12',
        'primary-100': 'rgb(255, 247, 237)',
        'primary-400': 'rgb(251, 146, 60)',
        'primary-white': '#FFFFFF',
        'primary-': 'rgb(255, 247, 237)',
      },
      textColor: {
        'primary': '#EA6A12',
        'item-black': 'rgb(30, 41, 59)',
        'item-white': '#FFFFFF',
        'placeholder': '#DDD8D8',
        'menu': '#07143B',
        '':''
      }
    },
  },
  plugins: [],
}
export default config
