"use client";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { FormatRupiah } from "@/libs/helper";

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
      badgeVariants: "outline",
      change: "+0%", // Nanti bisa dibikin dinamis kalau ada data bulan lalu
      icon: <IconTrendingUp />,
      body: { title: "Net balance this period", link: "#" },
    },
    {
      title: "Total Income",
      money: FormatRupiah(summary?.total_inflow),
      badgeVariants: "outline",
      change: "+0%",
      icon: <IconTrendingUp className="text-emerald-500" />,
      body: { title: "Inflow this period", link: "#" },
    },
    {
      title: "Total Outcome",
      money: FormatRupiah(summary?.total_outflow),
      badgeVariants: "outline",
      change: "-0%",
      icon: <IconTrendingDown className="text-destructive" />,
      body: { title: "Outflow this period", link: "#" },
    },
    {
      title: "Total Investment",
      money: FormatRupiah(summary?.total_investment),
      badgeVariants: "outline",
      change: "+0%",
      icon: <IconTrendingUp className="text-blue-500" />,
      body: { title: "Investment this period", link: "#" },
    },
  ];
  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      {cardsData.map((item, index) => (
        <Card className="@container/card" key={index}>
          <CardHeader>
            <CardDescription>{item.title}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">Rp{item.money}</CardTitle>
            <CardAction>
              <Badge variant="outline">
                {item.icon}
                {item.change}
              </Badge>
            </CardAction>
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

      {/* <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">$1,250.00</CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Trending up this month <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Visitors for the last 6 months</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>New Customers</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">1,234</CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingDown />
              -20%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Down 20% this period <IconTrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">Acquisition needs attention</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Accounts</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">45,678</CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Strong user retention <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Engagement exceed targets</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Growth Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">4.5%</CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +4.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Steady performance increase <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Meets growth projections</div>
        </CardFooter>
      </Card> */}
    </div>
  );
}
