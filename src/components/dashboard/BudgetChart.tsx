"use client";

import { Project } from "@/lib/types";
import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { budgetChartConfig } from "@/constants/chartitems";

const BudgetChart = ({ projects }: { projects: Project[] }) => {
  // Map the projects data and safely truncate long titles for the chart
  const chartData = useMemo(() => {
    return projects.map((project) => ({
      name: project.title.length > 15 ? `${project.title.substring(0, 15)}...` : project.title,
      budget: project.budget,
      fullTitle: project.title,
    }));
  }, [projects]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Overview</CardTitle>
        <CardDescription>Budget allocation per project</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={budgetChartConfig as ChartConfig} className="h-62.5 w-full">
          <BarChart accessibilityLayer data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} className="text-xs" />
            <YAxis
              tickFormatter={(value) => `$${value / 1000}k`}
              tickLine={false}
              axisLine={false}
              className="text-xs"
            />

            <ChartTooltip
              cursor={{ fill: "var(--accent)" }}
              content={
                <ChartTooltipContent
                  formatter={(value) =>
                    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value as number)
                  }
                />
              }
            />
            <Bar dataKey="budget" fill="var(--color-budget)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default BudgetChart;
