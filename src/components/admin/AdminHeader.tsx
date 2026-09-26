import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { isSupabaseConfigured } from '../../lib/supabase';
import { Menu, Database, ShieldCheck, User } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface AdminHeaderProps {
  onToggleSidebar: () => void;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onToggleSidebar,
  title,
  subtitle,
  actions,
}) => {
  const { user, isMockAuth } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white"
          aria-label="Abrir menú"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            {title}
          </h2>
          {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3 self-end sm:self-auto">
        {/* Supabase connection status pill */}
        {isSupabaseConfigured() ? (
          <Badge variant="success" size="sm" dot>
            Supabase DB Conectado
          </Badge>
        ) : (
          <Badge variant="warning" size="sm" dot>
            Modo Local / Demo
          </Badge>
        )}

        {actions}
      </div>
    </header>
  );
};
