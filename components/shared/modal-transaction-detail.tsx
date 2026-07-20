import { useUiStore } from "@/store/ui-store";
import { Button } from "@/components/ui/button"; // Pastikan path ini sesuai
import { Badge } from "@/components/ui/badge"; // Pastikan path ini sesuai
import { X } from "lucide-react";

const ModalTransactionDetail = () => {
  const selectedTransaction = useUiStore((state) => state.selectedTransaction);
  const closeAllModals = useUiStore((state) => state.closeAllModals);

  // Jika tidak ada data yang dipilih, jangan render apa-apa
  if (!selectedTransaction) return null;

  const isIncome = selectedTransaction.category?.type === "INCOME";

  return (
    // 1. OVERLAY BACKGROUND GELAP
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      {/* // 2. KOTAK MODAL UTAMA÷ */}
      <div id="modal-detail-transaction" className="w-full max-w-lg bg-card text-card-foreground rounded-xl shadow-xl flex flex-col animate-in fade-in-50 zoom-in-95 duration-200 overflow-hidden border">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-xl font-bold tracking-tight">Detail Transaksi</h2>
          <Button variant="ghost" size="icon" onClick={closeAllModals} className="h-8 w-8 rounded-full">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* BODY / CONTENT */}
        <div className="flex flex-col gap-6 p-6 overflow-y-auto max-h-[80vh]">
          {/* HIGHLIGHT NOMINAL */}
          <h2 className="text-sm text-center text-muted-foreground">Total Nominal</h2>
          <div className="flex flex-col items-center justify-center p-5 bg-muted/50 rounded-lg border border-border relative">
            <h3 className={`text-3xl font-bold ${isIncome ? "text-emerald-500" : "text-rose-500"}`}>Rp {selectedTransaction.amount.toLocaleString("id-ID")}</h3>
            <Badge variant={isIncome ? "default" : "destructive"} className="mt-2 text-primary bg-opacity-20 absolute top-1 right-1">
              {selectedTransaction.category?.type}
            </Badge>
          </div>

          {/* LIST RINCIAN DATA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground font-medium">Judul Transaksi</span>
              <span className="font-semibold text-base">{selectedTransaction.title}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground font-medium">Wallet</span>
              <span className="font-semibold text-base">{selectedTransaction.wallet?.name}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground font-medium">Kategori</span>
              <span className="font-semibold text-base">{selectedTransaction.category?.name}</span>
            </div>

            <div className="flex flex-col gap-1 sm:col-span-2">
              <span className="text-muted-foreground font-medium">Waktu Transaksi</span>
              <span className="font-semibold text-base">
                {new Date(selectedTransaction.date).toLocaleString("id-ID", {
                  dateStyle: "full",
                  timeStyle: "short",
                })}
              </span>
            </div>

            {/* DESKRIPSI (Hanya muncul jika diisi) */}
            {selectedTransaction.description && (
              <div className="flex flex-col gap-1 sm:col-span-2">
                <span className="text-muted-foreground font-medium">Deskripsi</span>
                <div className="bg-muted p-3 rounded-md text-sm border leading-relaxed whitespace-pre-wrap">{selectedTransaction.description}</div>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="border-t bg-muted/20 px-6 py-4 flex justify-end">
          <Button variant="outline" onClick={closeAllModals}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModalTransactionDetail;
