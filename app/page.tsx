import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen text-center p-4'>
      <h1 className='text-4xl md:text-5xl font-bold mb-4'>Welcome to Task Manager</h1>
      <p className='text-lg md:text-xl text-gray-600 mb-8 max-w-2xl'>The simple, elegant way to keep track of your daily tasks. Let&apos;s get started!</p>
      <div className='flex gap-4'>
        <Button asChild>
          <Link href='/sign-up'>Get Started</Link>
        </Button>
        <Button asChild variant='outline'>
          <Link href='/sign-in'>Sign In</Link>
        </Button>
      </div>
    </div>
  );
}