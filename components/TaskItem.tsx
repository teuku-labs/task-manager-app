'use client';

import { toast } from 'sonner';
import { toggleTask, deleteTask } from '@/app/dashboard/actions';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Task } from '@/app/generated/prisma';
import TaskForm from './TaskForm';
import { cn } from '@/lib/utils';
import { Trash2 } from 'lucide-react';

type TaskItemProps = {
  task: Task;
};

export function TaskItem({ task }: TaskItemProps) {
  const handleToggle = async () => {
    const result = await toggleTask(task.id, !task.completed);
    if (result?.error) toast.error(result.error);
  };

  const handleDelete = async () => {
    const result = await deleteTask(task.id);
    if (result?.error) toast.error(result.error);
    else toast.success('Task deleted!');
  };

  return (
    <Card className={cn(task.completed ? 'bg-gray-200' : 'bg-white')}>
      <CardHeader className='flex items-center justify-between'>
        <h3 className={cn('flex-grow text-lg', task.completed ? 'line-through text-gray-500' : 'text-gray-800')}>{task.title}</h3>
        <div className='flex items-center gap-2'>
          <Button className={cn('italic font-normal text-sm', task.completed && 'text-green-500')} variant='link' size='sm' onClick={handleToggle}>
            {task.completed ? 'Completed' : 'Mark as Complete'}
          </Button>
          <TaskForm currentTask={task} />
          <Button variant='destructive' size='icon' onClick={handleDelete}>
            <Trash2 />
          </Button>
        </div>
      </CardHeader>
      {task.description && (
        <CardContent>
          <p className={cn('font-light', task.completed ? 'line-through text-gray-500' : 'text-gray-800')}>{task.description}</p>
        </CardContent>
      )}
    </Card>
  );
}
