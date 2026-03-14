// # Helper (format currency, date)

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const formatIDR = (amount: number) => {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(amount);
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
