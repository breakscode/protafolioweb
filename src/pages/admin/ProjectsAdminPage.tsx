import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { projectsService } from '../../services/projectsService';
import { Project, PROJECT_CATEGORIES } from '../../types';
import { ProjectFormModal } from './ProjectFormModal';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { 
  Plus, 
  Search, 
  Edit, 
  Copy, 
  Trash2, 
  Star, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  ExternalLink,
  FolderGit2
} from 'lucide-react';

export const ProjectsAdminPage: React.FC = () => {
  const { onToggleSidebar } = useOutletContext<{ onToggleSidebar: () => void }>();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const loadProjects = async () => {
    setLoading(true);
    const data = await projectsService.getProjects(false);
    setProjects(data);
    setLoading(false);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleSaveProject = async (projectData: Omit<Project, 'id'> & { id?: string }) => {
    if (projectData.id) {
      await projectsService.updateProject(projectData.id, projectData);
      showToast('Proyecto actualizado correctamente.');
    } else {
      await projectsService.createProject(projectData as Omit<Project, 'id'>);
      showToast('Proyecto creado correctamente.');
    }
    await loadProjects();
  };

  const handleDuplicate = async (id: string) => {
    try {
      await projectsService.duplicateProject(id);
      showToast('Proyecto duplicado exitosamente.');
      await loadProjects();
    } catch (err) {
      console.error('Error duplicating:', err);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await projectsService.deleteProject(deleteTarget.id);
      showToast('Proyecto eliminado correctamente.');
      setDeleteTarget(null);
      await loadProjects();
    } catch (err) {
      console.error('Error deleting:', err);
    } finally {
      setDeleting(false);
    }
  };

  const handleTogglePublish = async (proj: Project) => {
    await projectsService.togglePublish(proj.id, proj.is_published);
    await loadProjects();
    showToast(`Proyecto ${proj.is_published ? 'ocultado' : 'publicado'}.`);
  };

  const handleToggleFeatured = async (proj: Project) => {
    await projectsService.toggleFeatured(proj.id, proj.is_featured);
    await loadProjects();
    showToast(`Proyecto ${proj.is_featured ? 'desmarcado como destacado' : 'marcado como destacado'}.`);
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.short_description.toLowerCase().includes(search.toLowerCase()) ||
      p.technologies.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchesCat = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-8">
      <AdminHeader
        onToggleSidebar={onToggleSidebar}
        title="Gestión de Proyectos"
        subtitle="Crea, edita, duplica y administra la visibilidad de tus proyectos."
        actions={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => {
              setEditingProject(null);
              setIsFormOpen(true);
            }}
          >
            Nuevo Proyecto
          </Button>
        }
      />

      <div className="px-4 sm:px-8 space-y-6">
        
        {toastMessage && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-full sm:w-80">
            <Input
              placeholder="Buscar por título o tecnología..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          <div className="w-full sm:w-56">
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              options={[
                { value: 'all', label: 'Todas las categorías' },
                ...PROJECT_CATEGORIES.map((cat) => ({
                  value: cat,
                  label: cat,
                })),
              ]}
            />
          </div>
        </div>

        {/* Projects Table */}
        <div className="glass-card rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-mono border-b border-white/10 text-[11px]">
                <tr>
                  <th className="px-6 py-4">Proyecto</th>
                  <th className="px-6 py-4">Categoría</th>
                  <th className="px-6 py-4">Año / Org</th>
                  <th className="px-6 py-4 text-center">Destacado</th>
                  <th className="px-6 py-4 text-center">Estado</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-white/5 transition-colors">
                    
                    {/* Project Title & Image */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                          {project.main_image_url ? (
                            <img src={project.main_image_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <FolderGit2 className="w-5 h-5 text-slate-500" />
                          )}
                        </div>
                        <div className="space-y-0.5">
                          <p className="font-bold text-white text-sm">{project.title}</p>
                          <p className="text-[11px] text-slate-400 font-mono line-clamp-1">{project.short_description}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4">
                      <Badge variant="primary" size="sm">
                        {project.category}
                      </Badge>
                    </td>

                    {/* Year & Organization */}
                    <td className="px-6 py-4 font-mono">
                      <p className="text-white">{project.year}</p>
                      <p className="text-[11px] text-slate-400 truncate max-w-[150px]">{project.organization || '—'}</p>
                    </td>

                    {/* Featured toggle */}
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleFeatured(project)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          project.is_featured
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                            : 'bg-slate-900 border-white/10 text-slate-500 hover:text-slate-300'
                        }`}
                        title="Alternar Destacado"
                      >
                        <Star className="w-4 h-4 fill-current" />
                      </button>
                    </td>

                    {/* Published status toggle */}
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleTogglePublish(project)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-semibold border transition-all ${
                          project.is_published
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                            : 'bg-slate-800 text-slate-400 border-white/10 hover:bg-slate-700'
                        }`}
                      >
                        {project.is_published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{project.is_published ? 'Publicado' : 'Oculto'}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setEditingProject(project);
                            setIsFormOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(project.id)}
                          className="p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-purple-400 hover:bg-slate-800 transition-colors"
                          title="Duplicar"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(project)}
                          className="p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProjects.length === 0 && (
            <div className="p-8 text-center text-xs text-slate-400">
              No se encontraron proyectos con los filtros actuales.
            </div>
          )}
        </div>

      </div>

      {/* Create / Edit Form Modal */}
      <ProjectFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingProject(null);
        }}
        onSave={handleSaveProject}
        project={editingProject}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={`¿Eliminar "${deleteTarget?.title}"?`}
        message="Esta acción removerá permanentemente el proyecto de Supabase y del portafolio público."
        isLoading={deleting}
      />
    </div>
  );
};
