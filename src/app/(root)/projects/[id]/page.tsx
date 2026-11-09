import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import ProjectComments from "@/components/projects/ProjectComments";

type ProjectPageProps = {
  params: Promise<{ id: string }>;
};

const ProjectPage = async ({ params }: ProjectPageProps) => {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    notFound();
  }

  const project = await db.project.findUnique({
    where: { id },
    include: {
      assignedTo: {
        select: { name: true, email: true },
      },
      comments: {
        orderBy: { createdAt: "asc" },
        include: { user: { select: { id: true, name: true, image: true } } },
      },
    },
  });

  if (!project || (session.user.role !== "ADMIN" && project.userId !== session.user.id)) {
    notFound();
  }

  const statusVariant = project.status === "COMPLETED" ? "secondary" : project.status === "ON_HOLD" ? "destructive" : "default";

  return (
    <section className="p-6 sm:p-8">
      <Link href="/projects" className="text-primary-500 mb-6 inline-block text-sm hover:underline">
        Back to projects
      </Link>

      <Card className="background-light850_dark100 max-w-3xl">
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle className="text-dark100_light900 text-2xl">{project.title}</CardTitle>
              <CardDescription className="text-dark300_light700 mt-2">
                Created {format(project.createdAt, "MMM dd, yyyy")}
              </CardDescription>
            </div>
            <Badge variant={statusVariant}>{project.status.replace("_", " ")}</Badge>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-muted-foreground text-xs uppercase tracking-wide">Description</p>
            <p className="text-dark100_light900 mt-1 text-sm">{project.description || "No description provided."}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs uppercase tracking-wide">Assigned to</p>
            <p className="text-dark100_light900 mt-1 text-sm">
              {project.assignedTo?.name || project.assignedTo?.email || "Unassigned"}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs uppercase tracking-wide">Deadline</p>
            <p className="text-dark100_light900 mt-1 text-sm">{format(project.deadline, "MMM dd, yyyy")}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs uppercase tracking-wide">Budget</p>
            <p className="text-dark100_light900 mt-1 text-sm">${project.budget.toFixed(2)}</p>
          </div>
        </CardContent>
      </Card>
      <ProjectComments
        projectId={project.id}
        currentUserId={session.user.id}
        isAdmin={session.user.role === "ADMIN"}
        initialComments={project.comments.map((comment) => ({
          ...comment,
          createdAt: comment.createdAt.toISOString(),
          updatedAt: comment.updatedAt.toISOString(),
        }))}
      />
    </section>
  );
};

export default ProjectPage;
