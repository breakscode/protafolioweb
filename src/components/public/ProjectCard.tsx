import React from 'react';
import { Project } from '../../types';
import { Badge } from '../ui/Badge';
import { Github, ExternalLink, ArrowUpRight, Calendar, Building2, MapPin } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelect }) => {
  const getCategoryColor = (cat: Project['category']) => {
    switch (cat) {
      case 'Full Stack': return 'primary';
      case 'Frontend': return 'cyan';
      case 'Backend': return 'indigo';
      case 'IA': return 'purple';
      case 'Automatización': 
      case 'IA / Automatización': return 'warning';
      default: return 'primary';
    }
  };

  return (
    <div 
      className="group glass-card glass-card-hover rounded-2xl overflow-hidden border border-white/10 flex flex-col justify-between cursor-pointer"
      onClick={() => onSelect(project)}
    >
      {/* Top Image Preview (if present) or Tech Visual Header */}
      {project.main_image_url ? (
        <div className="relative h-48 w-full overflow-hidden bg-slate-950">
          <img
            src={project.main_image_url}
            alt={project.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <Badge variant={getCategoryColor(project.category)} size="sm">
              {project.category}
            </Badge>
            {project.is_featured && (
              <Badge variant="warning" size="sm">
                Destacado
              </Badge>
            )}
          </div>
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="p-2 rounded-xl bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/30 flex items-center gap-1 text-xs">
              Ver detalle <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      ) : (
        <div className="p-5 pb-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant={getCategoryColor(project.category)} size="sm">
              {project.category}
            </Badge>
            {project.is_featured && (
              <Badge variant="warning" size="sm">
                Destacado
              </Badge>
            )}
          </div>
          <span className="text-xs font-mono text-slate-400">{project.year}</span>
        </div>
      )}

      {/* Card Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Metadata chips */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" /> {project.year}
            </span>
            {project.organization && (
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" /> {project.organization}
              </span>
            )}
            {project.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> {project.location}
              </span>
            )}
          </div>

          <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors leading-snug">
            {project.title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed">
            {project.short_description}
          </p>
        </div>

        {/* Tech tags */}
        <div className="space-y-3 pt-2">
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 4).map((tech, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md bg-slate-900/90 text-slate-300 border border-white/5 text-[11px] font-mono"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-400 text-[10px] font-mono">
                +{project.technologies.length - 4}
              </span>
            )}
          </div>

          {/* Action Links (Optional) */}
          <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs">
            <span className="text-cyan-400 flex items-center gap-1 font-medium group-hover:underline">
              Explorar arquitectura <ArrowUpRight className="w-3.5 h-3.5" />
            </span>

            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
                  aria-label="Ver repositorio en GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {project.demo_url && (
                <a
                  href={project.demo_url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
                  aria-label="Ver demostración en vivo"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
