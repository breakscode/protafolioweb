import React from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: string;
  color?: 'cyan' | 'purple' | 'emerald' | 'amber' | 'blue';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'cyan',
}) => {
  const colorMap = {
    cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 flex items-center justify-between">
      <div className="space-y-1">
        <p className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider">{title}</p>
        <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono">{value}</p>
        {subtitle && <p className="text-[11px] text-slate-400">{subtitle}</p>}
      </div>
      <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${colorMap[color]}`}>
        {icon}
      </div>
    </div>
  );
};
