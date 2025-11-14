'use client';

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'dark';
}

export const Card = ({ children, className, onClick, variant = 'default' }: CardProps) => {
  const variantStyles = {
    default: 'bg-white border border-gray-200',
    dark: 'bg-black text-white',
  };

  return (
    <div
      className={cn(
        'rounded-2xl p-6 transition-all duration-200',
        variantStyles[variant],
        onClick && 'cursor-pointer hover:shadow-lg',
        !onClick && 'hover:shadow-md',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className }: { children: ReactNode; className?: string }) => {
  return <div className={cn('mb-4', className)}>{children}</div>;
};

export const CardTitle = ({ children, className }: { children: ReactNode; className?: string }) => {
  return <h3 className={cn('text-sm font-bold uppercase tracking-wider text-gray-500', className)}>{children}</h3>;
};

export const CardContent = ({ children, className }: { children: ReactNode; className?: string }) => {
  return <div className={cn('', className)}>{children}</div>;
};
