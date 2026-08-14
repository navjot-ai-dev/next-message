"use client";

import { useParams, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from "@/components/ui/toast";
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { verifySchema } from '@/schemas/verifySchema';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Loader2 } from 'lucide-react';

const VerifyAccount = () => {
  const router = useRouter();
  const params = useParams();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post(`/api/verify-code`, {
        username: params.username,
        code: data.verifyCode
      });
      
      toast.add({
        title: "Account Verified! 🎉",
        description: response.data.message || "You can now sign in with your credentials."
      });

      router.replace('/sign-in');
    } catch (error) {
      console.error("Error verifying code", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      
      toast.add({
        title: "Verification Failed",
        type: "error",
        description: errorMessage ?? 'Invalid or expired verification code.',
      });
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-6 bg-background">
      <div className="w-full max-w-md rounded-xl border border-border/80 p-6 sm:p-8 shadow-md bg-card space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-2">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Verify Account
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Enter the 6-digit verification code sent to your registered email.
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FieldGroup>
            <Field data-invalid={!!form.formState.errors.verifyCode}>
              <FieldLabel htmlFor="verifyCode" className="sr-only">
                Verification Code
              </FieldLabel>

              <Input
                {...form.register("verifyCode")}
                id="verifyCode"
                placeholder="123456"
                maxLength={6}
                inputMode="numeric"
                autoComplete="one-time-code"
                className="text-center text-xl sm:text-2xl tracking-[0.4em] font-mono h-12"
              />

              {form.formState.errors.verifyCode && (
                <FieldError errors={[form.formState.errors.verifyCode]} />
              )}
            </Field>
          </FieldGroup>

          <Button
            type="submit"
            className="w-full h-10 font-semibold"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...
              </>
            ) : (
              "Verify Account"
            )}
          </Button>
        </form>

      </div>
    </div>
  );
};

export default VerifyAccount;