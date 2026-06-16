"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { format, subDays } from "date-fns";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/libs/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuthStore } from "@/store/auth-store";

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export const description = "An interactive area chart with API and DatePicker";

interface ChartDataPoint {
  date: string;
  savings: number;
  income: number;
  outcome: number;
}

const chartConfig = {
  savings: {
    label: "Savings",
    color: "var(--color-chart-savings)",
  },
  income: {
    label: "Income",
    color: "var(--color-chart-income)",
  },
  outcome: {
    label: "Outcome",
    color: "var(--color-chart-outcome)",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const selectedWalletId = useAuthStore((state) => state.selectedWalletId);

  const [data, setData] = React.useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [timeRange, setTimeRange] = React.useState("30d"); // Default tampilan 30 hari
  const date = useAuthStore((state) => state.dateRange);
  const setDate = useAuthStore((state) => state.setDateRange);

  const handlePresetChange = (value: string) => {
    if (!value) return; // Cegah unselect
    setTimeRange(value);

    if (value !== "custom") {
      const today = new Date();
      let days = 30;
      if (value === "7d") days = 7;
      if (value === "90d") days = 90;

      // Auto ubah kalender ke N hari ke belakang
      setDate({ from: subDays(today, days), to: today });
    }
  };

  // 3. HANDLER: Saat user milih tanggal manual dari kalender
  const handleManualDateChange = (newDate: DateRange | undefined) => {
    setDate(newDate);
    setTimeRange("custom"); // Matikan highlight tombol preset
  };

  // 4. TEXT RENDERER: Untuk judul deskripsi card
  const timeRangeToLabel = () => {
    if (timeRange === "90d") return "Last 3 Months";
    if (timeRange === "30d") return "Last 30 Days";
    if (timeRange === "7d") return "Last 7 Days";
    if (date?.from && date?.to) {
      return `${format(date.from, "LLL dd, y")} - ${format(date.to, "LLL dd, y")}`;
    }
    return "Custom Date Range";
  };

  React.useEffect(() => {
    const fetchChartData = async () => {
      // Kalau tanggal 'from' belum ada sama sekali, batalkan fetch
      if (!date?.from) return;

      setIsLoading(true);
      try {
        // 🔥 JARING PENGAMAN: Kalau user baru klik 1 tanggal ('to' undefined),
        // kita paksa 'to' sama dengan 'from' agar URL tidak error.
        const safeFrom = date.from;
        const safeTo = date.to || date.from;

        // Format ke YYYY-MM-DD
        const startDateStr = format(safeFrom, "yyyy-MM-dd");
        const endDateStr = format(safeTo, "yyyy-MM-dd");

        let url = `/api/dashboard/summary?start_date=${startDateStr}&end_date=${endDateStr}`;
        console.log("startDateStr:", startDateStr, "endDateStr:", endDateStr);
        console.log("url:", url);
        // Pastikan selectedWalletId ada isinya dan bukan "all" sebelum ditambah ke URL
        if (selectedWalletId && selectedWalletId !== "all") {
          url += `&wallet_id=${selectedWalletId}`;
        }

        console.log("🔥 URL CHART FETCH:", url);

        const res = await fetch(url);
        const json = await res.json();

        if (json.status && json.data) {
          setData(json.data);
        } else {
          // Kalau API gagal/kosong, reset data jadi array kosong biar chart gak error
          setData([]);
        }
      } catch (error) {
        console.error("Gagal get chart data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Panggil fungsinya
    fetchChartData();
  }, [date, selectedWalletId]);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Recap Arus Kas</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">Recap for {timeRangeToLabel()}</span>
          <span className="@[540px]/card:hidden">{timeRangeToLabel()}</span>
        </CardDescription>

        <CardAction className="flex flex-wrap items-center gap-2">
          {/* PRESET: Desktop */}
          <ToggleGroup type="single" value={timeRange} onValueChange={handlePresetChange} variant="outline" className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex">
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
          </ToggleGroup>

          {/* PRESET: Mobile */}
          <Select value={timeRange} onValueChange={handlePresetChange}>
            <SelectTrigger className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden" size="sm">
              <SelectValue placeholder="Pilih Rentang" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
              <SelectItem value="custom" disabled className="rounded-lg">
                Custom
              </SelectItem>
            </SelectContent>
          </Select>

          {/* MANUAL DATE PICKER */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !date && "text-muted-foreground",
                  timeRange === "custom" && "border-primary", // Highlight jika manual
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar mode="range" defaultMonth={date?.from} selected={date} onSelect={handleManualDateChange} numberOfMonths={isMobile ? 1 : 2} />
            </PopoverContent>
          </Popover>
        </CardAction>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6 relative">
        {/* Efek Loading saat nembak API */}
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-sm">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        <ChartContainer config={chartConfig} className="aspect-auto h-62.5 w-full">
          {/* PERHATIAN: Pake state `data` dari API, BUKAN filteredData lagi */}
          <AreaChart data={data}>
            <defs>
              <linearGradient id="fillsavings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-chart-savings)" stopOpacity={1.0} />
                <stop offset="95%" stopColor="var(--color-chart-savings)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillincome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-chart-income)" stopOpacity={1.0} />
                <stop offset="95%" stopColor="var(--color-chart-income)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="filloutcome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-chart-outcome)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-chart-outcome)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const d = new Date(value);
                return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area dataKey="savings" type="natural" fill="url(#fillsavings)" stroke="var(--color-chart-savings)" />
            <Area dataKey="income" type="natural" fill="url(#fillincome)" stroke="var(--color-chart-income)" />
            <Area dataKey="outcome" type="natural" fill="url(#filloutcome)" stroke="var(--color-chart-outcome)" />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
