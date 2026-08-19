import React from 'react';
import { ColorField } from './ColorField';
import { isValidHex } from '../../lib/color';
import { projectTypeLabel } from '../../lib/projects';
import { ProjectType } from '../../types';

interface ProjectThemeFieldsProps {
  idPrefix: string;
  primary: string;
  secondary: string;
  onPrimary: (value: string) => void;
  onSecondary: (value: string) => void;
  name: string;
  type: ProjectType;
}

export const ProjectThemeFields: React.FC<ProjectThemeFieldsProps> = ({
  idPrefix,
  primary,
  secondary,
  onPrimary,
  onSecondary,
  name,
  type,
}) => {
  const bg = isValidHex(primary) ? primary : '#F5F5F7';
  const ink = isValidHex(secondary) ? secondary : '#1A1C1E';

  return (
    <div className="flex flex-col gap-2">
      <p className="ui-label">Theme</p>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <ColorField
          id={`${idPrefix}-primary`}
          label="Bg"
          value={primary}
          onChange={onPrimary}
        />
        <ColorField
          id={`${idPrefix}-secondary`}
          label="Ink"
          value={secondary}
          onChange={onSecondary}
        />
      </div>
      <div
        className="h-10 rounded-full px-4 flex items-center justify-between gap-3"
        style={{ background: bg, color: ink }}
      >
        <span className="text-sm font-semibold truncate">{name.trim() || 'Preview'}</span>
        <span className="text-xs font-semibold shrink-0 opacity-70">{projectTypeLabel(type)}</span>
      </div>
    </div>
  );
};
