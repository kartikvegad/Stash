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
    <div className="modal-overlay">
      <div className="modal-panel max-w-2xl">
        <button onClick={onClose} className="absolute top-5 right-5 text-[var(--muted)] hover:text-[var(--secondary)] transition-colors">
          <X className="w-6 h-6" />
        </button>
        
        <h2 className="text-3xl font-extrabold tracking-tight text-[var(--secondary)] mb-8">
          {existingNote ? 'Edit note' : 'New note'}
        </h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input 
            label="Title" 
            placeholder="e.g. Server Setup Steps"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
            required
          />
          
          <div className="flex flex-col gap-1.5 w-full">
            <label className="ui-label">Content</label>
            <textarea
              className="ui-textarea min-h-[200px]"
              placeholder="Detailed notes..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          
          <div className="flex justify-end gap-3 mt-2">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
