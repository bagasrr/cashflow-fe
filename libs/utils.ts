// # Helper (format currency, date)

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const FormatIDR = (amount: number) => {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
