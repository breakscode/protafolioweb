import React, { useState, useEffect } from 'react';
import { Research as ResearchType } from '../../types';
import { researchService } from '../../services/researchService';
import { Badge } from '../ui/Badge';
import { FlaskConical, Binary, Bot, CheckCircle2, TrendingUp } from 'lucide-react';

export const Research: React.FC = () => {
  const [items, setItems] = useState<ResearchType[]>([]);

  useEffect(() => {
    researchService.getResearch(true).then(setItems);
  }, []);

  return (
    <section id="research" className="py-20 relative bg-surface-200/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <p className="text-xs font-mono font-semibold text-purple-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
            <FlaskConical className="w-4 h-4" /> // Investigación & Deep Learning
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Investigación Científica & IA
          </h2>
          <div className="w-12 h-1 bg-purple-500 mx-auto rounded-full" />
          <p className="text-sm text-slate-400 font-light">
            Proyectos de investigación orientados a la automatización inteligente, arquitecturas de agentes y redes neuronales.
          </p>
        </div>

        {/* Research Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="glass-card rounded-2xl p-7 border border-white/10 flex flex-col justify-between space-y-6 hover:border-purple-500/30 transition-all duration-300 relative overflow-hidden"
            >
              {/* Subtle ambient accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />

              <div className="space-y-4">
                {/* Header Badge & Year */}
                <div className="flex items-center justify-between">
                  <Badge variant="purple" size="sm">
                    {item.organization_or_context || 'Investigación Aplicada'}
                  </Badge>
                  <span className="text-xs font-mono text-slate-400">{item.year}</span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white leading-snug">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {item.description}
                </p>

                {/* Tech chips */}
                {item.technologies && item.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.technologies.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 border border-white/10 text-xs font-mono text-purple-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Key Metric Card (e.g. 80.34% strictly tied to this experiment) */}
              {item.key_metric && (
                <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/20 flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-extrabold text-purple-300 font-mono tracking-tight">
                      {item.key_metric}
                    </span>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {item.metric_label || 'Resultado obtenido en el experimento'}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
              )}

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
