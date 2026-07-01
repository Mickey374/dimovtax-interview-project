"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
import ProjectModal from "./ProjectModal";

type User = {
  id: string;
  name: string | null;
};

export const ProjectColumns: ColumnDef<Project>[] = [
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
      const amount = Number(row.getValue("budget"));
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
      const dateValue = row.getValue("deadline") as string | Date;
      const date = new Date(dateValue);
      const formatted = format(date, "MMM dd, yyyy");
      return <span>{formatted}</span>;
    },
  },
  {
    accessorKey: "assignedTo",
    header: "Assigned To",
    cell: ({ row }) => {
      const assignedTo = row.original.assignedTo;
      return <span>{assignedTo?.name || "Unassigned"}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      return <ProjectActionsCell project={row.original} tableMeta={table.options.meta as { isAdmin: boolean; users: User[] }} />;
    },
  },
];

const ProjectActionsCell = ({
  project,
  tableMeta,
}: {
  project: Project;
  tableMeta: { isAdmin: boolean; users: User[] };
}) => {
  const router = useRouter();
  const { isAdmin, users } = tableMeta;

  const handleDelete = async () => {
    const confirmed = window.confirm(`Delete project \"${project.title}\"?`);

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to delete project");
      }

      toast.success("Project deleted successfully");
      router.refresh();
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error(error instanceof Error ? error.message : "Failed to delete project");
    }
  };

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
        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(project.id)}>Copy Project ID</DropdownMenuItem>

        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <ProjectModal project={project} users={users} />
            <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer" onClick={handleDelete}>
              <Trash className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
