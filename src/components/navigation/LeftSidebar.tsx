"use client";

import Link from "next/link";
import NavLinks from "./navbar/NavLinks";
import ROUTES from "@/constants/route";
import { Button } from "../ui/button";
import Image from "next/image";

const LeftSidebar = () => {
  return (
    <section className="custom-scrollbar background-light900_dark200 light-border shadow-light-300 sticky top-0 flex h-screen flex-col justify-between overflow-y-auto border-r p-6 pt-36 max-sm:hidden lg:w-66.5 dark:shadow-none">
      <div className="flex flex-1 flex-col gap-6">
        <NavLinks />
      </div>

      <div className="flex flex-col gap-3 p-6">
        <Button className="small-medium btn-secondary min-h-10.25 w-full rounded-lg px-4 py-3 shadow-none" asChild>
          <Link href={ROUTES.SIGN_OUT} className="flex items-center justify-center">
            <Image
              src="/icons/exit.svg"
              alt="Sign out"
              width={20}
              height={20}
              className="invert-colors mr-2.5 object-contain"
            />
            <span className="primary-text-gradient text-dark400_light900 px-4 py-3 max-lg:hidden">Sign Out</span>
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default LeftSidebar;
