/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
      "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3B82F6",      // 青（Figmaのメインカラー）
        textMain: "#1F2937",     // 濃いグレー
        textSub: "#6B7280",      // 薄いグレー
        borderBase: "#E5E7EB",   // 薄いグレー（枠線）
      },
    },
  },
  plugins: [],
}