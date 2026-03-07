// # Helper (format currency, date)
export const formatIDR = (amount: number) => {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(amount);
};
