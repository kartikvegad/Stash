import React from 'react';
import { Project } from '../../types';
import { ArrowRight } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="group flex flex-col border-2 border-[var(--secondary)] cursor-pointer hover:bg-[var(--secondary)] transition-colors h-full overflow-hidden"
    >
      {project.image_url && (
        <div className="w-full h-32 border-b-2 border-[var(--secondary)] overflow-hidden bg-[var(--secondary)]/10">
          <img src={project.image_url} alt={project.name} className="w-full h-full object-cover group-hover:opacity-80 transition-opacity" />
        </div>
      )}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex-grow">
          <div className="flex items-center gap-3 mb-2">
            {project.logo_url && (
              <img src={project.logo_url} alt="Logo" className="w-8 h-8 object-contain" />
            )}
            <h3 className="text-xl font-black uppercase tracking-tighter text-[var(--secondary)] group-hover:text-[var(--primary)] line-clamp-1 break-words">
              {project.name}
            </h3>
          </div>
        <p className="text-sm font-medium text-[var(--secondary)]/80 group-hover:text-[var(--primary)]/80 line-clamp-3 break-words">
          {project.description}
        </p>
      </div>
        <div className="mt-6 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--secondary)]/60 group-hover:text-[var(--primary)]/60">
            {new Date(project.updated_at).toLocaleDateString()}
          </span>
          <ArrowRight className="w-5 h-5 text-[var(--secondary)] group-hover:text-[var(--primary)] transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </div>
  );
};
