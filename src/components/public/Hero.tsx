import React, { useState, useEffect } from 'react';
import { HeroData, Profile, DocumentItem } from '../../types';
import { heroService } from '../../services/heroService';
import { profileService } from '../../services/profileService';
import { documentsService } from '../../services/documentsService';
import { formatSocialUrl } from '../../lib/utils';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  ArrowRight, 
  FileDown, 
  Mail, 
  Github, 
  Linkedin, 
  Terminal as TerminalIcon, 
  Sparkles, 
  Cpu, 
  Layers, 
  CheckCircle2,
  Play
} from 'lucide-react';

export const Hero: React.FC = () => {
  const [hero, setHero] = useState<HeroData | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activeCV, setActiveCV] = useState<DocumentItem | null>(null);
  const [terminalTab, setTerminalTab] = useState<'stack' | 'status' | 'ai'>('stack');

  useEffect(() => {
    heroService.getHero().then(setHero);
    profileService.getProfile().then(setProfile);
    documentsService.getActiveCV().then(setActiveCV);
  }, []);

  const handleDownloadCV = () => {
    if (activeCV?.file_url && activeCV.file_url !== '#') {
      window.open(activeCV.file_url, '_blank');
    } else {
      const el = document.getElementById('contact');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!hero) return null;

  return (
    <section id="hero" className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="ambient-glow w-96 h-96 bg-cyan-500/10 -top-10 -left-20" />
      <div className="ambient-glow w-96 h-96 bg-indigo-500/10 top-1/2 -right-20" />
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headline & Call To Actions */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Status / Badge */}
            <div className="inline-flex items-center gap-2">
              <Badge variant="primary" dot size="md">
                {hero.tech_badge || 'Full Stack & AI Focused'}
              </Badge>
              {profile?.location && (
                <span className="text-xs text-slate-400 font-mono">
                  📍 {profile.location}
                </span>
              )}
            </div>

            {/* Main Greeting & Title */}
            <div className="space-y-2">
              <p className="text-cyan-400 font-mono text-base sm:text-lg tracking-wide font-medium">
                {hero.greeting}
              </p>
              <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
                {hero.role_title}
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-slate-300 max-w-2xl font-light leading-relaxed">
              {hero.subtitle}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => {
                  const el = document.querySelector(hero.cta_primary_link || '#projects');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {hero.cta_primary_text || 'Ver proyectos'}
              </Button>

              <Button
                variant="secondary"
                size="lg"
                leftIcon={<FileDown className="w-4 h-4 text-cyan-400" />}
                onClick={handleDownloadCV}
              >
                {hero.cta_secondary_text || 'Descargar CV'}
              </Button>

              <Button
                variant="ghost"
                size="lg"
                leftIcon={<Mail className="w-4 h-4" />}
                onClick={() => {
                  const el = document.querySelector(hero.cta_tertiary_link || '#contact');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {hero.cta_tertiary_text || 'Contactarme'}
              </Button>
            </div>

            {/* Social Links & Trust */}
            <div className="pt-4 flex items-center gap-4">
              <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">Enlaces:</span>
              <div className="flex items-center gap-2">
                <a
                  href={formatSocialUrl(profile?.github_url, 'github') || 'https://github.com/breakscode'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 hover:bg-cyan-500/5 transition-all duration-200"
                  aria-label="GitHub de Jhampier"
                  title="Ver perfil de GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>

                <a
                  href={formatSocialUrl(profile?.linkedin_url, 'linkedin') || 'https://www.linkedin.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 hover:bg-cyan-500/5 transition-all duration-200"
                  aria-label="LinkedIn de Jhampier"
                  title={profile?.linkedin_url ? "Ver perfil de LinkedIn" : "LinkedIn (Configurable en Admin / Perfil)"}
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
              {profile?.status_text && (
                <span className="text-xs text-emerald-400/90 font-mono flex items-center gap-1.5 pl-2 border-l border-white/10">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  {profile.status_text}
                </span>
              )}
            </div>
          </div>

          {/* Right Column: Interactive Tech Terminal & Architecture Preview */}
          <div className="lg:col-span-5">
            <div className="glass-card rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
              
              {/* Terminal Window Header */}
              <div className="bg-slate-950/80 px-4 py-3 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs font-mono text-slate-400 ml-2">jhampier@workspace:~$</span>
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setTerminalTab('stack')}
                    className={`px-2 py-1 text-[11px] font-mono rounded transition-colors ${
                      terminalTab === 'stack' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    stack.ts
                  </button>
                  <button 
                    onClick={() => setTerminalTab('status')}
                    className={`px-2 py-1 text-[11px] font-mono rounded transition-colors ${
                      terminalTab === 'status' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    system.sh
                  </button>
                  <button 
                    onClick={() => setTerminalTab('ai')}
                    className={`px-2 py-1 text-[11px] font-mono rounded transition-colors ${
                      terminalTab === 'ai' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    ai_flow.json
                  </button>
                </div>
              </div>

              {/* Terminal Body */}
              <div className="p-5 font-mono text-xs leading-relaxed text-slate-300 bg-slate-950/90 min-h-[300px]">
                {terminalTab === 'stack' && (
                  <div className="space-y-2">
                    <p className="text-slate-400">// Perfil de Ingeniería & Arquitectura</p>
                    <p>
                      <span className="text-purple-400">const</span>{' '}
                      <span className="text-cyan-300">developer</span> = &#123;
                    </p>
                    <p className="pl-4">
                      <span className="text-slate-400">name:</span>{' '}
                      <span className="text-emerald-300">'Jhampier Iván Juárez Mauricio'</span>,
                    </p>
                    <p className="pl-4">
                      <span className="text-slate-400">degree:</span>{' '}
                      <span className="text-emerald-300">'Ingeniería de Sistemas (Egresado)'</span>,
                    </p>
                    <p className="pl-4">
                      <span className="text-slate-400">coreStack:</span> [
                      <span className="text-amber-300">'React'</span>,{' '}
                      <span className="text-amber-300">'TypeScript'</span>,{' '}
                      <span className="text-amber-300">'NestJS'</span>,{' '}
                      <span className="text-amber-300">'Supabase'</span>,{' '}
                      <span className="text-amber-300">'PostgreSQL'</span>]
                    </p>
                    <p className="pl-4">
                      <span className="text-slate-400">aiIntegration:</span> [
                      <span className="text-amber-300">'Google Gemini'</span>,{' '}
                      <span className="text-amber-300">'n8n'</span>,{' '}
                      <span className="text-amber-300">'TensorFlow'</span>]
                    </p>
                    <p className="pl-4">
                      <span className="text-slate-400">focus:</span>{' '}
                      <span className="text-emerald-300">'Full Stack, APIs, Automatización & IA'</span>,
                    </p>
                    <p>&#125;;</p>
                    <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1.5 text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Typecheck: OK (0 errors)
                      </span>
                      <span className="text-cyan-400">ready for production</span>
                    </div>
                  </div>
                )}

                {terminalTab === 'status' && (
                  <div className="space-y-2">
                    <p className="text-emerald-400 flex items-center gap-2">
                      <Play className="w-3.5 h-3.5" /> ./check_system_health.sh
                    </p>
                    <div className="space-y-1 text-slate-300 pl-2">
                      <p>● DB Connection: <span className="text-emerald-400 font-bold">PostgreSQL [Active]</span></p>
                      <p>● Security: <span className="text-cyan-400">Row Level Security (RLS) Enforced</span></p>
                      <p>● Auth Engine: <span className="text-cyan-400">Supabase Auth (JWT)</span></p>
                      <p>● Storage Buckets: <span className="text-indigo-300">[profile, projects, certs, cv]</span></p>
                      <p>● Deployment Target: <span className="text-amber-300">Vercel / Cloud Edge</span></p>
                    </div>
                    <div className="mt-4 p-2.5 rounded bg-slate-900 border border-white/5 text-[11px] text-slate-400">
                      ⚡ Latencia optimizada & renderizado reactivo sin dependencias pesadas.
                    </div>
                  </div>
                )}

                {terminalTab === 'ai' && (
                  <div className="space-y-2">
                    <p className="text-slate-400">// Workflow de Automatización & Agentes</p>
                    <pre className="text-indigo-300 text-[11px]">
{`{
  "trigger": "Webhook / Event / User Query",
  "orchestrator": "n8n Autonomous Node",
  "engine": "Google Gemini 2.5 Flash",
  "actions": [
    "Context Retrieval",
    "Smart Categorization",
    "Calendar & Data Sync"
  ],
  "status": "Operational 24/7"
}`}
                    </pre>
                  </div>
                )}
              </div>

              {/* Terminal Footer Metrics */}
              <div className="bg-slate-950 px-4 py-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Cpu className="w-3 h-3 text-cyan-400" /> Arch: Clean & Scalable
                </span>
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" /> Dark Mode Pro
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
