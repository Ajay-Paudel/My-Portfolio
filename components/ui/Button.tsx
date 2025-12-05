import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  icon?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  icon = false,
  className = '',
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center px-6 py-3 rounded-full font-medium transition-all duration-300 transform active:scale-95 text-sm md:text-base";
  
  const variants = {
    primary: "bg-gradient-to-r from-brand-indigo to-brand-violet text-white shadow-lg shadow-brand-indigo/30 hover:shadow-brand-indigo/50 hover:-translate-y-1 dark:shadow-none dark:hover:shadow-[0_0_20px_rgba(147,51,234,0.5)]",
    outline: "border-2 border-brand-indigo/20 dark:border-white/10 text-brand-dark dark:text-white hover:border-brand-indigo dark:hover:border-brand-accent hover:bg-brand-indigo/5 dark:hover:bg-white/5 hover:text-brand-indigo dark:hover:text-brand-accent bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm",
    ghost: "text-brand-dark dark:text-white hover:text-brand-indigo dark:hover:text-brand-accent hover:bg-brand-indigo/5 dark:hover:bg-white/5",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
      {icon && <ArrowRight className="ml-2 w-4 h-4" />}
    </button>
  );
};