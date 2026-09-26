import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Skill } from '../types';
import { initialSkills } from '../lib/mockData';

const LOCAL_STORAGE_KEY = 'portfolio_skills';

export const skillsService = {
  async getSkills(onlyPublished = false): Promise<Skill[]> {
    if (isSupabaseConfigured()) {
      try {
        let query = supabase
          .from('skills')
          .select('*')
          .order('sort_order', { ascending: true });

        if (onlyPublished) {
          query = query.eq('is_published', true);
        }

        const { data, error } = await query;
        if (error) throw error;
        if (data && data.length > 0) return data as Skill[];
      } catch (err) {
        console.warn('Error fetching skills from Supabase, using local fallback:', err);
      }
    }

    const local = localStorage.getItem(LOCAL_STORAGE_KEY);
    let skills: Skill[] = initialSkills;
    if (local) {
      try {
        skills = JSON.parse(local);
      } catch {
        // ignore
      }
    }
    return onlyPublished ? skills.filter(s => s.is_published) : skills;
  },

  async createSkill(skill: Omit<Skill, 'id'>): Promise<Skill> {
    const newSkill: Skill = {
      ...skill,
      id: isSupabaseConfigured() ? undefined as any : 'sk-' + Date.now(),
    };

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('skills')
        .insert([skill])
        .select()
        .single();
      if (error) throw error;
      return data as Skill;
    }

    const current = await this.getSkills(false);
    const updated = [...current, newSkill];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return newSkill;
  },

  async updateSkill(id: string, updates: Partial<Skill>): Promise<Skill> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('skills')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Skill;
    }

    const current = await this.getSkills(false);
    const updated = current.map(s => s.id === id ? { ...s, ...updates } : s);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return updated.find(s => s.id === id)!;
  },

  async deleteSkill(id: string): Promise<void> {
    if (isSupabaseConfigured()) {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return;
    }

    const current = await this.getSkills(false);
    const updated = current.filter(s => s.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  },

  async togglePublish(id: string, currentStatus: boolean): Promise<Skill> {
    return this.updateSkill(id, { is_published: !currentStatus });
  }
};
