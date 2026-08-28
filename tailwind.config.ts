import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        gov: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          500: '#102a43',
          600: '#0b69a3',
          700: '#035388',
          800: '#014361',
          900: '#002147',
        },
        praman: {
          blue: '#1e3a8a',
          teal: '#0d9488',
          emerald: '#059669',
          amber: '#d97706',
          indigo: '#4f46e5',
        }
      },
    },
  },
  plugins: [],
};
export default config;
