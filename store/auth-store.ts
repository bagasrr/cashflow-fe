import { IUser } from "@/types/user";
import { subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { create } from "zustand";

// 1. Tambahkan interface Wallet sesuai JSON Golang kamu

interface AuthState {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  selectedWalletId: string | "all"; // 3. State untuk nyimpen ID dompet yang dipilih
  dateRange: DateRange | undefined;
  setAuth: (user: IUser) => void;
  clearAuth: () => void;
  setIsLoading: (loading: boolean) => void;
  setSelectedWalletId: (id: string | "all") => void; // 4. Fungsi untuk ngubah dompet
  setDateRange: (range: DateRange | undefined) => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  selectedWalletId: "all", // Default-nya kita pantau "Semua Dompet"
  dateRange: {
    from: subDays(new Date(), 30),
    to: new Date(),
  },
  setAuth: (user) => set({ user, isAuthenticated: true, isLoading: false }),
  clearAuth: () => set({ user: null, isAuthenticated: false, isLoading: false, selectedWalletId: "all" }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setSelectedWalletId: (id) => set({ selectedWalletId: id }),
  setDateRange: (range) => set({ dateRange: range }),
}));
