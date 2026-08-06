"use client";

import React, { useEffect, useState } from "react";
import { X, ChevronRight, Wallet as WalletIcon, ReceiptText, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUiStore } from "@/store/ui-store";
import { FormatIDR, GetDefaultDate } from "@/libs/utils";

// const MOCK_WALLETS = [
//   { id: "w1", name: "BCA Utama", balance: 15000000 },
//   { id: "w2", name: "Gopay", balance: 250000 },
//   { id: "w3", name: "Uang Tunai", balance: 500000 },
//   { id: "w4", name: "Mandiri Tabungan", balance: 8000000 },
//   { id: "w5", name: "OVO", balance: 120000 },
// ];

// const MOCK_TRANSACTIONS = [
//   { id: "t1", wallet_id: "w1", title: "Gaji Bulan Agustus", amount: 10000000, type: "INCOME" },
//   { id: "t2", wallet_id: "w1", title: "Bayar Listrik", amount: 500000, type: "EXPENSE" },
//   { id: "t3", wallet_id: "w1", title: "Gaji Bulan Agustus", amount: 10000000, type: "INCOME" },
//   { id: "t4", wallet_id: "w1", title: "Bayar Listrik", amount: 500000, type: "EXPENSE" },
//   { id: "t5", wallet_id: "w1", title: "Gaji Bulan Agustus", amount: 10000000, type: "INCOME" },
//   { id: "t6", wallet_id: "w1", title: "Bayar Listrik", amount: 500000, type: "EXPENSE" },
//   { id: "t7", wallet_id: "w1", title: "Gaji Bulan Agustus", amount: 10000000, type: "INCOME" },
//   { id: "t8", wallet_id: "w1", title: "Bayar Listrik", amount: 500000, type: "EXPENSE" },
//   { id: "t1", wallet_id: "w2", title: "GoFood Ayam Bakar", amount: 45000, type: "EXPENSE" },
//   { id: "t10", wallet_id: "w3", title: "Beli Bensin", amount: 20000, type: "EXPENSE" },
// ];

const ModalWallet = () => {
  // State untuk melacak wallet mana yang sedang diklik
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
  const [allWallets, setAllWallets] = useState<any[]>([]); // State untuk menyimpan semua wallet
  const onClose = useUiStore((state) => state.closeAllModals);
  console.log("All get wallet : ", allWallets);
  const page = 1;
  const limit = 10;

  useEffect(() => {
    const ApiGetWallets = async () => {
      try {
        const response = await fetch(`/api/wallets/me?page=${page}&limit=${limit}`, { method: "GET" });
        const resData = await response.json();

        // 🔥 1. UBAH BAGIAN INI (tarik dari resData.data)
        setAllWallets(resData.data || []);
      } catch (error) {
        console.error("Error fetching wallets:", error);
      }
    };
    ApiGetWallets();
  }, []);
  // Filter transaksi berdasarkan wallet yang dipilih
  const selectedWallet = allWallets.find((w) => w.id === selectedWalletId);
  const filteredTransactions = selectedWallet?.transactions || [];
  return (
    // OVERLAY
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      {/* KOTAK MODAL (Lebar maksimal 5xl biar lega buat 30/70 split) */}
      <div className="w-full max-w-5xl h-[80vh] bg-card text-card-foreground rounded-xl shadow-xl flex flex-col overflow-hidden border animate-in fade-in-50 zoom-in-95 duration-200">
        {/* HEADER MODAL UTAMA */}
        <div className="flex items-center justify-between border-b px-6 py-4 bg-muted/30">
          <h2 className="text-xl font-bold tracking-tight">Manajemen Dompet & Transaksi</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full hover:bg-destructive/20 hover:text-destructive">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* CONTAINER KONTEN (FLEX ROW) */}
        <div className="flex flex-1 overflow-hidden">
          {/* =========================================================
              BAGIAN KIRI: 30% (List Wallet)
          ========================================================= */}
          <div className="w-[30%] border-r bg-muted/10 flex flex-col h-full">
            <div className="p-4 border-b bg-muted/20 font-semibold text-sm text-muted-foreground uppercase tracking-wider flex justify-between items-center">
              <span>Daftar Dompet</span>
              <span>
                <Filter />
              </span>
            </div>
            {/* Area Scrollable Kiri */}
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
              {allWallets.map((wallet) => {
                const isSelected = selectedWalletId === wallet.id;

                return (
                  <div
                    key={wallet.id}
                    onClick={() => setSelectedWalletId(wallet.id)}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all border ${
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary shadow-md" // Highlight jika dipilih
                        : "bg-background hover:bg-muted border-border hover:border-primary/50" // Default state
                    }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <WalletIcon className={`h-5 w-5 shrink-0 ${isSelected ? "text-primary-foreground" : "text-muted-foreground"}`} />
                      <div className="flex flex-col truncate">
                        <span className="font-medium text-sm truncate">{wallet.name}</span>
                        <span className={`text-xs ${isSelected ? "text-primary-foreground/80" : "text-muted-foreground"}`}>Rp {wallet.balance.toLocaleString("id-ID")}</span>
                      </div>
                    </div>
                    {/* Panah Kanan */}
                    <ChevronRight className={`h-4 w-4 shrink-0 transition-transform ${isSelected ? "translate-x-1" : "opacity-50"}`} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* =========================================================
              BAGIAN KANAN: 70% (List Transaksi)
          ========================================================= */}
          <div className="w-[70%] bg-background flex flex-col h-full">
            {/* Header Kanan Dinamis */}
            <div className="p-4 border-b flex justify-between items-center bg-card">
              <span className="font-semibold">{selectedWallet ? `Transaksi: ${selectedWallet.name}` : "Detail Transaksi"}</span>
              {selectedWallet && (
                <span className="text-sm text-muted-foreground">
                  Saldo: <span className="text-primary text-md font-bold">{FormatIDR(selectedWallet.balance)}</span>
                </span>
              )}
            </div>

            {/* Area Scrollable Kanan */}
            <div className="flex-1 overflow-y-auto p-6">
              {!selectedWalletId ? (
                // EMPTY STATE: Belum ada wallet yang dipilih
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-3 opacity-60">
                  <WalletIcon className="h-16 w-16 mb-2" />
                  <p className="text-lg font-medium">Belum ada wallet yang dipilih</p>
                  <p className="text-sm">Silakan pilih dompet di sebelah kiri untuk melihat transaksi.</p>
                </div>
              ) : filteredTransactions.length === 0 ? (
                // EMPTY STATE: Wallet dipilih tapi gak ada transaksi
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-3 opacity-60">
                  <ReceiptText className="h-16 w-16 mb-2" />
                  <p className="text-lg font-medium">Tidak ada transaksi</p>
                  <p className="text-sm">Dompet ini belum memiliki riwayat transaksi.</p>
                </div>
              ) : (
                // LIST TRANSAKSI
                <div className="flex flex-col gap-3">
                  <p>Preview Transaksi</p>
                  {filteredTransactions.map((trx) => (
                    <div key={trx.id} className="flex items-center justify-between p-4 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex flex-col">
                        <span className="font-semibold text-base">{trx.title}</span>
                        <span className="text-xs text-muted-foreground">Transaction Date: {GetDefaultDate(trx.date)}</span>
                      </div>
                      <div className={`font-bold text-lg ${trx.category.type === "INCOME" ? "text-emerald-500" : trx.category.type === "INVESTMENT" ? "text-amber-500" : "text-rose-500"}`}>{FormatIDR(trx.amount)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalWallet;
