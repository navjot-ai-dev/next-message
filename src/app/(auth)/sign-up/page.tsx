"use client";

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
import * as z from 'zod'
import Link from 'next/link'
import { useEffect, useState } from 'react';
import { useDebounceValue } from 'usehooks-ts'
import { toast } from "@/components/ui/toast"
import { useRouter } from 'next/navigation';
import { signUpSchema } from '@/schemas/signUpSchema';
import axios, {AxiosError} from 'axios'
import { ApiResponse } from '@/types/ApiResponse';
import { Field, FieldError, FieldGroup, FieldLabel, } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';


const Page = () => {
  const [username, setusername] = useState('');
  const [usernameMessage, setusernameMessage] = useState('')
  const [isCheckingUsername, setisCheckingUsername] = useState(false)
  const [isSubmitting, setisSubmitting] = useState(false)

  const [debouncedUsername] = useDebounceValue(username, 300)

  const router = useRouter();

  //zod implementation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues:{
      username: '',
      email: '',
      password: '' 
   }
  })

  useEffect(()=>{
    const checkUsernameUnique = async () => {
      if (debouncedUsername) {
        setisCheckingUsername(true)
        setusernameMessage('')
        try {
         const response = await axios.get(`/api/check-username?username=${encodeURIComponent(debouncedUsername)}`);
         
         setusernameMessage(response.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>
          setusernameMessage(
            axiosError.response?.data.message ?? 'Error checking username'
          )
        } finally{
          setisCheckingUsername(false)
        }
      }
    }
    checkUsernameUnique()
  },
    [debouncedUsername]
)

  const onSubmit = async (data: z.infer<typeof signUpSchema>) =>
    {
      setisSubmitting(true)
      try {
        const response = await axios.post('/api/sign-up', data);
        toast.add({
          title: "Account created",
          description: response.data.message
        });
        router.replace(`/verify/${username}`)
        setisSubmitting(false)
      } catch (error) {
        console.error("error in signup of user", error);
       const axiosError = error as AxiosError<ApiResponse>
          
          let errorMessage =  axiosError.response?.data.message 
          toast.add({
            title: "Signup failed",
            type: "error",
            description: errorMessage ?? 'Error signing up', 
          });
          setisSubmitting(false)
          
      }
    }

  return (
    <div className='flex justify-center items-center min-h-screen
    bg-gray-100'>
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className='text-center'>
          <h1 className='text-4xl font-extrabold'>Join Mystery Message</h1>
          <p className='mb-4'>Sign up to start sending anonymous messages </p>
        </div>
 
<form
  onSubmit={form.handleSubmit(onSubmit)}
  className="space-y-5"
>
  <FieldGroup>
    {/* Username */}
   <Controller
  name="username"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={field.name}>
        Username
      </FieldLabel>

      <Input
        {...field}
        id={field.name}
        placeholder="Enter username"
        autoComplete="username"
        spellCheck={false}
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

      

      {!isCheckingUsername && usernameMessage && (
        <p className={`text-sm text-muted-foreground ${usernameMessage === "Username is available" ? 'text-green-700':'text-red-700'}`}>
          {usernameMessage}
        </p>
      )}

      {fieldState.invalid && (
        <FieldError
          errors={[fieldState.error]}
        />
      )}
    </Field>
  )}
/>

    {/* Email */}
    <Controller
      name="email"
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>
            Email
          </FieldLabel>

          <Input
            {...field}
            id={field.name}
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            spellCheck={false}
            aria-invalid={fieldState.invalid}
          />

          {fieldState.invalid && (
            <FieldError
              errors={[fieldState.error]}
            />
          )}
        </Field>
      )}
    />

    {/* Password */}
    <Controller
      name="password"
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>
            Password
          </FieldLabel>

          <Input
            {...field}
            id={field.name}
            type="password"
            placeholder="Enter password"
            autoComplete="new-password"
            aria-invalid={fieldState.invalid}
          />

          {fieldState.invalid && (
            <FieldError
              errors={[fieldState.error]}
            />
          )}
        </Field>
      )}
    />
  </FieldGroup>

  <Button
    type="submit"
    className="w-full"
    disabled={isSubmitting}
  >
    {isSubmitting
      ? (
        <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> please wait
        </>
      )
      : ("Sign Up")
      }
  </Button>
</form>

<p className="mt-6 text-center text-sm text-muted-foreground">
  Already have an account?{" "}
  <Link
    href="/sign-in"
    className="font-medium text-primary hover:underline"
  >
    Sign in
  </Link>
</p>

      </div>
    </div>
  )
}

export default Page