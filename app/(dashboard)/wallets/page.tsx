"use client";

import React, { useState } from "react";
import { useWallets } from "@/hooks/use-wallets";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Pencil, Trash2, ArrowRightLeft } from "lucide-react";
import { IWallet } from "@/types/wallet";

export default function WalletsPage() {
  const { wallets, loading, isUpdating, addWallet, editWallet, removeWallet, transferBalance } = useWallets();

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  
  const [selectedWallet, setSelectedWallet] = useState<IWallet | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  
  // Transfer states
  const [toWallet, setToWallet] = useState("");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await addWallet(name, Number(balance));
    if (success) {
      setIsAddOpen(false);
      setName("");
      setBalance("");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedWallet) {
      const success = await editWallet(selectedWallet.id, name, Number(balance));
      if (success) {
        setIsEditOpen(false);
        setSelectedWallet(null);
      }
    }
  };

  const openEdit = (wallet: IWallet) => {
    setSelectedWallet(wallet);
    setName(wallet.name);
    setBalance(wallet.balance.toString());
    setIsEditOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah anda yakin ingin menghapus wallet ini?")) {
      await removeWallet(id);
    }
  };

  const openTransfer = (wallet: IWallet) => {
    setSelectedWallet(wallet);
    setToWallet("");
    setAmount("");
    setNotes("");
    setIsTransferOpen(true);
  };

  const handleTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedWallet && toWallet) {
      const success = await transferBalance(selectedWallet.id, toWallet, Number(amount), notes);
      if (success) {
        setIsTransferOpen(false);
      }
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(val);
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manajemen Wallets</h1>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Tambah Wallet
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Wallet Baru</DialogTitle>
              <DialogDescription>Masukkan detail wallet baru anda di bawah ini.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Wallet</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required disabled={isUpdating} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="balance">Saldo Awal</Label>
                <Input id="balance" type="number" value={balance} onChange={(e) => setBalance(e.target.value)} required disabled={isUpdating} />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isUpdating}>{isUpdating ? "Menyimpan..." : "Simpan"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center">Memuat data...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wallets.map((wallet) => (
            <Card key={wallet.id}>
              <CardHeader>
                <CardTitle>{wallet.name}</CardTitle>
                <CardDescription>Saldo: {formatCurrency(wallet.balance)}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">Jumlah Transaksi: {wallet.transaction_count || 0}</p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" size="icon" onClick={() => openTransfer(wallet)} title="Transfer Saldo" disabled={isUpdating}>
                  <ArrowRightLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => openEdit(wallet)} title="Edit Wallet" disabled={isUpdating}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => handleDelete(wallet.id)} title="Hapus Wallet" disabled={isUpdating}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
          {wallets.length === 0 && <div className="col-span-full text-center text-gray-500">Belum ada wallet.</div>}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Wallet</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nama Wallet</Label>
              <Input id="edit-name" value={name} onChange={(e) => setName(e.target.value)} required disabled={isUpdating} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-balance">Saldo</Label>
              <Input id="edit-balance" type="number" value={balance} onChange={(e) => setBalance(e.target.value)} required disabled={isUpdating} />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isUpdating}>{isUpdating ? "Mengupdate..." : "Update"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Transfer Dialog */}
      <Dialog open={isTransferOpen} onOpenChange={setIsTransferOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transfer Saldo</DialogTitle>
            <DialogDescription>Transfer dari: {selectedWallet?.name}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleTransferSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Tujuan Wallet</Label>
              <Select onValueChange={setToWallet} value={toWallet} required disabled={isUpdating}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih wallet tujuan" />
                </SelectTrigger>
                <SelectContent>
                  {wallets
                    .filter((w) => w.id !== selectedWallet?.id)
                    .map((w) => (
                      <SelectItem key={w.id} value={w.id}>
                        {w.name} ({formatCurrency(w.balance)})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tf-amount">Jumlah</Label>
              <Input id="tf-amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required min={1} disabled={isUpdating} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tf-notes">Catatan (opsional)</Label>
              <Input id="tf-notes" value={notes} onChange={(e) => setNotes(e.target.value)} disabled={isUpdating} />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={!toWallet || !amount || isUpdating}>{isUpdating ? "Memproses..." : "Transfer"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
