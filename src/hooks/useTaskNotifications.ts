import { useEffect } from 'react';
import { Project, ProjectTask } from '../types';
import { alertTasks, getTaskUrgency, taskProjectName } from '../lib/tasks';

const STORAGE_KEY = 'stash_task_notices';

type NoticeLog = Record<string, string>;

const readLog = (): NoticeLog => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) as NoticeLog : {};
  } catch {
    return {};
  }
};

const writeLog = (log: NoticeLog) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(log));
};

const noticeKey = (task: ProjectTask): string =>
  `${task.id}:${getTaskUrgency(task)}`;

const sendNotice = (title: string, body: string) => {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  new Notification(title, { body, silent: false });
};

export const useTaskNotifications = (tasks: ProjectTask[], projects: Project[]) => {
  useEffect(() => {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'default') {
      void Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const notifyDue = () => {
      const log = readLog();
      let logChanged = false;
      for (const task of tasks) {
        if (task.done && log[task.id]) {
          delete log[task.id];
          logChanged = true;
        }
      }

      const due = alertTasks(tasks);
      const fresh = due.filter((task) => log[task.id] !== noticeKey(task));

      if (fresh.length > 0) {
        const overdue = fresh.filter((task) => getTaskUrgency(task) === 'overdue');
        const today = fresh.filter((task) => getTaskUrgency(task) === 'today');

        if (fresh.length === 1) {
          const task = fresh[0];
          const urgency = getTaskUrgency(task);
          sendNotice(
            urgency === 'overdue' ? 'Overdue task' : 'Task due today',
            `${task.title} · ${taskProjectName(task, projects)}`,
          );
        } else {
          const parts: string[] = [];
          if (overdue.length > 0) parts.push(`${overdue.length} overdue`);
          if (today.length > 0) parts.push(`${today.length} due today`);
          sendNotice('Pending tasks', parts.join(', '));
        }

        for (const task of fresh) {
          log[task.id] = noticeKey(task);
        }
        logChanged = true;
      }

      if (logChanged) writeLog(log);
    };

    const timeout = window.setTimeout(notifyDue, 800);
    const interval = window.setInterval(notifyDue, 60_000);
    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, [tasks, projects]);
};
