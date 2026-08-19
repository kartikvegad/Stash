import React, { useEffect, useRef, useState } from 'react';
import { Palette } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useProjects } from '../../context/ProjectContext';
import { ColorField } from '../ui/ColorField';
import { isValidHex, normalizeHex } from '../../lib/color';
import { resolveProjectTheme } from '../../lib/projects';

interface ThemeControlProps {
  variant?: 'default' | 'nav' | 'menu';
  projectId?: string | null;
}

export const ThemeControl: React.FC<ThemeControlProps> = ({ variant = 'default', projectId = null }) => {
  const { theme, globalTheme, setTheme } = useTheme();
  const { projects, updateProject } = useProjects();
  const [pri, setPri] = useState(theme.primary_color);
  const [sec, setSec] = useState(theme.secondary_color);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const project = projectId ? projects.find((item) => item.id === projectId) : undefined;

  useEffect(() => { setPri(theme.primary_color); }, [theme.primary_color]);
  useEffect(() => { setSec(theme.secondary_color); }, [theme.secondary_color]);

  useEffect(() => {
    if (variant !== 'menu') return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [variant]);

  const applyPrimary = (v: string) => {
    const val = normalizeHex(v);
    setPri(val);
    if (!isValidHex(val)) return;
    if (project) {
      const current = resolveProjectTheme(project, globalTheme);
      updateProject(project.id, { primary_color: val, secondary_color: current.secondary_color });
      return;
    }
    setTheme({ ...globalTheme, primary_color: val });
  };

  const applySecondary = (v: string) => {
    const val = normalizeHex(v);
    setSec(val);
    if (!isValidHex(val)) return;
    if (project) {
      const current = resolveProjectTheme(project, globalTheme);
      updateProject(project.id, { primary_color: current.primary_color, secondary_color: val });
      return;
    }
    setTheme({ ...globalTheme, secondary_color: val });
  };

  const fieldVariant = variant === 'default' ? 'page' : 'nav';
  const idPrefix = `${variant}-${projectId ?? 'global'}`;

  const fields = (
    <div className={variant === 'default' ? 'flex items-center gap-3' : 'flex flex-col gap-3'}>
      <ColorField
        id={`${idPrefix}-primary`}
        label="Bg"
        value={pri}
        onChange={applyPrimary}
        variant={fieldVariant}
      />
      <ColorField
        id={`${idPrefix}-secondary`}
        label="Ink"
        value={sec}
        onChange={applySecondary}
        variant={fieldVariant}
      />
    </div>
  );

  if (variant === 'menu') {
    return (
      <div ref={rootRef} className="relative shrink-0">
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="flex items-center gap-2 text-[var(--nav-fg)] text-sm font-medium px-1 py-1.5 rounded-full hover:bg-[color-mix(in_srgb,var(--nav-fg)_8%,transparent)]"
          aria-label="Theme colors"
          aria-expanded={open}
        >
          <Palette className="w-4 h-4" />
          <span>Theme</span>
        </button>
        {open && (
          <div className="absolute left-0 top-full mt-3 w-52 nav-panel z-30">
            {fields}
          </div>
        )}
      </div>
    );
  }

  return fields;
};
