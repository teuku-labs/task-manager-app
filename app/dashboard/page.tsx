import { UserButton } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import { TaskItem } from '@/components/TaskItem';
import prisma from '@/lib/prisma';
import TaskForm from '@/components/TaskForm';
import { Task } from '@prisma/client';

export default async function DashboardPage() {
  const user = await currentUser();

  const tasks = await prisma.task.findMany({
    where: {
      userId: user?.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className='max-w-2xl mx-auto p-4 sm:p-6 lg:p-8'>
      <header className='flex justify-between items-center mb-6'>
        <div>
          <h1 className='text-2xl font-bold text-gray-800'>Welcome, {user?.firstName}</h1>
          <p className='text-gray-500'>Here are your tasks for today.</p>
        </div>
        <UserButton />
      </header>
      <div className='mb-6 flex justify-end'>
        <TaskForm />
      </div>

      <div className='space-y-4'>
        {tasks.map((task: Task) => (
          <TaskItem key={task.id} task={task} />
        ))}
        {tasks.length === 0 && (
          <div className='text-center py-10 bg-white rounded-[20px] shadow-sm'>
            <p className='text-gray-500'>You have no tasks yet. Add one above!</p>
          </div>
        )}
      </div>
    </div>
  );
}