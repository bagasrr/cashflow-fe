import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", "media"],
  //   content: ["./pages/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // Folder app di root
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // Folder components di root
    "./libs/**/*.{js,ts,jsx,tsx,mdx}", // Folder libs kamu
  ],
  theme: {
    extend: {
      // MASUKKAN KONFIGURASI KAMU DI SINI
      colors: {
        brand: {
          primary: "#0ea5e9", // Contoh warna biru utama Cashflow kamu
          secondary: "#64748b",
          success: "#22c55e",
          danger: "#ef4444",
        },
        money: {
          income: "#10b981", // Hijau untuk pemasukan
          expense: "#f43f5e", // Merah untuk pengeluaran
        },
      },
      // Kamu juga bisa nambahin custom font di sini
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
      },
    },
  },
  plugins: [],
};
export default config;
