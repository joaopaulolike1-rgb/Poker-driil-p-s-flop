import React from 'react';

interface Props {
  children: React.ReactNode;
  variant?: 'emerald' | 'amber' | 'red' | 'slate' | 'purple';
  className?: string;
}

export const Badge: React.FC<Props> = ({ children, variant = 'slate', className = '' }) => {
  const variantStyles = {
    emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    amber: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    red: 'bg-red-500/20 text-red-400 border-red-500/40',
    slate: 'bg-slate-800 text-slate-300 border-slate-700',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[11px] font-bold uppercase tracking-wider ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};