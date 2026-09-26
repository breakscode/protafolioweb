import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { experienceService } from '../../services/experienceService';
import { Experience } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { Switch } from '../../components/ui/Switch';
import { Badge } from '../../components/ui/Badge';
import { Plus, Edit, Trash2, Briefcase, Eye, EyeOff, CheckCircle2, X } from 'lucide-react';

export const ExperienceAdminPage: React.FC = () => {
  const { onToggleSidebar } = useOutletContext<{ onToggleSidebar: () => void }>();

  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Experience | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Experience | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [techInput, setTechInput] = useState('');

  const [formData, setFormData] = useState<Omit<Experience, 'id'>>({
    type: 'Proyecto profesional',
    organization: '',
    role_or_title: '',
    description: '',
    start_date: '2026',
    end_date: '2026',
    year_label: '2026',
    location: 'Piura, Perú',
    modality: 'Remoto',
    technologies: [],
    url: '',
    is_published: true,
    sort_order: 1,
  });

  const loadItems = async () => {
    setLoading(true);
    const data = await experienceService.getExperience(false);
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleOpenModal = (item?: Experience) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        type: item.type,
        organization: item.organization || '',
        role_or_title: item.role_or_title,
        description: item.description,
        start_date: item.start_date,
        end_date: item.end_date || '',
        year_label: item.year_label || item.start_date,
        location: item.location || '',
        modality: item.modality || 'Remoto',
        technologies: item.technologies || [],
        url: item.url || '',
        is_published: item.is_published,
        sort_order: item.sort_order,
      });
    } else {
      setEditingItem(null);
      setFormData({
        type: 'Proyecto profesional',
        organization: '',
        role_or_title: '',
        description: '',
        start_date: '2026',
        end_date: '2026',
        year_label: '2026',
        location: 'Piura, Perú',
        modality: 'Remoto',
        technologies: [],
        url: '',
        is_published: true,
        sort_order: (items.length || 0) + 1,
      });
    }
    setIsModalOpen(true);
  };

  const handleAddTech = () => {
    if (techInput.trim() && !formData.technologies?.includes(techInput.trim())) {
      setFormData({
        ...formData,
        technologies: [...(formData.technologies || []), techInput.trim()],
      });
      setTechInput('');
    }
  };

  const handleRemoveTech = (tech: string) => {
    setFormData({
      ...formData,
      technologies: formData.technologies?.filter((t) => t !== tech),
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.role_or_title || !formData.description) return;

    if (editingItem) {
      await experienceService.updateExperience(editingItem.id, formData);
      showToast('Trayectoria actualizada.');
    } else {
      await experienceService.createExperience(formData);
      showToast('Registro de trayectoria creado.');
    }

    setIsModalOpen(false);
    await loadItems();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await experienceService.deleteExperience(deleteTarget.id);
    showToast('Registro eliminado.');
    setDeleteTarget(null);
    await loadItems();
  };

  const handleTogglePublish = async (item: Experience) => {
    await experienceService.togglePublish(item.id, item.is_published);
    await loadItems();
    showToast(`Elemento ${item.is_published ? 'ocultado' : 'publicado'}.`);
  };

  return (
    <div className="space-y-8">
      <AdminHeader
        onToggleSidebar={onToggleSidebar}
        title="Trayectoria & Experiencia"
        subtitle="Administra hitos, proyectos profesionales, proyectos académicos y trabajos reales."
        actions={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => handleOpenModal()}
          >
            Nuevo Hito
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

        <div className="glass-card rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-mono border-b border-white/10 text-[11px]">
                <tr>
                  <th className="px-6 py-4">Hito / Rol</th>
                  <th className="px-6 py-4">Tipo</th>
                  <th className="px-6 py-4">Organización</th>
                  <th className="px-6 py-4">Año</th>
                  <th className="px-6 py-4 text-center">Estado</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-white text-sm">{item.role_or_title}</p>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{item.description}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="primary" size="sm">
                        {item.type}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-cyan-400 font-medium font-mono">
                      {item.organization || '—'}
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-300">
                      {item.year_label || item.start_date}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleTogglePublish(item)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-semibold border transition-all ${
                          item.is_published
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400 border-white/10'
                        }`}
                      >
                        {item.is_published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{item.is_published ? 'Publicado' : 'Oculto'}</span>
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenModal(item)}
                          className="p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-cyan-400 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(item)}
                          className="p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-rose-400 transition-colors"
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
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Editar Trayectoria' : 'Nuevo Hito'}
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Título o Cargo *"
            value={formData.role_or_title}
            onChange={(e) => setFormData({ ...formData, role_or_title: e.target.value })}
            placeholder="Ej. Sistema Integral de Gestión Patrimonial"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Tipo de Experiencia *"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              options={[
                { value: 'Proyecto profesional', label: 'Proyecto profesional' },
                { value: 'Proyecto académico', label: 'Proyecto académico' },
                { value: 'Trabajo', label: 'Trabajo' },
                { value: 'Proyecto personal', label: 'Proyecto personal' },
              ]}
            />
            <Input
              label="Organización / Empresa (Opcional)"
              value={formData.organization || ''}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              placeholder="Ej. Comercial Rafael Norte S.A.C."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Año / Etiqueta *"
              value={formData.year_label || ''}
              onChange={(e) => setFormData({ ...formData, year_label: e.target.value, start_date: e.target.value })}
              placeholder="2026"
              required
            />
            <Select
              label="Modalidad"
              value={formData.modality || 'Remoto'}
              onChange={(e) => setFormData({ ...formData, modality: e.target.value as any })}
              options={[
                { value: 'Remoto', label: 'Remoto' },
                { value: 'Híbrido', label: 'Híbrido' },
                { value: 'Presencial', label: 'Presencial' },
              ]}
            />
            <Input
              label="Ubicación"
              value={formData.location || ''}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Piura, Perú"
            />
          </div>

          <Textarea
            label="Descripción del Hito *"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />

          {/* Tech tags */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Tecnologías Clave
            </label>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Ej. React, Supabase, PostgreSQL"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTech();
                  }
                }}
              />
              <Button type="button" variant="secondary" size="md" onClick={handleAddTech}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {formData.technologies?.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-white/10 text-xs font-mono text-cyan-300"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => handleRemoveTech(tech)}
                    className="text-slate-400 hover:text-rose-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <Switch
            label="Publicado en Portafolio"
            checked={formData.is_published}
            onChange={(checked) => setFormData({ ...formData, is_published: checked })}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Guardar
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={`¿Eliminar "${deleteTarget?.role_or_title}"?`}
        message="Se eliminará de la trayectoria."
      />
    </div>
  );
};
