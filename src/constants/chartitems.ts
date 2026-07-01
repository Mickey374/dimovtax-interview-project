export const projectStatusConfig: Record<string, { label: string; color?: string }> = {
  count: { label: "Projects" },
  ACTIVE: { label: "Active", color: "var(--chart-1)" },
  ON_HOLD: { label: "On Hold", color: "var(--chart-3)" },
  COMPLETED: { label: "Completed", color: "var(--chart-2)" },
};

export const budgetChartConfig: Record<string, { label: string; color?: string }> = {
  budget: {
    label: "Budget ($)",
    color: "var(--chart-2)",
  },
};

export const teamChartConfig: Record<string, { label: string; color?: string }> = {
  tasks: {
    label: "Active Tasks",
    color: "var(--chart-2)",
  },
};
