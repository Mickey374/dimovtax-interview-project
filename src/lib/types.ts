
import { ProjectStatus, Role } from "@prisma/client";

export type Project = {
  id: string;
  title: string;
  description: string | null;
  status: ProjectStatus;
  deadline: Date;
  budget: number;
  userId: string | null;
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: { name: string; email: string } | null;
};

export type User = {
  id: string;
  email: string;
  name: string;
  image: string | null;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
};
