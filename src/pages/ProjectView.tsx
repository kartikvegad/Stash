import React, { useState } from 'react';
import { useProjects } from '../context/ProjectContext';
import { ArrowLeft, Edit3, Trash2, Link as LinkIcon, Key, FileText, Code2, Plus, Copy, Check, Eye, EyeOff, FileType2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { NoteModal } from '../components/project/NoteModal';
import { LinkModal } from '../components/project/LinkModal';
import { SnippetModal } from '../components/project/SnippetModal';
import { KeyModal } from '../components/project/KeyModal';
import { DocumentModal } from '../components/project/DocumentModal';
import { EditProjectModal } from '../components/project/EditProjectModal';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { ProjectNote, ProjectLink, ProjectSnippet, ProjectKey, ProjectDocument } from '../types';
import ReactMarkdown from 'react-markdown';

interface ProjectViewProps {
  projectId: string;
  onBack: () => void;
}

type Tab = 'DOCUMENTS' | 'NOTES' | 'LINKS' | 'KEYS' | 'SNIPPETS';

export const ProjectView: React.FC<ProjectViewProps> = ({ projectId, onBack }) => {
  const { 
    projects, deleteProject, 
    notes, links, snippets, keys, documents,
    deleteNote, deleteLink, deleteSnippet, deleteKey, deleteDocument 
  } = useProjects();
  
  const project = projects.find(p => p.id === projectId);
  
  const projectDocuments = documents.filter(d => d.project_id === projectId);
  const projectNotes = notes.filter(n => n.project_id === projectId);
  const projectLinks = links.filter(l => l.project_id === projectId);
  const projectSnippets = snippets.filter(s => s.project_id === projectId);
  const projectKeys = keys.filter(k => k.project_id === projectId);

  const [activeTab, setActiveTab] = useState<Tab>('DOCUMENTS');

  // Modal States
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<ProjectNote | undefined>(undefined);
  
  const [isLinkOpen, setIsLinkOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<ProjectLink | undefined>(undefined);
  
  const [isSnippetOpen, setIsSnippetOpen] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState<ProjectSnippet | undefined>(undefined);
  
  const [isKeyOpen, setIsKeyOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<ProjectKey | undefined>(undefined);

  const [isDocumentOpen, setIsDocumentOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<ProjectDocument | undefined>(undefined);

  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);

  // Confirm Modal State
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const confirmDelete = (title: string, message: string, onConfirm: () => void) => {
    setConfirmConfig({ isOpen: true, title, message, onConfirm });
  };

  if (!project) return <div className="p-8">PROJECT NOT FOUND</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header section matching user screenshot */}
      <div className="mb-8">
        <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--secondary)] hover:opacity-70 mb-4 transition-opacity">
          <ArrowLeft className="w-4 h-4" />
          BACK TO DASHBOARD
        </button>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4">
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-[var(--secondary)] break-words">{project.name}</h2>
          
          <div className="flex gap-4">
            <Button variant="outline" size="sm" className="gap-2" onClick={() => setIsEditProjectOpen(true)}>
              <Edit3 className="w-4 h-4" />
              EDIT
            </Button>
            <Button variant="outline" size="sm" className="gap-2 text-red-600 border-red-600 hover:bg-red-600 hover:text-white" onClick={() => {
              confirmDelete(
                'DELETE PROJECT',
                'Are you sure you want to delete this project? All associated documents, notes, snippets, links, and keys will be permanently removed.',
                () => {
                  deleteProject(project.id);
                  onBack();
                }
              );
            }}>
              <Trash2 className="w-4 h-4" />
              DELETE
            </Button>
          </div>
        </div>
        
        <div className="bg-[var(--secondary)] text-[var(--primary)] p-4 md:p-6 mb-8">
          <p className="text-lg md:text-xl font-medium leading-relaxed break-words">{project.description}</p>
        </div>
        
        {/* Tabs */}
        <div className="flex flex-wrap gap-4 mb-8">
          <TabButton active={activeTab === 'DOCUMENTS'} onClick={() => setActiveTab('DOCUMENTS')}>
            DOCUMENTS ({projectDocuments.length})
          </TabButton>
          <TabButton active={activeTab === 'NOTES'} onClick={() => setActiveTab('NOTES')} icon={<FileText className="w-4 h-4" />}>
            NOTES ({projectNotes.length})
          </TabButton>
          <TabButton active={activeTab === 'LINKS'} onClick={() => setActiveTab('LINKS')} icon={<LinkIcon className="w-4 h-4" />}>
            LINKS ({projectLinks.length})
          </TabButton>
          <TabButton active={activeTab === 'KEYS'} onClick={() => setActiveTab('KEYS')} icon={<Key className="w-4 h-4" />}>
            KEYS ({projectKeys.length})
          </TabButton>
          <TabButton active={activeTab === 'SNIPPETS'} onClick={() => setActiveTab('SNIPPETS')} icon={<Code2 className="w-4 h-4" />}>
            SNIPPETS ({projectSnippets.length})
          </TabButton>
        </div>
      </div>

      {/* Content Area */}
      <div className="min-h-[500px]">
        {activeTab === 'DOCUMENTS' && (
          <SectionCard title="DOCUMENTS" icon={<FileType2 className="w-5 h-5" />} onAdd={() => { setEditingDocument(undefined); setIsDocumentOpen(true); }}>
            {projectDocuments.length === 0 ? (
              <div className="text-[var(--secondary)]/80 italic text-sm py-4">No documents added yet.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projectDocuments.map(doc => (
                  <div key={doc.id} className="border-2 border-[var(--secondary)] p-6 flex flex-col gap-4 relative group hover:bg-[var(--secondary)]/5 transition-colors">
                    <div className="flex justify-between items-start border-b-2 border-[var(--secondary)] pb-2">
                      <h4 className="font-bold text-xl uppercase tracking-tight break-words pr-12">{doc.name}</h4>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity absolute right-6 top-6">
                        <button onClick={() => { setEditingDocument(doc); setIsDocumentOpen(true); }} className="hover:opacity-70 bg-[var(--primary)] text-[var(--secondary)] p-1"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => confirmDelete('DELETE DOCUMENT', 'Are you sure you want to delete this document?', () => deleteDocument(doc.id))} className="text-red-600 hover:opacity-70 bg-[var(--primary)] p-1"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <div className="prose prose-invert max-w-none text-sm text-[var(--secondary)] overflow-y-auto max-h-64 custom-scrollbar pr-2">
                      <ReactMarkdown>{doc.content}</ReactMarkdown>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[var(--secondary)]/60 mt-auto pt-4">
                      {new Date(doc.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        )}

        {activeTab === 'NOTES' && (
          <SectionCard title="NOTES" icon={<FileText className="w-5 h-5" />} onAdd={() => { setEditingNote(undefined); setIsNoteOpen(true); }}>
            {projectNotes.length === 0 ? (
              <div className="text-[var(--secondary)]/80 italic text-sm py-4">No notes added yet.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projectNotes.map(note => (
                  <div key={note.id} className="border-2 border-[var(--secondary)] p-4 flex flex-col gap-2 relative group hover:bg-[var(--secondary)]/5">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-lg uppercase tracking-tight break-words">{note.title}</h4>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setEditingNote(note); setIsNoteOpen(true); }} className="hover:opacity-70"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => confirmDelete('DELETE NOTE', 'Are you sure you want to delete this note?', () => deleteNote(note.id))} className="text-red-600 hover:opacity-70"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <div className="max-h-48 overflow-y-auto border-y-2 border-transparent hover:border-[var(--secondary)]/20 transition-colors py-2 pr-2">
                      <p className="text-sm text-[var(--secondary)]/80 whitespace-pre-wrap break-words">{note.content}</p>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[var(--secondary)]/60 mt-auto pt-2">
                      {new Date(note.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        )}

        {activeTab === 'SNIPPETS' && (
          <SectionCard title="SNIPPETS" icon={<Code2 className="w-5 h-5" />} onAdd={() => { setEditingSnippet(undefined); setIsSnippetOpen(true); }}>
            {projectSnippets.length === 0 ? (
              <div className="text-[var(--secondary)]/80 italic text-sm py-4">No snippets added yet.</div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {projectSnippets.map(snippet => (
                  <SnippetItem key={snippet.id} snippet={snippet} onEdit={() => { setEditingSnippet(snippet); setIsSnippetOpen(true); }} onDelete={() => confirmDelete('DELETE SNIPPET', 'Are you sure you want to delete this snippet?', () => deleteSnippet(snippet.id))} />
                ))}
              </div>
            )}
          </SectionCard>
        )}

        {activeTab === 'LINKS' && (
          <SectionCard title="LINKS" icon={<LinkIcon className="w-5 h-5" />} onAdd={() => { setEditingLink(undefined); setIsLinkOpen(true); }}>
             {projectLinks.length === 0 ? (
               <div className="text-[var(--secondary)]/80 italic text-sm py-4">No links added yet.</div>
             ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {projectLinks.map(link => (
                   <div key={link.id} className="flex items-center justify-between group border-2 border-[var(--secondary)] p-4 hover:bg-[var(--secondary)] hover:text-[var(--primary)] transition-colors">
                     <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex-grow font-bold uppercase text-sm truncate pr-4">
                       {link.name}
                     </a>
                     <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => { e.preventDefault(); setEditingLink(link); setIsLinkOpen(true); }} className="hover:opacity-70"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={(e) => { e.preventDefault(); confirmDelete('DELETE LINK', 'Are you sure you want to delete this link?', () => deleteLink(link.id)); }} className="text-red-500 hover:opacity-70"><Trash2 className="w-4 h-4" /></button>
                      </div>
                   </div>
                 ))}
               </div>
             )}
          </SectionCard>
        )}

        {activeTab === 'KEYS' && (
          <SectionCard title="KEYS" icon={<Key className="w-5 h-5" />} onAdd={() => { setEditingKey(undefined); setIsKeyOpen(true); }}>
            {projectKeys.length === 0 ? (
              <div className="text-[var(--secondary)]/80 italic text-sm py-4">No keys added yet.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projectKeys.map(keyObj => (
                  <KeyItem key={keyObj.id} item={keyObj} onEdit={() => { setEditingKey(keyObj); setIsKeyOpen(true); }} onDelete={() => confirmDelete('DELETE KEY', 'Are you sure you want to delete this key?', () => deleteKey(keyObj.id))} />
                ))}
              </div>
            )}
          </SectionCard>
        )}
      </div>

      <DocumentModal isOpen={isDocumentOpen} onClose={() => setIsDocumentOpen(false)} projectId={projectId} existingDocument={editingDocument} />
      <EditProjectModal isOpen={isEditProjectOpen} onClose={() => setIsEditProjectOpen(false)} project={project} />
      <NoteModal isOpen={isNoteOpen} onClose={() => setIsNoteOpen(false)} projectId={projectId} existingNote={editingNote} />
      <LinkModal isOpen={isLinkOpen} onClose={() => setIsLinkOpen(false)} projectId={projectId} existingLink={editingLink} />
      <SnippetModal isOpen={isSnippetOpen} onClose={() => setIsSnippetOpen(false)} projectId={projectId} existingSnippet={editingSnippet} />
      <KeyModal isOpen={isKeyOpen} onClose={() => setIsKeyOpen(false)} projectId={projectId} existingKey={editingKey} />
      
      <ConfirmModal 
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        onConfirm={confirmConfig.onConfirm}
        onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
      />
    </div>
  );
};

const TabButton: React.FC<{active: boolean, onClick: () => void, children: React.ReactNode, icon?: React.ReactNode}> = ({ active, onClick, children, icon }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-3 font-black uppercase tracking-tighter transition-colors border-2 ${
      active 
        ? 'bg-[var(--secondary)] text-[var(--primary)] border-[var(--secondary)]' 
        : 'bg-transparent text-[var(--secondary)] border-[var(--secondary)] hover:bg-[var(--secondary)]/10'
    }`}
  >
    {icon} {children}
  </button>
);

const SectionCard: React.FC<{title: string, icon: React.ReactNode, children: React.ReactNode, onAdd: () => void}> = ({title, icon, children, onAdd}) => (
  <div className="border-2 border-[var(--secondary)] flex flex-col bg-[var(--primary)]">
    <div className="border-b-2 border-[var(--secondary)] p-4 flex justify-between items-center bg-[var(--secondary)] text-[var(--primary)]">
      <h3 className="text-xl font-black uppercase tracking-tighter flex items-center gap-3">
        {icon} {title}
      </h3>
      <button onClick={onAdd} className="hover:opacity-70 transition-opacity bg-[var(--primary)] text-[var(--secondary)] p-1 border-2 border-[var(--primary)] hover:border-[var(--secondary)]">
        <Plus className="w-4 h-4" />
      </button>
    </div>
    <div className="p-6 flex-grow">
      {children}
    </div>
  </div>
);

const SnippetItem: React.FC<{snippet: ProjectSnippet, onEdit: () => void, onDelete: () => void}> = ({ snippet, onEdit, onDelete }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border-2 border-[var(--secondary)] p-4 flex flex-col gap-2 relative group hover:bg-[var(--secondary)]/5 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-bold text-lg uppercase tracking-tight">{snippet.name}</h4>
          {snippet.purpose && <p className="text-sm font-medium text-[var(--secondary)]/70">{snippet.purpose}</p>}
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={handleCopy} className="hover:opacity-70" title="Copy Code">
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
          </button>
          <button onClick={onEdit} className="hover:opacity-70"><Edit3 className="w-4 h-4" /></button>
          <button onClick={onDelete} className="text-red-600 hover:opacity-70"><Trash2 className="w-4 h-4" /></button>
        </div>
      </div>
      <div className="bg-[#1a1a1a] text-[#e0e0e0] p-4 overflow-x-auto">
        <pre className="font-mono text-sm"><code>{snippet.code}</code></pre>
      </div>
    </div>
  );
};

const KeyItem: React.FC<{item: ProjectKey, onEdit: () => void, onDelete: () => void}> = ({ item, onEdit, onDelete }) => {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(item.value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border-2 border-[var(--secondary)] p-3 flex flex-col gap-2 group hover:bg-[var(--secondary)]/5 transition-colors">
      <div className="flex justify-between items-center">
        <h4 className="font-bold text-sm uppercase tracking-tight">{item.name}</h4>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => setShow(!show)} className="hover:opacity-70" title="Reveal">
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <button onClick={handleCopy} className="hover:opacity-70" title="Copy Value">
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
          </button>
          <button onClick={onEdit} className="hover:opacity-70"><Edit3 className="w-4 h-4" /></button>
          <button onClick={onDelete} className="text-red-600 hover:opacity-70"><Trash2 className="w-4 h-4" /></button>
        </div>
      </div>
      <div className="bg-[var(--secondary)]/10 p-2 break-all text-sm font-mono flex items-center justify-between">
        <span>{show ? item.value : '••••••••••••••••'}</span>
      </div>
    </div>
  );
};
