import React, { useState, useEffect } from 'react';
import { useProjects } from '../../context/ProjectContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { X } from 'lucide-react';
import { ProjectSnippet } from '../../types';

interface SnippetModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  existingSnippet?: ProjectSnippet;
}

export const SnippetModal: React.FC<SnippetModalProps> = ({ isOpen, onClose, projectId, existingSnippet }) => {
  const { addSnippet, updateSnippet } = useProjects();
  const [name, setName] = useState('');
  const [purpose, setPurpose] = useState('');
  const [code, setCode] = useState('');

  useEffect(() => {
    if (existingSnippet) {
      setName(existingSnippet.name);
      setPurpose(existingSnippet.purpose);
      setCode(existingSnippet.code);
    } else {
      setName('');
      setPurpose('');
      setCode('');
    }
  }, [existingSnippet, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;

    if (existingSnippet) {
      updateSnippet(existingSnippet.id, { name, purpose, code });
    } else {
      addSnippet({ project_id: projectId, name, purpose, code });
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
          {existingSnippet ? 'Edit snippet' : 'New snippet'}
        </h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input 
              label="Name" 
              placeholder="e.g. DB Connection"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              required
            />
            <Input 
              label="Purpose" 
              placeholder="e.g. Connects to Postgres"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col gap-1.5 w-full">
            <label className="ui-label">Code</label>
            <textarea
              className="px-4 py-3 bg-[var(--secondary)] text-[var(--primary)] font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] rounded-2xl w-full min-h-[200px] resize-none"
              placeholder="const connect = () => { ... }"
              value={code}
              onChange={(e) => setCode(e.target.value)}
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
