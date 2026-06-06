import React, { useState, useEffect } from 'react';
import { useProjects } from '../../context/ProjectContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { X } from 'lucide-react';
import { ProjectLink } from '../../types';

interface LinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  existingLink?: ProjectLink;
}

export const LinkModal: React.FC<LinkModalProps> = ({ isOpen, onClose, projectId, existingLink }) => {
  const { addLink, updateLink } = useProjects();
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (existingLink) {
      setName(existingLink.name);
      setUrl(existingLink.url);
    } else {
      setName('');
      setUrl('');
    }
  }, [existingLink, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;

    if (existingLink) {
      updateLink(existingLink.id, { name, url });
    } else {
      addLink({ project_id: projectId, name, url });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[var(--secondary)]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[var(--primary)] border-4 border-[var(--secondary)] w-full max-w-lg p-8 relative shadow-[8px_8px_0px_0px_var(--secondary)]">
        <button onClick={onClose} className="absolute top-4 right-4 text-[var(--secondary)] hover:opacity-70 transition-opacity">
          <X className="w-6 h-6" />
        </button>
        
        <h2 className="text-4xl font-black uppercase tracking-tighter text-[var(--secondary)] mb-8">
          {existingLink ? 'EDIT LINK' : 'NEW LINK'}
        </h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Input 
            label="Name" 
            placeholder="e.g. Production URL"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            required
          />
          <Input 
            label="URL" 
            type="url"
            placeholder="https://"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          
          <div className="flex justify-end gap-4 mt-4">
            <Button type="button" variant="ghost" onClick={onClose}>CANCEL</Button>
            <Button type="submit">SAVE</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
