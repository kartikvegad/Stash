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
    <div className="fixed inset-0 bg-[var(--secondary)]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[var(--primary)] border-4 border-[var(--secondary)] w-full max-w-lg p-8 relative shadow-[8px_8px_0px_0px_var(--secondary)]">
        <button onClick={onClose} className="absolute top-4 right-4 text-[var(--secondary)] hover:opacity-70 transition-opacity">
          <X className="w-6 h-6" />
        </button>
        
        <h2 className="text-4xl font-black uppercase tracking-tighter text-[var(--secondary)] mb-8">
          {existingKey ? 'EDIT KEY' : 'NEW KEY'}
        </h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Input 
            label="Name" 
            placeholder="e.g. AWS Access Key"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            required
          />
          
          <div className="flex flex-col gap-1 w-full relative">
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
              className="absolute right-3 top-7 text-[var(--secondary)]/70 hover:text-[var(--secondary)]"
            >
              {showValue ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
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
