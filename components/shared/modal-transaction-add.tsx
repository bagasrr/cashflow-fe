"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUiStore } from "@/store/ui-store";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  type: string;
}

export const AddTransaction = () => {
  const setIsAddTransaction = useUiStore((state) => state.setIsAddTransaction);

  const [rawAmount, setRawAmount] = useState<number | "">("");
  const [displayAmount, setDisplayAmount] = useState<string>("");
  const userInfo = useAuthStore((state) => state.user);
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/\D/g, "");

    if (!numericValue) {
      setRawAmount("");
      setDisplayAmount("");
      return;
    }

    const numberValue = parseInt(numericValue, 10);
    setRawAmount(numberValue);

    const formatted = new Intl.NumberFormat("id-ID").format(numberValue);
    setDisplayAmount(formatted);
  };

  const [selectedType, setSelectedType] = useState<string | null>(null);
  const handleTypeChange = (value: string) => {
    setSelectedType(value);
  };
  const [listCategories, setListCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(false);
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };
  const trigerRefresh = useUiStore((state) => state.triggerRefresh);
  const categoryType = [
    { value: "INCOME", label: "Income" },
    { value: "EXPENSE", label: "Expense" },
    { value: "INVESTMENT", label: "Investment" },
  ];

  const getCategoryTypeUrl = "/api/categories"; // Ganti dengan URL API kategori lu
  console.info("Selected Type:", selectedType);

  const categoryUrl = selectedType ? `${getCategoryTypeUrl}?type=${selectedType}` : "";
  useEffect(() => {
    // Kalau categoryUrl kosong, gak usah ngapa-ngapain
    if (!categoryUrl) return;

    // Bungkus semua logikanya di dalam fungsi async
    const fetchCategories = async () => {
      setIsLoadingCategories(true);

      try {
        const response = await fetch(categoryUrl);
        const data = await response.json();

        // Sesuaikan kalau Golang lu pakai { data: [...] }
        setListCategories(data.data || data);
        setSelectedCategory(null);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        // Matikan loading, entah itu sukses atau error
        setIsLoadingCategories(false);
      }
    };

    // Panggil fungsinya
    fetchCategories();
  }, [categoryUrl]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const rawDate = formData.get("date") as string;

    const formattedDate = rawDate ? new Date(rawDate).toISOString() : "";
    const payload = {
      title: formData.get("title"),
      amount: rawAmount,
      category_id: selectedCategory,
      date: formattedDate,
      description: formData.get("description"),
      wallet_id: formData.get("wallet"),
    };

    if (!payload.category_id) {
      toast.error("Kategori belum dipilih!");
      return;
    }

    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("Transaksi Berhasil Disimpan!");
        setIsAddTransaction(false);
        trigerRefresh(); // 🔥 Trigger refresh data di dashboard
      } else {
        toast.error("Gagal Menyimpan Transaksi");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat menyimpan transaksi. Silakan coba lagi.");
      console.log("ERR : ", error);
    }
  };

  return (
    <div className="w-[90%] md:w-[70%] max-h-[90vh] overflow-y-auto rounded-lg bg-card p-6 shadow-lg shadow-secondary/50 animate-in fade-in-50 duration-200 flex flex-col gap-6">
      <div className="flex items-center justify-between border-b pb-4">
        <h2 className="text-xl font-bold tracking-tight">Tambah Transaksi</h2>
      </div>

      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">
                Judul Transaksi <span className="text-destructive">*</span>
              </Label>
              <Input id="title" name="title" placeholder="Cth: Makan Siang Nasi Padang" required />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="amount">
                Nominal (Rp) <span className="text-destructive">*</span>
              </Label>
              <Input id="amount" name="amount" type="text" placeholder="Cth: 50000" required step="1" min="0" value={displayAmount} onChange={handleAmountChange} className="pl-5" />
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
                    type="button"
                    variant={selectedType === cat.value ? "default" : "outline"}
                    size="lg"
                    className="capitalize"
                    onClick={() => {
                      handleTypeChange(cat.value);
                    }}
                  >
                    {cat.label}
                  </Button>
                ))}
              </div>
              <Select required name="category" onValueChange={handleCategoryChange} value={selectedCategory || undefined} disabled={!selectedType || isLoadingCategories}>
                <SelectTrigger id="category" className="w-full">
                  <SelectValue placeholder="Pilih Kategori..." className="w-[80%]" />
                  <Loader2 className={`ml-2 h-4 w-4 animate-spin ${isLoadingCategories ? "inline-block" : "hidden"}`} />
                  {/* <Loader2 className={`ml-2 h-4 w-4 animate-spin }`} /> */}
                </SelectTrigger>

                <SelectContent>
                  {listCategories.length > 0 ? (
                    listCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="null" disabled>
                      Pilih tipe kategori terlebih dahulu
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="date">
                Tanggal & Waktu <span className="text-destructive">*</span>
              </Label>
              <Input id="date" name="date" type="datetime-local" required />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="wallet">
                Dompet (Wallet) <span className="text-destructive">*</span>
              </Label>
              <Select required name="wallet">
                <SelectTrigger id="wallet">
                  <SelectValue placeholder="Pilih Sumber Dana..." />
                </SelectTrigger>
                <SelectContent>
                  {/* Nantinya di-map dari data API Wallet lu
                  <SelectItem value="wallet-uuid-1">💳 BCA Utama</SelectItem>
                  <SelectItem value="wallet-uuid-2">💵 Uang Tunai</SelectItem> */}
                  {userInfo && userInfo.wallets && userInfo.wallets.length > 0 ? (
                    userInfo.wallets.map((wallet) => (
                      <SelectItem key={wallet.id} value={wallet.id}>
                        {wallet.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="null" disabled>
                      Belum ada dompet tersedia
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="description">Deskripsi (Opsional)</Label>
              <Textarea id="description" name="description" placeholder="Tambahkan catatan khusus di sini..." className="resize-none h-20" />
            </div>
          </div>
        </div>

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
