import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      primary: 'bg-[var(--secondary)] text-[var(--primary)] hover:opacity-90 border-2 border-[var(--secondary)]',
      outline: 'bg-transparent text-[var(--secondary)] border-2 border-[var(--secondary)] hover:bg-[var(--secondary)] hover:text-[var(--primary)]',
      ghost: 'bg-transparent text-[var(--secondary)] hover:bg-black/10 border-2 border-transparent',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} rounded-none ${className}`}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
