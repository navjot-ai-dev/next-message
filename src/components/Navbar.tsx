'use client'

import React from 'react'
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from "@/components/ui/button";

const Navbar = () => {
   
  const {data: session} = useSession();

  const user: User = session?.user

  return (
    <nav className='p-3  md:p-5 shadow-md'>
     <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
       <Link className='text-2xl font-extrabold mb-4 md:mb-0' href='#'>Mystry Message</Link>

      {
        session ? (
          <>
            <span className='mr-4 font-bold text-lg '>Welcome, {user?.username || user?.email}</span>
            <Button className="w-full mr-5 p-4 md:w-auto " onClick={() => signOut()}>logOut</Button>
          </>
        ) : (
          <Link href='/sign-in'><Button className="w-full mr-5 p-4 md:w-auto">Login</Button></Link>
        )
      }
        
     </div>
      
    </nav>
  )

}
export default Navbar