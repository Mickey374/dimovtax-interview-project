"use client";

import AuthForm from "@/components/forms/AuthForm";
import { SignInSchema } from "@/lib/validations";

const SignIn = () => {
  return (
    <AuthForm
      formType="SIGN_IN"
      schema={SignInSchema}
      defaultValues={{ email: "", password: "" }}
      onSubmit={(data: { email: string; password: string }) => Promise.resolve({ success: true, data })}
    />
  );
};

export default SignIn;
