import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";

type ProfilePageProps = {
  params: Promise<{ id: string }>;
};

const Profile = async ({ params }: ProfilePageProps) => {
  const { id } = await params;
  const session = await auth();

  if (!session?.user || (session.user.role !== "ADMIN" && session.user.id !== id)) {
    notFound();
  }

  const user = await db.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      projects: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          status: true,
          deadline: true,
          budget: true,
        },
      },
    },
  });

  if (!user) {
    notFound();
  }

  const showProjects = user.role !== "ADMIN";

  return (
    <section className="p-6 sm:p-8">
      <h1 className="h1-bold mb-6">Profile</h1>

      <div className="card-wrapper shadow-light100_darknone rounded-2xl p-6">
        <Card className="background-light850_dark100 border-none shadow-none">
          <CardHeader>
            <CardTitle className="text-dark100_light900 text-2xl">{user.name}</CardTitle>
            <CardDescription className="text-dark300_light700">{user.email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant={user.role === "ADMIN" ? "destructive" : "default"}>{user.role}</Badge>
              <span className="text-dark300_light700 text-sm">Member since {format(user.createdAt, "MMM dd, yyyy")}</span>
            </div>

            <Separator />

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-background px-4 py-3">
                <p className="text-muted-foreground text-xs uppercase tracking-wide">User ID</p>
                <p className="text-dark100_light900 mt-1 break-all text-sm">{user.id}</p>
              </div>
              <div className="rounded-xl border border-border bg-background px-4 py-3">
                <p className="text-muted-foreground text-xs uppercase tracking-wide">Role</p>
                <p className="text-dark100_light900 mt-1 text-sm">{user.role}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {showProjects ? (
          <div className="mt-6 space-y-4">
            <h2 className="h2-bold text-dark100_light900">Assigned Projects</h2>
            {user.projects.length ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {user.projects.map((project) => (
                  <Card key={project.id} className="background-light850_dark100 border-none shadow-none">
                    <CardHeader>
                      <CardTitle className="text-dark100_light900 text-lg">{project.title}</CardTitle>
                      <CardDescription className="text-dark300_light700">
                        Deadline {format(project.deadline, "MMM dd, yyyy")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between gap-3">
                      <Badge variant={project.status === "COMPLETED" ? "secondary" : project.status === "ON_HOLD" ? "destructive" : "default"}>
                        {project.status.replace("_", " ")}
                      </Badge>
                      <span className="text-dark300_light700 text-sm">${project.budget.toFixed(2)}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="background-light850_dark100 border-none shadow-none">
                <CardContent className="py-8 text-center text-sm text-muted-foreground">No projects are assigned to this user.</CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="mt-6">
            <Card className="background-light850_dark100 border-none shadow-none">
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                Admin accounts do not show assigned projects because they oversee the full project set.
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
};

export default Profile;
