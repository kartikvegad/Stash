import React, { useEffect, useState } from 'react';
import { useProjects } from '../../context/ProjectContext';
import { ProjectFormModal, ProjectFormValue } from '../ui/ProjectFormModal';
import { Project } from '../../types';
import { resolveProjectTheme, resolveProjectType } from '../../lib/projects';
import { useTheme } from '../../context/ThemeContext';

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

export const EditProjectModal: React.FC<EditProjectModalProps> = ({ isOpen, onClose, project }) => {
  const { updateProject } = useProjects();
  const { globalTheme } = useTheme();
  const [form, setForm] = useState<ProjectFormValue>({
    name: '',
    description: '',
    type: 'other',
    primaryColor: globalTheme.primary_color,
    secondaryColor: globalTheme.secondary_color,
  });

  const readFile = (file: File): Promise<string> =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target!.result as string);
      reader.readAsDataURL(file);
    });

  useEffect(() => {
    if (!project) return;
    const colors = resolveProjectTheme(project, globalTheme);
    setForm({
      name: project.name,
      description: project.description,
      type: resolveProjectType(project),
      primaryColor: colors.primary_color,
      secondaryColor: colors.secondary_color,
      logoData: project.logo_url,
      imageData: project.image_url,
    });
  }, [project, isOpen, globalTheme]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!form.name.trim()) return;

    updateProject(project.id, {
      name: form.name,
      description: form.description,
      type: form.type,
      primary_color: form.primaryColor,
      secondary_color: form.secondaryColor,
      logo_url: form.logoData,
      image_url: form.imageData,
    });
    onClose();
  };

  return (
    <ProjectFormModal
      title="Edit project"
      submitLabel="Save"
      idPrefix="edit-project"
      value={form}
      onChange={setForm}
      onSubmit={handleSubmit}
      onClose={onClose}
      onReadFile={readFile}
    />
  );
};
