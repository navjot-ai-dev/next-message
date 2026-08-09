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

const page = () => {
  const [username, setusername] = useState('');
  const [usernameMessage, setusernameMessage] = useState('')
  const [isCheckingUsername, setisCheckingUsername] = useState(false)
  const [isSubmitting, setisSubmitting] = useState(false)

  const debouncedUsername = useDebounceValue(username , 300)
 const Toast = toast.add({
            title: "Event created",
            description: "Sunday, December 3 at 9:00 AM",
       });
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
         console.log(response)
         setusernameMessage(response.data.message)
        } catch (error) {
          
        }
      }
    }
  },
[debouncedUsername]
)

  return (
    <div></div>
  )
}

export default page