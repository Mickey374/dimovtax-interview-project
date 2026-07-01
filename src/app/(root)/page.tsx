import BudgetChart from "@/components/dashboard/BudgetChart";
import StatusChart from "@/components/dashboard/StatusChart";
import TeamChart from "@/components/dashboard/TeamChart";
// import { columns } from "@/components/projects/ProjectColumns";
import { DataTable } from "@/components/projects/DataTable";
import { getProjects, getUsers } from "@/lib/data";
import { Suspense } from "react";
import TableSkeleton from "@/components/projects/TableSkeleton";
import { auth } from "@/lib/auth";
import { ProjectColumns } from "@/components/projects/ProjectColumns";
import { redirect } from "next/navigation";

const Dashboard = async () => {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    redirect("/projects");
  }

  const projects = await getProjects();

  return (
    <section className="p-6 sm:p-8">
      <h1 className="h1-bold mb-6">Dashboard</h1>
      <div className="card-wrapper rounded-2 flex w-full flex-col justify-between gap-6 p-6 md:flex-row">
        <StatusChart projects={projects} />
        <BudgetChart projects={projects} />
        <TeamChart projects={projects} />
      </div>

      <div className="mt-12">
        <h2 className="h2-bold mb-6">Recent Projects</h2>
        <Suspense fallback={<TableSkeleton />}>
          <DataTableWrapper isDashboard />
        </Suspense>
      </div>
    </section>
  );
};

const DataTableWrapper = async ({ isDashboard }: { isDashboard?: boolean }) => {
  const session = await auth();
  // Fetch only the 5 most recent projects for the dashboard table
  const recentProjects = await getProjects({ limit: 5 });
  const isAdmin = session?.user?.role === "ADMIN";
  const users = await getUsers();

  return (
    <DataTable
      columns={ProjectColumns}
      users={users}
      data={recentProjects}
      isAdmin={isAdmin}
      isDashboard={isDashboard}
    />
  );
};

export default Dashboard;
