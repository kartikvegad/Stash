import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, id, ...props }, ref) => {
    const inputId = id || props.name;
    
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="ui-label">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`px-4 py-2.5 bg-[var(--primary)] border border-[var(--border)] text-[var(--secondary)] placeholder:text-[var(--muted)]/70 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent rounded-2xl w-full ${className}`}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = 'Input';
