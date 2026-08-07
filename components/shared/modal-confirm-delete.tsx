import React from "react";
import { Button } from "../ui/button";
import { useUiStore } from "@/store/ui-store";
import { toast } from "sonner";

interface ModalConfirmDeleteProps {
  param: string;
  onClose: () => void;
  onConfirm: () => void;
}

const ModalConfirmDelete = () => {
  const selectedTransaction = useUiStore((state) => state.selectedTransaction);
  const onClose = useUiStore((state) => state.closeAllModals);
  const isLoading = useUiStore((state) => state.isLoading);
  const setIsLoading = useUiStore((state) => state.setIsLoading);
  const triggerRefresh = useUiStore((state) => state.triggerRefresh);

  if (!selectedTransaction) {
    return null; // Jangan render apa pun jika tidak ada transaksi yang dipilih
  }

  const param = selectedTransaction.title; // Ambil judul transaksi sebagai parameter

  const handleDelete = () => {
    setIsLoading(true);
    // Panggil fungsi untuk menghapus transaksi di sini
    const req = async () => {
      try {
        const response = await fetch(`/api/transactions/${selectedTransaction.id}`, {
          method: "DELETE",
        });
        const data = await response.json();
        triggerRefresh();
        console.log(data);
        toast.success("Transaksi berhasil dihapus");
      } catch (error) {
        console.error("Error deleting transaction:", error);
        toast.error("Gagal menghapus transaksi");
      }
    };
    req();
    setIsLoading(false);
    onClose();
  };
  return (
    <div className="flex flex-col w-fit px-20 py-10 items-center p-6 bg-card rounded-lg shadow-md">
      <div className="flex flex-col items-center justify-center gap-2">
        <p>Apakah Anda yakin ingin menghapus transaksi</p>
        <div className="bg-muted/50 rounded-sm border border-border relative w-[80%] p-5 text-center">
          <p className="font-bold ">{param}</p>
        </div>
        <p className="text-sm text-muted-foreground">Tindakan ini tidak dapat dibatalkan.</p>
      </div>
      <div className="w-[80%] flex justify-center gap-4 items-center">
        <Button variant="outline" className="mt-4 cursor-pointer" onClick={handleDelete} disabled={isLoading}>
          Hapus
        </Button>
        <Button variant="destructive" className="mt-4 cursor-pointer" onClick={onClose} disabled={isLoading}>
          Tidak
        </Button>
      </div>
    </div>
  );
};

export default ModalConfirmDelete;
