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
  confirmText = 'CONFIRM', 
  cancelText = 'CANCEL',
  onConfirm, 
  onClose 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[var(--secondary)]/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-[var(--primary)] border-4 border-red-600 w-full max-w-md p-8 relative shadow-[8px_8px_0px_0px_#dc2626]">
        <button onClick={onClose} className="absolute top-4 right-4 text-[var(--secondary)] hover:opacity-70 transition-opacity">
          <X className="w-6 h-6" />
        </button>
        
        <div className="flex items-center gap-3 mb-6 text-red-600">
          <AlertTriangle className="w-8 h-8" />
          <h2 className="text-3xl font-black uppercase tracking-tighter">
            {title}
          </h2>
        </div>
        
        <p className="text-lg font-medium text-[var(--secondary)] mb-8">
          {message}
        </p>
        
        <div className="flex justify-end gap-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            {cancelText}
          </Button>
          <Button 
            type="button" 
            className="bg-red-600 text-white border-red-600 hover:bg-red-700 hover:border-red-700" 
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
