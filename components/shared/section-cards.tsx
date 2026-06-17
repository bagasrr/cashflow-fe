"use client";
import { IconTrendingDown, IconTrendingUp, IconMinus } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { FormatRupiah } from "@/libs/helper";
import { format } from "date-fns";

interface SummaryData {
  total_cashflow: number;
  total_inflow: number;
  total_outflow: number;
  total_investment: number;
}

export function SectionCards() {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { selectedWalletId, dateRange } = useAuthStore();

  useEffect(() => {
    const fetchSummary = async () => {
      // Tunggu sampai tanggal from ada isinya
      if (!dateRange?.from) return;

      setIsLoading(true);
      try {
        // Jaring pengaman kalau user cuma milih tanggal mulai doang
        const safeFrom = dateRange.from;
        const safeTo = dateRange.to || dateRange.from;

        const startDateStr = format(safeFrom, "yyyy-MM-dd");
        const endDateStr = format(safeTo, "yyyy-MM-dd");

        let url = `/api/dashboard/summary?start_date=${startDateStr}&end_date=${endDateStr}`;
        if (selectedWalletId && selectedWalletId !== "all") {
          url += `&wallet_id=${selectedWalletId}`;
        }

        console.log("URL FETCH SUMMARY : ", url);
        const res = await fetch(url, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        const json = await res.json();

        if (json.status && json.data) {
          setSummary(json.data);
        } else {
          setSummary(null); // Reset kalau gagal
        }
      } catch (error) {
        console.error("Gagal get summary:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummary();
  }, [selectedWalletId, dateRange]);
  console.info("Summary data:", summary);
  const cardsData = [
    {
      title: "Total Cashflow",
      money: FormatRupiah(summary?.total_cashflow),
      // Contoh angka dummy: cashflow turun 5% (merah)
      badge: renderChangeBadge(-5.0, false),
      body: { title: "Net balance this period", link: "#" },
    },
    {
      title: "Total Income",
      money: FormatRupiah(summary?.total_inflow),
      // Contoh angka dummy: income naik 12% (hijau)
      badge: renderChangeBadge(12.0, false),
      body: { title: "Inflow this period", link: "#" },
    },
    {
      title: "Total Outcome",
      money: FormatRupiah(summary?.total_outflow),
      // Pengeluaran turun 8% (Kategori Expense = true). Akan jadi Hijau karena ngirit!
      badge: renderChangeBadge(-8.0, true),
      body: { title: "Outflow this period", link: "#" },
    },
    {
      title: "Total Investment",
      money: FormatRupiah(summary?.total_investment),
      // Investasi naik 15.5% (Kategori Expense = false, karena investasi itu nambah aset).
      badge: renderChangeBadge(15.5, false),
      body: { title: "Investment this period", link: "#" },
    },
  ];
  // const cardsData = [
  //   {
  //     title: "Total Cashflow",
  //     money: FormatRupiah(summary?.total_cashflow),
  //     // badgeVariants: "outline",
  //     badge: renderChangeBadge(15.5, true),
  //     change: "+0%", // Nanti bisa dibikin dinamis kalau ada data bulan lalu
  //     icon: <IconTrendingUp />,
  //     body: { title: "Net balance this period", link: "#" },
  //   },
  //   {
  //     title: "Total Income",
  //     money: FormatRupiah(summary?.total_inflow),
  //     badge: renderChangeBadge(15.5, true),
  //     // badgeVariants: "outline",
  //     change: "+0%",
  //     icon: <IconTrendingUp className="text-emerald-500" />,
  //     body: { title: "Inflow this period", link: "#" },
  //   },
  //   {
  //     title: "Total Outcome",
  //     money: FormatRupiah(summary?.total_outflow),
  //     badge: renderChangeBadge(15.5, true),
  //     // badgeVariants: "outline",
  //     change: "-0%",
  //     icon: <IconTrendingDown className="text-destructive" />,
  //     body: { title: "Outflow this period", link: "#" },
  //   },
  //   {
  //     title: "Total Investment",
  //     money: FormatRupiah(summary?.total_investment),
  //     badge: renderChangeBadge(15.5, true),
  //     // badgeVariants: "outline",
  //     change: "+0%",
  //     icon: <IconTrendingUp className="text-blue-500" />,
  //     body: { title: "Investment this period", link: "#" },
  //   },
  // ];
  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      {cardsData.map((item, index) => (
        <Card className="@container/card" key={index}>
          <CardHeader>
            <CardDescription>{item.title}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{item.money}</CardTitle>
            <CardAction>{item.badge}</CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {item.body?.title}
              <IconTrendingUp className="size-4" />
            </div>
            <Link href={item.body?.link || ""} className="text-muted-foreground">
              View Details
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

// Jangan lupa import icon tambahan

// Fungsi untuk menentukan warna dan icon secara otomatis
const renderChangeBadge = (percentValue: number, isExpense: boolean = false) => {
  // Kalau nilainya 0 (Netral)
  if (percentValue === 0) {
    return (
      <Badge variant="outline" className="text-blue-500 border-blue-500/20 bg-blue-500/10 gap-1">
        <IconMinus className="h-4 w-4" /> 0%
      </Badge>
    );
  }

  // Kalau nilainya Plus (+)
  if (percentValue > 0) {
    // Kalau ini card pengeluaran (Outcome), Plus itu BURUK (Merah)
    // Kalau card pemasukan/cashflow, Plus itu BAIK (Hijau)
    const colorClass = isExpense ? "text-destructive border-destructive/20 bg-destructive/10" : "text-emerald-500 border-emerald-500/20 bg-emerald-500/10";

    return (
      <Badge variant="outline" className={`${colorClass} gap-1`}>
        <IconTrendingUp className="h-4 w-4" /> +{percentValue.toFixed(1)}%
      </Badge>
    );
  }

  // Kalau nilainya Minus (-)
  if (percentValue < 0) {
    // Kalau ini card pengeluaran, Minus itu BAIK (Hijau, karena ngirit)
    // Kalau card pemasukan, Minus itu BURUK (Merah, karena tekor)
    const colorClass = isExpense ? "text-emerald-500 border-emerald-500/20 bg-emerald-500/10" : "text-destructive border-destructive/20 bg-destructive/10";

    return (
      <Badge variant="outline" className={`${colorClass} gap-1`}>
        <IconTrendingDown className="h-4 w-4" /> {percentValue.toFixed(1)}%
      </Badge>
    );
  }
};
