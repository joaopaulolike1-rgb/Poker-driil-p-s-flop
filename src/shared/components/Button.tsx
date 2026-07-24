import React from 'react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<Props> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'font-black rounded-xl transition-all shadow-md active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none select-none uppercase tracking-wider';

  const sizeStyles = {
    sm: 'py-2 px-3 text-xs',
    md: 'py-3 px-4 text-xs',
    lg: 'py-3.5 px-6 text-sm',
  };

  const variantStyles = {
    primary: 'bg-gradient-to-r from-amber-500 to-amber-600 text-black hover:brightness-110 shadow-amber-500/20',
    secondary: 'bg-slate-800 hover:bg-slate-700 text-white border border-white/10',
    danger: 'bg-red-700 hover:bg-red-600 text-white shadow-red-700/20',
    ghost: 'bg-transparent hover:bg-white/5 text-slate-300 border border-transparent',
  };

  return (
    <button
      disabled={disabled}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};