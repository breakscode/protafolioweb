import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { mediaService } from '../../services/mediaService';
import { MediaItem } from '../../types';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { 
  UploadCloud, 
  Trash2, 
  Copy, 
  Check, 
  Image as ImageIcon, 
  Loader2, 
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { formatFileSize, formatDateTime } from '../../lib/utils';

export const MediaAdminPage: React.FC = () => {
  const { onToggleSidebar } = useOutletContext<{ onToggleSidebar: () => void }>();

  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [selectedBucket, setSelectedBucket] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null);
  const [toastMessage, setToastMessage] = useState('');

  const buckets = [
    { value: 'all', label: 'Todos los buckets' },
    { value: 'profile', label: 'profile' },
    { value: 'projects', label: 'projects' },
    { value: 'certificates', label: 'certificates' },
    { value: 'documents', label: 'documents' },
    { value: 'general', label: 'general' },
  ];

  const loadMedia = async () => {
    setLoading(true);
    const data = await mediaService.getMedia(selectedBucket === 'all' ? undefined : selectedBucket);
    setMediaList(data);
    setLoading(false);
  };

  useEffect(() => {
    loadMedia();
  }, [selectedBucket]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const bucketToUse = selectedBucket === 'all' ? 'general' : selectedBucket;
      await mediaService.uploadFile(file, bucketToUse);
      showToast('Archivo subido exitosamente.');
      await loadMedia();
    } catch (err) {
      console.error('Error uploading:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleCopyUrl = (item: MediaItem) => {
    navigator.clipboard.writeText(item.public_url);
    setCopiedId(item.id);
    showToast('URL pública copiada al portapapeles.');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await mediaService.deleteMedia(deleteTarget.id, deleteTarget.bucket, deleteTarget.file_name);
      showToast('Archivo eliminado.');
      setDeleteTarget(null);
      await loadMedia();
    } catch (err) {
      console.error('Error deleting:', err);
    }
  };

  return (
    <div className="space-y-8">
      <AdminHeader
        onToggleSidebar={onToggleSidebar}
        title="Biblioteca Multimedia"
        subtitle="Sube imágenes y recursos multimedia directamente a Supabase Storage."
        actions={
          <label className="cursor-pointer">
            <Button
              variant="primary"
              size="sm"
              isLoading={uploading}
              leftIcon={<UploadCloud className="w-4 h-4" />}
              onClick={() => document.getElementById('media-upload-input')?.click()}
            >
              Subir Archivo
            </Button>
            <input
              id="media-upload-input"
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </label>
        }
      />

      <div className="px-4 sm:px-8 space-y-6">
        {toastMessage && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Bucket filter */}
        <div className="flex items-center gap-4">
          <div className="w-64">
            <Select
              label="Filtrar por Bucket"
              value={selectedBucket}
              onChange={(e) => setSelectedBucket(e.target.value)}
              options={buckets}
            />
          </div>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {mediaList.map((item) => (
            <div
              key={item.id}
              className="glass-card rounded-2xl border border-white/10 overflow-hidden flex flex-col justify-between group hover:border-cyan-500/30 transition-all duration-200"
            >
              {/* Media Preview */}
              <div className="relative h-44 bg-slate-950 flex items-center justify-center overflow-hidden">
                {item.mime_type?.startsWith('image/') || item.public_url.match(/\.(jpeg|jpg|png|webp|gif)/i) ? (
                  <img
                    src={item.public_url}
                    alt={item.file_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <ImageIcon className="w-12 h-12 text-slate-600" />
                )}
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/90 text-cyan-400 text-[10px] font-mono border border-white/10">
                  {item.bucket}
                </span>
              </div>

              {/* Info & Actions */}
              <div className="p-4 space-y-3">
                <div>
                  <p className="font-semibold text-white text-xs truncate" title={item.file_name}>
                    {item.file_name}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {formatFileSize(item.size_bytes)} • {formatDateTime(item.created_at)}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <button
                    onClick={() => handleCopyUrl(item)}
                    className="inline-flex items-center gap-1 text-xs font-mono text-cyan-400 hover:underline"
                  >
                    {copiedId === item.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === item.id ? 'Copiado' : 'Copiar URL'}</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <a
                      href={item.public_url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
                      title="Ver original"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => setDeleteTarget(item)}
                      className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-rose-400"
                      title="Eliminar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {mediaList.length === 0 && (
          <div className="p-12 text-center text-xs text-slate-400 glass-card rounded-2xl border border-white/10">
            No hay archivos en este bucket. Sube una imagen para comenzar.
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={`¿Eliminar archivo?`}
        message={`Se eliminará "${deleteTarget?.file_name}" del bucket ${deleteTarget?.bucket}.`}
      />
    </div>
  );
};
