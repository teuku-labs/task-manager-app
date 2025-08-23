'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Task } from '@prisma/client';
import { toast } from 'sonner';
import { addTask, editTask } from '@/app/dashboard/actions';
import { TaskForm } from '@/app/types/task';
import { Edit, Loader2 } from 'lucide-react';
import { Textarea } from './ui/textarea';

interface Props {
  currentTask?: Task;
}

export default function TaskFormComponent({ currentTask }: Props) {
  const isEdit = currentTask ? true : false;
  const initData: TaskForm = {
    title: currentTask?.title ?? '',
    description: currentTask?.description ?? '',
  };
  const [taskForm, setTaskForm] = useState(initData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    if (isEdit && currentTask) {
      // Edit task
      const result = await editTask(currentTask.id, taskForm);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success('Task updated!');
        setIsDialogOpen(false);
      }
    } else {
      // Add task
      const result = await addTask(taskForm);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success('Task added successfully!');
        setTaskForm(initData);
        setIsDialogOpen(false);
      }
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant={isEdit ? 'outline' : 'link'} size={isEdit ? 'icon' : 'sm'}>
          {isEdit ? <Edit /> : 'Add Task'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit' : 'Add'} Task</DialogTitle>
        </DialogHeader>
        <div className='grid gap-3'>
          <Label htmlFor='title'>
            Task Title <span className='text-red-400'>*</span>
          </Label>
          <Input id='title' value={taskForm.title} onChange={(e) => setTaskForm((currTaskFrom) => ({ ...currTaskFrom, title: e.target.value }))} />
        </div>
        <div className='grid gap-3'>
          <Label htmlFor='title'>Task Description</Label>
          <Textarea id='description' value={taskForm.description} onChange={(e) => setTaskForm((currTaskFrom) => ({ ...currTaskFrom, description: e.target.value }))} />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading && <Loader2 className='animate-spin' />} {isEdit ? 'Save Changes' : 'Add Task'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
