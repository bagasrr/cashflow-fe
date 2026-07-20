// # Helper (format currency, date)

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const FormatIDR = (amount: number | undefined) => {
  if (amount === null || amount === undefined) {
    return "0";
  }
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const GetDefaultDate = (isoString: string | undefined) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  const yyyy = date.getFullYear();
  const MM = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
};
