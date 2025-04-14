/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'wp-blue': '#0073aa',
        'wp-light-blue': '#00a0d2',
        'wp-admin-bg': '#f1f1f1',
      },
    },
  },
  plugins: [],
  // Prefixo para evitar conflitos com outros estilos do WordPress
  prefix: 'ir-',
  // Configuração para garantir que o Tailwind CSS não entre em conflito com estilos do WordPress
  corePlugins: {
    preflight: false,
  },
}