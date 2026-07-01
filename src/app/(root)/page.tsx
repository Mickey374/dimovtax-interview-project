import BudgetChart from "@/components/dashboard/BudgetChart";
import StatusChart from "@/components/dashboard/StatusChart";
import TeamChart from "@/components/dashboard/TeamChart";
import { getProjects } from "@/lib/data";

const Dashboard = async () => {
  const projects = await getProjects();
  console.log("Projects:", projects);

  return (
    <div>
      <h1 className="h1-bold">Dashboard</h1>
      <div className="rounded-2 border-light-200_light700 bg-light-100_dark800 border-0.5 mt-4 flex w-full flex-col justify-between gap-8 p-6 md:flex-row">
        <StatusChart projects={projects} />
        <BudgetChart projects={projects} />
        <TeamChart projects={projects} />
      </div>
    </div>
  );
};

export default Dashboard;
