"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUiStore } from "@/store/ui-store";
import { useEffect, useState } from "react";

export const AddTransaction = () => {
  const setIsAddTransaction = useUiStore((state) => state.setIsAddTransaction);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const categoryType = [
    { value: "INCOME", label: "Income" },
    { value: "EXPENSE", label: "Expense" },
    { value: "INVESTMENT", label: "Investment" },
  ];

  const getCategoryTypeUrl = "/api/categories?type="; // Ganti dengan URL API kategori lu

  useEffect(() => {}, [selectedType]);

  return (
    <div className="w-[90%] md:w-[70%] max-h-[90vh] overflow-y-auto rounded-lg bg-card p-6 shadow-lg shadow-secondary/50 animate-in fade-in-50 duration-200 flex flex-col gap-6">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b pb-4">
        <h2 className="text-xl font-bold tracking-tight">Tambah Transaksi</h2>
      </div>

      {/* FORM UTAMA */}
      <form className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* ================================== */}
          {/* KOLOM PRIMER (KIRI)                */}
          {/* ================================== */}
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">
                Judul Transaksi <span className="text-destructive">*</span>
              </Label>
              <Input id="title" placeholder="Cth: Makan Siang Nasi Padang" required />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="amount">
                Nominal (Rp) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder="Cth: 50000"
                required
                // Karena di Golang lu pakai int64 (bukan desimal),
                // pastikan input ini gak menerima koma di step form-nya.
                step="1"
                min="0"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="category-type">
                Kategori <span className="text-destructive">*</span>
              </Label>
              <div className="flex flex-row gap-2 mb-1" id="category-type">
                {categoryType.map((cat) => (
                  <Button
                    key={cat.value}
                    value={cat.value}
                    variant={selectedType === cat.value ? "default" : "outline"}
                    size="lg"
                    className="capitalize"
                    onClick={() => {
                      setSelectedType(cat.value);
                    }}
                  >
                    {cat.label}
                  </Button>
                ))}
              </div>
              <Select required>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Pilih Kategori..." />
                </SelectTrigger>

                <SelectContent>
                  {/* Nantinya di-map dari data API Kategori lu */}
                  <SelectItem value="cat-uuid-1">🍕 Makanan & Minuman</SelectItem>
                  <SelectItem value="cat-uuid-2">🚗 Transportasi</SelectItem>
                  <SelectItem value="cat-uuid-3">💰 Gaji (Income)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* ================================== */}
          {/* KOLOM SEKUNDER (KANAN)             */}
          {/* ================================== */}
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="date">
                Tanggal & Waktu <span className="text-destructive">*</span>
              </Label>
              {/* Pakai type datetime-local agar match dengan time.Time Golang */}
              <Input id="date" type="datetime-local" required />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="wallet">
                Dompet (Wallet) <span className="text-destructive">*</span>
              </Label>
              <Select required>
                <SelectTrigger id="wallet">
                  <SelectValue placeholder="Pilih Sumber Dana..." />
                </SelectTrigger>
                <SelectContent>
                  {/* Nantinya di-map dari data API Wallet lu */}
                  <SelectItem value="wallet-uuid-1">💳 BCA Utama</SelectItem>
                  <SelectItem value="wallet-uuid-2">💵 Uang Tunai</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="description">Deskripsi (Opsional)</Label>
              <Textarea id="description" placeholder="Tambahkan catatan khusus di sini..." className="resize-none h-20" />
            </div>
          </div>
        </div>

        {/* ================================== */}
        {/* ACTION BUTTONS                     */}
        {/* ================================== */}
        <div className="flex justify-end gap-3 pt-4 border-t mt-2">
          <Button variant="outline" type="button" onClick={() => setIsAddTransaction(false)}>
            Batal
          </Button>
          <Button type="submit">Simpan Transaksi</Button>
        </div>
      </form>
    </div>
  );
};
