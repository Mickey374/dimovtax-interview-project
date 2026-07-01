import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { auth } from "@/lib/auth";
import { CreateProjectSchema } from "@/lib/schemas";
import { fromZodError } from "zod-validation-error";
import { getProjectCacheKeysToInvalidate } from "@/lib/project-cache";

// PUT Request handler for updating an existing project
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();

  if (!session || !session.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized. Admin access required." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { id: projectId } = await params;

    const validation = CreateProjectSchema.safeParse(body);

    if (!validation.success) {
      const validationError = fromZodError(validation.error);
      return NextResponse.json({ message: validationError.message }, { status: 400 });
    }

    const { title, description, status, deadline, budget, assignedToId } = validation.data;

    // First check the project to see who it was origannly given
    const existingProject = await db.project.findUnique({
      where: { id: projectId },
    });

    if (!existingProject) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    // Secondly, update the project with the new data
    const updatedProject = await db.project.update({
      where: { id: projectId },
      data: {
        title,
        description: description.trim(),
        status,
        deadline,
        budget,
        userId: assignedToId,
      },
    });

    await redis.del(...getProjectCacheKeysToInvalidate([existingProject.userId, assignedToId]));

    return NextResponse.json({ message: "Project updated successfully", project: updatedProject }, { status: 200 });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE Request handler for deleting a project
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();

  if (!session || !session.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized. Admin access required." }, { status: 403 });
  }

  try {
    const { id: projectId } = await params;

    // Find the project before deleting to get the userId for cache invalidation
    const projectToDelete = await db.project.findUnique({
      where: { id: projectId },
    });

    if (!projectToDelete) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    await db.project.delete({
      where: { id: projectId },
    });

    await redis.del(...getProjectCacheKeysToInvalidate([projectToDelete.userId]));

    return NextResponse.json({ message: "Project deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
