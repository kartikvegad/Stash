import React, { useEffect, useState } from 'react';
import { useProjects } from '../../context/ProjectContext';
import { ProjectFormModal, ProjectFormValue } from '../ui/ProjectFormModal';
import { useTheme } from '../../context/ThemeContext';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (id: string) => void;
}

const emptyForm = (primary: string, secondary: string): ProjectFormValue => ({
  name: '',
  description: '',
  type: 'web',
  primaryColor: primary,
  secondaryColor: secondary,
});

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { addProject } = useProjects();
  const { globalTheme } = useTheme();
  const [form, setForm] = useState<ProjectFormValue>(() =>
    emptyForm(globalTheme.primary_color, globalTheme.secondary_color)
  );

  useEffect(() => {
    if (!isOpen) return;
    setForm(emptyForm(globalTheme.primary_color, globalTheme.secondary_color));
  }, [isOpen, globalTheme.primary_color, globalTheme.secondary_color]);

  const readFile = (file: File): Promise<string> =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target!.result as string);
      reader.readAsDataURL(file);
    });

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!form.name.trim()) return;

    const id = addProject({
      name: form.name,
      description: form.description,
      type: form.type,
      primary_color: form.primaryColor,
      secondary_color: form.secondaryColor,
      logo_url: form.logoData,
      image_url: form.imageData,
    });
    onSuccess(id);
    onClose();
  };

  return (
    <ProjectFormModal
      title="New project"
      submitLabel="Create"
      idPrefix="create-project"
      value={form}
      onChange={setForm}
      onSubmit={handleSubmit}
      onClose={onClose}
      onReadFile={readFile}
    />
  );
};
