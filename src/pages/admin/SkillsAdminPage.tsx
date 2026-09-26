import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { skillsService } from '../../services/skillsService';
import { Skill, SkillCategory } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Switch } from '../../components/ui/Switch';
import { Badge } from '../../components/ui/Badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Sparkles, 
  CheckCircle2, 
  Cpu, 
  Layers 
} from 'lucide-react';

export const SkillsAdminPage: React.FC = () => {
  const { onToggleSidebar } = useOutletContext<{ onToggleSidebar: () => void }>();

  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Skill | null>(null);
  const [toastMessage, setToastMessage] = useState('');

  const [formData, setFormData] = useState<{
    name: string;
    category: SkillCategory;
    icon_name: string;
    highlight: boolean;
    is_published: boolean;
    sort_order: number;
  }>({
    name: '',
    category: 'frontend',
    icon_name: 'Code2',
    highlight: false,
    is_published: true,
    sort_order: 1,
  });

  const loadSkills = async () => {
    setLoading(true);
    const data = await skillsService.getSkills(false);
    setSkills(data);
    setLoading(false);
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleOpenModal = (skill?: Skill) => {
    if (skill) {
      setEditingSkill(skill);
      setFormData({
        name: skill.name,
        category: skill.category,
        icon_name: skill.icon_name || 'Code2',
        highlight: skill.highlight,
        is_published: skill.is_published,
        sort_order: skill.sort_order,
      });
    } else {
      setEditingSkill(null);
      setFormData({
        name: '',
        category: 'frontend',
        icon_name: 'Code2',
        highlight: false,
        is_published: true,
        sort_order: (skills.length || 0) + 1,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingSkill) {
      await skillsService.updateSkill(editingSkill.id, formData);
      showToast('Habilidad actualizada correctamente.');
    } else {
      await skillsService.createSkill(formData);
      showToast('Habilidad creada correctamente.');
    }

    setIsModalOpen(false);
    await loadSkills();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await skillsService.deleteSkill(deleteTarget.id);
    showToast('Habilidad eliminada.');
    setDeleteTarget(null);
    await loadSkills();
  };

  const handleTogglePublish = async (skill: Skill) => {
    await skillsService.togglePublish(skill.id, skill.is_published);
    await loadSkills();
    showToast(`Tecnología ${skill.is_published ? 'ocultada' : 'publicada'}.`);
  };

  const categories: { key: SkillCategory; label: string }[] = [
    { key: 'frontend', label: 'Frontend' },
    { key: 'backend', label: 'Backend' },
    { key: 'database', label: 'Bases de Datos' },
    { key: 'ai_automation', label: 'IA & Automatización' },
    { key: 'tools', label: 'Herramientas' },
    { key: 'other', label: 'Redes, IoT & Otros' },
  ];

  const filteredSkills = skills.filter((s) => {
    return selectedCategory === 'all' || s.category === selectedCategory;
  });

  return (
    <div className="space-y-8">
      <AdminHeader
        onToggleSidebar={onToggleSidebar}
        title="Stack & Tecnologías"
        subtitle="Administra las tecnologías organizadas por categorías sin porcentajes inventados."
        actions={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => handleOpenModal()}
          >
            Nueva Tecnología
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

        {/* Category filter tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
              selectedCategory === 'all'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'bg-slate-900 text-slate-400 border border-white/10 hover:text-white'
            }`}
          >
            Todas ({skills.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
                selectedCategory === cat.key
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-400 border border-white/10 hover:text-white'
              }`}
            >
              {cat.label} ({skills.filter(s => s.category === cat.key).length})
            </button>
          ))}
        </div>

        {/* Skills Grid Table */}
        <div className="glass-card rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-mono border-b border-white/10 text-[11px]">
                <tr>
                  <th className="px-6 py-4">Tecnología</th>
                  <th className="px-6 py-4">Categoría</th>
                  <th className="px-6 py-4 text-center">Destacado</th>
                  <th className="px-6 py-4 text-center">Orden</th>
                  <th className="px-6 py-4 text-center">Estado</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredSkills.map((skill) => (
                  <tr key={skill.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center text-cyan-400">
                          <Cpu className="w-4 h-4" />
                        </div>
                        <span className="font-semibold text-white text-sm">{skill.name}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 font-mono">
                      <span className="capitalize">{skill.category.replace('_', ' ')}</span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      {skill.highlight ? (
                        <span className="inline-flex items-center gap-1 text-cyan-400 font-mono text-xs">
                          <Sparkles className="w-3.5 h-3.5" /> Sí
                        </span>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-center font-mono">
                      {skill.sort_order}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleTogglePublish(skill)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-semibold border transition-all ${
                          skill.is_published
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400 border-white/10'
                        }`}
                      >
                        {skill.is_published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{skill.is_published ? 'Publicado' : 'Oculto'}</span>
                      </button>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenModal(skill)}
                          className="p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-cyan-400 transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(skill)}
                          className="p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-rose-400 transition-colors"
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
        </div>

      </div>

      {/* Modal Create / Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSkill ? 'Editar Tecnología' : 'Nueva Tecnología'}
        maxWidth="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Nombre de la Tecnología *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ej. NestJS / TensorFlow"
            required
          />

          <Select
            label="Categoría *"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
            options={[
              { value: 'frontend', label: 'Frontend' },
              { value: 'backend', label: 'Backend' },
              { value: 'database', label: 'Bases de Datos' },
              { value: 'ai_automation', label: 'IA & Automatización' },
              { value: 'tools', label: 'Herramientas' },
              { value: 'other', label: 'Redes, IoT & Otros' },
            ]}
          />

          <Input
            label="Orden de Aparición"
            type="number"
            value={formData.sort_order}
            onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
          />

          <div className="space-y-3 pt-2">
            <Switch
              label="Destacar Tecnología"
              description="Resaltar con borde cyan y brillo sutil en el stack"
              checked={formData.highlight}
              onChange={(checked) => setFormData({ ...formData, highlight: checked })}
            />
            <Switch
              label="Publicado en Portafolio"
              description="Visible en la sección de habilidades"
              checked={formData.is_published}
              onChange={(checked) => setFormData({ ...formData, is_published: checked })}
            />
          </div>

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

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={`¿Eliminar "${deleteTarget?.name}"?`}
        message="Se removerá permanentemente de tu stack tecnológico."
      />
    </div>
  );
};
