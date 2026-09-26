import React, { useState, useEffect } from 'react';
import { Experience as ExperienceType } from '../../types';
import { experienceService } from '../../services/experienceService';
import { Badge } from '../ui/Badge';
import { GitCommit, Calendar, Building2, MapPin, Sparkles } from 'lucide-react';

export const Experience: React.FC = () => {
  const [items, setItems] = useState<ExperienceType[]>([]);

  useEffect(() => {
    experienceService.getExperience(true).then(setItems);
  }, []);

  const getTypeVariant = (type: ExperienceType['type']) => {
    switch (type) {
      case 'Proyecto profesional': return 'primary';
      case 'Proyecto académico': return 'purple';
      case 'Trabajo': return 'success';
      case 'Proyecto personal': return 'warning';
      default: return 'neutral';
    }
  };

  return (
    <section id="experience" className="py-20 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <p className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4" /> // Trayectoria & Desarrollo
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Trayectoria y Proyectos
          </h2>
          <div className="w-12 h-1 bg-cyan-500 mx-auto rounded-full" />
          <p className="text-sm text-slate-400 font-light">
            Evolución práctica a través de desarrollo de software, proyectos profesionales e investigación aplicada.
          </p>
        </div>

        {/* Vertical Timeline */}
        <div className="relative border-l-2 border-cyan-500/20 ml-4 sm:ml-32 space-y-10 pl-6 sm:pl-10">
          {items.map((item) => (
            <div key={item.id} className="relative group">
              
              {/* Timeline Marker Dot */}
              <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-slate-950 border-2 border-cyan-400 group-hover:bg-cyan-400 group-hover:scale-125 transition-all duration-300 shadow-glow-sm" />

              {/* Year label on left for larger screens */}
              <div className="hidden sm:block absolute -left-32 top-1 w-20 text-right font-mono font-bold text-sm text-cyan-400">
                {item.year_label || item.start_date}
              </div>

              {/* Timeline Card */}
              <div className="glass-card glass-card-hover p-6 rounded-2xl border border-white/10 space-y-3">
                
                {/* Year tag for mobile + Type Badge */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="sm:hidden text-xs font-mono font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                      {item.year_label || item.start_date}
                    </span>
                    <Badge variant={getTypeVariant(item.type)} size="sm">
                      {item.type}
                    </Badge>
                    {item.modality && (
                      <span className="text-[11px] font-mono text-slate-400">
                        • {item.modality}
                      </span>
                    )}
                  </div>

                  {item.location && (
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {item.location}
                    </span>
                  )}
                </div>

                {/* Title and Org */}
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {item.role_or_title}
                  </h3>
                  {item.organization && (
                    <p className="text-xs sm:text-sm text-cyan-400/90 font-medium flex items-center gap-1.5 mt-0.5">
                      <Building2 className="w-3.5 h-3.5" /> {item.organization}
                    </p>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {item.description}
                </p>

                {/* Tech chips */}
                {item.technologies && item.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {item.technologies.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-slate-900 border border-white/5 text-[11px] font-mono text-slate-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
