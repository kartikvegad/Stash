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
    <div className="fixed inset-0 bg-[var(--secondary)]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[var(--primary)] border-4 border-[var(--secondary)] w-full max-w-2xl p-8 relative shadow-[8px_8px_0px_0px_var(--secondary)]">
        <button onClick={onClose} className="absolute top-4 right-4 text-[var(--secondary)] hover:opacity-70 transition-opacity">
          <X className="w-6 h-6" />
        </button>
        
        <h2 className="text-4xl font-black uppercase tracking-tighter text-[var(--secondary)] mb-8">
          {existingSnippet ? 'EDIT SNIPPET' : 'NEW SNIPPET'}
        </h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          
          <div className="flex flex-col gap-1 w-full">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--secondary)]">Code</label>
            <textarea
              className="px-3 py-2 bg-[#1a1a1a] text-[#e0e0e0] font-mono text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--secondary)] rounded-none w-full min-h-[200px] resize-none"
              placeholder="const connect = () => { ... }"
              value={code}
              onChange={(e) => setCode(e.target.value)}
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
