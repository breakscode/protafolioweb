import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { researchService } from '../../services/researchService';
import { Research } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Switch } from '../../components/ui/Switch';
import { Plus, Edit, Trash2, FlaskConical, Eye, EyeOff, CheckCircle2, X } from 'lucide-react';

export const ResearchAdminPage: React.FC = () => {
  const { onToggleSidebar } = useOutletContext<{ onToggleSidebar: () => void }>();

  const [items, setItems] = useState<Research[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Research | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Research | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [techInput, setTechInput] = useState('');

  const [formData, setFormData] = useState<Omit<Research, 'id'>>({
    title: '',
    description: '',
    organization_or_context: '',
    year: '2026',
    technologies: [],
    key_metric: '',
    metric_label: '',
    url: '',
    is_published: true,
    sort_order: 1,
  });

  const loadItems = async () => {
    setLoading(true);
    const data = await researchService.getResearch(false);
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

  const handleOpenModal = (item?: Research) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title,
        description: item.description,
        organization_or_context: item.organization_or_context || '',
        year: item.year,
        technologies: item.technologies || [],
        key_metric: item.key_metric || '',
        metric_label: item.metric_label || '',
        url: item.url || '',
        is_published: item.is_published,
        sort_order: item.sort_order,
      });
    } else {
      setEditingItem(null);
      setFormData({
        title: '',
        description: '',
        organization_or_context: '',
        year: '2026',
        technologies: ['Google Gemini', 'n8n'],
        key_metric: '',
        metric_label: '',
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
    if (!formData.title || !formData.description) return;

    if (editingItem) {
      await researchService.updateResearch(editingItem.id, formData);
      showToast('Investigación actualizada.');
    } else {
      await researchService.createResearch(formData);
      showToast('Proyecto de investigación registrado.');
    }

    setIsModalOpen(false);
    await loadItems();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await researchService.deleteResearch(deleteTarget.id);
    showToast('Investigación eliminada.');
    setDeleteTarget(null);
    await loadItems();
  };

  const handleTogglePublish = async (item: Research) => {
    await researchService.togglePublish(item.id, item.is_published);
    await loadItems();
    showToast(`Investigación ${item.is_published ? 'ocultada' : 'publicada'}.`);
  };

  return (
    <div className="space-y-8">
      <AdminHeader
        onToggleSidebar={onToggleSidebar}
        title="Investigación & Métricas IA"
        subtitle="Gestiona proyectos científicos, modelos de lenguaje y resultados experimentales."
        actions={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => handleOpenModal()}
          >
            Nueva Investigación
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
                  <th className="px-6 py-4">Título de la Investigación</th>
                  <th className="px-6 py-4">Año</th>
                  <th className="px-6 py-4">Métrica Destacada</th>
                  <th className="px-6 py-4 text-center">Estado</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-white text-sm">{item.title}</p>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{item.description}</p>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-300">
                      {item.year}
                    </td>
                    <td className="px-6 py-4">
                      {item.key_metric ? (
                        <div className="font-mono">
                          <span className="text-purple-300 font-bold">{item.key_metric}</span>
                          <span className="text-[10px] text-slate-400 block">{item.metric_label}</span>
                        </div>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
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
        title={editingItem ? 'Editar Investigación' : 'Nueva Investigación'}
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Título de la Investigación *"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Ej. Automatización de consultas y agendas mediante IA..."
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Contexto / Organización"
              value={formData.organization_or_context || ''}
              onChange={(e) => setFormData({ ...formData, organization_or_context: e.target.value })}
              placeholder="Ej. Proyecto de Investigación Institucional"
            />
            <Input
              label="Año *"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              placeholder="2026"
              required
            />
          </div>

          <Textarea
            label="Descripción & Alcance *"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Métrica Clave (Opcional)"
              value={formData.key_metric || ''}
              onChange={(e) => setFormData({ ...formData, key_metric: e.target.value })}
              placeholder="Ej. 80.34% / 24/7"
            />
            <Input
              label="Etiqueta de la Métrica"
              value={formData.metric_label || ''}
              onChange={(e) => setFormData({ ...formData, metric_label: e.target.value })}
              placeholder="Ej. Precisión experimental obtenida"
            />
          </div>

          {/* Tech tags */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Tecnologías de Investigación
            </label>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Ej. TensorFlow, Google Gemini, Python"
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
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-white/10 text-xs font-mono text-purple-300"
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
        title={`¿Eliminar investigación?`}
        message="Esta acción no se puede deshacer."
      />
    </div>
  );
};
