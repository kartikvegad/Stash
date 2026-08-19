import React, { useState, useEffect } from 'react';
import { useProjects } from '../../context/ProjectContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { X } from 'lucide-react';
import { ProjectCommand } from '../../types';

interface CommandModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  existingCommand?: ProjectCommand;
}

export const CommandModal: React.FC<CommandModalProps> = ({ isOpen, onClose, projectId, existingCommand }) => {
  const { addCommand, updateCommand } = useProjects();
  const [name, setName] = useState('');
  const [command, setCommand] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (existingCommand) {
      setName(existingCommand.name);
      setCommand(existingCommand.command);
      setNotes(existingCommand.notes);
    } else {
      setName('');
      setCommand('');
      setNotes('');
    }
  }, [existingCommand, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !command.trim()) return;

    if (existingCommand) {
      updateCommand(existingCommand.id, { name, command, notes });
    } else {
      addCommand({ project_id: projectId, name, command, notes });
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
          {existingCommand ? 'Edit command' : 'New command'}
        </h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input 
            label="Name" 
            placeholder="e.g. Start local server"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            required
          />
          <Input 
            label="Command" 
            placeholder="e.g. npm run dev"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            required
          />
          <div className="flex flex-col gap-1.5 w-full">
            <label className="ui-label">Notes</label>
            <textarea
              className="ui-textarea min-h-[100px]"
              placeholder="When to use this, flags, caveats..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
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
