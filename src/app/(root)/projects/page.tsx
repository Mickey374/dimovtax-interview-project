import { getProjects, getUsers } from "@/lib/data";
// import { columns } from "@/components/projects/ProjectColumns";
import { DataTable } from "@/components/projects/DataTable";
import { auth } from "@/lib/auth";
import { Suspense } from "react";
import TableSkeleton from "@/components/projects/TableSkeleton";
import { ProjectColumns } from "@/components/projects/ProjectColumns";

const ProjectsPage = () => {
  return (
    <section className="p-6 sm:p-8">
      <div className="mb-6 flex items-center">
        <h1 className="h1-bold">All Projects</h1>
      </div>
      <Suspense fallback={<TableSkeleton />}>
        <DataTableWrapper />
      </Suspense>
    </section>
  );
};

// I created a new component to fetch data and render the table.
// This is necessary to make Suspense work with async data fetching in Server Components.
const DataTableWrapper = async () => {
  const session = await auth();
  const projects = await getProjects();
  const isAdmin = session?.user?.role === "ADMIN";
  const users = isAdmin ? await getUsers() : [];

  return <DataTable users={users} columns={ProjectColumns} data={projects} isAdmin={isAdmin} isDashboard={false} />;
};

export default ProjectsPage;
