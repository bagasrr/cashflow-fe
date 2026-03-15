"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export const description = "An interactive area chart";

const chartData = [
  { date: "2024-04-01", savings: 100, income: 222, outcome: 150 },
  { date: "2024-04-02, savings: 80 ", income: 97, outcome: 180 },
  { date: "2024-04-03", savings: 110, income: 167, outcome: 120 },
  { date: "2024-04-04", savings: 120, income: 242, outcome: 260 },
  { date: "2024-04-05", savings: 130, income: 373, outcome: 290 },
  { date: "2024-04-06", savings: 140, income: 301, outcome: 340 },
  { date: "2024-04-07", savings: 150, income: 245, outcome: 180 },
  { date: "2024-04-08", savings: 160, income: 409, outcome: 320 },
  { date: "2024-04-09, savings: 107", income: 59, outcome: 110 },
  { date: "2024-04-10", savings: 180, income: 261, outcome: 190 },
  { date: "2024-04-11", savings: 190, income: 327, outcome: 350 },
  { date: "2024-04-12", savings: 200, income: 292, outcome: 210 },
  { date: "2024-04-13", savings: 300, income: 342, outcome: 380 },
  { date: "2024-04-14", savings: 400, income: 137, outcome: 220 },
  { date: "2024-04-15", savings: 500, income: 120, outcome: 170 },
  { date: "2024-04-16", savings: 340, income: 138, outcome: 190 },
  { date: "2024-04-17", savings: 130, income: 446, outcome: 360 },
  { date: "2024-04-18", savings: 250, income: 364, outcome: 410 },
  { date: "2024-04-19", savings: 220, income: 243, outcome: 180 },
  { date: "2024-04-20, savings: 470", income: 89, outcome: 150 },
  { date: "2024-04-21", savings: 270, income: 137, outcome: 200 },
  { date: "2024-04-22", savings: 180, income: 224, outcome: 170 },
  { date: "2024-04-23", savings: 240, income: 138, outcome: 230 },
  { date: "2024-04-24", savings: 350, income: 387, outcome: 290 },
  { date: "2024-04-25", savings: 460, income: 215, outcome: 250 },
  { date: "2024-04-26, savings: 456", income: 75, outcome: 130 },
  { date: "2024-04-27", savings: 430, income: 383, outcome: 420 },
  { date: "2024-04-28", savings: 400, income: 122, outcome: 180 },
  { date: "2024-04-29", savings: 450, income: 315, outcome: 240 },
  { date: "2024-04-30", savings: 490, income: 454, outcome: 380 },
  { date: "2024-05-01", savings: 420, income: 165, outcome: 220 },
  { date: "2024-05-02", savings: 450, income: 293, outcome: 310 },
  { date: "2024-05-03", savings: 350, income: 247, outcome: 190 },
  { date: "2024-05-04", savings: 570, income: 385, outcome: 420 },
  { date: "2024-05-05", savings: 530, income: 481, outcome: 390 },
  { date: "2024-05-06", savings: 330, income: 498, outcome: 520 },
  { date: "2024-05-07", savings: 430, income: 388, outcome: 300 },
  { date: "2024-05-08", savings: 460, income: 149, outcome: 210 },
  { date: "2024-05-09", savings: 570, income: 227, outcome: 180 },
  { date: "2024-05-10", savings: 330, income: 293, outcome: 330 },
  { date: "2024-05-11", savings: 340, income: 335, outcome: 270 },
  { date: "2024-05-12", savings: 550, income: 197, outcome: 240 },
  { date: "2024-05-13", savings: 360, income: 197, outcome: 160 },
  { date: "2024-05-14", savings: 430, income: 448, outcome: 490 },
  { date: "2024-05-15", savings: 350, income: 473, outcome: 380 },
  { date: "2024-05-16", savings: 367, income: 338, outcome: 400 },
  { date: "2024-05-17", savings: 264, income: 499, outcome: 420 },
  { date: "2024-05-18", savings: 356, income: 315, outcome: 350 },
  { date: "2024-05-19", savings: 347, income: 235, outcome: 180 },
  { date: "2024-05-20", savings: 256, income: 177, outcome: 230 },
  { date: "2024-05-21, savings: 584", income: 82, outcome: 140 },
  { date: "2024-05-22, savings: 356", income: 81, outcome: 120 },
  { date: "2024-05-23", savings: 365, income: 252, outcome: 290 },
  { date: "2024-05-24", savings: 443, income: 294, outcome: 220 },
  { date: "2024-05-25", savings: 536, income: 201, outcome: 250 },
  { date: "2024-05-26", savings: 534, income: 213, outcome: 170 },
  { date: "2024-05-27", savings: 367, income: 420, outcome: 460 },
  { date: "2024-05-28", savings: 373, income: 233, outcome: 190 },
  { date: "2024-05-29, savings: 278", income: 78, outcome: 130 },
  { date: "2024-05-30", savings: 230, income: 340, outcome: 280 },
  { date: "2024-05-31", savings: 246, income: 178, outcome: 230 },
  { date: "2024-06-01", savings: 455, income: 178, outcome: 200 },
  { date: "2024-06-02", savings: 360, income: 470, outcome: 410 },
  { date: "2024-06-03", savings: 370, income: 103, outcome: 160 },
  { date: "2024-06-04", savings: 340, income: 439, outcome: 380 },
  { date: "2024-06-05, savings: 384", income: 88, outcome: 140 },
  { date: "2024-06-06", savings: 467, income: 294, outcome: 250 },
  { date: "2024-06-07", savings: 460, income: 323, outcome: 370 },
  { date: "2024-06-08", savings: 240, income: 385, outcome: 320 },
  { date: "2024-06-09", savings: 560, income: 438, outcome: 480 },
  { date: "2024-06-10", savings: 250, income: 155, outcome: 200 },
  { date: "2024-06-11, savings: 100", income: 92, outcome: 150 },
  { date: "2024-06-12", savings: 360, income: 492, outcome: 420 },
  { date: "2024-06-13, savings: 368", income: 81, outcome: 130 },
  { date: "2024-06-14", savings: 240, income: 426, outcome: 380 },
  { date: "2024-06-15", savings: 100, income: 307, outcome: 350 },
  { date: "2024-06-16", savings: 240, income: 371, outcome: 310 },
  { date: "2024-06-17", savings: 550, income: 475, outcome: 520 },
  { date: "2024-06-18", savings: 250, income: 107, outcome: 170 },
  { date: "2024-06-19", savings: 230, income: 341, outcome: 290 },
  { date: "2024-06-20", savings: 370, income: 408, outcome: 450 },
  { date: "2024-06-21", savings: 460, income: 169, outcome: 210 },
  { date: "2024-06-22", savings: 320, income: 317, outcome: 270 },
  { date: "2024-06-23", savings: 280, income: 480, outcome: 530 },
  { date: "2024-06-24", savings: 380, income: 132, outcome: 180 },
  { date: "2024-06-25", savings: 380, income: 141, outcome: 190 },
  { date: "2024-06-26", savings: 380, income: 434, outcome: 380 },
  { date: "2024-06-27", savings: 440, income: 448, outcome: 490 },
  { date: "2024-06-28", savings: 580, income: 149, outcome: 200 },
  { date: "2024-06-29", savings: 220, income: 103, outcome: 160 },
  { date: "2024-06-30", savings: 160, income: 446, outcome: 400 },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  savings: {
    label: "savings",
    color: "var(--color-chart-savings)",
  },
  income: {
    label: "income",
    color: "var(--color-chart-income)",
  },
  outcome: {
    label: "outcome",
    color: "var(--color-chart-outcome)",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("7d");

  const timeRangeToLabel = (timeRange: string) => {
    if (timeRange === "90d") {
      return "Last 3 Months";
    } else if (timeRange === "30d") {
      return "Last 30 days";
    } else if (timeRange === "7d") {
      return "Last 7 days";
    }
  };

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-06-30");
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Recap</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">Recap for the {timeRangeToLabel(timeRange)}</span>
          <span className="@[540px]/card:hidden">{timeRangeToLabel(timeRange)}</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup type="single" value={timeRange} onValueChange={setTimeRange} variant="outline" className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex">
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden" size="sm" aria-label="Select a value">
              <SelectValue placeholder="Last 3 months" />
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
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-62.5 w-full">
          <AreaChart data={filteredData}>
            <defs>
              {/* id untuk ditambahkan ke url <area fill="url(#fillsavings)"/> dibawah */}
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
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            {/* fill untuk warna chart nyambung ke bagian <defs id="fillsavings"/> */}
            <Area dataKey="savings" type="natural" fill="url(#fillsavings)" stroke="var(--color-chart-savings)" />
            <Area dataKey="income" type="natural" fill="url(#fillincome)" stroke="var(--color-chart-income)" />
            <Area dataKey="outcome" type="natural" fill="url(#filloutcome)" stroke="var(--color-chart-outcome)" />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
