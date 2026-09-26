import React, { useState, useEffect } from 'react';
import { Menu, X, Terminal, FileDown, Shield } from 'lucide-react';
import { NavigationItem, DocumentItem } from '../../types';
import { navigationService } from '../../services/navigationService';
import { documentsService } from '../../services/documentsService';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const [navItems, setNavItems] = useState<NavigationItem[]>([]);
  const [activeCV, setActiveCV] = useState<DocumentItem | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    navigationService.getNavigation(true).then(setNavItems);
    documentsService.getActiveCV().then(setActiveCV);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDownloadCV = () => {
    if (activeCV?.file_url && activeCV.file_url !== '#') {
      window.open(activeCV.file_url, '_blank');
    } else {
      const element = document.getElementById('contact');
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      isScrolled ? 'glass-nav py-3' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <a 
            href="#hero" 
            className="flex items-center gap-2.5 group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all duration-300 group-hover:shadow-glow-sm">
              <Terminal className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono font-bold text-sm text-slate-100 tracking-tight flex items-center gap-1.5">
                jhampier<span className="text-cyan-400">.dev</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Software Developer</span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-full border border-white/10 backdrop-blur-md">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-cyan-400 hover:bg-white/5 rounded-full transition-all duration-200"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<FileDown className="w-4 h-4" />}
              onClick={handleDownloadCV}
            >
              CV
            </Button>
            <a
              href="/admin"
              className="p-2 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
              title="Panel de Administración"
            >
              <Shield className="w-4 h-4" />
            </a>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <a
              href="/admin"
              className="p-2 text-slate-400 hover:text-cyan-400"
              title="Panel Admin"
            >
              <Shield className="w-4 h-4" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 focus:outline-none"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-nav border-b border-white/10 px-4 pt-3 pb-6 animate-slide-up">
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium text-slate-200 hover:text-cyan-400 hover:bg-white/5 rounded-lg transition-colors"
              >
                {item.label}
              </a>
            ))}
            <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
              <Button
                variant="primary"
                size="sm"
                leftIcon={<FileDown className="w-4 h-4" />}
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleDownloadCV();
                }}
                className="w-full"
              >
                Descargar CV
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
