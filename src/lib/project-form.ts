import { ProjectStatus } from "@prisma/client";
import { z } from "zod";

export const ProjectFormSchema = z.object({
  title: z.string().min(1, "Title is required.").trim(),
  description: z.string(),
  status: z.nativeEnum(ProjectStatus),
  deadline: z.string().min(1, "Deadline is required."),
  budget: z.number().positive("Currency must be greater than 0"),
  assignedToId: z.string().optional().nullable(),
});

export type ProjectFormValues = z.infer<typeof ProjectFormSchema>;

export const formatProjectDateForInput = (value?: string | Date | null) => {
  if (!value) {
    return "";
  }

  const date = typeof value === "string" ? new Date(value) : value;

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().split("T")[0];
};

export const serializeProjectFormValues = (values: ProjectFormValues) => ({
  ...values,
  title: values.title.trim(),
  description: values.description.trim(),
  deadline: new Date(values.deadline).toISOString(),
  assignedToId: values.assignedToId || null,
});