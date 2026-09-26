import React, { useState } from 'react';
import { mediaService } from '../../services/mediaService';
import { Button } from '../ui/Button';
import { UploadCloud, Image as ImageIcon, Check, Loader2, X } from 'lucide-react';

interface ImageUploaderProps {
  value?: string | null;
  onChange: (url: string) => void;
  bucket?: string;
  label?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  bucket = 'general',
  label = 'Imagen',
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona un archivo de imagen válido.');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const result = await mediaService.uploadFile(file, bucket);
      onChange(result.public_url);
    } catch (err: any) {
      console.error('Upload failed:', err);
      setError('Error al subir la imagen. Puedes pegar una URL directa.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full space-y-2">
      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
        {label}
      </label>

      <div className="flex flex-col sm:flex-row gap-4 items-start">
        {/* Preview block */}
        <div className="relative w-28 h-28 rounded-2xl bg-slate-900 border border-white/10 overflow-hidden flex items-center justify-center shrink-0">
          {value ? (
            <>
              <img src={value} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => onChange('')}
                className="absolute top-1 right-1 p-1 bg-slate-950/80 rounded-full text-slate-300 hover:text-rose-400"
                title="Eliminar imagen"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <ImageIcon className="w-8 h-8 text-slate-600" />
          )}
        </div>

        {/* Input & Upload action */}
        <div className="flex-1 space-y-2 w-full">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="https://... o sube un archivo"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-white/10 transition-colors">
              {uploading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
              ) : (
                <UploadCloud className="w-3.5 h-3.5 text-cyan-400" />
              )}
              <span>{uploading ? 'Subiendo...' : 'Subir archivo'}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={uploading}
              />
            </label>
            <span className="text-[11px] text-slate-400 font-mono">Bucket: {bucket}</span>
          </div>

          {error && <p className="text-xs text-rose-400">{error}</p>}
        </div>
      </div>
    </div>
  );
};
