export type Project = {
  id: string;
  name: string;
  description: string;
  logo_url?: string;
  image_url?: string;
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

export type ProjectDeployment = {
  id: string;
  project_id: string;
  notes: string;
};

export type AppTheme = {
  primary_color: string;
  secondary_color: string;
};
