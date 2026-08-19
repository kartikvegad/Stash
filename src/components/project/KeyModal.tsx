import React, { useState, useEffect } from 'react';
import { useProjects } from '../../context/ProjectContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { X, Eye, EyeOff } from 'lucide-react';
import { ProjectKey } from '../../types';

interface KeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  existingKey?: ProjectKey;
}

export const KeyModal: React.FC<KeyModalProps> = ({ isOpen, onClose, projectId, existingKey }) => {
  const { addKey, updateKey } = useProjects();
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [showValue, setShowValue] = useState(false);

  useEffect(() => {
    if (existingKey) {
      setName(existingKey.name);
      setValue(existingKey.value);
    } else {
      setName('');
      setValue('');
    }
    setShowValue(false);
  }, [existingKey, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !value.trim()) return;

    if (existingKey) {
      updateKey(existingKey.id, { name, value });
    } else {
      addKey({ project_id: projectId, name, value });
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
          {existingKey ? 'Edit key' : 'New key'}
        </h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input 
            label="Name" 
            placeholder="e.g. AWS Access Key"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            required
          />
          
          <div className="flex flex-col gap-1.5 w-full relative">
            <Input 
              label="Value" 
              type={showValue ? 'text' : 'password'}
              placeholder="e.g. AKIAIOSFODNN7EXAMPLE"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
            />
            <button 
              type="button"
              onClick={() => setShowValue(!showValue)}
              className="absolute right-3 top-8 text-[var(--muted)] hover:text-[var(--secondary)]"
            >
              {showValue ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
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
