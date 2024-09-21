/** @type {import('tailwindcss').Config} */

import type { Config } from 'tailwindcss';
import { nextui } from '@nextui-org/react';
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
  plugins: [nextui()],
} satisfies Config;

export default config;
