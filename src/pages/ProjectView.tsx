import React, { useEffect, useState } from 'react';
import { useProjects } from '../context/ProjectContext';
import { ArrowLeft, Edit3, Trash2, Link as LinkIcon, Key, FileText, Code2, Plus, Copy, Check, Eye, EyeOff, FileType2, ListTodo, Users, Terminal } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { NoteModal } from '../components/project/NoteModal';
import { LinkModal } from '../components/project/LinkModal';
import { SnippetModal } from '../components/project/SnippetModal';
import { KeyModal } from '../components/project/KeyModal';
import { DocumentModal } from '../components/project/DocumentModal';
import { EditProjectModal } from '../components/project/EditProjectModal';
import { TaskModal } from '../components/project/TaskModal';
import { PersonModal } from '../components/project/PersonModal';
import { CommandModal } from '../components/project/CommandModal';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { ProjectNote, ProjectLink, ProjectSnippet, ProjectKey, ProjectDocument, ProjectTask, ProjectPerson, ProjectCommand } from '../types';
import ReactMarkdown from 'react-markdown';
import { formatDeadline, getTaskUrgency, sortTasks } from '../lib/tasks';
import { projectTypeLabel, resolveProjectType } from '../lib/projects';

type Tab = 'DOCUMENTS' | 'NOTES' | 'TASKS' | 'LINKS' | 'KEYS' | 'SNIPPETS' | 'PEOPLE' | 'COMMANDS';

interface ProjectViewProps {
  projectId: string;
  onBack: () => void;
  initialTab?: Tab;
}

export const ProjectView: React.FC<ProjectViewProps> = ({ projectId, onBack, initialTab }) => {
  const { 
    projects, deleteProject, 
    notes, links, snippets, keys, documents, tasks, people, commands,
    deleteNote, deleteLink, deleteSnippet, deleteKey, deleteDocument, deleteTask, deletePerson, deleteCommand, updateTask
  } = useProjects();
  
  const project = projects.find(p => p.id === projectId);
  
  const projectDocuments = documents.filter(d => d.project_id === projectId);
  const projectNotes = notes.filter(n => n.project_id === projectId);
  const projectTasks = tasks.filter(t => t.project_id === projectId);
  const projectLinks = links.filter(l => l.project_id === projectId);
  const projectSnippets = snippets.filter(s => s.project_id === projectId);
  const projectKeys = keys.filter(k => k.project_id === projectId);
  const projectPeople = people.filter(p => p.project_id === projectId);
  const projectCommands = commands.filter(c => c.project_id === projectId);

  const [activeTab, setActiveTab] = useState<Tab>(initialTab ?? 'DOCUMENTS');

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

  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<ProjectTask | undefined>(undefined);

  const [isPersonOpen, setIsPersonOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<ProjectPerson | undefined>(undefined);

  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [editingCommand, setEditingCommand] = useState<ProjectCommand | undefined>(undefined);

  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);

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

  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab, projectId]);

  const confirmDelete = (title: string, message: string, onConfirm: () => void) => {
    setConfirmConfig({ isOpen: true, title, message, onConfirm });
  };

  if (!project) return <div className="p-8 text-[var(--muted)]">Project not found</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold text-[var(--muted)] hover:text-[var(--secondary)] mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to dashboard
        </button>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-5">
          <div className="min-w-0">
            <span className="ui-badge mb-3">{projectTypeLabel(resolveProjectType(project))}</span>
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--secondary)] break-words">{project.name}</h2>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" size="sm" className="gap-2" onClick={() => setIsEditProjectOpen(true)}>
              <Edit3 className="w-4 h-4" />
              Edit
            </Button>
            <Button variant="outline" size="sm" className="gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700" onClick={() => {
              confirmDelete(
                'Delete project',
                'Are you sure you want to delete this project? All associated documents, notes, tasks, snippets, links, keys, people, and commands will be permanently removed.',
                () => {
                  deleteProject(project.id);
                  onBack();
                }
              );
            }}>
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </div>
        </div>
        
        <div className="bg-[var(--accent)] text-[var(--secondary)] p-5 md:p-6 mb-8 rounded-[1.75rem]">
          <p className="text-base md:text-lg font-medium leading-relaxed break-words">{project.description}</p>
        </div>
        
        <div className="flex flex-nowrap items-center gap-1.5 sm:gap-2 mb-8 w-full">
          {([
            { id: 'DOCUMENTS' as const, label: 'Documents', count: projectDocuments.length, icon: <FileType2 className="w-4 h-4 shrink-0" /> },
            { id: 'NOTES' as const, label: 'Notes', count: projectNotes.length, icon: <FileText className="w-4 h-4 shrink-0" /> },
            { id: 'TASKS' as const, label: 'Tasks', count: projectTasks.length, icon: <ListTodo className="w-4 h-4 shrink-0" /> },
            { id: 'LINKS' as const, label: 'Links', count: projectLinks.length, icon: <LinkIcon className="w-4 h-4 shrink-0" /> },
            { id: 'KEYS' as const, label: 'Keys', count: projectKeys.length, icon: <Key className="w-4 h-4 shrink-0" /> },
            { id: 'SNIPPETS' as const, label: 'Snippets', count: projectSnippets.length, icon: <Code2 className="w-4 h-4 shrink-0" /> },
            { id: 'PEOPLE' as const, label: 'People', count: projectPeople.length, icon: <Users className="w-4 h-4 shrink-0" /> },
            { id: 'COMMANDS' as const, label: 'Commands', count: projectCommands.length, icon: <Terminal className="w-4 h-4 shrink-0" /> },
          ]).map((tab) => (
            <TabButton
              key={tab.id}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              icon={tab.icon}
              label={tab.label}
              count={tab.count}
            />
          ))}
        </div>
      </div>

      <div className="min-h-[500px]">
        {activeTab === 'DOCUMENTS' && (
          <SectionCard title="Documents" icon={<FileType2 className="w-5 h-5" />} onAdd={() => { setEditingDocument(undefined); setIsDocumentOpen(true); }}>
            {projectDocuments.length === 0 ? (
              <div className="text-[var(--muted)] text-sm py-4">No documents added yet.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {projectDocuments.map(doc => (
                  <div key={doc.id} className="bg-[var(--primary)] rounded-3xl p-6 flex flex-col gap-4 relative group hover:bg-[var(--accent)]/60 transition-colors">
                    <div className="flex justify-between items-start pb-2">
                      <h4 className="font-bold text-xl tracking-tight break-words pr-12">{doc.name}</h4>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity absolute right-6 top-6">
                        <button onClick={() => { setEditingDocument(doc); setIsDocumentOpen(true); }} className="hover:opacity-70 bg-[var(--surface)] text-[var(--secondary)] p-1.5 rounded-full"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => confirmDelete('Delete document', 'Are you sure you want to delete this document?', () => deleteDocument(doc.id))} className="text-red-600 hover:opacity-70 bg-[var(--surface)] p-1.5 rounded-full"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <div className="prose prose-invert max-w-none text-sm text-[var(--secondary)] overflow-y-auto max-h-64 custom-scrollbar pr-2">
                      <ReactMarkdown>{doc.content}</ReactMarkdown>
                    </div>
                    <span className="ui-badge mt-auto self-start">
                      {new Date(doc.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        )}

        {activeTab === 'NOTES' && (
          <SectionCard title="Notes" icon={<FileText className="w-5 h-5" />} onAdd={() => { setEditingNote(undefined); setIsNoteOpen(true); }}>
            {projectNotes.length === 0 ? (
              <div className="text-[var(--muted)] text-sm py-4">No notes added yet.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {projectNotes.map(note => (
                  <div key={note.id} className="bg-[var(--primary)] rounded-3xl p-5 flex flex-col gap-2 relative group hover:bg-[var(--accent)]/60 transition-colors">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-lg tracking-tight break-words">{note.title}</h4>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setEditingNote(note); setIsNoteOpen(true); }} className="hover:opacity-70"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => confirmDelete('Delete note', 'Are you sure you want to delete this note?', () => deleteNote(note.id))} className="text-red-600 hover:opacity-70"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <div className="max-h-48 overflow-y-auto py-2 pr-2">
                      <p className="text-sm text-[var(--muted)] whitespace-pre-wrap break-words">{note.content}</p>
                    </div>
                    <span className="ui-badge mt-auto self-start">
                      {new Date(note.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        )}

        {activeTab === 'TASKS' && (
          <SectionCard title="Tasks" icon={<ListTodo className="w-5 h-5" />} onAdd={() => { setEditingTask(undefined); setIsTaskOpen(true); }}>
            {projectTasks.length === 0 ? (
              <div className="text-[var(--muted)] text-sm py-4">No tasks added yet.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sortTasks(projectTasks).map(task => {
                  const urgency = getTaskUrgency(task);
                  return (
                  <div key={task.id} className="flex items-center gap-3 group bg-[var(--primary)] rounded-2xl p-4 hover:bg-[var(--accent)] transition-colors">
                    <button
                      type="button"
                      onClick={() => updateTask(task.id, { done: !task.done })}
                      className={`w-5 h-5 rounded-md border border-[var(--secondary)] shrink-0 flex items-center justify-center ${task.done ? 'bg-[var(--secondary)] text-[var(--primary)]' : ''}`}
                      aria-label={task.done ? 'Mark incomplete' : 'Mark complete'}
                    >
                      {task.done && <Check className="w-3.5 h-3.5" />}
                    </button>
                    <div className="flex-grow min-w-0">
                      <p className={`font-semibold text-sm break-words ${task.done ? 'line-through text-[var(--muted)]' : ''}`}>
                        {task.title}
                      </p>
                      {task.deadline && (
                        <p className={`text-xs mt-1 ${urgency === 'overdue' ? 'font-bold' : 'text-[var(--muted)]'}`}>
                          {urgency === 'overdue' ? 'Overdue' : urgency === 'today' ? 'Due today' : 'Due'}
                          {' · '}
                          {formatDeadline(task.deadline)}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEditingTask(task); setIsTaskOpen(true); }} className="hover:opacity-70"><Edit3 className="w-4 h-4" /></button>
                      <button onClick={() => confirmDelete('Delete task', 'Are you sure you want to delete this task?', () => deleteTask(task.id))} className="text-red-600 hover:opacity-70"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  );
                })}
              </div>
            )}
          </SectionCard>
        )}

        {activeTab === 'SNIPPETS' && (
          <SectionCard title="Snippets" icon={<Code2 className="w-5 h-5" />} onAdd={() => { setEditingSnippet(undefined); setIsSnippetOpen(true); }}>
            {projectSnippets.length === 0 ? (
              <div className="text-[var(--muted)] text-sm py-4">No snippets added yet.</div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {projectSnippets.map(snippet => (
                  <SnippetItem key={snippet.id} snippet={snippet} onEdit={() => { setEditingSnippet(snippet); setIsSnippetOpen(true); }} onDelete={() => confirmDelete('Delete snippet', 'Are you sure you want to delete this snippet?', () => deleteSnippet(snippet.id))} />
                ))}
              </div>
            )}
          </SectionCard>
        )}

        {activeTab === 'LINKS' && (
          <SectionCard title="Links" icon={<LinkIcon className="w-5 h-5" />} onAdd={() => { setEditingLink(undefined); setIsLinkOpen(true); }}>
             {projectLinks.length === 0 ? (
               <div className="text-[var(--muted)] text-sm py-4">No links added yet.</div>
             ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {projectLinks.map(link => (
                   <div key={link.id} className="flex items-center justify-between group bg-[var(--primary)] rounded-2xl p-4 hover:bg-[var(--accent)] transition-colors">
                     <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex-grow font-semibold text-sm truncate pr-4">
                       {link.name}
                     </a>
                     <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => { e.preventDefault(); setEditingLink(link); setIsLinkOpen(true); }} className="hover:opacity-70"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={(e) => { e.preventDefault(); confirmDelete('Delete link', 'Are you sure you want to delete this link?', () => deleteLink(link.id)); }} className="text-red-500 hover:opacity-70"><Trash2 className="w-4 h-4" /></button>
                      </div>
                   </div>
                 ))}
               </div>
             )}
          </SectionCard>
        )}

        {activeTab === 'KEYS' && (
          <SectionCard title="Keys" icon={<Key className="w-5 h-5" />} onAdd={() => { setEditingKey(undefined); setIsKeyOpen(true); }}>
            {projectKeys.length === 0 ? (
              <div className="text-[var(--muted)] text-sm py-4">No keys added yet.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projectKeys.map(keyObj => (
                  <KeyItem key={keyObj.id} item={keyObj} onEdit={() => { setEditingKey(keyObj); setIsKeyOpen(true); }} onDelete={() => confirmDelete('Delete key', 'Are you sure you want to delete this key?', () => deleteKey(keyObj.id))} />
                ))}
              </div>
            )}
          </SectionCard>
        )}

        {activeTab === 'PEOPLE' && (
          <SectionCard title="People" icon={<Users className="w-5 h-5" />} onAdd={() => { setEditingPerson(undefined); setIsPersonOpen(true); }}>
            {projectPeople.length === 0 ? (
              <div className="text-[var(--muted)] text-sm py-4">No people added yet.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projectPeople.map(person => (
                  <div key={person.id} className="bg-[var(--primary)] rounded-2xl p-4 flex flex-col gap-1 relative group hover:bg-[var(--accent)]/50 transition-colors">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-base tracking-tight break-words pr-10">{person.name}</h4>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 top-4">
                        <button onClick={() => { setEditingPerson(person); setIsPersonOpen(true); }} className="hover:opacity-70"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => confirmDelete('Delete person', 'Are you sure you want to delete this person?', () => deletePerson(person.id))} className="text-red-600 hover:opacity-70"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                    {person.role && <p className="text-sm text-[var(--muted)]">{person.role}</p>}
                    {person.contact && <p className="text-sm font-medium break-all">{person.contact}</p>}
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        )}

        {activeTab === 'COMMANDS' && (
          <SectionCard title="Commands" icon={<Terminal className="w-5 h-5" />} onAdd={() => { setEditingCommand(undefined); setIsCommandOpen(true); }}>
            {projectCommands.length === 0 ? (
              <div className="text-[var(--muted)] text-sm py-4">No commands added yet.</div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {projectCommands.map(item => (
                  <CommandItem key={item.id} item={item} onEdit={() => { setEditingCommand(item); setIsCommandOpen(true); }} onDelete={() => confirmDelete('Delete command', 'Are you sure you want to delete this command?', () => deleteCommand(item.id))} />
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
      <TaskModal isOpen={isTaskOpen} onClose={() => setIsTaskOpen(false)} projectId={projectId} existingTask={editingTask} />
      <PersonModal isOpen={isPersonOpen} onClose={() => setIsPersonOpen(false)} projectId={projectId} existingPerson={editingPerson} />
      <CommandModal isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} projectId={projectId} existingCommand={editingCommand} />
      
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

const TabButton: React.FC<{
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count: number;
}> = ({ active, onClick, icon, label, count }) => (
  <button 
    type="button"
    onClick={onClick}
    title={`${label} (${count})`}
    aria-label={`${label} (${count})`}
    className={`flex flex-1 lg:flex-none items-center justify-center gap-1 sm:gap-1.5 rounded-full font-semibold transition-colors min-w-0 px-1.5 py-2 sm:px-2.5 lg:px-3.5 text-[11px] sm:text-xs lg:text-sm whitespace-nowrap ${
      active 
        ? 'bg-[var(--secondary)] text-[var(--primary)]' 
        : 'bg-[var(--surface)] text-[var(--secondary)] hover:bg-[var(--accent)]'
    }`}
  >
    {icon}
    <span className="hidden lg:inline truncate">{label}</span>
    <span className="lg:hidden tabular-nums">{count}</span>
    <span className="hidden lg:inline tabular-nums">({count})</span>
  </button>
);

const SectionCard: React.FC<{title: string, icon: React.ReactNode, children: React.ReactNode, onAdd: () => void}> = ({title, icon, children, onAdd}) => (
  <div className="flex flex-col bg-[var(--surface)] rounded-[1.75rem] overflow-hidden">
    <div className="p-5 flex justify-between items-center bg-[var(--accent)]">
      <h3 className="text-lg font-extrabold tracking-tight flex items-center gap-3">
        {icon} {title}
      </h3>
      <button onClick={onAdd} className="hover:opacity-80 transition-opacity bg-[var(--secondary)] text-[var(--primary)] p-2 rounded-full">
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
    <div className="bg-[var(--primary)] rounded-3xl p-5 flex flex-col gap-2 relative group hover:bg-[var(--accent)]/50 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-bold text-lg tracking-tight">{snippet.name}</h4>
          {snippet.purpose && <p className="text-sm font-medium text-[var(--muted)]">{snippet.purpose}</p>}
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={handleCopy} className="hover:opacity-70" title="Copy Code">
            {copied ? <Check className="w-4 h-4 text-[var(--secondary)]" /> : <Copy className="w-4 h-4" />}
          </button>
          <button onClick={onEdit} className="hover:opacity-70"><Edit3 className="w-4 h-4" /></button>
          <button onClick={onDelete} className="text-red-600 hover:opacity-70"><Trash2 className="w-4 h-4" /></button>
        </div>
      </div>
      <div className="bg-[var(--secondary)] text-[var(--primary)] p-4 overflow-x-auto rounded-2xl">
        <pre className="font-mono text-sm"><code>{snippet.code}</code></pre>
      </div>
    </div>
  );
};

const CommandItem: React.FC<{item: ProjectCommand, onEdit: () => void, onDelete: () => void}> = ({ item, onEdit, onDelete }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(item.command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[var(--primary)] rounded-3xl p-5 flex flex-col gap-2 relative group hover:bg-[var(--accent)]/50 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-bold text-lg tracking-tight">{item.name}</h4>
          {item.notes && <p className="text-sm font-medium text-[var(--muted)]">{item.notes}</p>}
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={handleCopy} className="hover:opacity-70" title="Copy command">
            {copied ? <Check className="w-4 h-4 text-[var(--secondary)]" /> : <Copy className="w-4 h-4" />}
          </button>
          <button onClick={onEdit} className="hover:opacity-70"><Edit3 className="w-4 h-4" /></button>
          <button onClick={onDelete} className="text-red-600 hover:opacity-70"><Trash2 className="w-4 h-4" /></button>
        </div>
      </div>
      <div className="bg-[var(--secondary)] text-[var(--primary)] p-4 overflow-x-auto rounded-2xl">
        <pre className="font-mono text-sm"><code>{item.command}</code></pre>
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
    <div className="bg-[var(--primary)] rounded-2xl p-4 flex flex-col gap-2 group hover:bg-[var(--accent)]/50 transition-colors">
      <div className="flex justify-between items-center">
        <h4 className="font-bold text-sm tracking-tight">{item.name}</h4>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => setShow(!show)} className="hover:opacity-70" title="Reveal">
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <button onClick={handleCopy} className="hover:opacity-70" title="Copy Value">
            {copied ? <Check className="w-4 h-4 text-[var(--secondary)]" /> : <Copy className="w-4 h-4" />}
          </button>
          <button onClick={onEdit} className="hover:opacity-70"><Edit3 className="w-4 h-4" /></button>
          <button onClick={onDelete} className="text-red-600 hover:opacity-70"><Trash2 className="w-4 h-4" /></button>
        </div>
      </div>
      <div className="bg-[var(--surface)] p-2.5 break-all text-sm font-mono flex items-center justify-between rounded-xl">
        <span>{show ? item.value : '••••••••••••••••'}</span>
      </div>
    </div>
  );
};
