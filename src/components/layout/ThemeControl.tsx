import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

export const ThemeControl: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [pri, setPri] = useState(theme.primary_color);
  const [sec, setSec] = useState(theme.secondary_color);

  useEffect(() => { setPri(theme.primary_color); }, [theme.primary_color]);
  useEffect(() => { setSec(theme.secondary_color); }, [theme.secondary_color]);

  const isValidHex = (v: string) => /^#[0-9A-Fa-f]{6}$/.test(v);

  const handlePri = (v: string) => {
    const val = v.startsWith('#') ? v : `#${v}`;
    setPri(val);
    if (isValidHex(val)) setTheme({ ...theme, primary_color: val });
  };

  const handleSec = (v: string) => {
    const val = v.startsWith('#') ? v : `#${v}`;
    setSec(val);
    if (isValidHex(val)) setTheme({ ...theme, secondary_color: val });
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <label htmlFor="primary" className="text-xs font-bold uppercase text-[var(--secondary)]">Pri</label>
        <input
          type="text"
          id="primary"
          value={pri}
          onChange={(e) => handlePri(e.target.value)}
          maxLength={7}
          className="w-22 px-2 py-1 border-2 border-[var(--secondary)] bg-transparent text-[var(--secondary)] font-mono text-xs font-bold uppercase rounded-none focus:outline-none focus:ring-2 focus:ring-[var(--secondary)]"
          placeholder="#E0E0E0"
        />
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor="secondary" className="text-xs font-bold uppercase text-[var(--secondary)]">Sec</label>
        <input
          type="text"
          id="secondary"
          value={sec}
          onChange={(e) => handleSec(e.target.value)}
          maxLength={7}
          className="w-22 px-2 py-1 border-2 border-[var(--secondary)] bg-transparent text-[var(--secondary)] font-mono text-xs font-bold uppercase rounded-none focus:outline-none focus:ring-2 focus:ring-[var(--secondary)]"
          placeholder="#FF4400"
        />
      </div>
    </div>
  );
};
