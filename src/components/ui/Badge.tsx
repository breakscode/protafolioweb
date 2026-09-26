import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'purple';
  size?: 'sm' | 'md';
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className,
  dot = false,
}) => {
  const variants = {
    primary: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    danger: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    neutral: "bg-slate-800/80 text-slate-300 border-white/10",
    purple: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
  };

  const dotColors = {
    primary: "bg-cyan-400",
    success: "bg-emerald-400",
    warning: "bg-amber-400",
    danger: "bg-rose-400",
    neutral: "bg-slate-400",
    purple: "bg-indigo-400",
  };

  const sizes = {
    sm: "text-xs px-2 py-0.5 font-medium",
    md: "text-xs px-2.5 py-1 font-semibold",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border tracking-wide select-none",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {dot && <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", dotColors[variant])} />}
      {children}
    </span>
  );
};
