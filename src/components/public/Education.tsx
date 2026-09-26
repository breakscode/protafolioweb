import React, { useState, useEffect } from 'react';
import { Education as EducationType } from '../../types';
import { educationService } from '../../services/educationService';
import { Badge } from '../ui/Badge';
import { GraduationCap, MapPin, Calendar, BookOpen } from 'lucide-react';

export const Education: React.FC = () => {
  const [eduList, setEduList] = useState<EducationType[]>([]);

  useEffect(() => {
    educationService.getEducation(true).then(setEduList);
  }, []);

  return (
    <section id="education" className="py-20 relative bg-surface-200/40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <p className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
            <GraduationCap className="w-4 h-4" /> // Formación Universitaria
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Educación
          </h2>
          <div className="w-12 h-1 bg-cyan-500 mx-auto rounded-full" />
        </div>

        {/* Education cards */}
        <div className="space-y-6">
          {eduList.map((edu) => (
            <div
              key={edu.id}
              className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10 space-y-4 hover:border-cyan-500/30 transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">
                      {edu.degree}
                    </h3>
                    <p className="text-sm font-semibold text-cyan-400">
                      {edu.institution}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="success" size="md">
                    {edu.status}
                  </Badge>
                  <span className="text-xs font-mono text-slate-300 flex items-center gap-1 bg-slate-900 px-3 py-1.5 rounded-xl border border-white/10">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" /> {edu.period}
                  </span>
                </div>
              </div>

              {/* Details & Location */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" /> {edu.location}
                </div>

                {edu.field_of_study && (
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    <strong>Áreas clave:</strong> {edu.field_of_study}
                  </p>
                )}

                {edu.description && (
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {edu.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
