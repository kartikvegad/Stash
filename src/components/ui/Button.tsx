import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent)] disabled:opacity-50 disabled:cursor-not-allowed rounded-full';
    
    const variants = {
      primary: 'bg-[var(--secondary)] text-[var(--primary)] hover:opacity-90',
      outline: 'bg-[var(--surface)] text-[var(--secondary)] border border-[var(--border)] hover:bg-[var(--accent)]',
      ghost: 'bg-transparent text-[var(--muted)] hover:bg-[var(--accent)]/60 hover:text-[var(--secondary)]',
    };

    const sizes = {
      sm: 'px-4 py-1.5 text-xs',
      md: 'px-5 py-2.5 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
