import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ProjectProvider } from './context/ProjectContext';
import { Layout } from './components/layout/Layout';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ProjectProvider>
        <Layout />
      </ProjectProvider>
    </ThemeProvider>
  );
};

export default App;
