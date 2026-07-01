import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

import { fromZodError } from "zod-validation-error";
import { CreateProjectSchema } from "@/lib/schemas";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { getProjectCacheKey, getProjectCacheKeysToInvalidate } from "@/lib/project-cache";

// GET Request handler for fetching projects
export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = searchParams.get("limit");

    const { user } = session;
    const isAdmin = user.role === "ADMIN";
    
    const take = limit ? parseInt(limit, 10) : undefined;
    const cacheKey = getProjectCacheKey({ scope: isAdmin ? "all" : "user", userId: user.id, limit: take });

    // Check Redis cache first
    const cachedProjects = await redis.get(cacheKey);

    // Let upstash auto parses the JSON
    if (cachedProjects) {
      return NextResponse.json(cachedProjects, { status: 200 });
    }

    // Fetch from DB
    const projects = await db.project.findMany({
      where: isAdmin ? {} : { userId: user.id }, // Herre, my logic is admins get all projects
      include: { assignedTo: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
      take,
    });

    // Set the Cache in Redis with an expiration time of 1 hour
    await redis.set(cacheKey, JSON.stringify(projects), { ex: 3600 });

    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// POST Request handler for creating a new project :: ADMIN ONLY
export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const body = await req.json();
    const validation = CreateProjectSchema.safeParse(body);

    if (!validation.success) {
      const validationError = fromZodError(validation.error);
      return NextResponse.json({ message: validationError.message }, { status: 400 });
    }

    const { title, description, status, deadline, budget, assignedToId } = validation.data;

    const newProject = await db.project.create({
      data: {
        title,
        description,
        status,
        deadline,
        budget,
        userId: assignedToId,
      },
    });

    // Invalidate caches
    await redis.del(...getProjectCacheKeysToInvalidate([assignedToId]));

    return NextResponse.json({ message: "Project created successfully", project: newProject }, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
