import React, { useState, useEffect } from 'react';
import { SiteSettings } from '../../types';
import { settingsService } from '../../services/settingsService';
import { Terminal, Github, Linkedin, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    settingsService.getSettings().then(setSettings);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-12 border-t border-white/10 bg-slate-950/80 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Logo / Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Terminal className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono font-bold text-sm text-slate-100">
                Jhampier Juárez
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Software Developer | Full Stack | IA</span>
            </div>
          </div>

          {/* Copyright */}
          <p className="text-xs text-center font-mono text-slate-400">
            {settings?.copyright_text || `© ${new Date().getFullYear()} Jhampier Iván Juárez Mauricio. Todos los derechos reservados.`}
          </p>

          {/* Social and back to top */}
          <div className="flex items-center gap-4">
            {settings?.github_url && (
              <a
                href={settings.github_url}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {settings?.linkedin_url && (
              <a
                href={settings.linkedin_url}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
              aria-label="Volver arriba"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </footer>
  );
};
