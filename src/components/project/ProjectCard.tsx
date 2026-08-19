import React from 'react';
import { Project } from '../../types';
import { ArrowRight } from 'lucide-react';
import { projectTypeLabel, resolveProjectTheme, resolveProjectType } from '../../lib/projects';
import { useTheme } from '../../context/ThemeContext';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const { globalTheme } = useTheme();
  const colors = resolveProjectTheme(project, globalTheme);

  return (
    <div 
      onClick={onClick}
      className="group flex flex-col bg-[var(--surface)] cursor-pointer hover:bg-[var(--accent)] transition-colors h-full overflow-hidden rounded-[1.75rem]"
      style={{
        '--primary': colors.primary_color,
        '--secondary': colors.secondary_color,
        '--ink': colors.secondary_color,
      } as React.CSSProperties}
    >
      {project.image_url && (
        <div className="w-full h-32 overflow-hidden bg-[var(--primary)]">
          <img src={project.image_url} alt={project.name} className="w-full h-full object-cover group-hover:opacity-90 transition-opacity" />
        </div>
      )}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex-grow">
          <div className="flex items-center gap-3 mb-2">
            {project.logo_url && (
              <img src={project.logo_url} alt="Logo" className="w-8 h-8 object-contain rounded-lg" />
            )}
            <h3 className="text-xl font-extrabold tracking-tight text-[var(--secondary)] line-clamp-1 break-words">
              {project.name}
            </h3>
          </div>
          <span className="ui-badge mb-3">{projectTypeLabel(resolveProjectType(project))}</span>
        <p className="text-sm font-medium text-[var(--muted)] line-clamp-3 break-words">
          {project.description}
        </p>
      </div>
        <div className="mt-6 flex items-center justify-between">
          <span className="ui-badge">
            {new Date(project.updated_at).toLocaleDateString()}
          </span>
          <ArrowRight className="w-5 h-5 text-[var(--secondary)] transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </div>
  );
};
