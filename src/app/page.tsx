import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import Link from 'next/link'
import { useState } from 'react';
import { useDebounceValue } from 'usehooks-ts'

const page = () => {
  const [username, setusername] = useState('');
  const [usernameMessage, setusernameMessage] = useState('')
  const [isCheckingUsername, setisCheckingUsername] = useState(false)
  const [isSubmitting, setisSubmitting] = useState(false)

  const debouncedUsername = useDebounceValue(username , 300)
  return (
    <div></div>
  )
}

export default page