export type ProjectType =
  | 'web'
  | 'mobile'
  | 'desktop'
  | 'backend'
  | 'design'
  | 'client'
  | 'personal'
  | 'other';

export type Project = {
  id: string;
  name: string;
  description: string;
  type?: ProjectType;
  logo_url?: string;
  image_url?: string;
  primary_color?: string;
  secondary_color?: string;
  created_at: string;
  updated_at: string;
};

export type ProjectDocument = {
  id: string;
  project_id: string;
  name: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export type ProjectLink = {
  id: string;
  project_id: string;
  name: string;
  url: string;
};

export type ProjectKey = {
  id: string;
  project_id: string;
  name: string;
  value: string;
};

export type ProjectNote = {
  id: string;
  project_id: string;
  title: string;
  content: string;
  created_at: string;
};

export type ProjectSnippet = {
  id: string;
  project_id: string;
  name: string;
  purpose: string;
  code: string;
};

export type ProjectTask = {
  id: string;
  project_id: string;
  title: string;
  done: boolean;
  deadline?: string;
};

export type ProjectPerson = {
  id: string;
  project_id: string;
  name: string;
  role: string;
  contact: string;
};

export type ProjectCommand = {
  id: string;
  project_id: string;
  name: string;
  command: string;
  notes: string;
};

export type AppTheme = {
  primary_color: string;
  secondary_color: string;
};
