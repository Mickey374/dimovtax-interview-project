import Image from "next/image";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <nav className="flex-between background-light900_dark200 shadow-light-300 fixed z-50 w-full gap-5 p-6 sm:px-12 dark:shadow-none">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/images/site-logo.svg" alt="Dimovtax Logo" width={23} height={23} className="object-contain" />

        <p className="h2-bold font-space-grotesk text-dark-100 dark:text-light-900 max-sm:hidden">
          Dimov<span className="text-primary-500 uppercase">Tax</span>
        </p>
      </Link>

      <p>Global Search here...</p>

      <div className="flex-between gap-2">
        <p>Theme icon</p>
        <p>Profile icon</p>
      </div>
    </nav>
  );
};

export default Navbar;
