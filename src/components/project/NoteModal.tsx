import React, { useState, useEffect } from 'react';
import { useProjects } from '../../context/ProjectContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { X } from 'lucide-react';
import { ProjectNote } from '../../types';

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  existingNote?: ProjectNote;
}

export const NoteModal: React.FC<NoteModalProps> = ({ isOpen, onClose, projectId, existingNote }) => {
  const { addNote, updateNote } = useProjects();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (existingNote) {
      setTitle(existingNote.title);
      setContent(existingNote.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [existingNote, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    if (existingNote) {
      updateNote(existingNote.id, { title, content });
    } else {
      addNote({ project_id: projectId, title, content });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[var(--secondary)]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[var(--primary)] border-4 border-[var(--secondary)] w-full max-w-2xl p-8 relative shadow-[8px_8px_0px_0px_var(--secondary)]">
        <button onClick={onClose} className="absolute top-4 right-4 text-[var(--secondary)] hover:opacity-70 transition-opacity">
          <X className="w-6 h-6" />
        </button>
        
        <h2 className="text-4xl font-black uppercase tracking-tighter text-[var(--secondary)] mb-8">
          {existingNote ? 'EDIT NOTE' : 'NEW NOTE'}
        </h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Input 
            label="Title" 
            placeholder="e.g. Server Setup Steps"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
            required
          />
          
          <div className="flex flex-col gap-1 w-full">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--secondary)]">Content</label>
            <textarea
              className="px-3 py-2 bg-[var(--primary)] border-2 border-[var(--secondary)] text-[var(--secondary)] placeholder:text-[var(--secondary)]/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--secondary)] rounded-none w-full min-h-[200px] resize-none"
              placeholder="Detailed notes..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          
          <div className="flex justify-end gap-4 mt-4">
            <Button type="button" variant="ghost" onClick={onClose}>CANCEL</Button>
            <Button type="submit">SAVE</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
