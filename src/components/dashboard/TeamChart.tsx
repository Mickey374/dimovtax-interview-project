"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Project } from "@/lib/types";
import { useMemo } from "react";
import { teamChartConfig } from "@/constants/chartitems";

const TeamChart = ({ projects }: { projects: Project[] }) => {
  // Aggregate unfinished projects by team members
  const teamData = useMemo(() => {
    const workload: Record<string, number> = {};

    projects.forEach((project) => {
      // Only counting projects that are not completed
      if (project.status !== "COMPLETED" && project.assignedTo?.name) {
        const userName = project.assignedTo.name;
        workload[userName] = (workload[userName] || 0) + 1;
      }
    });

    // Convert the object into an array suitable for the chart
    return Object.entries(workload)
      .map(([name, tasks]) => ({
        name,
        tasks,
      }))
      .sort((a, b) => b.tasks - a.tasks);
  }, [projects]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Workload</CardTitle>
        <CardDescription>Active and On-Hold tasks per member</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={teamChartConfig as ChartConfig} className="h-62.5 w-full">
          {/* layout="vertical" flips the bar chart horizontally */}
          <BarChart
            accessibilityLayer
            data={teamData}
            layout="vertical"
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          >
            <CartesianGrid horizontal={false} strokeDasharray="3 3" className="stroke-muted" />
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} width={100} className="text-xs" />
            <ChartTooltip cursor={{ fill: "var(--accent)" }} content={<ChartTooltipContent />} />
            <Bar dataKey="tasks" fill="var(--color-tasks)" radius={[0, 4, 4, 0]} barSize={30} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default TeamChart;
