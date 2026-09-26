import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { heroService } from '../../services/heroService';
import { HeroData } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Switch } from '../../components/ui/Switch';
import { Save, CheckCircle2, Eye, Sparkles } from 'lucide-react';

export const HeroAdminPage: React.FC = () => {
  const { onToggleSidebar } = useOutletContext<{ onToggleSidebar: () => void }>();

  const [hero, setHero] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    heroService.getHero().then((data) => {
      setHero(data);
      setLoading(false);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hero) return;

    setSaving(true);
    setSuccess(false);

    try {
      const updated = await heroService.updateHero(hero);
      setHero(updated);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      console.error('Error saving hero:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !hero) {
    return <div className="p-8 text-slate-400">Cargando Hero...</div>;
  }

  return (
    <div className="space-y-8">
      <AdminHeader
        onToggleSidebar={onToggleSidebar}
        title="Hero & Portada Principal"
        subtitle="Modifica los textos principales, botones de llamada a la acción y badges del Hero."
        actions={
          <Button
            type="button"
            variant="outline"
            size="sm"
            leftIcon={<Eye className="w-4 h-4" />}
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? 'Ocultar Preview' : 'Vista Previa'}
          </Button>
        }
      />

      <div className="px-4 sm:px-8 max-w-5xl space-y-6">
        
        {success && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Hero actualizado con éxito.</span>
          </div>
        )}

        {/* Live Preview Card */}
        {showPreview && (
          <div className="glass-card p-6 sm:p-8 rounded-2xl border border-cyan-500/30 bg-cyan-500/5 space-y-4 animate-slide-up">
            <span className="text-xs font-mono text-cyan-400 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30">
              {hero.tech_badge}
            </span>
            <div className="space-y-1">
              <p className="text-sm font-mono text-cyan-400">{hero.greeting}</p>
              <h1 className="text-3xl font-extrabold text-white">{hero.role_title}</h1>
              <p className="text-sm text-slate-300 max-w-xl">{hero.subtitle}</p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <span className="px-3 py-1 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs">{hero.cta_primary_text}</span>
              <span className="px-3 py-1 rounded-lg bg-slate-800 text-white text-xs border border-white/10">{hero.cta_secondary_text}</span>
              <span className="px-3 py-1 rounded-lg text-slate-400 text-xs">{hero.cta_tertiary_text}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSave} className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10 space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Saludo (Greeting)"
              value={hero.greeting}
              onChange={(e) => setHero({ ...hero, greeting: e.target.value })}
              required
            />
            <Input
              label="Título del Rol"
              value={hero.role_title}
              onChange={(e) => setHero({ ...hero, role_title: e.target.value })}
              required
            />
          </div>

          <Textarea
            label="Subtítulo Principal"
            rows={3}
            value={hero.subtitle}
            onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
            required
          />

          <Input
            label="Badge Tecnológico Superior"
            value={hero.tech_badge}
            onChange={(e) => setHero({ ...hero, tech_badge: e.target.value })}
            hint="Ej. Full Stack & AI Focused"
          />

          <div className="pt-4 border-t border-white/10 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Configuración de Botones de Acción (CTAs)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Botón Primario (Texto)"
                value={hero.cta_primary_text}
                onChange={(e) => setHero({ ...hero, cta_primary_text: e.target.value })}
              />
              <Input
                label="Botón Primario (Enlace / Ancla)"
                value={hero.cta_primary_link}
                onChange={(e) => setHero({ ...hero, cta_primary_link: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Botón Secundario (Texto)"
                value={hero.cta_secondary_text}
                onChange={(e) => setHero({ ...hero, cta_secondary_text: e.target.value })}
              />
              <Input
                label="Botón Secundario (Enlace / Ancla)"
                value={hero.cta_secondary_link}
                onChange={(e) => setHero({ ...hero, cta_secondary_link: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Botón Terciario (Texto)"
                value={hero.cta_tertiary_text}
                onChange={(e) => setHero({ ...hero, cta_tertiary_text: e.target.value })}
              />
              <Input
                label="Botón Terciario (Enlace / Ancla)"
                value={hero.cta_tertiary_link}
                onChange={(e) => setHero({ ...hero, cta_tertiary_link: e.target.value })}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <Switch
              label="Sección Hero Activa"
              checked={hero.is_active}
              onChange={(checked) => setHero({ ...hero, is_active: checked })}
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={saving}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Guardar Hero
            </Button>
          </div>

        </form>

      </div>
    </div>
  );
};
