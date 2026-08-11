"use client";

import { useState } from "react";
import Papa from "papaparse";
import { Upload, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";
import { useUiStore } from "@/store/ui-store";

// Target kontrak DTO Golang
const TARGET_FIELDS = [
  { id: "title", label: "Judul Transaksi", required: true },
  { id: "amount", label: "Nominal (Amount)", required: true },
  { id: "date", label: "Tanggal (Date)", required: true },
  { id: "category_name", label: "Nama Kategori", required: true },
  { id: "category_type", label: "Tipe (Income/Expense/Investment)", required: false }, // Jika tidak ada, pakai fallback
];

export function ModalImportData() {
  const { user, selectedWalletId, setSelectedWalletId } = useAuthStore();
  const closeAllModals = useUiStore((state) => state.closeAllModals);

  // State 1: Data Mentah di RAM (Aturan 1)
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvRawData, setCsvRawData] = useState<any[]>([]);

  // State 2: UI Mapping & Fallback (Aturan 2 & 3)
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [fallbackType, setFallbackType] = useState<"INCOME" | "EXPENSE" | "INVESTMENT">("EXPENSE");

  // State 3: Validasi & Eksekusi (Aturan 4 & 5)
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // --- ATURAN 1: Intersep & Parsing di RAM ---
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true, // Otomatis hapus baris benar-benar kosong
      complete: (results) => {
        if (results.meta.fields) {
          setCsvHeaders(results.meta.fields);
          setCsvRawData(results.data);
          setErrors([]);
        } else {
          toast.error("Gagal membaca header CSV");
        }
      },
    });
  };

  // --- ATURAN 4 & 5: Validasi, Transformasi, Eksekusi ---
  const handleSubmit = async () => {
    setErrors([]); // Reset error lokal

    // Validasi Dasar: Dompet wajib dipilih (Aturan 2)
    if (!selectedWalletId || selectedWalletId === "all") {
      return setErrors(["Pilih dompet tujuan terlebih dahulu."]);
    }

    // Validasi Dasar: Cek field wajib map
    const missing = TARGET_FIELDS.filter((f) => f.required && !mapping[f.id]);
    if (missing.length > 0) {
      return setErrors([`Harap petakan kolom wajib: ${missing.map((m) => m.label).join(", ")}`]);
    }

    const localErrors: string[] = [];
    const cleanPayload = [];

    // --- ATURAN 3: Transformasi Kontrak Mutlak ---
    for (let i = 0; i < csvRawData.length; i++) {
      const row = csvRawData[i];
      const rowNum = i + 1; // Untuk penanda error ke user

      // Ambil nilai dari kolom yang di-map
      const rawTitle = row[mapping["title"]];
      const rawAmount = row[mapping["amount"]];
      const rawDate = row[mapping["date"]];
      const rawCatName = row[mapping["category_name"]];
      const rawCatType = mapping["category_type"] ? row[mapping["category_type"]] : fallbackType;

      // Cek Baris Kosong (Pengamanan Ganda)
      if (!rawTitle && !rawAmount && !rawDate) continue;

      const cleanAmountStr = String(rawAmount)
        .replace(/\./g, "") // 1. Hapus semua titik (pemisah ribuan Indonesia)
        .replace(/,/g, ".") // 2. Ubah koma menjadi titik (jadikan desimal standar JS)
        .replace(/[^0-9.-]+/g, ""); // 3. Hapus sisa karakter aneh (Rp, spasi, huruf)

      const finalAmount = Number(cleanAmountStr);

      // Validasi Dini (The Gatekeeper)
      if (isNaN(finalAmount) || finalAmount <= 0) {
        localErrors.push(`Baris ${rowNum}: Nominal "${rawAmount}" tidak valid.`);
      }

      // Format ISO 8601 Date
      const finalDate = new Date(rawDate);
      if (isNaN(finalDate.getTime())) {
        localErrors.push(`Baris ${rowNum}: Format tanggal "${rawDate}" tidak valid.`);
      }

      const finalType = String(rawCatType).toUpperCase();
      if (finalType !== "INCOME" && finalType !== "EXPENSE" && finalType !== "INVESTMENT") {
        localErrors.push(`Baris ${rowNum}: Tipe "${finalType}" tidak dikenali (Gunakan INCOME/EXPENSE/INVESTMENT).`);
      }

      cleanPayload.push({
        wallet_id: selectedWalletId, // Hasil Aturan 2
        title: String(rawTitle).trim(),
        amount: finalAmount,
        date: finalDate.toISOString(),
        category_name: String(rawCatName).trim(),
        category_type: finalType,
      });
    }

    // Hentikan proses jika ada 1 saja baris yang cacat
    if (localErrors.length > 0) {
      setErrors(localErrors);
      return;
    }

    // --- ATURAN 5: Eksekusi & Penguncian UI ---
    setIsLoading(true);
    try {
      const res = await fetch("/api/transactions/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanPayload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Gagal menyimpan ke server.");
      }

      toast.success(`${cleanPayload.length} transaksi berhasil diimport!`);
      // Reset state & tutup modal
      setCsvRawData([]);
      closeAllModals();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrors([error.message]);
      } else {
        setErrors(["Terjadi kesalahan saat memproses data."]);
      }
    } finally {
      setIsLoading(false); // Buka kunci UI
    }
  };

  return (
    // <Dialog onOpenChange={(open) => !isLoading && onClose()}>
    <Dialog open={true} onOpenChange={(open) => !isLoading}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Transaksi (CSV/XLSX)</DialogTitle>
        </DialogHeader>

        {/* ATURAN 2: Injeksi UUID Dompet */}
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Pilih Dompet Tujuan</label>
            <Select disabled={isLoading} value={selectedWalletId === "all" ? "" : selectedWalletId} onValueChange={setSelectedWalletId}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih dompet..." />
              </SelectTrigger>
              <SelectContent>
                {user?.wallets?.map((w) => (
                  <SelectItem key={w.id} value={w.id}>
                    {w.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Upload File </label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={isLoading}
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer disabled:opacity-50"
            />
          </div>

          {/* Area Mapping */}
          {csvHeaders.length > 0 && (
            <div className="space-y-4 pt-4 border-t">
              <label className="text-sm font-semibold">3. Petakan Kolom CSV</label>

              {TARGET_FIELDS.map((field) => (
                <div key={field.id} className="grid grid-cols-2 items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </span>
                  <Select disabled={isLoading} value={mapping[field.id] || ""} onValueChange={(val) => setMapping((prev) => ({ ...prev, [field.id]: val }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih..." />
                    </SelectTrigger>
                    <SelectContent>
                      {csvHeaders.map((header) => (
                        <SelectItem key={header} value={header}>
                          {header}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}

              {/* ATURAN 3: Fallback Kategori Jika CSV tidak punya kolom Type */}
              {!mapping["category_type"] && (
                <div className="grid grid-cols-2 items-center gap-4 bg-muted/50 p-3 rounded-md border border-yellow-200">
                  <span className="text-sm font-medium text-yellow-700">Tipe Default (Karena kolom tipe belum dipetakan)</span>
                  <Select disabled={isLoading} value={fallbackType} onValueChange={(val: any) => setFallbackType(val)}>
                    <SelectTrigger className="bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EXPENSE">Pengeluaran (Expense)</SelectItem>
                      <SelectItem value="INCOME">Pemasukan (Income)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}

          {/* Tampilan Error Validasi Lokal */}
          {errors.length > 0 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center gap-2 text-red-600 mb-1">
                <AlertCircle className="h-4 w-4" />
                <span className="font-semibold text-sm">Validasi Gagal:</span>
              </div>
              <ul className="list-disc pl-5 text-xs text-red-600 max-h-32 overflow-y-auto space-y-1">
                {errors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => closeAllModals()} disabled={isLoading}>
            Batal
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || csvRawData.length === 0}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sedang Memproses...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" /> Import {csvRawData.length > 0 ? csvRawData.length : ""} Data
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
