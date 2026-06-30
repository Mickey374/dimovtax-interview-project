import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/route";
import { auth, signOut } from "@/lib/auth";

const Dashboard = async () => {
  const session = await auth();

  console.log("Session in dashboard page:", session);
  return (
    <div>
      <h1 className="h1-bold">Hello Home Page</h1>

      <form
        className="mt-10 px-10 pt-25"
        action={async () => {
          "use server";

          await signOut({
            redirectTo: ROUTES.SIGN_IN,
          });
        }}
      >
        <Button type="submit">Logout</Button>
      </form>
    </div>
  );
};

export default Dashboard;
