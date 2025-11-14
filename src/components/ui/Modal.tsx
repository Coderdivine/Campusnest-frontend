'use client';

import { X } from 'lucide-react';
import { ReactNode, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'full';
  position?: 'center' | 'right' | 'bottom';
}

export const Modal = ({ 
  isOpen, 
  onClose, 
  children, 
  title, 
  size = 'md',
  position = 'center' 
}: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeStyles = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    full: 'max-w-full',
  };

  const positionStyles = {
    center: 'items-center justify-center',
    right: 'items-start justify-end',
    bottom: 'items-end justify-center',
  };

  const contentStyles = 
    position === 'right' ? 'h-full w-full max-w-md rounded-l-3xl animate-slide-in-right' 
    : position === 'bottom' ? 'w-full max-w-full rounded-t-3xl animate-slide-in-up'
    : 'rounded-3xl animate-fade-in';

  return (
    <div 
      className={cn(
        'fixed inset-0 z-50 flex',
        positionStyles[position]
      )}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      
      {/* Modal Content */}
      <div
        className={cn(
          'relative bg-white shadow-2xl overflow-hidden',
          position === 'center' && 'mx-4 my-8 w-full',
          position === 'center' && sizeStyles[size],
          contentStyles
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <h2 className="text-2xl font-extrabold uppercase tracking-tight">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        )}
        
        {/* Body */}
        <div className={cn(
          'overflow-y-auto',
          position === 'right' ? 'p-8' : 
          position === 'bottom' ? 'max-h-[85vh] p-8' :
          'max-h-[80vh] p-8'
        )}
        style={{
          height: position === 'right' ? 'calc(100vh - 88px)' : undefined
        }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
