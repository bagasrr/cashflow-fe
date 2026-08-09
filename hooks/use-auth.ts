// src/hooks/useAuthUser.ts
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";

export function useAuthUser() {
  const router = useRouter();
  const { user, setAuth, clearAuth } = useAuthStore();

  // 🔥 Tambahkan state isLoading biar lu bisa nampilin efek loading di UI
  const [isUserLoading, setIsUserLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const response = await fetch("/api/users/me", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store", // Biar selalu dapet data terbaru, gak di-cache browser
        });

        const json = await response.json();

        if (!response.ok || !json.success) {
          throw new Error(json.error || "Gagal fetch data user");
        }

        setAuth(json.user);
      } catch (error) {
        console.error("Error getMe:", error);
        clearAuth();
        router.push("/login"); // Lempar ke halaman login kalau token mati/error
      } finally {
        setIsUserLoading(false);
      }
    };

    // Panggil fungsinya
    fetchMe();
  }, [setAuth, clearAuth, router]);

  // Kembalikan data user dan status loadingnya
  return { user, isUserLoading };
}
