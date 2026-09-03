"use client";

import { useAuthStore } from "@/store/auth-store";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FormatIDR } from "@/libs/utils";
import { Wallet } from "lucide-react";

export function WalletBalanceBox() {
  const { user, selectedWalletId } = useAuthStore();

  let balance = 0;
  let title = "Total Balance";

  if (user && user.wallets) {
    if (selectedWalletId === "all") {
      balance = user.wallets.reduce((acc, w) => acc + w.balance, 0);
      title = "All Wallets Balance";
    } else {
      const selectedWallet = user.wallets.find((w) => w.id === selectedWalletId);
      if (selectedWallet) {
        balance = selectedWallet.balance;
        title = `${selectedWallet.name} Balance`;
      }
    }
  }

  return (
    <div className="px-4 lg:px-6 w-full">
      <Card className="w-full bg-gradient-to-r from-primary/10 to-primary/5 shadow-sm">
        <CardHeader className="flex flex-row items-center gap-4 py-4">
          <div className="rounded-full bg-primary/20 p-3">
            <Wallet className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardDescription className="text-sm font-medium">{title}</CardDescription>
            <CardTitle className="text-2xl font-bold md:text-3xl">{FormatIDR(balance)}</CardTitle>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
