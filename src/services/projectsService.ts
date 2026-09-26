import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Project } from '../types';
import { initialProjects } from '../lib/mockData';

const LOCAL_STORAGE_KEY = 'portfolio_projects';

export const projectsService = {
  async getProjects(onlyPublished = false): Promise<Project[]> {
    if (isSupabaseConfigured()) {
      try {
        let query = supabase
          .from('projects')
          .select('*')
          .order('sort_order', { ascending: true });

        if (onlyPublished) {
          query = query.eq('is_published', true);
        }

        const { data, error } = await query;
        if (error) throw error;
        if (data && data.length > 0) return data as Project[];
      } catch (err) {
        console.warn('Error fetching projects from Supabase, using local fallback:', err);
      }
    }

    const local = localStorage.getItem(LOCAL_STORAGE_KEY);
    let projects: Project[] = initialProjects;
    if (local) {
      try {
        projects = JSON.parse(local);
      } catch {
        // ignore
      }
    }
    return onlyPublished ? projects.filter(p => p.is_published) : projects;
  },

  async getProjectBySlug(slug: string): Promise<Project | null> {
    const projects = await this.getProjects(false);
    return projects.find(p => p.slug === slug) || null;
  },

  async createProject(project: Omit<Project, 'id'>): Promise<Project> {
    const newProject: Project = {
      ...project,
      id: isSupabaseConfigured() ? undefined as any : 'proj-' + Date.now(),
    };

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('projects')
        .insert([project])
        .select()
        .single();
      if (error) throw error;
      return data as Project;
    }

    const current = await this.getProjects(false);
    const updated = [...current, newProject];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return newProject;
  },

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Project;
    }

    const current = await this.getProjects(false);
    const updated = current.map(p => p.id === id ? { ...p, ...updates } : p);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return updated.find(p => p.id === id)!;
  },

  async deleteProject(id: string): Promise<void> {
    if (isSupabaseConfigured()) {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return;
    }

    const current = await this.getProjects(false);
    const updated = current.filter(p => p.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  },

  async duplicateProject(id: string): Promise<Project> {
    const current = await this.getProjects(false);
    const original = current.find(p => p.id === id);
    if (!original) throw new Error('Proyecto no encontrado');

    const copyData: Omit<Project, 'id'> = {
      ...original,
      title: `${original.title} (Copia)`,
      slug: `${original.slug}-copia-${Date.now()}`,
      is_published: false,
      sort_order: (original.sort_order || 0) + 1,
    };

    return this.createProject(copyData);
  },

  async togglePublish(id: string, currentStatus: boolean): Promise<Project> {
    return this.updateProject(id, { is_published: !currentStatus });
  },

  async toggleFeatured(id: string, currentStatus: boolean): Promise<Project> {
    return this.updateProject(id, { is_featured: !currentStatus });
  }
};
