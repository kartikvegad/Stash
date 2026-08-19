import { useEffect, useRef, useState } from 'react';
import { navContrastVars, useTheme } from '../../context/ThemeContext';
import { ThemeControl } from './ThemeControl';
import { StashLogo } from '../ui/StashLogo';
import { TaskAlertButton } from './TaskAlertButton';
import { Search, Plus, Palette, X } from 'lucide-react';

interface ControlBarProps {
  onGoHome: () => void;
  onSearch: (query: string) => void;
  onCreateProject: () => void;
  onOpenProject: (projectId: string) => void;
  projectId?: string | null;
}

type MobilePanel = 'search' | 'theme' | null;

export const ControlBar: React.FC<ControlBarProps> = ({ onGoHome, onSearch, onCreateProject, onOpenProject, projectId = null }) => {
  const { theme } = useTheme();
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>(null);
  const [query, setQuery] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const handleSearch = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  useEffect(() => {
    if (mobilePanel === 'search') {
      searchRef.current?.focus();
    }
  }, [mobilePanel]);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setMobilePanel(null);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobilePanel(null);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const togglePanel = (panel: Exclude<MobilePanel, null>) => {
    setMobilePanel((current) => (current === panel ? null : panel));
  };

  return (
    <div
      ref={rootRef}
      className="nav-dock sticky top-0 z-20 overflow-visible px-3 sm:px-5 pt-5 pb-3"
      style={navContrastVars(theme.secondary_color)}
    >
      <div className="nav-pill mx-auto w-full max-w-3xl">
        <button
          type="button"
          onClick={onGoHome}
          className="nav-chip h-10 w-10 hover:opacity-85 transition-opacity"
          aria-label="Go home"
        >
          <StashLogo className="h-5 w-5" />
        </button>

        <div className="min-w-0 flex-1 flex items-center px-1 sm:px-2">
          <div className="hidden md:flex items-center gap-3 w-full min-w-0">
            <Search className="w-4 h-4 text-[var(--nav-muted)] shrink-0" />
            <input
              type="text"
              placeholder="Search"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              className="nav-input min-w-0"
            />
            <div className="nav-divider" />
            <ThemeControl variant="menu" projectId={projectId} />
          </div>

          <div className="flex md:hidden items-center justify-evenly w-full">
            <button
              type="button"
              onClick={() => togglePanel('search')}
              className="flex items-center gap-2 text-[var(--nav-fg)] text-sm font-medium px-2 py-1.5 rounded-full hover:bg-[color-mix(in_srgb,var(--nav-fg)_8%,transparent)]"
              aria-expanded={mobilePanel === 'search'}
              aria-label="Search projects"
            >
              {mobilePanel === 'search' ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
              <span className="hidden sm:inline">Search</span>
            </button>
            <div className="nav-divider" />
            <button
              type="button"
              onClick={() => togglePanel('theme')}
              className="flex items-center gap-2 text-[var(--nav-fg)] text-sm font-medium px-2 py-1.5 rounded-full hover:bg-[color-mix(in_srgb,var(--nav-fg)_8%,transparent)]"
              aria-expanded={mobilePanel === 'theme'}
              aria-label="Theme colors"
            >
              <Palette className="w-4 h-4" />
              <span className="hidden sm:inline">Theme</span>
            </button>
          </div>
        </div>

        <TaskAlertButton onOpenProject={onOpenProject} />
        <button
          type="button"
          onClick={onCreateProject}
          className="nav-chip h-10 px-3 sm:px-4 gap-2 text-sm font-semibold hover:opacity-85 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New project</span>
        </button>
      </div>

      {mobilePanel !== null && (
        <div className="md:hidden mx-auto w-full max-w-3xl mt-3">
          <div className="nav-panel">
            {mobilePanel === 'search' && (
              <div className="flex items-center gap-3">
                <Search className="w-4 h-4 text-[var(--nav-muted)] shrink-0" />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search projects..."
                  value={query}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="nav-input"
                />
              </div>
            )}
            {mobilePanel === 'theme' && <ThemeControl variant="nav" projectId={projectId} />}
          </div>
        </div>
      )}
    </div>
  );
};
