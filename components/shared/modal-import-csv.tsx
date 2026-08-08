"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, UploadCloud, X } from "lucide-react";
import { toast } from "sonner";
import { useUiStore } from "@/store/ui-store";

export const ModalImportCsv = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const closeAllModals = useUiStore((state) => state.closeAllModals);
  const triggerRefresh = useUiStore((state) => state.triggerRefresh);

  // Fungsi untuk menangkap file yang dipilih user
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];

      // Validasi ringan di frontend (opsional)
      if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith(".csv")) {
        toast.error("Format file harus CSV!");
        setFile(null);
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      toast.error("Pilih file CSV terlebih dahulu!");
      return;
    }

    setIsLoading(true);

    // 1. Bungkus file menggunakan FormData
    const formData = new FormData();
    formData.append("file", file); // "file" adalah key yang bakal dibaca sama Golang lu

    try {
      // 2. Tembak ke API Endpoint lu
      const response = await fetch("/api/transactions/import", {
        method: "POST",
        // 🔥 PENTING: JANGAN tulis 'Content-Type': 'multipart/form-data' di headers!
        // Browser akan otomatis nge-set itu beserta "boundary"-nya secara otomatis kalau pakai FormData.
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Data berhasil di-import!");
        closeAllModals();
        triggerRefresh(); // Refresh tabel lu
      } else {
        toast.error(data.message || "Gagal mengimport data.");
      }
    } catch (error) {
      console.error("Import error:", error);
      toast.error("Terjadi kesalahan jaringan saat mengupload file.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-card text-card-foreground rounded-xl shadow-xl flex flex-col border animate-in fade-in-50 zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-bold tracking-tight">Import Transaksi (CSV)</h2>
          <Button variant="ghost" size="icon" onClick={closeAllModals} className="h-8 w-8 rounded-full">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 gap-3 bg-muted/10">
            <UploadCloud className="h-10 w-10 text-muted-foreground" />
            <div className="text-center">
              <p className="text-sm font-medium">Upload file CSV Anda di sini</p>
              <p className="text-xs text-muted-foreground mt-1">Maksimal ukuran file: 5MB</p>
            </div>

            {/* Input File yang disembunyikan tampilannya, tapi fungsional */}
            <Label htmlFor="csv-upload" className="mt-2 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium">
              Pilih File
            </Label>
            <Input
              id="csv-upload"
              type="file"
              accept=".csv" // Membatasi cuma bisa pilih file CSV
              className="hidden"
              onChange={handleFileChange}
            />

            {file && <p className="text-sm font-semibold text-emerald-600 mt-2">File terpilih: {file.name}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" type="button" onClick={closeAllModals}>
              Batal
            </Button>
            <Button type="submit" disabled={!file || isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Mengupload...
                </>
              ) : (
                "Mulai Import"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
