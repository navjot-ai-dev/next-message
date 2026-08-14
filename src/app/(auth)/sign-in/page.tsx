"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, LogIn, KeyRound } from "lucide-react";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";

const Page = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      });

      if (result?.error) {
        toast.add({
          title: "Login Failed",
          type: "error",
          description:
            result.error === "CredentialsSignin"
              ? "Incorrect email or password"
              : "An unexpected error occurred. Please check your details.",
        });
      }

      if (result?.ok) {
        toast.add({
          title: "Welcome Back! 👋",
          description: "Signed in successfully.",
        });
        router.replace("/dashboard");
        router.refresh();
      }
    } catch (error) {
      toast.add({
        title: "Error",
        type: "error",
        description: "An unexpected error occurred. Please try again.",
      });
    }
  };

  return (
    <div className="flex-1 flex justify-center items-center p-4 sm:p-6 bg-background">
      <div className="w-full max-w-md p-6 sm:p-8 space-y-6 bg-card rounded-xl border border-border/80 shadow-md">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-2">
            <LogIn className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Welcome Back</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Sign in to access your anonymous messages dashboard
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            {/* Identifier Field */}
            <Controller
              name="identifier"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Email or Username</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="text"
                    placeholder="you@example.com or username"
                    spellCheck={false}
                    autoComplete="email"
                    aria-invalid={fieldState.invalid}
                    className="h-10"
                  />
                  {fieldState.invalid && (
                    <FieldError>{fieldState.error?.message}</FieldError>
                  )}
                </Field>
              )}
            />

            {/* Password Field */}
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    aria-invalid={fieldState.invalid}
                    className="h-10"
                  />
                  {fieldState.invalid && (
                    <FieldError>{fieldState.error?.message}</FieldError>
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <Button type="submit" className="w-full h-10 gap-2 font-semibold" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <KeyRound className="h-4 w-4" />
                <span>Sign In</span>
              </>
            )}
          </Button>
        </form>

        <div className="pt-2 text-center text-xs sm:text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link
            href="/sign-up"
            className="font-semibold text-primary hover:underline"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;