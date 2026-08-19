import React from 'react';
import { Button } from './Button';
import { X, AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ 
  isOpen, 
  title, 
  message, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  onConfirm, 
  onClose 
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 100 }}>
      <div className="modal-panel max-w-md">
        <button onClick={onClose} className="absolute top-5 right-5 text-[var(--muted)] hover:text-[var(--secondary)] transition-colors">
          <X className="w-6 h-6" />
        </button>
        
        <div className="flex items-center gap-3 mb-5 text-red-600">
          <div className="bg-red-50 p-2 rounded-full">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">
            {title}
          </h2>
        </div>
        
        <p className="text-base font-medium text-[var(--muted)] mb-8">
          {message}
        </p>
        
        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            {cancelText}
          </Button>
          <Button 
            type="button" 
            className="bg-red-600 text-white hover:bg-red-700" 
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};
