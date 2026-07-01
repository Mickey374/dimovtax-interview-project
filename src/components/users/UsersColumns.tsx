"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { UserListItem } from "@/lib/types";

export const UsersColumns: ColumnDef<UserListItem>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      const variant = role === "ADMIN" ? "destructive" : "default";

      return <Badge variant={variant}>{role}</Badge>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date Joined",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      const formatted = format(date, "MMM dd, yyyy");
      return <span>{formatted}</span>;
    },
  },
];
