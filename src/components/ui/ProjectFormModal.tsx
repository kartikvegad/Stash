import React from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { Select } from './Select';
import { FileInput } from './FileInput';
import { ProjectThemeFields } from './ProjectThemeFields';
import { ProjectType } from '../../types';
import { PROJECT_TYPES, projectTypeLabel } from '../../lib/projects';

export type ProjectFormValue = {
  name: string;
  description: string;
  type: ProjectType;
  primaryColor: string;
  secondaryColor: string;
  logoData?: string;
  imageData?: string;
};

interface ProjectFormModalProps {
  title: string;
  submitLabel: string;
  idPrefix: string;
  value: ProjectFormValue;
  onChange: (value: ProjectFormValue) => void;
  onSubmit: () => void;
  onClose: () => void;
  onReadFile: (file: File) => Promise<string>;
}

export const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
  title,
  submitLabel,
  idPrefix,
  value,
  onChange,
  onSubmit,
  onClose,
  onReadFile,
}) => {
  const patch = (next: Partial<ProjectFormValue>) => onChange({ ...value, ...next });

  return (
    <div className="modal-overlay">
      <div className="modal-panel modal-panel-form">
        <div className="flex items-start justify-between gap-4 px-7 pt-7 pb-4 shrink-0">
          <h2 className="text-3xl font-bold tracking-tight text-[var(--secondary)]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-[var(--muted)] hover:text-[var(--secondary)] transition-colors mt-1"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
          className="flex flex-col flex-1 min-h-0"
        >
          <div className="flex-1 overflow-y-auto custom-scrollbar px-7 pb-2 flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
              <div className="sm:col-span-3">
                <Input
                  label="Project name"
                  placeholder="e.g. Apollo Mission"
                  value={value.name}
                  onChange={(e) => patch({ name: e.target.value })}
                  autoFocus
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <Select
                  label="Type"
                  value={value.type}
                  onChange={(e) => patch({ type: e.target.value as ProjectType })}
                >
                  {PROJECT_TYPES.map((projectType) => (
                    <option key={projectType} value={projectType}>
                      {projectTypeLabel(projectType)}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <ProjectThemeFields
              idPrefix={idPrefix}
              primary={value.primaryColor}
              secondary={value.secondaryColor}
              onPrimary={(primaryColor) => patch({ primaryColor })}
              onSecondary={(secondaryColor) => patch({ secondaryColor })}
              name={value.name}
              type={value.type}
            />

            <div className="flex flex-col gap-1.5 w-full">
              <label className="ui-label">Description</label>
              <textarea
                className="ui-textarea min-h-[88px]"
                placeholder="Brief description of the project goals..."
                value={value.description}
                onChange={(e) => patch({ description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-1">
              <FileInput
                label="Logo"
                accept="image/png,image/svg+xml,image/jpeg"
                preview={value.logoData}
                onChange={async (file) => patch({ logoData: await onReadFile(file) })}
                onClear={() => patch({ logoData: undefined })}
              />
              <FileInput
                label="Cover"
                accept="image/png,image/svg+xml,image/jpeg"
                preview={value.imageData}
                onChange={async (file) => patch({ imageData: await onReadFile(file) })}
                onClear={() => patch({ imageData: undefined })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 px-7 py-5 shrink-0">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{submitLabel}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
