import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { documentsService } from '../../services/documentsService';
import { DocumentItem } from '../../types';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { 
  FileText, 
  UploadCloud, 
  Download, 
  Trash2, 
  CheckCircle2, 
  FileDown, 
  Sparkles,
  Calendar
} from 'lucide-react';
import { formatDateTime } from '../../lib/utils';

export const DocumentsAdminPage: React.FC = () => {
  const { onToggleSidebar } = useOutletContext<{ onToggleSidebar: () => void }>();

  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DocumentItem | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [customTitle, setCustomTitle] = useState('CV - Jhampier Iván Juárez Mauricio');

  const loadDocs = async () => {
    setLoading(true);
    const data = await documentsService.getDocuments();
    setDocuments(data);
    setLoading(false);
  };

  useEffect(() => {
    loadDocs();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      await documentsService.uploadOrUpdateCV(file, customTitle);
      showToast('CV subido y activado exitosamente.');
      await loadDocs();
    } catch (err) {
      console.error('Error uploading CV:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await documentsService.deleteDocument(deleteTarget.id);
    showToast('Documento eliminado.');
    setDeleteTarget(null);
    await loadDocs();
  };

  return (
    <div className="space-y-8">
      <AdminHeader
        onToggleSidebar={onToggleSidebar}
        title="Documentos & CV"
        subtitle="Gestiona tu Currículum Vitae descargable en el portafolio público."
      />

      <div className="px-4 sm:px-8 max-w-5xl space-y-8">
        {toastMessage && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Upload / Replace Card */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10 space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-white/10">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Subir o Reemplazar CV</h3>
              <p className="text-xs text-slate-400 font-mono">El archivo activo se vinculará automáticamente al botón "Descargar CV".</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Título del Documento"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
            />

            <div className="space-y-1.5 flex flex-col justify-end">
              <label className="cursor-pointer">
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  className="w-full justify-center"
                  isLoading={uploading}
                  leftIcon={<UploadCloud className="w-4 h-4" />}
                  onClick={() => document.getElementById('cv-file-input')?.click()}
                >
                  Seleccionar PDF / Subir CV
                </Button>
                <input
                  id="cv-file-input"
                  type="file"
                  accept="application/pdf,.doc,.docx"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Current & Past Documents List */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Historial de Archivos CV
          </h3>

          <div className="glass-card rounded-2xl border border-white/10 overflow-hidden divide-y divide-white/5">
            {documents.map((doc) => (
              <div key={doc.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 transition-colors">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-cyan-400 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-white text-sm">{doc.title}</p>
                      {doc.is_active && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-semibold">
                          Activo en Portafolio
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      {doc.file_name} • {doc.file_size} • {formatDateTime(doc.updated_at)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {doc.file_url && doc.file_url !== '#' && (
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Download className="w-3.5 h-3.5" />}
                      onClick={() => window.open(doc.file_url, '_blank')}
                    >
                      Descargar
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                    onClick={() => setDeleteTarget(doc)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}

            {documents.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-400">
                No hay documentos subidos.
              </div>
            )}
          </div>
        </div>

      </div>

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={`¿Eliminar documento?`}
        message={`Se removerá "${deleteTarget?.file_name}".`}
      />
    </div>
  );
};
