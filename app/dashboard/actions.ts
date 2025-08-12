'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { TaskForm } from '../types/task';

export async function addTask(taskForm: TaskForm) {
  const { userId } = await auth();
  if (!userId) {
    return { error: 'Not authenticated' };
  }

  // Just-in-time user creation in our DB
  // This ensures a user record exists before creating a task.
  await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: { id: userId },
  });

  if (!taskForm.title || taskForm.title.trim().length === 0) {
    return { error: 'Title is required' };
  }

  try {
    await prisma.task.create({
      data: {
        userId: userId,
        title: taskForm.title,
        description: taskForm.description
      },
    });
    revalidatePath('/dashboard');
    return { success: 'Task added' };
  } catch (e) {
    return { error: 'Failed to create task' };
  }
}

export async function editTask(id: string, taskForm: TaskForm) {
  const { userId } = await auth();
  if (!userId) {
    return { error: 'Not authenticated' };
  }

  if (!taskForm.title || taskForm.title.trim().length === 0) {
    return { error: 'Title cannot be empty' };
  }

  try {
    const task = await prisma.task.findFirst({ where: { id, userId } });
    if (!task) {
      return { error: 'Task not found or you do not have permission to edit it.' };
    }

    await prisma.task.update({
      where: { id },
      data: { title: taskForm.title, description: taskForm.description },
    });
    revalidatePath('/dashboard');
    return { success: 'Task updated' };
  } catch (e) {
    return { error: 'Failed to update task' };
  }
}

export async function toggleTask(id: string, completed: boolean) {
  const { userId } = await auth();
  if (!userId) {
    return { error: 'Not authenticated' };
  }

  try {
    const task = await prisma.task.findFirst({ where: { id, userId } });
    if (!task) {
      return { error: 'Task not found or you do not have permission to edit it.' };
    }

    await prisma.task.update({
      where: { id },
      data: { completed },
    });
    revalidatePath('/dashboard');
    return { success: 'Task status updated' };
  } catch (e) {
    return { error: 'Failed to update task status' };
  }
}

export async function deleteTask(id: string) {
  const { userId } = await auth();
  if (!userId) {
    return { error: 'Not authenticated' };
  }

  try {
    const task = await prisma.task.findFirst({ where: { id, userId } });
    if (!task) {
      return { error: 'Task not found or you do not have permission to delete it.' };
    }

    await prisma.task.delete({
      where: { id },
    });
    revalidatePath('/dashboard');
    return { success: 'Task deleted' };
  } catch (e) {
    return { error: 'Failed to delete task' };
  }
}