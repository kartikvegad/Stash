import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, ProjectLink, ProjectKey, ProjectNote, ProjectSnippet, ProjectDocument } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface ProjectContextType {
  projects: Project[];
  notes: ProjectNote[];
  documents: ProjectDocument[];
  links: ProjectLink[];
  snippets: ProjectSnippet[];
  keys: ProjectKey[];
  
  addProject: (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => string;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  addDocument: (document: Omit<ProjectDocument, 'id' | 'created_at' | 'updated_at'>) => void;
  updateDocument: (id: string, document: Partial<ProjectDocument>) => void;
  deleteDocument: (id: string) => void;

  addNote: (note: Omit<ProjectNote, 'id' | 'created_at'>) => void;
  updateNote: (id: string, note: Partial<ProjectNote>) => void;
  deleteNote: (id: string) => void;

  addLink: (link: Omit<ProjectLink, 'id'>) => void;
  updateLink: (id: string, link: Partial<ProjectLink>) => void;
  deleteLink: (id: string) => void;

  addSnippet: (snippet: Omit<ProjectSnippet, 'id'>) => void;
  updateSnippet: (id: string, snippet: Partial<ProjectSnippet>) => void;
  deleteSnippet: (id: string) => void;

  addKey: (key: Omit<ProjectKey, 'id'>) => void;
  updateKey: (id: string, key: Partial<ProjectKey>) => void;
  deleteKey: (id: string) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const getLocal = <T,>(key: string, fallback: T): T => {
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : fallback;
};

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(() => getLocal('stash_projects', []));
  const [documents, setDocuments] = useState<ProjectDocument[]>(() => getLocal('stash_documents', []));
  const [notes, setNotes] = useState<ProjectNote[]>(() => getLocal('stash_notes', []));
  const [links, setLinks] = useState<ProjectLink[]>(() => getLocal('stash_links', []));
  const [snippets, setSnippets] = useState<ProjectSnippet[]>(() => getLocal('stash_snippets', []));
  const [keys, setKeys] = useState<ProjectKey[]>(() => getLocal('stash_keys', []));

  useEffect(() => localStorage.setItem('stash_projects', JSON.stringify(projects)), [projects]);
  useEffect(() => localStorage.setItem('stash_documents', JSON.stringify(documents)), [documents]);
  useEffect(() => localStorage.setItem('stash_notes', JSON.stringify(notes)), [notes]);
  useEffect(() => localStorage.setItem('stash_links', JSON.stringify(links)), [links]);
  useEffect(() => localStorage.setItem('stash_snippets', JSON.stringify(snippets)), [snippets]);
  useEffect(() => localStorage.setItem('stash_keys', JSON.stringify(keys)), [keys]);

  // Projects CRUD
  const addProject = (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
    const now = new Date().toISOString();
    const newProject: Project = { ...projectData, id: uuidv4(), created_at: now, updated_at: now };
    setProjects(prev => [...prev, newProject]);
    return newProject.id;
  };
  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p));
  };
  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    // Cascade delete related entities
    setDocuments(prev => prev.filter(d => d.project_id !== id));
    setNotes(prev => prev.filter(n => n.project_id !== id));
    setLinks(prev => prev.filter(l => l.project_id !== id));
    setSnippets(prev => prev.filter(s => s.project_id !== id));
    setKeys(prev => prev.filter(k => k.project_id !== id));
  };

  // Documents CRUD
  const addDocument = (docData: Omit<ProjectDocument, 'id' | 'created_at' | 'updated_at'>) => {
    const now = new Date().toISOString();
    setDocuments(prev => [...prev, { ...docData, id: uuidv4(), created_at: now, updated_at: now }]);
  };
  const updateDocument = (id: string, updates: Partial<ProjectDocument>) => {
    setDocuments(prev => prev.map(d => d.id === id ? { ...d, ...updates, updated_at: new Date().toISOString() } : d));
  };
  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  // Notes CRUD
  const addNote = (noteData: Omit<ProjectNote, 'id' | 'created_at'>) => {
    setNotes(prev => [...prev, { ...noteData, id: uuidv4(), created_at: new Date().toISOString() }]);
  };
  const updateNote = (id: string, updates: Partial<ProjectNote>) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n));
  };
  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  // Links CRUD
  const addLink = (linkData: Omit<ProjectLink, 'id'>) => {
    setLinks(prev => [...prev, { ...linkData, id: uuidv4() }]);
  };
  const updateLink = (id: string, updates: Partial<ProjectLink>) => {
    setLinks(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  };
  const deleteLink = (id: string) => {
    setLinks(prev => prev.filter(l => l.id !== id));
  };

  // Snippets CRUD
  const addSnippet = (snippetData: Omit<ProjectSnippet, 'id'>) => {
    setSnippets(prev => [...prev, { ...snippetData, id: uuidv4() }]);
  };
  const updateSnippet = (id: string, updates: Partial<ProjectSnippet>) => {
    setSnippets(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };
  const deleteSnippet = (id: string) => {
    setSnippets(prev => prev.filter(s => s.id !== id));
  };

  // Keys CRUD
  const addKey = (keyData: Omit<ProjectKey, 'id'>) => {
    setKeys(prev => [...prev, { ...keyData, id: uuidv4() }]);
  };
  const updateKey = (id: string, updates: Partial<ProjectKey>) => {
    setKeys(prev => prev.map(k => k.id === id ? { ...k, ...updates } : k));
  };
  const deleteKey = (id: string) => {
    setKeys(prev => prev.filter(k => k.id !== id));
  };

  return (
    <ProjectContext.Provider value={{
      projects, documents, notes, links, snippets, keys,
      addProject, updateProject, deleteProject,
      addDocument, updateDocument, deleteDocument,
      addNote, updateNote, deleteNote,
      addLink, updateLink, deleteLink,
      addSnippet, updateSnippet, deleteSnippet,
      addKey, updateKey, deleteKey
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) throw new Error('useProjects must be used within a ProjectProvider');
  return context;
};
