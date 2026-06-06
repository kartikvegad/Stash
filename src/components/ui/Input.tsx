import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, id, ...props }, ref) => {
    const inputId = id || props.name;
    
    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <label htmlFor={inputId} className="text-xs font-bold uppercase tracking-wider text-[var(--secondary)]">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`px-3 py-2 bg-[var(--primary)] border-2 border-[var(--secondary)] text-[var(--secondary)] placeholder:text-[var(--secondary)]/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--secondary)] rounded-none w-full ${className}`}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = 'Input';
