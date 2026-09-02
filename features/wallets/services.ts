import { IWallet } from "@/types/wallet";

export const getWallets = async (page = 1, limit = 10) => {
  const res = await fetch(`/api/wallets/me?page=${page}&limit=${limit}`);
  if (!res.ok) {
    throw new Error("Failed to fetch wallets");
  }
  return res.json();
};

export const createWallet = async (data: { name: string; balance: number }) => {
  const res = await fetch(`/api/wallets/me`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Failed to create wallet");
  }
  return res.json();
};

export const updateWallet = async (id: string, data: { name: string; balance: number }) => {
  const res = await fetch(`/api/wallets/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Failed to update wallet");
  }
  return res.json();
};

export const deleteWallet = async (id: string) => {
  const res = await fetch(`/api/wallets/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Failed to delete wallet");
  }
  return res.json();
};

export const transferWalletBalance = async (data: { from_wallet_id: string; to_wallet_id: string; amount: number; notes?: string }) => {
  const res = await fetch(`/api/wallets/transfer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Failed to transfer balance");
  }
  return res.json();
};
