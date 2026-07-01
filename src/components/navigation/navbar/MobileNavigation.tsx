"use client";

import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";
import Link from "next/link";
import NavLinks from "./NavLinks";
import SignOutButton from "../SignOutButton";
const MobileNavigation = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Image src="/icons/hamburger.svg" alt="Menu" height={36} width={36} className="invert-colors sm:hidden" />
      </SheetTrigger>
      <SheetContent side="left" className="background-light900_dark200 border-none">
        <SheetHeader>
          <SheetTitle className="hidden">Nav</SheetTitle>
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/site-logo.svg" width={23} height={23} alt="Dimovtax Logo" />

            <p className="h2-bold font-space-grotesk text-dark-100 dark:text-light-900">
              Dimov<span className="text-primary-500 uppercase">Tax</span>
            </p>
          </Link>

          <div className="no-scrollbar flex-h-[calc(100vh-80px)] flex-col justify-between overflow-y-auto py-5">
            <SheetClose asChild>
              <section className="flex h-full flex-col gap-6 pt-16">
                <NavLinks isMobileNav />
              </section>
            </SheetClose>

            <div className="flex flex-col gap-3">
              <SheetClose asChild>
                <SignOutButton className="small-medium btn-secondary min-h-10.25 w-full rounded-lg px-4 py-3 shadow-none" />
              </SheetClose>
            </div>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavigation;
