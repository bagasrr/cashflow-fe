import axios from "axios";

// 1. BIKIN INSTANCE UTAMA
// Jangan pernah pakai axios bawaan murni. Pakai cetakan ini.
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api", // Baca dari .env
  timeout: 10000, // Putus koneksi kalau backend Golang lu nge-hang lebih dari 10 detik
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. REQUEST INTERCEPTOR (Satpam Pintu Keluar)
// Ini akan selalu tereksekusi OTOMATIS setiap kali lu nembak API apapun.
apiClient.interceptors.request.use(
  (config) => {
    // Tarik token dari tempat lu nyimpen (Contoh: localStorage atau Cookies)
    // Peringatan: Kalau lu pakai Server Components, cara ambil tokennya beda (pakai next/headers)
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`; // Otomatis suntik KTP
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 3. RESPONSE INTERCEPTOR (Satpam Pintu Masuk)
// Menangkap semua response dari Golang lu sebelum nyampe ke komponen React.
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Kalau backend Golang lu ngelempar 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      console.error("Token mati atau belum login. Tendang ke halaman login!");
      // Hapus token basi
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        window.location.href = "/login"; // Tendang paksa
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
