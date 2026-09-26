import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { certificationsService } from '../../services/certificationsService';
import { Certification } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';
import { ImageUploader } from '../../components/admin/ImageUploader';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Switch } from '../../components/ui/Switch';
import { Plus, Edit, Trash2, Award, Eye, EyeOff, CheckCircle2, ExternalLink } from 'lucide-react';

export const CertificationsAdminPage: React.FC = () => {
  const { onToggleSidebar } = useOutletContext<{ onToggleSidebar: () => void }>();

  const [certs, setCerts] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Certification | null>(null);
  const [toastMessage, setToastMessage] = useState('');

  const [formData, setFormData] = useState<Omit<Certification, 'id'>>({
    name: '',
    issuer: '',
    issue_date: '',
    description: '',
    image_url: '',
    verification_url: '',
    is_published: true,
    sort_order: 1,
  });

  const loadCerts = async () => {
    setLoading(true);
    const data = await certificationsService.getCertifications(false);
    setCerts(data);
    setLoading(false);
  };

  useEffect(() => {
    loadCerts();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleOpenModal = (cert?: Certification) => {
    if (cert) {
      setEditingCert(cert);
      setFormData({
        name: cert.name,
        issuer: cert.issuer,
        issue_date: cert.issue_date || '',
        description: cert.description || '',
        image_url: cert.image_url || '',
        verification_url: cert.verification_url || '',
        is_published: cert.is_published,
        sort_order: cert.sort_order,
      });
    } else {
      setEditingCert(null);
      setFormData({
        name: '',
        issuer: '',
        issue_date: '',
        description: '',
        image_url: '',
        verification_url: '',
        is_published: true,
        sort_order: (certs.length || 0) + 1,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.issuer.trim()) return;

    if (editingCert) {
      await certificationsService.updateCertification(editingCert.id, formData);
      showToast('Certificación actualizada correctamente.');
    } else {
      await certificationsService.createCertification(formData);
      showToast('Certificación creada correctamente.');
    }

    setIsModalOpen(false);
    await loadCerts();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await certificationsService.deleteCertification(deleteTarget.id);
    showToast('Certificación eliminada.');
    setDeleteTarget(null);
    await loadCerts();
  };

  const handleTogglePublish = async (cert: Certification) => {
    await certificationsService.togglePublish(cert.id, cert.is_published);
    await loadCerts();
    showToast(`Certificación ${cert.is_published ? 'ocultada' : 'publicada'}.`);
  };

  return (
    <div className="space-y-8">
      <AdminHeader
        onToggleSidebar={onToggleSidebar}
        title="Certificaciones"
        subtitle="Administra credenciales, emisores y enlaces de verificación."
        actions={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => handleOpenModal()}
          >
            Nueva Certificación
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
                  <th className="px-6 py-4">Certificación</th>
                  <th className="px-6 py-4">Emisor</th>
                  <th className="px-6 py-4">Fecha</th>
                  <th className="px-6 py-4 text-center">Orden</th>
                  <th className="px-6 py-4 text-center">Estado</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {certs.map((cert) => (
                  <tr key={cert.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center text-cyan-400">
                          <Award className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-white text-sm">{cert.name}</p>
                          {cert.description && (
                            <p className="text-[11px] text-slate-400 line-clamp-1">{cert.description}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 font-mono text-cyan-400">
                      {cert.issuer}
                    </td>

                    <td className="px-6 py-4 font-mono text-slate-400">
                      {cert.issue_date || '—'}
                    </td>

                    <td className="px-6 py-4 text-center font-mono">
                      {cert.sort_order}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleTogglePublish(cert)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-semibold border transition-all ${
                          cert.is_published
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400 border-white/10'
                        }`}
                      >
                        {cert.is_published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{cert.is_published ? 'Publicado' : 'Oculto'}</span>
                      </button>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenModal(cert)}
                          className="p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-cyan-400 transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(cert)}
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

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCert ? 'Editar Certificación' : 'Nueva Certificación'}
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Nombre de la Certificación *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ej. Claude Certified Architect"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Institución / Emisor *"
              value={formData.issuer}
              onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
              placeholder="Ej. Anthropic / Cisco / Google"
              required
            />
            <Input
              label="Año o Fecha (Opcional)"
              value={formData.issue_date || ''}
              onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
              placeholder="Ej. 2026"
            />
          </div>

          <Textarea
            label="Descripción del Contenido / Especialización"
            rows={3}
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <Input
            label="URL de Verificación (Opcional)"
            placeholder="https://verify.issuer.com/..."
            value={formData.verification_url || ''}
            onChange={(e) => setFormData({ ...formData, verification_url: e.target.value })}
            hint="Solo colocar URL si dispones de credencial pública real."
          />

          <div className="pt-2">
            <ImageUploader
              label="Insignia / Certificado Imagen (Opcional)"
              value={formData.image_url || ''}
              onChange={(url) => setFormData({ ...formData, image_url: url })}
              bucket="certificates"
            />
          </div>

          <div className="space-y-3 pt-2">
            <Switch
              label="Publicado en Portafolio"
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
        message="Se eliminará la certificación del portafolio."
      />
    </div>
  );
};
