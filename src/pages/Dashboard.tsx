import React, { useState } from 'react';
import { useProjects } from '../context/ProjectContext';
import { ProjectCard } from '../components/project/ProjectCard';
import { ProjectType } from '../types';
import { PROJECT_TYPES, projectTypeLabel, resolveProjectType } from '../lib/projects';

interface DashboardProps {
  onProjectSelect: (id: string) => void;
  searchQuery: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ onProjectSelect, searchQuery }) => {
  const { projects } = useProjects();
  const [typeFilter, setTypeFilter] = useState<ProjectType | 'all'>('all');

  const filteredProjects = projects.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      projectTypeLabel(resolveProjectType(p)).toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || resolveProjectType(p) === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-8">
      {projects.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            type="button"
            onClick={() => setTypeFilter('all')}
            className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
              typeFilter === 'all'
                ? 'bg-[var(--secondary)] text-[var(--primary)]'
                : 'bg-[var(--surface)] text-[var(--secondary)] hover:bg-[var(--accent)]'
            }`}
          >
            All
          </button>
          {PROJECT_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setTypeFilter(type)}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
                typeFilter === type
                  ? 'bg-[var(--secondary)] text-[var(--primary)]'
                  : 'bg-[var(--surface)] text-[var(--secondary)] hover:bg-[var(--accent)]'
              }`}
            >
              {projectTypeLabel(type)}
            </button>
          ))}
        </div>
      )}

      {filteredProjects.length === 0 ? (
        <div className="flex items-center justify-center min-h-[min(28rem,60vh)]">
          <div className="w-full max-w-3xl bg-[var(--surface)] rounded-[2rem] px-8 py-16 sm:px-14 sm:py-20 text-center">
            <p className="text-sm font-bold text-[var(--secondary)] mb-4">stash</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--secondary)] mb-3">
              No projects found
            </h2>
            <p className="text-base sm:text-lg text-[var(--muted)]">
              {projects.length === 0
                ? 'Create a new project to get started'
                : 'Try a different search or type'}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 auto-rows-fr">
          {filteredProjects.map(project => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onClick={() => onProjectSelect(project.id)} 
            />
          ))}
        </div>
      )}
    </div>
  );
};
