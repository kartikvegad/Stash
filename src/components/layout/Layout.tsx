import React, { useLayoutEffect, useState } from 'react';
import { ControlBar } from './ControlBar';
import { Dashboard } from '../../pages/Dashboard';
import { ProjectView } from '../../pages/ProjectView';
import { CreateProjectModal } from '../project/CreateProjectModal';
import { useProjects } from '../../context/ProjectContext';
import { useTheme } from '../../context/ThemeContext';
import { useTaskNotifications } from '../../hooks/useTaskNotifications';
import { resolveProjectTheme } from '../../lib/projects';

export const Layout: React.FC = () => {
  const { tasks, projects } = useProjects();
  const { globalTheme, setOverrideTheme } = useTheme();
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [focusTasks, setFocusTasks] = useState(false);

  useTaskNotifications(tasks, projects);

  const currentProject = currentProjectId
    ? projects.find((project) => project.id === currentProjectId)
    : undefined;

  useLayoutEffect(() => {
    if (currentProject) {
      setOverrideTheme(resolveProjectTheme(currentProject, globalTheme));
      return;
    }
    setOverrideTheme(null);
  }, [
    currentProject,
    currentProject?.primary_color,
    currentProject?.secondary_color,
    globalTheme,
    setOverrideTheme,
  ]);

  return (
    <div className="min-h-screen bg-[var(--primary)] text-[var(--secondary)] flex flex-col font-sans transition-colors duration-300">
      <ControlBar 
        onGoHome={() => {
          setCurrentProjectId(null);
          setSearchQuery('');
          setFocusTasks(false);
        }}
        onSearch={setSearchQuery}
        onCreateProject={() => setIsCreateModalOpen(true)}
        onOpenProject={(id) => {
          setCurrentProjectId(id);
          setFocusTasks(true);
        }}
        projectId={currentProjectId}
      />
      
      <main className="flex-grow relative overflow-y-auto">
        {currentProjectId ? (
          <ProjectView 
            key={currentProjectId}
            projectId={currentProjectId} 
            onBack={() => {
              setCurrentProjectId(null);
              setFocusTasks(false);
            }}
            initialTab={focusTasks ? 'TASKS' : undefined}
          />
        ) : (
          <Dashboard 
            onProjectSelect={(id) => {
              setFocusTasks(false);
              setCurrentProjectId(id);
            }}
            searchQuery={searchQuery}
          />
        )}
      </main>

      <CreateProjectModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={(id) => {
          setSearchQuery('');
          setCurrentProjectId(id);
        }}
      />
    </div>
  );
};
