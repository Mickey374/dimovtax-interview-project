import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { fromZodError } from "zod-validation-error";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { CommentSchema } from "@/lib/schemas";

type RouteContext = { params: Promise<{ id: string }> };

const getComment = async (id: string) =>
  db.comment.findUnique({
    where: { id },
    select: { id: true, userId: true, projectId: true },
  });

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const comment = await getComment(id);
    if (!comment) {
      return NextResponse.json({ message: "Comment not found" }, { status: 404 });
    }
    if (comment.userId !== session.user.id) {
      return NextResponse.json({ message: "You can only edit your own comments" }, { status: 403 });
    }

    const validation = CommentSchema.safeParse(await request.json());
    if (!validation.success) {
      return NextResponse.json({ message: fromZodError(validation.error).message }, { status: 400 });
    }

    const updatedComment = await db.comment.update({
      where: { id },
      data: { content: validation.data.content },
      include: { user: { select: { id: true, name: true, image: true } } },
    });

    return NextResponse.json(updatedComment, { status: 200 });
  } catch (error) {
    console.error("Error updating comment:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const comment = await getComment(id);
    if (!comment) {
      return NextResponse.json({ message: "Comment not found" }, { status: 404 });
    }
    if (comment.userId !== session.user.id && session.user.role !== Role.ADMIN) {
      return NextResponse.json({ message: "You cannot delete this comment" }, { status: 403 });
    }

    await db.comment.delete({ where: { id } });
    return NextResponse.json({ message: "Comment deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
