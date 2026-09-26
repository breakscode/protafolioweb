import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { StatCard } from '../../components/admin/StatCard';
import { projectsService } from '../../services/projectsService';
import { skillsService } from '../../services/skillsService';
import { certificationsService } from '../../services/certificationsService';
import { messagesService } from '../../services/messagesService';
import { Project, ContactMessage } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { 
  FolderGit2, 
  Cpu, 
  Award, 
  MessageSquare, 
  ArrowRight, 
  Plus, 
  Eye, 
  Clock, 
  Mail,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { onToggleSidebar } = useOutletContext<{ onToggleSidebar: () => void }>();

  const [projects, setProjects] = useState<Project[]>([]);
  const [skillsCount, setSkillsCount] = useState(0);
  const [certsCount, setCertsCount] = useState(0);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      projectsService.getProjects(false),
      skillsService.getSkills(false),
      certificationsService.getCertifications(false),
      messagesService.getMessages(),
    ]).then(([projs, sks, certs, msgs]) => {
      setProjects(projs);
      setSkillsCount(sks.length);
      setCertsCount(certs.length);
      setMessages(msgs);
      setLoading(false);
    });
  }, []);

  const publishedProjects = projects.filter(p => p.is_published).length;
  const newMessages = messages.filter(m => m.status === 'new').length;

  return (
    <div className="space-y-8">
      <AdminHeader
        onToggleSidebar={onToggleSidebar}
        title="Dashboard General"
        subtitle="Métricas en tiempo real y resumen del contenido gestionado."
        actions={
          <div className="flex items-center gap-2">
            <Link to="/admin/projects">
              <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                Nuevo Proyecto
              </Button>
            </Link>
          </div>
        }
      />

      <div className="px-4 sm:px-8 space-y-8">
        
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Proyectos"
            value={projects.length}
            subtitle={`${publishedProjects} publicados / ${projects.length - publishedProjects} ocultos`}
            icon={<FolderGit2 className="w-6 h-6" />}
            color="cyan"
          />
          <StatCard
            title="Tecnologías"
            value={skillsCount}
            subtitle="Categorizadas en el Stack"
            icon={<Cpu className="w-6 h-6" />}
            color="purple"
          />
          <StatCard
            title="Certificaciones"
            value={certsCount}
            subtitle="Credenciales activas"
            icon={<Award className="w-6 h-6" />}
            color="emerald"
          />
          <StatCard
            title="Mensajes Recibidos"
            value={messages.length}
            subtitle={`${newMessages} mensajes sin leer`}
            icon={<MessageSquare className="w-6 h-6" />}
            color="amber"
          />
        </div>

        {/* Two Columns: Recent Projects & Recent Messages */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Recent Projects */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-cyan-400" /> Proyectos Recientes
              </h3>
              <Link
                to="/admin/projects"
                className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-mono"
              >
                Gestionar todos <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="glass-card rounded-2xl border border-white/10 overflow-hidden divide-y divide-white/5">
              {projects.slice(0, 5).map((proj) => (
                <div key={proj.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                  <div className="space-y-1 max-w-[70%]">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-white truncate">{proj.title}</h4>
                      {proj.is_featured && <Badge variant="warning" size="sm">Destacado</Badge>}
                    </div>
                    <p className="text-xs text-slate-400 font-mono">
                      {proj.category} • {proj.year} {proj.organization ? `• ${proj.organization}` : ''}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant={proj.is_published ? 'success' : 'neutral'} size="sm">
                      {proj.is_published ? 'Publicado' : 'Oculto'}
                    </Badge>
                    <Link
                      to="/admin/projects"
                      className="p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-cyan-400 transition-colors"
                      title="Editar en Proyectos"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Messages */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-400" /> Últimos Mensajes
              </h3>
              <Link
                to="/admin/messages"
                className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-mono"
              >
                Ver bandeja <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="glass-card rounded-2xl border border-white/10 overflow-hidden divide-y divide-white/5">
              {messages.length > 0 ? (
                messages.slice(0, 4).map((msg) => (
                  <div key={msg.id} className="p-4 space-y-1.5 hover:bg-white/5 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white">{msg.name}</span>
                      <Badge variant={msg.status === 'new' ? 'warning' : 'neutral'} size="sm">
                        {msg.status === 'new' ? 'Nuevo' : msg.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-300 font-mono truncate">{msg.subject || msg.email}</p>
                    <p className="text-xs text-slate-400 line-clamp-2">{msg.message}</p>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-xs text-slate-400">
                  No hay mensajes recibidos aún.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
