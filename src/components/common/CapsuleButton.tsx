import React from 'react';
import { cn } from '../../utils/cn';

interface CapsuleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const CapsuleButton: React.FC<CapsuleButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 active:scale-95";
  
  const variants = {
    primary: "bg-indigo-600 text-white shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] hover:bg-indigo-700 hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)]",
    secondary: "bg-indigo-50 text-indigo-600 hover:bg-indigo-100",
    outline: "border border-slate-200 bg-transparent text-slate-700 hover:bg-slate-50",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2 text-sm",
    lg: "px-8 py-3 text-base"
  };

  return (
    <button 
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};
