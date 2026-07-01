"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import AuthForm from "@/components/forms/AuthForm";
import { SignInSchema, TSignInSchema } from "@/lib/validations";
import ROUTES from "@/constants/route";

const SignIn = () => {
  const router = useRouter();

  const handleSignIn = async (data: TSignInSchema) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        toast.error("Sign in failed. Please check your credentials.");
        return { success: false, error: result.error };
      }

      if (result?.ok) {
        toast.success("Signed in successfully!");
        router.push(ROUTES.HOME);
        return { success: true, data };
      }

      return { success: false, error: "Unable to sign in." };
    } catch (error) {
      toast.error("Sign in failed. Please try again.");
      return {
        success: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred.",
      };
    }
  };

  return (
    <AuthForm
      formType="SIGN_IN"
      schema={SignInSchema}
      defaultValues={{ email: "", password: "" }}
      onSubmit={handleSignIn}
    />
  );
};

export default SignIn;
