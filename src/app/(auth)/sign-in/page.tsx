
"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios, { AxiosError } from "axios";

import { signInSchema } from "@/schemas/signInSchema";
import { ApiResponse } from "@/types/ApiResponse";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SignInPage = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    try {
      const response = await axios.post<ApiResponse>(
        "/api/sign-in",
        data
      );

      console.log(response.data);

      router.replace("/");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      console.error(
        axiosError.response?.data.message ||
          "Error signing in"
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border bg-background p-6 shadow-lg">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold">
            Welcome Back
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to your account
          </p>
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <FieldGroup>
            {/* Username / Email */}
            <Field
              data-invalid={
                !!form.formState.errors.email
              }
            >
              <FieldLabel htmlFor="identifier">
                Username or Email
              </FieldLabel>

              <Input
                {...form.register("email")}
                id="identifier"
                placeholder="Enter username or email"
                autoComplete="username"
              />

              {form.formState.errors.email && (
                <FieldError
                  errors={[
                    form.formState.errors.email,
                  ]}
                />
              )}
            </Field>

            {/* Password */}
            <Field
              data-invalid={
                !!form.formState.errors.password
              }
            >
              <FieldLabel htmlFor="password">
                Password
              </FieldLabel>

              <Input
                {...form.register("password")}
                id="password"
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
              />

              {form.formState.errors.password && (
                <FieldError
                  errors={[
                    form.formState.errors.password,
                  ]}
                />
              )}
            </Field>
          </FieldGroup>

          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting
              ? "Signing in..."
              : "Sign In"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/sign-up")}
            className="font-medium text-primary hover:underline"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
