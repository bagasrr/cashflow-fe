"use client";

import * as React from "react";
import { useAuthStore } from "@/store/auth-store";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wallet } from "lucide-react";

export function WalletToggle() {
  const { user, selectedWalletId, setSelectedWalletId } = useAuthStore();

  React.useEffect(() => {
    if (user && user.wallets && user.wallets.length > 0) {
      if (!selectedWalletId || selectedWalletId === "all") {
        setSelectedWalletId(user.wallets[0].id);
      }
    }
  }, [user, selectedWalletId, setSelectedWalletId]);

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Wallet className="h-4 w-4 text-muted-foreground" />
      {/* value akan otomatis terisi ID dompet pertama berkat useEffect di atas */}
      <Select value={selectedWalletId} onValueChange={(value) => setSelectedWalletId(value)}>
        <SelectTrigger className="w-[200px] h-9 bg-background">
          <SelectValue placeholder="Pilih Dompet" />
        </SelectTrigger>
        <SelectContent>
          {/* Tangani kasus jika user belum membuat dompet sama sekali */}
          {!user.wallets || user.wallets.length === 0 ? (
            <SelectItem value="empty" disabled>
              Belum ada dompet
            </SelectItem>
          ) : (
            user.wallets.map((wallet) => (
              <SelectItem key={wallet.id} value={wallet.id}>
                {wallet.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
