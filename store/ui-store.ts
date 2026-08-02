import { ZTransaction } from "@/libs/validation";
import { create } from "zustand";

// Cukup pakai string union ini, gak perlu dibungkus object interface lagi
type ModalType = "add" | "edit" | "detail" | "delete" | "none";

interface UiState {
  isLoading: boolean;
  selectedTransaction: ZTransaction | null;
  refreshKey: number;
  isModalOpen: boolean;
  modalType: ModalType;

  // Jadikan parameter transaction opsional (bisa null) untuk kasus "add"
  openModal: (type: ModalType, transaction?: ZTransaction | null) => void;
  closeAllModals: () => void;
  triggerRefresh: () => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  selectedTransaction: null,
  isLoading: false,
  refreshKey: 0,
  isModalOpen: false,
  modalType: "none",

  // 1 Fungsi sakti untuk buka semua modal
  openModal: (type, transaction = null) => set({ isModalOpen: true, modalType: type, selectedTransaction: transaction }),

  // 1 Fungsi sakti untuk tutup semua modal
  closeAllModals: () => set({ isModalOpen: false, modalType: "none", selectedTransaction: null }),

  triggerRefresh: () => set((state) => ({ refreshKey: state.refreshKey + 1 })),
  setIsLoading: (isLoading) => set({ isLoading }),
}));
