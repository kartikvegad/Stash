import React, { useState, useEffect } from 'react';
import { useProjects } from '../../context/ProjectContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { X } from 'lucide-react';
import { ProjectDocument } from '../../types';

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  existingDocument?: ProjectDocument;
}

export const DocumentModal: React.FC<DocumentModalProps> = ({ isOpen, onClose, projectId, existingDocument }) => {
  const { addDocument, updateDocument } = useProjects();
  const [name, setName] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (existingDocument) {
      setName(existingDocument.name);
      setContent(existingDocument.content);
    } else {
      setName('');
      setContent('');
    }
  }, [existingDocument, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (existingDocument) {
      updateDocument(existingDocument.id, { name, content });
    } else {
      addDocument({ project_id: projectId, name, content });
    }
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-panel max-w-5xl h-[90vh] flex flex-col p-0 overflow-hidden">
        <div className="flex justify-between items-center p-6">
          <h2 className="text-3xl font-extrabold tracking-tight text-[var(--secondary)]">
            {existingDocument ? 'Edit document' : 'New document'}
          </h2>
          <button onClick={onClose} className="text-[var(--muted)] hover:text-[var(--secondary)] transition-colors">
            <X className="w-7 h-7" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col flex-grow px-6 pb-6 overflow-hidden gap-5">
          <Input 
            label="Document name" 
            placeholder="e.g. README.md"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            required
          />
          
          <div className="flex flex-col flex-grow gap-1.5">
            <label className="ui-label">
              Markdown content
            </label>
            <textarea
              className="flex-grow px-4 py-4 bg-[var(--primary)] border border-[var(--border)] text-[var(--secondary)] font-mono placeholder:text-[var(--muted)]/70 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] rounded-2xl w-full resize-none custom-scrollbar"
              placeholder="# Introduction..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save document</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
