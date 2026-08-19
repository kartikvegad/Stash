import { AppTheme, Project, ProjectType } from '../types';
import { isValidHex } from './color';

export const PROJECT_TYPES: ProjectType[] = [
  'web',
  'mobile',
  'desktop',
  'backend',
  'design',
  'client',
  'personal',
  'other',
];

export const projectTypeLabel = (type: ProjectType): string => {
  switch (type) {
    case 'web':
      return 'Web';
    case 'mobile':
      return 'Mobile';
    case 'desktop':
      return 'Desktop';
    case 'backend':
      return 'Backend';
    case 'design':
      return 'Design';
    case 'client':
      return 'Client';
    case 'personal':
      return 'Personal';
    case 'other':
      return 'Other';
    default: {
      const _exhaustive: never = type;
      return _exhaustive;
    }
  }
};

export const resolveProjectType = (project: Project): ProjectType =>
  project.type ?? 'other';

export const resolveProjectTheme = (project: Project, fallback: AppTheme): AppTheme => ({
  primary_color:
    project.primary_color && isValidHex(project.primary_color)
      ? project.primary_color
      : fallback.primary_color,
  secondary_color:
    project.secondary_color && isValidHex(project.secondary_color)
      ? project.secondary_color
      : fallback.secondary_color,
});
