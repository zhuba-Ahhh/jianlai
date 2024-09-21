/** @type {import('tailwindcss').Config} */

import type { Config } from 'tailwindcss';
const config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  darkMode: 'class',
  plugins: [require('daisyui')],
} satisfies Config;

export default config;
