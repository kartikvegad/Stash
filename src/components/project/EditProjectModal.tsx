import React, { useState, useEffect } from 'react';
import { useProjects } from '../../context/ProjectContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { FileInput } from '../ui/FileInput';
import { X } from 'lucide-react';
import { Project } from '../../types';

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

export const EditProjectModal: React.FC<EditProjectModalProps> = ({ isOpen, onClose, project }) => {
  const { updateProject } = useProjects();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [logoData, setLogoData] = useState<string | undefined>(undefined);
  const [imageData, setImageData] = useState<string | undefined>(undefined);

  const readFile = (file: File): Promise<string> =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target!.result as string);
      reader.readAsDataURL(file);
    });

  useEffect(() => {
    if (project) {
      setName(project.name);
      setDescription(project.description);
      setLogoData(project.logo_url);
      setImageData(project.image_url);
    }
  }, [project, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    updateProject(project.id, {
      name,
      description,
      logo_url: logoData,
      image_url: imageData,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[var(--secondary)]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[var(--primary)] border-4 border-[var(--secondary)] w-full max-w-lg p-8 relative shadow-[8px_8px_0px_0px_var(--secondary)]">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--secondary)] hover:opacity-70 transition-opacity"
        >
          <X className="w-6 h-6" />
        </button>
        
        <h2 className="text-4xl font-black uppercase tracking-tighter text-[var(--secondary)] mb-8">
          EDIT PROJECT
        </h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Input 
            label="Project Name" 
            placeholder="e.g. Apollo Mission"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            required
          />
          
          <div className="flex flex-col gap-1 w-full">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--secondary)]">
              Description
            </label>
            <textarea
              className="px-3 py-2 bg-[var(--primary)] border-2 border-[var(--secondary)] text-[var(--secondary)] placeholder:text-[var(--secondary)]/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--secondary)] rounded-none w-full min-h-[120px] resize-none"
              placeholder="Brief description of the project goals..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FileInput
              label="Logo (PNG / SVG / JPG)"
              accept="image/png,image/svg+xml,image/jpeg"
              preview={logoData}
              onChange={async (file) => setLogoData(await readFile(file))}
              onClear={() => setLogoData(undefined)}
            />
            <FileInput
              label="Cover Image (PNG / SVG / JPG)"
              accept="image/png,image/svg+xml,image/jpeg"
              preview={imageData}
              onChange={async (file) => setImageData(await readFile(file))}
              onClear={() => setImageData(undefined)}
            />
          </div>
          
          <div className="flex justify-end gap-4 mt-4">
            <Button type="button" variant="ghost" onClick={onClose}>
              CANCEL
            </Button>
            <Button type="submit">
              SAVE
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
