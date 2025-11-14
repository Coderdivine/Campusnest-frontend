'use client';

import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const baseStyles = 'font-bold uppercase tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2';
    
    const variantStyles = {
      primary: 'bg-black text-white hover:bg-gray-800 active:bg-gray-900',
      secondary: 'bg-gray-200 text-black hover:bg-gray-300 active:bg-gray-400',
      ghost: 'bg-transparent text-gray-700 border border-gray-300 hover:border-black hover:text-black',
    };

    const sizeStyles = {
      sm: 'px-5 py-2.5 text-xs rounded-lg',
      md: 'px-6 py-3.5 text-sm rounded-xl',
      lg: 'px-8 py-4 text-sm rounded-full',
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          loading && 'cursor-wait opacity-70',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>Loading...</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
