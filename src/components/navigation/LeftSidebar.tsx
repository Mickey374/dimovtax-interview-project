"use client";

import NavLinks from "./navbar/NavLinks";
import SignOutButton from "./SignOutButton";

const LeftSidebar = () => {
  return (
    <section className="custom-scrollbar background-light900_dark200 light-border shadow-light-300 sticky top-0 flex h-screen flex-col justify-between overflow-y-auto border-r p-6 pt-36 max-sm:hidden lg:w-66.5 dark:shadow-none">
      <div className="flex flex-1 flex-col gap-6">
        <NavLinks />
      </div>

      <div className="flex flex-col gap-3 p-6">
        <SignOutButton className="small-medium btn-secondary min-h-10.25 w-full rounded-lg px-4 py-3 shadow-none" />
      </div>
    </section>
  );
};

export default LeftSidebar;
