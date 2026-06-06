import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';

interface FileInputProps {
  label: string;
  accept: string;
  preview?: string;
  onChange: (file: File) => void;
  onClear: () => void;
}

export const FileInput: React.FC<FileInputProps> = ({ label, accept, preview, onChange, onClear }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => inputRef.current?.click();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onChange(file);
    // Reset so same file can be re-selected
    e.target.value = '';
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-xs font-bold uppercase tracking-wider text-[var(--secondary)]">{label}</label>

      {preview ? (
        <div className="relative border-2 border-[var(--secondary)] h-24 flex items-center justify-center overflow-hidden group">
          <img src={preview} alt="Preview" className="h-full w-full object-contain p-2" />
          <button
            type="button"
            onClick={onClear}
            className="absolute top-1 right-1 bg-[var(--secondary)] text-[var(--primary)] p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          className="border-2 border-dashed border-[var(--secondary)] h-24 flex flex-col items-center justify-center gap-2 hover:bg-[var(--secondary)]/5 transition-colors text-[var(--secondary)] cursor-pointer"
        >
          <Upload className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Click to upload</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
};
