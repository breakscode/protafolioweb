import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Experience } from '../types';
import { initialExperience } from '../lib/mockData';

const LOCAL_STORAGE_KEY = 'portfolio_experience';

export const experienceService = {
  async getExperience(onlyPublished = false): Promise<Experience[]> {
    if (isSupabaseConfigured()) {
      try {
        let query = supabase
          .from('experience')
          .select('*')
          .order('sort_order', { ascending: true });

        if (onlyPublished) {
          query = query.eq('is_published', true);
        }

        const { data, error } = await query;
        if (error) throw error;
        if (data && data.length > 0) return data as Experience[];
      } catch (err) {
        console.warn('Error fetching experience from Supabase, using local fallback:', err);
      }
    }

    const local = localStorage.getItem(LOCAL_STORAGE_KEY);
    let exp: Experience[] = initialExperience;
    if (local) {
      try {
        exp = JSON.parse(local);
      } catch {
        // ignore
      }
    }
    return onlyPublished ? exp.filter(e => e.is_published) : exp;
  },

  async createExperience(item: Omit<Experience, 'id'>): Promise<Experience> {
    const newItem: Experience = {
      ...item,
      id: isSupabaseConfigured() ? undefined as any : 'exp-' + Date.now(),
    };

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('experience')
        .insert([item])
        .select()
        .single();
      if (error) throw error;
      return data as Experience;
    }

    const current = await this.getExperience(false);
    const updated = [...current, newItem];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return newItem;
  },

  async updateExperience(id: string, updates: Partial<Experience>): Promise<Experience> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('experience')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Experience;
    }

    const current = await this.getExperience(false);
    const updated = current.map(e => e.id === id ? { ...e, ...updates } : e);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return updated.find(e => e.id === id)!;
  },

  async deleteExperience(id: string): Promise<void> {
    if (isSupabaseConfigured()) {
      const { error } = await supabase
        .from('experience')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return;
    }

    const current = await this.getExperience(false);
    const updated = current.filter(e => e.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  },

  async togglePublish(id: string, currentStatus: boolean): Promise<Experience> {
    return this.updateExperience(id, { is_published: !currentStatus });
  }
};
