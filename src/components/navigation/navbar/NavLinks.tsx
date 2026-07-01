"use client";

import React from "react";
import { SheetClose } from "@/components/ui/sheet";
import { sidebarNavItems } from "@/constants/navitems";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

const NavLinks = ({ isMobileNav = false }: { isMobileNav?: boolean }) => {
  const pathName = usePathname();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";
  return (
    <>
      {sidebarNavItems.map((item) => {
        if (item.adminOnly && !isAdmin) {
          return null;
        }

        const isActive = (pathName.includes(item.route) && item.route.length > 1) || pathName === item.route;
        let route = item.route;

        if (item.route === "/profile") {
          if (session?.user?.id) route = `${item.route}/${session.user.id}`;
          else return null;
        }

        const LinkComponent = (
          <Link
            href={route}
            key={item.title}
            className={cn(
              isActive ? "primary-gradient text-light-900 rounded-lg" : "text-dark300_light900",
              "background-transparent flex items-center justify-start gap-4 p-4"
            )}
          >
            <Image
              src={item.imgURL}
              alt={item.title}
              width={20}
              height={20}
              className={cn({ "invert-colors": !isActive })}
            />
            <p className={cn(isActive ? "base-bold" : "base-medium", !isMobileNav && "max-lg:hidden")}>{item.title}</p>
          </Link>
        );

        return isMobileNav ? (
          <SheetClose asChild key={item.title}>
            {LinkComponent}
          </SheetClose>
        ) : (
          <React.Fragment key={route}>{LinkComponent}</React.Fragment>
        );
      })}
    </>
  );
};

export default NavLinks;
