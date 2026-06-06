import React from 'react';
import { useProjects } from '../context/ProjectContext';
import { ProjectCard } from '../components/project/ProjectCard';

interface DashboardProps {
  onProjectSelect: (id: string) => void;
  searchQuery: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ onProjectSelect, searchQuery }) => {
  const { projects } = useProjects();

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8">
      {filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h2 className="text-4xl font-black uppercase tracking-tighter text-[var(--secondary)] mb-4">NO PROJECTS FOUND</h2>
          <p className="text-[var(--secondary)]/70 uppercase tracking-widest font-bold">Create a new project to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
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
