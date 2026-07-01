import { getProjects } from "@/lib/data";
import { columns } from "@/components/projects/Columns";
import { DataTable } from "@/components/projects/DataTable";
import { auth } from "@/lib/auth";
import { Suspense } from "react";
import TableSkeleton from "@/components/projects/TableSkeleton";
import { Button } from "@/components/ui/button";

const ProjectsPage = () => {
  return (
    <section className="p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="h1-bold">All Projects</h1>
        <Button>Add Project</Button>
      </div>
      <Suspense fallback={<TableSkeleton />}>
        <DataTableWrapper />
      </Suspense>
    </section>
  );
};

// We create a new component to fetch data and render the table.
// This is necessary to make Suspense work with async data fetching in Server Components.
const DataTableWrapper = async () => {
  const session = await auth();
  const projects = await getProjects();
  const isAdmin = session?.user?.role === "ADMIN";

  return <DataTable columns={columns} data={projects} isAdmin={isAdmin} isDashboard={false} />;
};

export default ProjectsPage;
