import { UsersColumns } from "@/components/users/UsersColumns";
import { UsersDataTable } from "@/components/users/UsersDataTable";
import { getUsers } from "@/lib/data";

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <section className="py-24">
      <div className="container">
        <h1 className="mb-6 text-3xl font-bold">Team Members</h1>
        <UsersDataTable columns={UsersColumns} data={users} />
      </div>
    </section>
  );
}
