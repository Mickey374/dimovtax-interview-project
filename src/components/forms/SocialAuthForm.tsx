"use client";
import Image from "next/image";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import ROUTES from "@/constants/route";

const SocialAuthForm = () => {
  const handleSignInWithGoogle = async (provider: "google" | "facebook") => {
    try {
      await signIn(provider, { callbackUrl: ROUTES.HOME, redirect: false });
    } catch (error) {
      console.log(error);
      toast.error("Sign in with Google failed", {
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        position: "top-center",
      });
    }
  };
  return (
    <div className="mt-10 flex flex-wrap gap-2.5">
      <Button
        className="background-dark400_light900 body-medium text-dark200_light800 rounded-2 min-h-12 flex-1 px-4 py-3.5 hover:cursor-pointer"
        onClick={() => handleSignInWithGoogle("google")}
      >
        <Image src="icons/google.svg" alt="Google Logo" width={20} height={20} className="mr-2.5 object-contain" />
        <span>Continue with Google</span>
      </Button>
    </div>
  );
};

export default SocialAuthForm;
