"use client";

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import Link from 'next/link'
import { useEffect, useState } from 'react';
import { useDebounceValue } from 'usehooks-ts'
import { toast } from "@/components/ui/toast"
import { useRouter } from 'next/navigation';
import { signUpSchema } from '@/schemas/signUpSchema';
import axios, {AxiosError} from 'axios'
import { ApiResponse } from '@/types/ApiResponse';

const page = () => {
  const [username, setusername] = useState('');
  const [usernameMessage, setusernameMessage] = useState('')
  const [isCheckingUsername, setisCheckingUsername] = useState(false)
  const [isSubmitting, setisSubmitting] = useState(false)

  const debouncedUsername = useDebounceValue(username , 300)

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
         const response = await axios.get(`/api/check-username?username=${debouncedUsername}`);
         
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
        
      </div>
    </div>
  )
}

export default page