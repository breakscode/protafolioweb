import React, { useState, useEffect } from 'react';
import { Profile } from '../../types';
import { profileService } from '../../services/profileService';
import { 
  GraduationCap, 
  Code, 
  Bot, 
  Database, 
  Network, 
  CheckCircle2, 
  MapPin, 
  Briefcase
} from 'lucide-react';

export const About: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    profileService.getProfile().then(setProfile);
  }, []);

  if (!profile) return null;

  const highlights = [
    {
      icon: <GraduationCap className="w-5 h-5 text-cyan-400" />,
      title: 'Ingeniería de Sistemas',
      desc: 'Formación universitaria completa con base sólida en análisis, diseño de software y arquitectura de datos.',
    },
    {
      icon: <Code className="w-5 h-5 text-indigo-400" />,
      title: 'Desarrollo Full Stack',
      desc: 'Construcción de interfaces modernas en React y servicios backend robustos con NestJS, Node.js y APIs REST.',
    },
    {
      icon: <Bot className="w-5 h-5 text-emerald-400" />,
      title: 'IA & Automatización',
      desc: 'Integración práctica de modelos de lenguaje (Google Gemini), flujos autónomos con n8n y redes neuronales en TensorFlow.',
    },
    {
      icon: <Database className="w-5 h-5 text-amber-400" />,
      title: 'Bases de Datos & Cloud',
      desc: 'Modelado relacional y persistencia escalable en PostgreSQL, Supabase, Redis y Prisma ORM.',
    },
  ];

  return (
    <section id="about" className="py-20 relative bg-surface-200/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <p className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-widest">
            // Perfil Profesional
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Sobre mí
          </h2>
          <div className="w-12 h-1 bg-cyan-500 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Summary */}
          <div className="lg:col-span-6 space-y-6">
            <div className="glass-card p-6 sm:p-8 rounded-2xl border border-white/10 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {profile.full_name}
                  </h3>
                  <p className="text-xs text-cyan-400 font-mono">
                    {profile.headline}
                  </p>
                </div>
              </div>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {profile.bio_long || profile.bio_short}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Ubicación: <strong>{profile.location}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Network className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Modalidad: <strong>Remoto / Híbrido</strong></span>
                </div>
              </div>
            </div>

            {/* Practical approach */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-300 leading-normal">
                Enfoque en código estructurado, buenas prácticas de desarrollo, tipado estricto en TypeScript y seguridad a nivel de datos (RLS).
              </p>
            </div>
          </div>

          {/* Right Column: Focus Areas */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {highlights.map((item, index) => (
              <div 
                key={index}
                className="glass-card glass-card-hover p-5 rounded-xl border border-white/10 flex flex-col justify-between space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10">
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">0{index + 1}</span>
                </div>
                <div>
                  <h4 className="text-base font-semibold text-white mb-1.5">{item.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
