import React, { useState, useEffect } from 'react';
import { Project } from '../../types';
import { projectsService } from '../../services/projectsService';
import { ProjectCard } from './ProjectCard';
import { ProjectModal } from './ProjectModal';
import { FolderGit2 } from 'lucide-react';

export const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('Todos');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    projectsService.getProjects(true).then(setProjects);
  }, []);

  const filterTabs = [
    'Todos',
    'Full Stack',
    'IA',
    'Automatización',
    'IoT',
    'Redes',
    'Investigación',
  ];

  const filteredProjects = projects.filter((proj) => {
    if (activeFilter === 'Todos') return true;
    if (activeFilter === 'Automatización') {
      return proj.category === 'Automatización' || proj.category === 'IA / Automatización';
    }
    if (activeFilter === 'IA') {
      return proj.category === 'IA' || proj.category === 'IA / Automatización';
    }
    return proj.category === activeFilter;
  });

  const handleOpenModal = (proj: Project) => {
    setSelectedProject(proj);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <section id="projects" className="py-20 relative bg-surface-200/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <p className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
            <FolderGit2 className="w-4 h-4" /> // Proyectos Destacados & Arquitecturas
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Proyectos Desarrollados
          </h2>
          <div className="w-12 h-1 bg-cyan-500 mx-auto rounded-full" />
          <p className="text-sm text-slate-400 font-light">
            Sistemas web completos, aplicaciones con IA, automatización y soluciones de ingeniería de software.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-12">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-medium font-mono transition-all duration-200 border ${
                activeFilter === tab
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-semibold shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-900/80 text-slate-300 border-white/10 hover:border-white/20 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onSelect={handleOpenModal}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 glass-card rounded-2xl border border-white/10 max-w-md mx-auto">
            <p className="text-sm text-slate-400">No se encontraron proyectos en esta categoría.</p>
          </div>
        )}

      </div>

      {/* Interactive Detail Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  );
};
