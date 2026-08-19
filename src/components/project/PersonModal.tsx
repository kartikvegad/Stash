import React, { useState, useEffect } from 'react';
import { useProjects } from '../../context/ProjectContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { X } from 'lucide-react';
import { ProjectPerson } from '../../types';

interface PersonModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  existingPerson?: ProjectPerson;
}

export const PersonModal: React.FC<PersonModalProps> = ({ isOpen, onClose, projectId, existingPerson }) => {
  const { addPerson, updatePerson } = useProjects();
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [contact, setContact] = useState('');

  useEffect(() => {
    if (existingPerson) {
      setName(existingPerson.name);
      setRole(existingPerson.role);
      setContact(existingPerson.contact);
    } else {
      setName('');
      setRole('');
      setContact('');
    }
  }, [existingPerson, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (existingPerson) {
      updatePerson(existingPerson.id, { name, role, contact });
    } else {
      addPerson({ project_id: projectId, name, role, contact });
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
          {existingPerson ? 'Edit person' : 'New person'}
        </h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input 
            label="Name" 
            placeholder="e.g. Alex Rivera"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            required
          />
          <Input 
            label="Role" 
            placeholder="e.g. Designer"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
          <Input 
            label="Contact" 
            placeholder="e.g. alex@studio.com"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
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
