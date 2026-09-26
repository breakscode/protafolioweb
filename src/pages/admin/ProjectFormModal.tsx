import React, { useState, useEffect } from 'react';
import { Project } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { Switch } from '../../components/ui/Switch';
import { ImageUploader } from '../../components/admin/ImageUploader';
import { Save, Plus, X, Sparkles } from 'lucide-react';

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Omit<Project, 'id'> & { id?: string }) => Promise<void>;
  project?: Project | null;
}

export const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  project,
}) => {
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    slug: '',
    short_description: '',
    full_description: '',
    problem_statement: '',
    solution_statement: '',
    results_statement: '',
    year: new Date().getFullYear().toString(),
    organization: '',
    location: 'Piura',
    category: 'Full Stack',
    technologies: [],
    main_image_url: '',
    gallery_images: [],
    github_url: '',
    demo_url: '',
    status: 'Completado',
    is_featured: false,
    is_published: true,
    sort_order: 1,
  });

  const [techInput, setTechInput] = useState('');
  const [galleryInput, setGalleryInput] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData(project);
    } else {
      setFormData({
        title: '',
        slug: '',
        short_description: '',
        full_description: '',
        problem_statement: '',
        solution_statement: '',
        results_statement: '',
        year: '2026',
        organization: '',
        location: 'Piura',
        category: 'Full Stack',
        technologies: ['React', 'TypeScript', 'Supabase'],
        main_image_url: '',
        gallery_images: [],
        github_url: '',
        demo_url: '',
        status: 'Completado',
        is_featured: false,
        is_published: true,
        sort_order: 1,
      });
    }
  }, [project, isOpen]);

  const handleAddTech = () => {
    if (techInput.trim() && !formData.technologies?.includes(techInput.trim())) {
      setFormData({
        ...formData,
        technologies: [...(formData.technologies || []), techInput.trim()],
      });
      setTechInput('');
    }
  };

  const handleRemoveTech = (tech: string) => {
    setFormData({
      ...formData,
      technologies: formData.technologies?.filter((t) => t !== tech),
    });
  };

  const handleAddGalleryImage = () => {
    if (galleryInput.trim() && !formData.gallery_images?.includes(galleryInput.trim())) {
      setFormData({
        ...formData,
        gallery_images: [...(formData.gallery_images || []), galleryInput.trim()],
      });
      setGalleryInput('');
    }
  };

  const handleRemoveGalleryImage = (url: string) => {
    setFormData({
      ...formData,
      gallery_images: formData.gallery_images?.filter((u) => u !== url),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.short_description) return;

    // Auto-generate slug if empty
    const slug = formData.slug?.trim() || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    setSaving(true);
    try {
      await onSave({
        ...formData,
        slug,
        title: formData.title!,
        short_description: formData.short_description!,
        year: formData.year || '2026',
        category: formData.category || 'Full Stack',
        technologies: formData.technologies || [],
        status: formData.status || 'Completado',
        is_featured: formData.is_featured || false,
        is_published: formData.is_published ?? true,
        sort_order: formData.sort_order || 1,
      } as any);
      onClose();
    } catch (err) {
      console.error('Error saving project:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={project ? 'Editar Proyecto' : 'Nuevo Proyecto'}
      description="Completa la información detallada para el portafolio público."
      maxWidth="4xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Título del Proyecto *"
            value={formData.title || ''}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <Input
            label="Slug (URL Amigable)"
            value={formData.slug || ''}
            placeholder="ej. sistema-gestion-patrimonial"
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            hint="Se autogenera si se deja vacío."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Categoría *"
            value={formData.category || 'Full Stack'}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
            options={[
              { value: 'Full Stack', label: 'Full Stack' },
              { value: 'IA', label: 'IA' },
              { value: 'Automatización', label: 'Automatización' },
              { value: 'IA / Automatización', label: 'IA / Automatización' },
              { value: 'IoT', label: 'IoT' },
              { value: 'Redes', label: 'Redes' },
              { value: 'Investigación', label: 'Investigación' },
            ]}
          />
          <Input
            label="Año *"
            value={formData.year || ''}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            required
          />
          <Input
            label="Estado"
            value={formData.status || ''}
            placeholder="Completado / En desarrollo"
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Organización / Cliente"
            placeholder="Ej. IESTP Juan José Farfán (Opcional)"
            value={formData.organization || ''}
            onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
          />
          <Input
            label="Ubicación"
            placeholder="Ej. Sullana, Piura"
            value={formData.location || ''}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
        </div>

        <Textarea
          label="Descripción Corta (Tarjeta) *"
          rows={2}
          value={formData.short_description || ''}
          onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
          required
        />

        <Textarea
          label="Descripción Completa (Modal de Detalle)"
          rows={4}
          value={formData.full_description || ''}
          onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
        />

        <div className="space-y-4 pt-2 border-t border-white/10">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Arquitectura & Casos de Estudio
          </h4>

          <Textarea
            label="Problema / Desafío"
            rows={2}
            value={formData.problem_statement || ''}
            placeholder="¿Qué reto o ineficiencia enfrentaba la organización?"
            onChange={(e) => setFormData({ ...formData, problem_statement: e.target.value })}
          />

          <Textarea
            label="Solución Implementada"
            rows={2}
            value={formData.solution_statement || ''}
            placeholder="Arquitectura, componentes y tecnologías aplicadas..."
            onChange={(e) => setFormData({ ...formData, solution_statement: e.target.value })}
          />

          <Textarea
            label="Resultados & Métricas"
            rows={2}
            value={formData.results_statement || ''}
            placeholder="Impacto cuantificable obtenido..."
            onChange={(e) => setFormData({ ...formData, results_statement: e.target.value })}
          />
        </div>

        {/* Technologies Tag Manager */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Tecnologías Utilizadas
          </label>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Ej. NestJS, Redis, Gemini 2.5"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTech();
                }
              }}
            />
            <Button type="button" variant="secondary" size="md" onClick={handleAddTech}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {formData.technologies?.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-white/10 text-xs font-mono text-cyan-300"
              >
                {tech}
                <button
                  type="button"
                  onClick={() => handleRemoveTech(tech)}
                  className="text-slate-400 hover:text-rose-400"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Image Uploader */}
        <div className="pt-2 border-t border-white/10">
          <ImageUploader
            label="Imagen Principal del Proyecto"
            value={formData.main_image_url || ''}
            onChange={(url) => setFormData({ ...formData, main_image_url: url })}
            bucket="projects"
          />
        </div>

        {/* External Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
          <Input
            label="URL de GitHub (Opcional)"
            placeholder="https://github.com/..."
            value={formData.github_url || ''}
            onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
          />
          <Input
            label="URL de Demostración (Opcional)"
            placeholder="https://..."
            value={formData.demo_url || ''}
            onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
          />
        </div>

        {/* Switches */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-950/60 border border-white/10">
          <Switch
            label="Proyecto Destacado"
            description="Mostrar con prioridad e insignia en el portafolio"
            checked={formData.is_featured || false}
            onChange={(checked) => setFormData({ ...formData, is_featured: checked })}
          />
          <Switch
            label="Estado Publicado"
            description="Visible públicamente para visitantes"
            checked={formData.is_published ?? true}
            onChange={(checked) => setFormData({ ...formData, is_published: checked })}
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          <Button type="button" variant="ghost" size="md" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" size="md" isLoading={saving} leftIcon={<Save className="w-4 h-4" />}>
            Guardar Proyecto
          </Button>
        </div>

      </form>
    </Modal>
  );
};
