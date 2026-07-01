"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Project } from "@/lib/types";

export const columns: ColumnDef<Project>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const variant = status === "ACTIVE" ? "default" : status === "COMPLETED" ? "secondary" : "destructive";

      return <Badge variant={variant}>{status.replace("_", " ")}</Badge>;
    },
  },
  {
    accessorKey: "budget",
    header: "Budget",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("budget"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <span>{formatted}</span>;
    },
  },
  {
    accessorKey: "deadline",
    header: "Deadline",
    cell: ({ row }) => {
      const date = new Date(row.getValue("deadline"));
      const formatted = format(date, "MMM dd, yyyy");
      return <span>{formatted}</span>;
    },
  },
  {
    accessorKey: "assignedTo",
    header: "Assigned To",
    cell: ({ row }) => {
      const assignedTo = row.getValue("assignedTo") as { name: string } | null;
      return <span>{assignedTo?.name || "Unassigned"}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const project = row.original;

      // Retrieve the user role from localStorage or table meta
      const isAdmin = (table.options.meta as { isAdmin: boolean })?.isAdmin;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(project.id)}>
              Copy Project ID
            </DropdownMenuItem>

            {isAdmin && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <Pencil className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer">
                  <Trash className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
