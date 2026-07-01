"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/route";

type SignOutButtonProps = {
  className?: string;
  showIcon?: boolean;
  label?: string;
};

const SignOutButton = ({ className, showIcon = true, label = "Sign Out" }: SignOutButtonProps) => {
  return (
    <Button
      type="button"
      variant="ghost"
      className={className}
      onClick={() => signOut({ callbackUrl: ROUTES.SIGN_IN })}
    >
      {showIcon && <LogOut className="mr-2 h-4 w-4" />}
      {label}
    </Button>
  );
};

export default SignOutButton;