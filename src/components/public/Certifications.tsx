import React, { useState, useEffect } from 'react';
import { Certification } from '../../types';
import { certificationsService } from '../../services/certificationsService';
import { Award, ExternalLink, ShieldCheck, CheckCircle } from 'lucide-react';

export const Certifications: React.FC = () => {
  const [certs, setCerts] = useState<Certification[]>([]);

  useEffect(() => {
    certificationsService.getCertifications(true).then(setCerts);
  }, []);

  return (
    <section id="certifications" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <p className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> // Formación Continua
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Certificaciones
          </h2>
          <div className="w-12 h-1 bg-cyan-500 mx-auto rounded-full" />
          <p className="text-sm text-slate-400 font-light">
            Especializaciones y credenciales emitidas por Anthropic, Cisco, Red Hat, Google, Microsoft y GitHub.
          </p>
        </div>

        {/* Grid of Certifications */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {certs.map((cert) => (
            <div
              key={cert.id}
              className="glass-card glass-card-hover rounded-2xl p-5 border border-white/10 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  {cert.issue_date && (
                    <span className="text-xs font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
                      {cert.issue_date}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                    {cert.name}
                  </h3>
                  <p className="text-xs text-cyan-400 font-mono font-medium mt-1">
                    {cert.issuer}
                  </p>
                </div>

                {cert.description && (
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {cert.description}
                  </p>
                )}
              </div>

              {/* Verification link if provided */}
              {cert.verification_url && (
                <a
                  href={cert.verification_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors pt-2 border-t border-white/5 font-mono"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Verificar credencial
                </a>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
