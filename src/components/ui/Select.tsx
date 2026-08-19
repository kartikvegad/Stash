import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', label, id, children, ...props }, ref) => {
    const selectId = id || props.name;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={selectId} className="ui-label">
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={`px-4 py-2.5 bg-[var(--primary)] border border-[var(--border)] text-[var(--secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent rounded-2xl w-full ${className}`}
          {...props}
        >
          {children}
        </select>
      </div>
    );
  }
);
Select.displayName = 'Select';
