import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { educationService } from '../../services/educationService';
import { Education } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Switch } from '../../components/ui/Switch';
import { Plus, Edit, Trash2, GraduationCap, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

export const EducationAdminPage: React.FC = () => {
  const { onToggleSidebar } = useOutletContext<{ onToggleSidebar: () => void }>();

  const [eduList, setEduList] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Education | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Education | null>(null);
  const [toastMessage, setToastMessage] = useState('');

  const [formData, setFormData] = useState<Omit<Education, 'id'>>({
    institution: 'Universidad César Vallejo',
    degree: 'Ingeniería de Sistemas',
    field_of_study: '',
    period: '2020 — 2026',
    status: 'Egresado',
    location: 'Piura, Perú',
    description: '',
    is_published: true,
    sort_order: 1,
  });

  const loadEdu = async () => {
    setLoading(true);
    const data = await educationService.getEducation(false);
    setEduList(data);
    setLoading(false);
  };

  useEffect(() => {
    loadEdu();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleOpenModal = (item?: Education) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        institution: item.institution,
        degree: item.degree,
        field_of_study: item.field_of_study,
        period: item.period,
        status: item.status,
        location: item.location,
        description: item.description || '',
        is_published: item.is_published,
        sort_order: item.sort_order,
      });
    } else {
      setEditingItem(null);
      setFormData({
        institution: '',
        degree: '',
        field_of_study: '',
        period: '',
        status: 'Egresado',
        location: 'Piura, Perú',
        description: '',
        is_published: true,
        sort_order: (eduList.length || 0) + 1,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.institution || !formData.degree) return;

    if (editingItem) {
      await educationService.updateEducation(editingItem.id, formData);
      showToast('Educación actualizada.');
    } else {
      await educationService.createEducation(formData);
      showToast('Registro educativo creado.');
    }

    setIsModalOpen(false);
    await loadEdu();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await educationService.deleteEducation(deleteTarget.id);
    showToast('Registro eliminado.');
    setDeleteTarget(null);
    await loadEdu();
  };

  const handleTogglePublish = async (item: Education) => {
    await educationService.togglePublish(item.id, item.is_published);
    await loadEdu();
    showToast(`Educación ${item.is_published ? 'ocultada' : 'publicada'}.`);
  };

  return (
    <div className="space-y-8">
      <AdminHeader
        onToggleSidebar={onToggleSidebar}
        title="Formación Académica & Educación"
        subtitle="Administra tus estudios superiores, instituciones y especialidades."
        actions={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => handleOpenModal()}
          >
            Nueva Educación
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
                  <th className="px-6 py-4">Carrera / Grado</th>
                  <th className="px-6 py-4">Institución</th>
                  <th className="px-6 py-4">Periodo</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4 text-center">Publicado</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {eduList.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-bold text-white text-sm">
                      {item.degree}
                    </td>
                    <td className="px-6 py-4 text-cyan-400 font-medium">
                      {item.institution}
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-300">
                      {item.period}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono text-[11px]">
                        {item.status}
                      </span>
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
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(item)}
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Editar Educación' : 'Nueva Educación'}
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Carrera / Grado *"
            value={formData.degree}
            onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
            placeholder="Ej. Ingeniería de Sistemas"
            required
          />
          <Input
            label="Institución Universitaria *"
            value={formData.institution}
            onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
            placeholder="Ej. Universidad César Vallejo"
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Periodo"
              value={formData.period}
              onChange={(e) => setFormData({ ...formData, period: e.target.value })}
              placeholder="Ej. 2020 — 2026"
            />
            <Input
              label="Estado"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              placeholder="Egresado / Titulado"
            />
            <Input
              label="Ubicación"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Piura, Perú"
            />
          </div>
          <Textarea
            label="Áreas de Estudio & Especialización"
            rows={2}
            value={formData.field_of_study}
            onChange={(e) => setFormData({ ...formData, field_of_study: e.target.value })}
          />
          <Textarea
            label="Descripción Adicional"
            rows={2}
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
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
        title={`¿Eliminar "${deleteTarget?.degree}"?`}
        message="Se removerá el registro educativo."
      />
    </div>
  );
};
