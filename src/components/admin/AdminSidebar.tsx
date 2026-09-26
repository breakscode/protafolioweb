import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  User,
  Sparkles,
  FolderGit2,
  Cpu,
  Award,
  GraduationCap,
  Briefcase,
  FlaskConical,
  Compass,
  Image,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  ExternalLink,
  Terminal,
  X
} from 'lucide-react';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { to: '/admin/dashboard', icon: <LayoutDashboard className="w-4 h-4" />, label: 'Dashboard' },
    { to: '/admin/profile', icon: <User className="w-4 h-4" />, label: 'Perfil' },
    { to: '/admin/hero', icon: <Sparkles className="w-4 h-4" />, label: 'Hero' },
    { to: '/admin/projects', icon: <FolderGit2 className="w-4 h-4" />, label: 'Proyectos' },
    { to: '/admin/skills', icon: <Cpu className="w-4 h-4" />, label: 'Tecnologías' },
    { to: '/admin/certifications', icon: <Award className="w-4 h-4" />, label: 'Certificaciones' },
    { to: '/admin/education', icon: <GraduationCap className="w-4 h-4" />, label: 'Educación' },
    { to: '/admin/experience', icon: <Briefcase className="w-4 h-4" />, label: 'Trayectoria' },
    { to: '/admin/research', icon: <FlaskConical className="w-4 h-4" />, label: 'Investigación' },
    { to: '/admin/navigation', icon: <Compass className="w-4 h-4" />, label: 'Navegación' },
    { to: '/admin/media', icon: <Image className="w-4 h-4" />, label: 'Media Library' },
    { to: '/admin/documents', icon: <FileText className="w-4 h-4" />, label: 'Documentos / CV' },
    { to: '/admin/messages', icon: <MessageSquare className="w-4 h-4" />, label: 'Mensajes' },
    { to: '/admin/settings', icon: <Settings className="w-4 h-4" />, label: 'Configuración' },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-950 border-r border-white/10 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Branding */}
        <div>
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Terminal className="w-4 h-4" />
              </div>
              <div>
                <h1 className="font-mono font-bold text-sm text-white">CMS Admin</h1>
                <p className="text-[10px] text-cyan-400 font-mono">Jhampier Juárez</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav List */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => onClose()}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-white/10 space-y-1 bg-slate-950">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-cyan-400 hover:bg-white/5 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4" /> Ver Portafolio
            </span>
            <span className="text-[10px] font-mono text-cyan-400">Público</span>
          </a>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
};
