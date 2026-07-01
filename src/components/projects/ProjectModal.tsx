"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProjectStatus } from "@prisma/client";
import { Project } from "@/lib/types";
import {
  ProjectFormSchema,
  formatProjectDateForInput,
  serializeProjectFormValues,
  type ProjectFormValues,
} from "@/lib/project-form";

type User = { id: string; name: string | null };

type EditableProject = Omit<Project, "deadline"> & {
  deadline: string | Date;
};

interface ProjectModalProps {
  project?: EditableProject;
  users?: User[];
}

const ProjectModal = ({ project, users = [] }: ProjectModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const isEditing = !!project;
  const router = useRouter();

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(ProjectFormSchema),
    defaultValues: {
      title: project?.title || "",
      description: project?.description || "",
      status: project?.status || ProjectStatus.ACTIVE,
      deadline: formatProjectDateForInput(project?.deadline),
      budget: project?.budget || 0,
      assignedToId: project?.userId || null,
    },
  });

  async function onSubmit(values: ProjectFormValues) {
    const url = isEditing ? `/api/projects/${project.id}` : "/api/projects";
    const method = isEditing ? "PUT" : "POST";
    const payload = serializeProjectFormValues(values);

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to save project");
      }

      toast.success(`Project ${isEditing ? "updated" : "created"} successfully!`);
      setIsOpen(false);

      // Refresh the page data after a successful mutation
      router.refresh();
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error("Failed to save project. Please try again.");
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {isEditing ? (
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <Pencil className="mr-2 h-4 w-4" /> Edit
          </DropdownMenuItem>
        ) : (
          <Button>Add New Project</Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Project" : "Create Project"}</DialogTitle>
        </DialogHeader>

        {/* Form wraps the content inside the Dialog to manage submission */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <FieldGroup className="flex w-full flex-col gap-4">
            {/* TITLE FIELD */}
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="title">Project Title</FieldLabel>
                  <Input id="title" {...field} placeholder="Enter project title" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* DESCRIPTION FIELD */}
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="description">Description</FieldLabel>
                  <Input id="description" {...field} placeholder="Brief description" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              {/* STATUS FIELD (SELECT) */}
              <Controller
                name="status"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Status</FieldLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="ON_HOLD">On Hold</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {/* DEADLINE FIELD (DATE) */}
              <Controller
                name="deadline"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="deadline">Deadline</FieldLabel>{" "}
                    <Input
                      id="deadline"
                      type="date"
                      {...field}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* BUDGET FIELD (NUMBER) */}
              <Controller
                name="budget"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="budget">Budget ($)</FieldLabel>
                    <Input
                      id="budget"
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {/* ASSIGNED TO FIELD (DYNAMIC SELECT) */}
              <Controller
                name="assignedToId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Assign Team Member</FieldLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                      <SelectTrigger>
                        <SelectValue placeholder="Unassigned" />
                      </SelectTrigger>
                      <SelectContent>
                        {users && users.length > 0 ? (
                          users.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="none" disabled>
                            No users found
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>
          </FieldGroup>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={form.formState.isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectModal;
