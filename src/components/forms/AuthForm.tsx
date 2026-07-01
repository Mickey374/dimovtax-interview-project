"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, DefaultValues, FieldValues, Path, useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import Link from "next/link";
import ROUTES from "@/constants/route";

interface AuthFormProps<T extends FieldValues> {
  schema: Parameters<typeof zodResolver>[0];
  formType: "SIGN_IN" | "SIGN_UP";
  defaultValues: T;
  onSubmit: (data: T) => Promise<{ success: boolean; data?: T; error?: string }>;
}

const AuthForm = <T extends FieldValues>({ formType, schema, defaultValues, onSubmit }: AuthFormProps<T>) => {
  const form = useForm<T>({
    resolver: zodResolver(schema) as unknown as Resolver<T, undefined, T>,
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const buttonText = formType === "SIGN_IN" ? "Sign In" : "Sign Up";

  return (
    <>
      <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)} className="mt-10 space-y-6">
        {Object.keys(defaultValues as Record<string, unknown>).map((field) => (
          <FieldGroup key={field} className="flex w-full flex-col gap-2">
            <FieldSet>
              <Controller
                name={field as Path<T>}
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-demo-title" className="paragraph-medium text-dark400_light700">
                      {field.name === "email"
                        ? "Email Address"
                        : field.name.charAt(0).toUpperCase() + field.name.slice(1)}
                    </FieldLabel>
                    <Input
                      required
                      type={field.name === "password" ? "password" : "text"}
                      id="form-rhf-demo-title"
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                      {...field}
                      className="paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 no-focus rounded-1.5 min-h-12 border"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldSet>
          </FieldGroup>
        ))}

        <Field orientation="horizontal">
          <Button
            form="form-rhf-demo"
            className="primary-gradient paragraph-medium rounded-2 font-inter text-light-900! min-h-12 w-full px-4 py-3 hover:cursor-pointer"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (buttonText === "Sign In" ? "Signing In..." : "Signing Up...") : buttonText}
          </Button>
        </Field>

        {formType === "SIGN_IN" ? (
          <p className="paragraph-regular text-dark400_light700">
            Don&lsquo;t have an account?{" "}
            <Link href={ROUTES.SIGN_UP} className="paragraph-semibold primary-text-gradient hover:underline">
              Sign Up
            </Link>
          </p>
        ) : (
          <p className="paragraph-regular text-dark400_light700">
            Already have an account?{" "}
            <Link href={ROUTES.SIGN_IN} className="paragraph-semibold primary-text-gradient hover:underline">
              Sign In
            </Link>
          </p>
        )}
      </form>
    </>
  );
};

export default AuthForm;
