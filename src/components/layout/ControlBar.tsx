import { ThemeControl } from './ThemeControl';
import { StashLogo } from '../ui/StashLogo';
import { Search, Plus } from 'lucide-react';
import { Button } from '../ui/Button';

interface ControlBarProps {
  onGoHome: () => void;
  onSearch: (query: string) => void;
  onCreateProject: () => void;
}

export const ControlBar: React.FC<ControlBarProps> = ({ onGoHome, onSearch, onCreateProject }) => {
  return (
    <div className="w-full border-b-4 border-[var(--secondary)] px-6 py-5 flex items-center justify-between sticky top-0 bg-[var(--primary)] z-10">
      <div className="flex items-center gap-8">
        <StashLogo
          onClick={onGoHome}
          className="h-14 cursor-pointer hover:opacity-70 transition-opacity"
        />
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-5 h-5 text-[var(--secondary)]" />
          <input 
            type="text" 
            placeholder="SEARCH PROJECTS..."
            onChange={(e) => onSearch(e.target.value)}
            className="pl-10 pr-4 py-3 border-2 border-[var(--secondary)] bg-transparent text-[var(--secondary)] placeholder:text-[var(--secondary)]/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--secondary)] w-80 rounded-none font-bold text-sm uppercase"
          />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <Button onClick={onCreateProject} className="gap-2 text-sm">
          <Plus className="w-5 h-5" />
          NEW PROJECT
        </Button>
        <ThemeControl />
      </div>
    </div>
  );
};
