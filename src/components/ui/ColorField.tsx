import React from 'react';
import { isValidHex } from '../../lib/color';

interface ColorFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  variant?: 'page' | 'nav';
}

export const ColorField: React.FC<ColorFieldProps> = ({
  id,
  label,
  value,
  onChange,
  variant = 'page',
}) => {
  const nav = variant === 'nav';

  return (
    <div className="flex items-center gap-2 min-w-0">
      <label className="relative w-4 h-4 shrink-0 cursor-pointer" htmlFor={`swatch-${id}`}>
        <span
          className="block w-4 h-4 rounded-full"
          style={{
            background: value,
            boxShadow: nav
              ? '0 0 0 1px rgba(255,255,255,0.55), 0 0 0 2px rgba(0,0,0,0.55)'
              : '0 0 0 1px var(--border)',
          }}
          aria-hidden
        />
        <input
          id={`swatch-${id}`}
          type="color"
          value={isValidHex(value) ? value : '#000000'}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer"
          aria-label={`${label} color`}
        />
      </label>
      <label htmlFor={id} className={nav ? 'text-sm font-medium text-[var(--nav-muted)]' : 'ui-label'}>
        {label}
      </label>
      <input
        type="text"
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={7}
        className={
          nav
            ? 'min-w-0 flex-1 bg-transparent text-[var(--nav-fg)] text-sm font-medium focus:outline-none'
            : 'w-24 px-2.5 py-1.5 border border-[var(--border)] bg-[var(--primary)] text-[var(--secondary)] text-sm font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--accent)]'
        }
        placeholder={label === 'Bg' ? '#F5F5F7' : '#1A1C1E'}
      />
    </div>
  );
};
