import { ProjectStatus } from "@prisma/client";
import { z as zod } from "zod";

export const CreateProjectSchema = zod.object({
  title: zod.string().min(1, "Title is required.").trim(),
  description: zod.string().optional().default(""),
  status: zod.enum(ProjectStatus).default(ProjectStatus.ACTIVE),
  deadline: zod.coerce.date(),
  budget: zod
    .number()
    .positive("Currency must be greater than 0")
    .refine(
      (value) => {
        return Number.isInteger(Number((value * 100).toFixed(4)));
      },
      { message: "Currency can have a maximum of 2 decimal places" }
    ),
  assignedToId: zod.string().optional().nullable(),
});
