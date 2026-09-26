import React, { useState, useEffect } from 'react';
import { Skill, SkillCategory } from '../../types';
import { skillsService } from '../../services/skillsService';
import { 
  Code2, 
  Server, 
  Database, 
  Bot, 
  Wrench, 
  Radio, 
  Sparkles,
  Layers
} from 'lucide-react';

const CATEGORY_CONFIG: Record<SkillCategory, { label: string; icon: React.ReactNode; color: string }> = {
  frontend: {
    label: 'Frontend',
    icon: <Code2 className="w-4 h-4 text-cyan-400" />,
    color: 'border-cyan-500/20 bg-cyan-500/5',
  },
  backend: {
    label: 'Backend & APIs',
    icon: <Server className="w-4 h-4 text-indigo-400" />,
    color: 'border-indigo-500/20 bg-indigo-500/5',
  },
  database: {
    label: 'Bases de Datos & ORM',
    icon: <Database className="w-4 h-4 text-emerald-400" />,
    color: 'border-emerald-500/20 bg-emerald-500/5',
  },
  ai_automation: {
    label: 'IA & Automatización',
    icon: <Bot className="w-4 h-4 text-purple-400" />,
    color: 'border-purple-500/20 bg-purple-500/5',
  },
  tools: {
    label: 'Herramientas & Cloud',
    icon: <Wrench className="w-4 h-4 text-amber-400" />,
    color: 'border-amber-500/20 bg-amber-500/5',
  },
  other: {
    label: 'Redes, IoT & BI',
    icon: <Radio className="w-4 h-4 text-blue-400" />,
    color: 'border-blue-500/20 bg-blue-500/5',
  },
};

export const Skills: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    skillsService.getSkills(true).then(setSkills);
  }, []);

  const categories: SkillCategory[] = [
    'frontend',
    'backend',
    'database',
    'ai_automation',
    'tools',
    'other',
  ];

  return (
    <section id="skills" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <p className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-widest">
            // Tecnologías & Herramientas
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Stack Tecnológico
          </h2>
          <div className="w-12 h-1 bg-cyan-500 mx-auto rounded-full" />
          <p className="text-sm text-slate-400 font-light pt-2">
            Tecnologías y herramientas aplicadas en proyectos de desarrollo de software, automatización e infraestructura.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((catKey) => {
            const catSkills = skills.filter((s) => s.category === catKey);
            if (catSkills.length === 0) return null;
            const config = CATEGORY_CONFIG[catKey];

            return (
              <div
                key={catKey}
                className="glass-card rounded-2xl p-6 border border-white/10 flex flex-col justify-between space-y-4 hover:border-white/20 transition-all duration-200"
              >
                {/* Card Header */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-slate-900 border border-white/10">
                      {config.icon}
                    </div>
                    <h3 className="font-semibold text-slate-100 text-sm sm:text-base">
                      {config.label}
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {catSkills.length} techs
                  </span>
                </div>

                {/* Skills Badges */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {catSkills.map((skill) => (
                    <div
                      key={skill.id}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 border ${
                        skill.highlight
                          ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/20 hover:border-cyan-400'
                          : 'bg-slate-900/90 text-slate-300 border-white/10 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      {skill.highlight && <Sparkles className="w-3 h-3 text-cyan-400" />}
                      <span>{skill.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
