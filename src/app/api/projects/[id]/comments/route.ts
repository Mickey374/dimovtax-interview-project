import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { fromZodError } from "zod-validation-error";

import { auth } from "@/lib/auth";
import { canAccessProjectComments } from "@/lib/comment-access";
import { db } from "@/lib/db";
import { NOTIFICATION_TYPES } from "@/lib/notifications";
import { CommentSchema } from "@/lib/schemas";

type RouteContext = { params: Promise<{ id: string }> };

const getProjectForUser = async (projectId: string, user: { id: string; role?: Role }) => {
  const project = await db.project.findUnique({
    where: { id: projectId },
    select: { id: true, title: true, userId: true },
  });

  if (!project || !canAccessProjectComments(user, project.userId)) {
    return null;
  }

  return project;
};

export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const project = await getProjectForUser(id, session.user);
    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    const comments = await db.comment.findMany({
      where: { projectId: project.id },
      orderBy: { createdAt: "asc" },
      include: { user: { select: { id: true, name: true, image: true } } },
    });

    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const project = await getProjectForUser(id, session.user);
    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    const validation = CommentSchema.safeParse(await request.json());
    if (!validation.success) {
      return NextResponse.json({ message: fromZodError(validation.error).message }, { status: 400 });
    }

    const comment = await db.$transaction(async (tx) => {
      const createdComment = await tx.comment.create({
        data: { content: validation.data.content, projectId: project.id, userId: session.user.id },
        include: { user: { select: { id: true, name: true, image: true } } },
      });

      const admins = await tx.user.findMany({
        where: { role: Role.ADMIN, id: { not: session.user.id } },
        select: { id: true },
      });
      const recipientIds = new Set(admins.map((admin) => admin.id));
      if (project.userId && project.userId !== session.user.id) {
        recipientIds.add(project.userId);
      }

      if (recipientIds.size > 0) {
        await tx.notification.createMany({
          data: [...recipientIds].map((userId) => ({
            userId,
            projectId: project.id,
            title: "New comment",
            message: `${createdComment.user.name || "Someone"} commented on ${project.title}.`,
            type: NOTIFICATION_TYPES.NEW_COMMENT,
          })),
        });
      }

      return createdComment;
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
