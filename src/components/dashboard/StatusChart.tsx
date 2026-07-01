"use client";

import { Label, Pie, PieChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useMemo } from "react";
import { projectStatusConfig } from "@/constants/chartitems";
import { Project } from "@/lib/types";

const StatusChart = ({ projects }: { projects: Project[] }) => {
  // Aggregate the raw data for the chart
  const aggregatedData = useMemo(() => {
    const counts = { ACTIVE: 0, ON_HOLD: 0, COMPLETED: 0 };
    projects.forEach((p) => {
      if (counts[p.status as keyof typeof counts] !== undefined) {
        counts[p.status as keyof typeof counts]++;
      }
    });

    return [
      { status: "ACTIVE", count: counts.ACTIVE, fill: "var(--color-ACTIVE)" },
      { status: "ON_HOLD", count: counts.ON_HOLD, fill: "var(--color-ON_HOLD)" },
      { status: "COMPLETED", count: counts.COMPLETED, fill: "var(--color-COMPLETED)" },
    ];
  }, [projects]);

  const totalProjects = aggregatedData.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card className="flex flex-col bg-none shadow-none">
      <CardHeader className="items-center pb-0">
        <CardTitle>Project Status</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={projectStatusConfig as ChartConfig} className="mx-auto aspect-square h-62.5">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={aggregatedData} dataKey="count" nameKey="status" innerRadius={60} strokeWidth={5}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                          {totalProjects.toLocaleString()}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                          Projects
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default StatusChart;
