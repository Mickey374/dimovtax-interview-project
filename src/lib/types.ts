import { ProjectStatus, Role } from "@prisma/client";

export type ProjectAssignee = {
  name: string | null;
  email: string | null;
};

export type UserListItem = {
  id: string;
  name: string | null;
  email: string;
  role: Role;
  createdAt: string;
};

export type Project = {
  id: string;
  title: string;
  description: string | null;
  status: ProjectStatus;
  deadline: string;
  budget: number;
  userId: string | null;
  createdAt: string;
  updatedAt: string;
  assignedTo?: ProjectAssignee | null;
};
