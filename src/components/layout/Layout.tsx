import React, { useState } from 'react';
import { ControlBar } from './ControlBar';
import { Dashboard } from '../../pages/Dashboard';
import { ProjectView } from '../../pages/ProjectView';
import { CreateProjectModal } from '../project/CreateProjectModal';

export const Layout: React.FC = () => {
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--primary)] text-[var(--secondary)] flex flex-col font-sans transition-colors duration-300">
      <ControlBar 
        onGoHome={() => {
          setCurrentProjectId(null);
          setSearchQuery('');
        }}
        onSearch={setSearchQuery}
        onCreateProject={() => setIsCreateModalOpen(true)}
      />
      
      <main className="flex-grow relative overflow-y-auto">
        {currentProjectId ? (
          <ProjectView 
            projectId={currentProjectId} 
            onBack={() => setCurrentProjectId(null)} 
          />
        ) : (
          <Dashboard 
            onProjectSelect={setCurrentProjectId}
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
