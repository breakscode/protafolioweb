import React, { useState } from 'react';
import { Project } from '../../types';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { 
  Github, 
  ExternalLink, 
  Calendar, 
  Building2, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  Lightbulb, 
  TrendingUp 
} from 'lucide-react';

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, isOpen, onClose }) => {
  const [activeImage, setActiveImage] = useState<string | null>(null);

  if (!project) return null;

  const currentDisplayImage = activeImage || project.main_image_url || (project.gallery_images && project.gallery_images[0]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="4xl">
      <div className="space-y-6">
        
        {/* Header Metadata */}
        <div className="space-y-3 pb-4 border-b border-white/10">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Badge variant="primary" size="md">
                {project.category}
              </Badge>
              {project.status && (
                <Badge variant="neutral" size="md">
                  Estado: {project.status}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" /> {project.year}
              </span>
              {project.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> {project.location}
                </span>
              )}
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {project.title}
          </h2>

          {project.organization && (
            <p className="text-xs sm:text-sm text-cyan-400 flex items-center gap-1.5 font-medium">
              <Building2 className="w-4 h-4" /> Organización / Cliente: {project.organization}
            </p>
          )}
        </div>

        {/* Media Preview / Gallery */}
        {currentDisplayImage && (
          <div className="space-y-3">
            <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden bg-slate-950 border border-white/10">
              <img
                src={currentDisplayImage}
                alt={project.title}
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Gallery Thumbnails */}
            {project.gallery_images && project.gallery_images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {project.gallery_images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      currentDisplayImage === img ? 'border-cyan-400 scale-105' : 'border-white/10 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Miniatura" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Detailed Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Main Description, Problem & Solution */}
          <div className="md:col-span-8 space-y-6">
            
            {/* Overview */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" /> Descripción General
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {project.full_description || project.short_description}
              </p>
            </div>

            {/* Problem Statement (if present) */}
            {project.problem_statement && (
              <div className="p-4 rounded-xl bg-slate-950/60 border border-rose-500/20 space-y-2">
                <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider font-mono flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> Desafío / Problema
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {project.problem_statement}
                </p>
              </div>
            )}

            {/* Solution Statement (if present) */}
            {project.solution_statement && (
              <div className="p-4 rounded-xl bg-slate-950/60 border border-emerald-500/20 space-y-2">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" /> Solución Implementada
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {project.solution_statement}
                </p>
              </div>
            )}

            {/* Results Statement (if present) */}
            {project.results_statement && (
              <div className="p-4 rounded-xl bg-slate-950/60 border border-cyan-500/20 space-y-2">
                <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Impacto & Resultados
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {project.results_statement}
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Stack & Links */}
          <div className="md:col-span-4 space-y-6">
            
            {/* Tech Stack */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Stack Tecnológico
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {project.technologies.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 border border-white/10 text-xs font-mono text-cyan-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* External Links */}
            {(project.github_url || project.demo_url) && (
              <div className="space-y-2 pt-2">
                {project.github_url && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full justify-center"
                    leftIcon={<Github className="w-4 h-4" />}
                    onClick={() => window.open(project.github_url!, '_blank')}
                  >
                    Ver en GitHub
                  </Button>
                )}
                {project.demo_url && (
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full justify-center"
                    leftIcon={<ExternalLink className="w-4 h-4" />}
                    onClick={() => window.open(project.demo_url!, '_blank')}
                  >
                    Demostración en vivo
                  </Button>
                )}
              </div>
            )}

            {/* Quick close */}
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-center"
              onClick={onClose}
            >
              Cerrar detalle
            </Button>
          </div>

        </div>

      </div>
    </Modal>
  );
};
