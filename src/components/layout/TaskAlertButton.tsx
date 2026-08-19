import React, { useEffect, useRef, useState } from 'react';
import { Bell } from 'lucide-react';
import { useProjects } from '../../context/ProjectContext';
import { alertTasks, formatDeadline, getTaskUrgency, sortTasks, taskProjectName } from '../../lib/tasks';

interface TaskAlertButtonProps {
  onOpenProject: (projectId: string) => void;
}

export const TaskAlertButton: React.FC<TaskAlertButtonProps> = ({ onOpenProject }) => {
  const { tasks, projects } = useProjects();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const alerts = sortTasks(alertTasks(tasks));
  const count = alerts.length;

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="relative h-10 w-10 flex items-center justify-center text-[var(--nav-fg)] rounded-full hover:bg-[color-mix(in_srgb,var(--nav-fg)_8%,transparent)]"
        aria-label="Task notifications"
        aria-expanded={open}
      >
        <Bell className="w-4 h-4" />
        {count > 0 && (
          <span className="absolute top-1.5 right-1.5 min-w-4 h-4 px-1 rounded-full bg-[var(--nav-fg)] text-[var(--nav-fill)] text-[10px] font-bold leading-4">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 max-w-[calc(100vw-2rem)] nav-panel z-30">
          <p className="text-xs font-semibold text-[var(--nav-muted)] mb-3">Pending tasks</p>
          {alerts.length === 0 ? (
            <p className="text-sm text-[var(--nav-muted)]">No overdue or due-today tasks.</p>
          ) : (
            <div className="flex flex-col gap-2 max-h-72 overflow-y-auto custom-scrollbar">
              {alerts.map((task) => {
                const urgency = getTaskUrgency(task);
                return (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => {
                      onOpenProject(task.project_id);
                      setOpen(false);
                    }}
                    className="text-left rounded-2xl px-3 py-2 hover:bg-[color-mix(in_srgb,var(--nav-fg)_8%,transparent)]"
                  >
                    <p className="text-sm font-semibold truncate">{task.title}</p>
                    <p className="text-xs text-[var(--nav-muted)] truncate">
                      {taskProjectName(task, projects)}
                      {task.deadline ? ` · ${urgency === 'overdue' ? 'Overdue' : 'Due today'} ${formatDeadline(task.deadline)}` : ''}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
