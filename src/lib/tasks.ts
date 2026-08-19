import { Project, ProjectTask } from '../types';

export type TaskUrgency = 'done' | 'overdue' | 'today' | 'upcoming' | 'open';

export const todayIsoDate = (): string => {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
};

export const getTaskUrgency = (task: ProjectTask): TaskUrgency => {
  if (task.done) return 'done';
  if (!task.deadline) return 'open';
  const today = todayIsoDate();
  if (task.deadline < today) return 'overdue';
  if (task.deadline === today) return 'today';
  return 'upcoming';
};

export const formatDeadline = (deadline: string): string => {
  const [year, month, day] = deadline.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString();
};

export const pendingTasks = (tasks: ProjectTask[]): ProjectTask[] =>
  tasks.filter((task) => !task.done);

export const alertTasks = (tasks: ProjectTask[]): ProjectTask[] =>
  pendingTasks(tasks).filter((task) => {
    const urgency = getTaskUrgency(task);
    return urgency === 'overdue' || urgency === 'today';
  });

export const sortTasks = (tasks: ProjectTask[]): ProjectTask[] => {
  const rank = (task: ProjectTask): number => {
    const urgency = getTaskUrgency(task);
    switch (urgency) {
      case 'overdue':
        return 0;
      case 'today':
        return 1;
      case 'upcoming':
        return 2;
      case 'open':
        return 3;
      case 'done':
        return 4;
      default: {
        const _exhaustive: never = urgency;
        return _exhaustive;
      }
    }
  };

  return [...tasks].sort((a, b) => {
    const rankDelta = rank(a) - rank(b);
    if (rankDelta !== 0) return rankDelta;
    return (a.deadline ?? '').localeCompare(b.deadline ?? '');
  });
};

export const taskProjectName = (task: ProjectTask, projects: Project[]): string =>
  projects.find((project) => project.id === task.project_id)?.name ?? 'Project';
