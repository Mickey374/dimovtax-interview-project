import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { getServerSession } from "next-auth";

// PUT Request handler for updating an existing project
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession();

  if (!session || !session.user || session.user.role !== "ADMIN") {
    return NextResponse.json(
      { message: "Unauthorized. Admin access required." },
      { status: 403 },
    );
  }

  try {
    const body = await req.json();
    const projectId = params.id;

    // First check the project to see who it was origannly given
    const existingProject = await db.project.findUnique({
      where: { id: projectId },
    });

    if (!existingProject) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 },
      );
    }

    // Secondly, update the project with the new data
    const updatedProject = await db.project.update({
      where: { id: projectId },
      data: {
        title: body.title.trim(),
        description: body.description.trim() || "",
        status: body.status,
        deadline: body.deadline ? new Date(body.deadline) : undefined,
        budget: body.budget ? parseFloat(body.budget) : undefined,
        userId: body.assignedToId, // New assigned user id
      },
    });

    // Cache Invalidate the Admin data
    await redis.del("projects:all");

    if (existingProject.userId) {
      // If the project was previously assigned to a user, invalidate that user's cache
      await redis.del(`projects:user:${existingProject.userId}`);
    }

    if (body.assignedToId && body.assignedToId !== existingProject.userId) {
      await redis.del(`projects:user:${body.assignedToId}`);
    }

    return NextResponse.json(
      { message: "Project updated successfully", project: updatedProject },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// DELETE Request handler for deleting a project
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession();

  if (!session || !session.user || session.user.role !== "ADMIN") {
    return NextResponse.json(
      { message: "Unauthorized. Admin access required." },
      { status: 403 },
    );
  }

  try {
    const projectId = params.id;

    // Find the project before deleting to get the userId for cache invalidation
    const projectToDelete = await db.project.findUnique({
      where: { id: projectId },
    });

    if (!projectToDelete) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 },
      );
    }

    await db.project.delete({
      where: { id: projectId },
    });

    // Invalidate caches
    await redis.del("projects:all");
    if (projectToDelete.userId) {
      await redis.del(`projects:user:${projectToDelete.userId}`);
    }

    return NextResponse.json({ message: "Project deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
