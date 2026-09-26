import React, { useState, useEffect } from 'react';
import { messagesService } from '../../services/messagesService';
import { profileService } from '../../services/profileService';
import { Profile } from '../../types';
import { formatSocialUrl } from '../../lib/utils';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { 
  Mail, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  Github, 
  Linkedin, 
  MessageSquare,
  Sparkles
} from 'lucide-react';

export const Contact: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    profileService.getProfile().then(setProfile);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage('Por favor completa los campos obligatorios.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      await messagesService.sendMessage(formData);
      setSuccessMessage(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSuccessMessage(false), 8000);
    } catch (err: any) {
      console.error('Error sending message:', err);
      setErrorMessage('No se pudo enviar el mensaje. Por favor intenta nuevamente o escribe a mi correo directo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <p className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
            <MessageSquare className="w-4 h-4" /> // Conectemos
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Contacto Profesional
          </h2>
          <div className="w-12 h-1 bg-cyan-500 mx-auto rounded-full" />
          <p className="text-sm text-slate-400 font-light">
            ¿Tienes una propuesta o vacante para Software Developer / Full Stack? Escríbeme y responderé a la brevedad.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Direct Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-card p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" /> Disponibilidad Actual
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {profile?.availability_text || (
                  <>
                    Abierto a posiciones remotas o híbridas como <strong>Software Developer</strong> o <strong>Full Stack Developer</strong>. Interesado en proyectos desafiantes con tecnologías web modernas, arquitecturas escalables y soluciones con IA.
                  </>
                )}
              </p>

              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-mono">Ubicación</p>
                    <p className="text-sm font-semibold text-white">
                      {profile?.location
                        ? (profile.location.includes('UTC') ? profile.location : `${profile.location} (UTC-5)`)
                        : 'Piura, Perú (UTC-5)'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                    <Github className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-mono">Repositorios</p>
                    <a
                      href={formatSocialUrl(profile?.github_url, 'github') || 'https://github.com/breakscode'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-cyan-400 hover:underline"
                    >
                      {profile?.github_url
                        ? profile.github_url.replace(/^https?:\/\//, '').replace(/\/$/, '')
                        : 'github.com/breakscode'}
                    </a>
                  </div>
                </div>

                {profile?.linkedin_url && (
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                      <Linkedin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-mono">LinkedIn</p>
                      <a
                        href={formatSocialUrl(profile.linkedin_url, 'linkedin')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-cyan-400 hover:underline"
                      >
                        {profile.linkedin_url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7">
            <div className="glass-card p-6 sm:p-8 rounded-2xl border border-white/10">
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {successMessage && (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-3 animate-fade-in">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span>¡Mensaje enviado exitosamente! Me pondré en contacto contigo pronto.</span>
                  </div>
                )}

                {errorMessage && (
                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center gap-3 animate-fade-in">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Nombre Completo *"
                    placeholder="Ej. Carlos Mendoza"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                  <Input
                    label="Correo Electrónico *"
                    type="email"
                    placeholder="carlos@empresa.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <Input
                  label="Asunto / Motivo"
                  placeholder="Ej. Oportunidad laboral Full Stack / Consulta técnica"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />

                <Textarea
                  label="Mensaje *"
                  placeholder="Escribe aquí los detalles del proyecto, requerimiento o vacante..."
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full justify-center mt-2"
                  isLoading={loading}
                  rightIcon={<Send className="w-4 h-4" />}
                >
                  Enviar Mensaje
                </Button>
              </form>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
