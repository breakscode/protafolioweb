import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { settingsService } from '../../services/settingsService';
import { SiteSettings } from '../../types';
import { ImageUploader } from '../../components/admin/ImageUploader';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Switch } from '../../components/ui/Switch';
import { Save, CheckCircle2, Globe, Shield, Search, Eye } from 'lucide-react';

export const SettingsAdminPage: React.FC = () => {
  const { onToggleSidebar } = useOutletContext<{ onToggleSidebar: () => void }>();

  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    settingsService.getSettings().then((data) => {
      setSettings(data);
      setLoading(false);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setSuccess(false);

    try {
      const updated = await settingsService.updateSettings(settings);
      setSettings(updated);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      console.error('Error saving settings:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return <div className="p-8 text-slate-400">Cargando configuración...</div>;
  }

  return (
    <div className="space-y-8">
      <AdminHeader
        onToggleSidebar={onToggleSidebar}
        title="Configuración Global & SEO"
        subtitle="Administra metadatos, posicionamiento web, redes sociales y estado del sitio."
      />

      <div className="px-4 sm:px-8 max-w-4xl space-y-6">
        {success && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Configuraciones actualizadas correctamente.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10 space-y-6">
          
          {/* SEO Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Search className="w-4 h-4 text-cyan-400" /> Posicionamiento Web & Metadatos (SEO)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nombre del Sitio Web"
                value={settings.site_name}
                onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                required
              />
              <Input
                label="Título SEO (Meta Title)"
                value={settings.seo_title}
                onChange={(e) => setSettings({ ...settings, seo_title: e.target.value })}
                required
              />
            </div>

            <Textarea
              label="Descripción SEO (Meta Description)"
              rows={3}
              value={settings.seo_description}
              onChange={(e) => setSettings({ ...settings, seo_description: e.target.value })}
              hint="Recomendado entre 140 y 160 caracteres para óptimo CTR en Google."
              required
            />

            <div className="pt-2">
              <ImageUploader
                label="Imagen Open Graph (OG Image para redes)"
                value={settings.og_image_url || ''}
                onChange={(url) => setSettings({ ...settings, og_image_url: url })}
                bucket="general"
              />
            </div>
          </div>

          {/* Social Links & Copyright */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-400" /> Canales & Derechos
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="GitHub URL"
                value={settings.github_url}
                onChange={(e) => setSettings({ ...settings, github_url: e.target.value })}
              />
              <Input
                label="LinkedIn URL"
                placeholder="https://linkedin.com/in/..."
                value={settings.linkedin_url || ''}
                onChange={(e) => setSettings({ ...settings, linkedin_url: e.target.value })}
              />
            </div>

            <Input
              label="Texto de Copyright"
              value={settings.copyright_text}
              onChange={(e) => setSettings({ ...settings, copyright_text: e.target.value })}
            />
          </div>

          {/* Site Status */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" /> Estado del Servidor
            </h3>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10">
              <Switch
                label="Modo Mantenimiento"
                description="Mostrar pantalla de mantenimiento temporal para visitantes públicos"
                checked={settings.maintenance_mode}
                onChange={(checked) => setSettings({ ...settings, maintenance_mode: checked })}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={saving}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Guardar Configuración
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
};
