"use client";

import { useParams, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from "@/components/ui/toast";
import { useForm } from 'react-hook-form';
import * as z from 'zod'
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



const VerifyAccount = () => {
    const router = useRouter()
    const params = useParams()
    
     const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema), 
   }
)

  const onSubmit = async (data:z.infer<typeof verifySchema> ) => 
    {

        try {
           const response = await axios.post(`/api/verify-code`,{
                username: params.username,
                code: data.verifyCode
            } )
              toast.add({
          title: "Success",
          description:  response.data.message
        });

        router.replace('/sign-in')

        } catch (error) {
            console.error("error in signup of user", error);
       const axiosError = error as AxiosError<ApiResponse>
          
          let errorMessage =  axiosError.response?.data.message 
          toast.add({
            title: "Signup failed",
            type: "error",
            description: errorMessage ?? 'Error signing up',
            
           
          });
         
        }

  }

  return (
      <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border p-6 shadow-lg">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">
            Verify Account
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Enter the verification code sent to your email.
          </p>
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <FieldGroup>
            <Field
              data-invalid={
                !!form.formState.errors.verifyCode
              }
            >
              <FieldLabel htmlFor="verifyCode">
                Verification Code
              </FieldLabel>

              <Input
                {...form.register("verifyCode")}
                id="verifyCode"
                placeholder="123456"
                maxLength={6}
                inputMode="numeric"
                autoComplete="one-time-code"
                className="text-center text-xl tracking-[0.5em]"
              />

              {form.formState.errors.verifyCode && (
                <FieldError
                  errors={[
                    form.formState.errors.verifyCode,
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
              ? "Verifying..."
              : "Verify Account"}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default VerifyAccount