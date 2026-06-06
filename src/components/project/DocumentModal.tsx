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
    <div className="fixed inset-0 bg-[var(--secondary)]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[var(--primary)] border-4 border-[var(--secondary)] w-full max-w-5xl h-[90vh] flex flex-col relative shadow-[8px_8px_0px_0px_var(--secondary)]">
        <div className="flex justify-between items-center p-6 border-b-4 border-[var(--secondary)]">
          <h2 className="text-4xl font-black uppercase tracking-tighter text-[var(--secondary)]">
            {existingDocument ? 'EDIT DOCUMENT' : 'NEW DOCUMENT'}
          </h2>
          <button onClick={onClose} className="text-[var(--secondary)] hover:opacity-70 transition-opacity">
            <X className="w-8 h-8" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col flex-grow p-6 overflow-hidden gap-6">
          <Input 
            label="Document Name" 
            placeholder="e.g. README.md"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            required
          />
          
          <div className="flex flex-col flex-grow gap-1">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--secondary)]">
              Markdown Content
            </label>
            <textarea
              className="flex-grow px-4 py-4 bg-[var(--primary)] border-2 border-[var(--secondary)] text-[var(--secondary)] font-mono placeholder:text-[var(--secondary)]/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--secondary)] rounded-none w-full resize-none custom-scrollbar"
              placeholder="# Introduction..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          
          <div className="flex justify-end gap-4 mt-2">
            <Button type="button" variant="ghost" onClick={onClose}>CANCEL</Button>
            <Button type="submit">SAVE DOCUMENT</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
