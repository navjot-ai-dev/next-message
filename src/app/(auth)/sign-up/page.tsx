"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDebounceValue } from 'usehooks-ts';
import { toast } from "@/components/ui/toast";
import { useRouter } from 'next/navigation';
import { signUpSchema } from '@/schemas/signUpSchema';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, UserPlus, CheckCircle2, XCircle } from 'lucide-react';

const Page = () => {
  const [username, setusername] = useState('');
  const [usernameMessage, setusernameMessage] = useState('');
  const [isCheckingUsername, setisCheckingUsername] = useState(false);
  const [isSubmitting, setisSubmitting] = useState(false);

  const [debouncedUsername] = useDebounceValue(username, 300);
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: ''
    }
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (debouncedUsername) {
        setisCheckingUsername(true);
        setusernameMessage('');
        try {
          const response = await axios.get(`/api/check-username?username=${encodeURIComponent(debouncedUsername)}`);
          setusernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setusernameMessage(
            axiosError.response?.data.message ?? 'Error checking username'
          );
        } finally {
          setisCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [debouncedUsername]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setisSubmitting(true);
    try {
      const response = await axios.post('/api/sign-up', data);
      toast.add({
        title: "Account Created! 🎉",
        description: response.data.message
      });
      router.replace(`/verify/${username}`);
    } catch (error) {
      console.error("Error in signup of user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast.add({
        title: "Signup Failed",
        type: "error",
        description: errorMessage ?? 'Error signing up. Please try again.',
      });
    } finally {
      setisSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex justify-center items-center p-4 sm:p-6 bg-background">
      <div className="w-full max-w-md p-6 sm:p-8 space-y-6 bg-card rounded-xl border border-border/80 shadow-md">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-2">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Join Mystery Message</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Create an account to start receiving secret feedback
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            {/* Username Field */}
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Username</FieldLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      id={field.name}
                      placeholder="johndoe"
                      autoComplete="username"
                      spellCheck={false}
                      className="h-10 pr-9"
                      onChange={(event) => {
                        const value = event.target.value;
                        field.onChange(event);
                        setusername(value);

                        if (value.trim()) {
                          setisCheckingUsername(true);
                          setusernameMessage("");
                        } else {
                          setisCheckingUsername(false);
                          setusernameMessage("");
                        }
                      }}
                    />
                    {isCheckingUsername && (
                      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground absolute right-3 top-3" />
                    )}
                  </div>

                  {!isCheckingUsername && usernameMessage && (
                    <div className="flex items-center gap-1.5 mt-1.5">
                      {usernameMessage === "Username is available" ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                          <span className="text-xs font-medium text-green-600">Username is available</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5 text-destructive" />
                          <span className="text-xs font-medium text-destructive">{usernameMessage}</span>
                        </>
                      )}
                    </div>
                  )}

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Email Field */}
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Email Address</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    spellCheck={false}
                    aria-invalid={fieldState.invalid}
                    className="h-10"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
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
                    placeholder="Create a strong password"
                    autoComplete="new-password"
                    aria-invalid={fieldState.invalid}
                    className="h-10"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <Button
            type="submit"
            className="w-full h-10 gap-2 font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Sign Up</span>
            )}
          </Button>
        </form>

        <div className="pt-2 text-center text-xs sm:text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-semibold text-primary hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;