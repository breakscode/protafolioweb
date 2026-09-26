import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { profileService } from '../../services/profileService';
import { Profile } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { ImageUploader } from '../../components/admin/ImageUploader';
import { Save, CheckCircle2, User, Sparkles, MapPin, Mail, Github, Linkedin, Eye } from 'lucide-react';

export const ProfileAdminPage: React.FC = () => {
  const { onToggleSidebar } = useOutletContext<{ onToggleSidebar: () => void }>();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    profileService.getProfile().then((data) => {
      setProfile(data);
      setLoading(false);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    setSuccess(false);

    try {
      const updated = await profileService.updateProfile(profile);
      setProfile(updated);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      console.error('Error saving profile:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !profile) {
    return <div className="p-8 text-slate-400">Cargando perfil...</div>;
  }

  return (
    <div className="space-y-8">
      <AdminHeader
        onToggleSidebar={onToggleSidebar}
        title="Perfil Profesional"
        subtitle="Administra la información personal, biografía y enlaces profesionales."
        actions={
          <Button
            type="button"
            variant="outline"
            size="sm"
            leftIcon={<Eye className="w-4 h-4" />}
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? 'Ocultar Vista Previa' : 'Vista Previa'}
          </Button>
        }
      />

      <div className="px-4 sm:px-8 max-w-5xl space-y-6">
        
        {success && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Perfil actualizado correctamente. Los cambios ya se reflejan en el portafolio.</span>
          </div>
        )}

        {/* Live Preview Card */}
        {showPreview && (
          <div className="glass-card p-6 rounded-2xl border border-cyan-500/30 bg-cyan-500/5 space-y-4 animate-slide-up">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-lg">
                {profile.full_name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{profile.full_name}</h3>
                <p className="text-xs text-cyan-400 font-mono">{profile.headline}</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{profile.bio_long || profile.bio_short}</p>
            <div className="flex items-center gap-4 text-xs text-slate-400 font-mono">
              <span>📍 {profile.location}</span>
              <span>✉️ {profile.email}</span>
              <span>🔗 {profile.github_url}</span>
            </div>
          </div>
        )}

        {/* Form Card */}
        <form onSubmit={handleSave} className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10 space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Nombre Completo"
              value={profile.full_name}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              required
            />
            <Input
              label="Titular / Headline"
              value={profile.headline}
              onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
              required
            />
          </div>

          <Textarea
            label="Biografía Corta"
            rows={2}
            value={profile.bio_short}
            onChange={(e) => setProfile({ ...profile, bio_short: e.target.value })}
            hint="Se muestra en resúmenes y fragmentos destacados."
          />

          <Textarea
            label="Biografía Completa (Sección Sobre Mí)"
            rows={5}
            value={profile.bio_long}
            onChange={(e) => setProfile({ ...profile, bio_long: e.target.value })}
            hint="Texto principal presentado a reclutadores."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Ubicación"
              value={profile.location}
              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
              leftIcon={<MapPin className="w-4 h-4" />}
            />
            <Input
              label="Correo de Contacto"
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              leftIcon={<Mail className="w-4 h-4" />}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="URL de GitHub"
              value={profile.github_url}
              onChange={(e) => setProfile({ ...profile, github_url: e.target.value })}
              leftIcon={<Github className="w-4 h-4" />}
            />
            <Input
              label="URL de LinkedIn"
              placeholder="https://linkedin.com/in/tu-usuario"
              value={profile.linkedin_url || ''}
              onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })}
              leftIcon={<Linkedin className="w-4 h-4" />}
              hint="Opcional. Configurar con tu enlace real."
            />
          </div>

          <div className="pt-4 border-t border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" /> Disponibilidad y Estado Profesional
            </h3>

            <Input
              label="Texto Breve de Disponibilidad (Badge en Hero)"
              value={profile.status_text}
              onChange={(e) => setProfile({ ...profile, status_text: e.target.value })}
              hint="Ej. Disponible para oportunidades como Software Developer / Full Stack Developer"
            />

            <Textarea
              label="Descripción de Disponibilidad Actual (Tarjeta en Contacto)"
              rows={3}
              value={profile.availability_text || ''}
              onChange={(e) => setProfile({ ...profile, availability_text: e.target.value })}
              hint="Texto detallado que se muestra en la tarjeta 'Disponibilidad Actual' en la sección de Contacto."
            />
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={saving}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Guardar Cambios
            </Button>
          </div>

        </form>

      </div>
    </div>
  );
};
