import React, { useState, useEffect } from 'react';
import { Navbar } from '../../components/public/Navbar';
import { Hero } from '../../components/public/Hero';
import { About } from '../../components/public/About';
import { Skills } from '../../components/public/Skills';
import { Projects } from '../../components/public/Projects';
import { Experience } from '../../components/public/Experience';
import { Research } from '../../components/public/Research';
import { Certifications } from '../../components/public/Certifications';
import { Education } from '../../components/public/Education';
import { Contact } from '../../components/public/Contact';
import { Footer } from '../../components/public/Footer';
import { CyberBackground } from '../../components/public/CyberBackground';
import { settingsService } from '../../services/settingsService';
import { SiteSettings } from '../../types';
import { Wrench } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    settingsService.getSettings().then(setSettings);
  }, []);

  if (settings?.maintenance_mode) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 text-center">
        <div className="glass-card max-w-md p-8 rounded-2xl border border-white/10 space-y-4">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
            <Wrench className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-white">Modo Mantenimiento</h1>
          <p className="text-xs text-slate-300">
            El portafolio se encuentra actualmente en actualización. Por favor vuelve a visitarnos en breve.
          </p>
          <div className="pt-2">
            <a href="/admin/login" className="text-xs font-mono text-cyan-400 hover:underline">
              Acceso Administrativo →
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200 relative">
      <CyberBackground />
      <Navbar />
      <main className="flex-1 relative z-10">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Research />
        <Certifications />
        <Education />
        <Contact />
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
};
