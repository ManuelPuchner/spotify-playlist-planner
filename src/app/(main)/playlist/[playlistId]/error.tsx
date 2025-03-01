'use client' // Error boundaries must be Client Components
 
import Link from 'next/link'
import { useEffect } from 'react'
 
export default function Error({
  error
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])
 
  return (
    <div className='flex justify-center items-center flex-col h-screen'>
      <h2 className='text-3xl font-bold'>Something went wrong!</h2>
      <p className='text-lg text-neutral-200'>
        {error.message}
      </p>
      <Link href="/home" className='underline text-primary-500'>
        Go back to home
      </Link>
    </div>
  )
}