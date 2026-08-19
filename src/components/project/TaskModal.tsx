import React, { useState, useEffect } from 'react';
import { useProjects } from '../../context/ProjectContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { X } from 'lucide-react';
import { ProjectTask } from '../../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  existingTask?: ProjectTask;
}

export const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, projectId, existingTask }) => {
  const { addTask, updateTask } = useProjects();
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState('');

  useEffect(() => {
    if (existingTask) {
      setTitle(existingTask.title);
      setDeadline(existingTask.deadline ?? '');
    } else {
      setTitle('');
      setDeadline('');
    }
  }, [existingTask, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const nextDeadline = deadline.trim() || undefined;

    if (existingTask) {
      updateTask(existingTask.id, { title, deadline: nextDeadline });
    } else {
      addTask({ project_id: projectId, title, done: false, deadline: nextDeadline });
    }
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-panel max-w-lg">
        <button onClick={onClose} className="absolute top-5 right-5 text-[var(--muted)] hover:text-[var(--secondary)] transition-colors">
          <X className="w-6 h-6" />
        </button>
        
        <h2 className="text-3xl font-extrabold tracking-tight text-[var(--secondary)] mb-8">
          {existingTask ? 'Edit task' : 'New task'}
        </h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input 
            label="Title" 
            placeholder="e.g. Ship landing page"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
            required
          />
          <Input 
            label="Deadline" 
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
          
          <div className="flex justify-end gap-3 mt-2">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
