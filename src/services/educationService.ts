import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Education } from '../types';
import { initialEducation } from '../lib/mockData';

const LOCAL_STORAGE_KEY = 'portfolio_education';

export const educationService = {
  async getEducation(onlyPublished = false): Promise<Education[]> {
    if (isSupabaseConfigured()) {
      try {
        let query = supabase
          .from('education')
          .select('*')
          .order('sort_order', { ascending: true });

        if (onlyPublished) {
          query = query.eq('is_published', true);
        }

        const { data, error } = await query;
        if (error) throw error;
        if (data && data.length > 0) return data as Education[];
      } catch (err) {
        console.warn('Error fetching education from Supabase, using local fallback:', err);
      }
    }

    const local = localStorage.getItem(LOCAL_STORAGE_KEY);
    let edu: Education[] = initialEducation;
    if (local) {
      try {
        edu = JSON.parse(local);
      } catch {
        // ignore
      }
    }
    return onlyPublished ? edu.filter(e => e.is_published) : edu;
  },

  async createEducation(item: Omit<Education, 'id'>): Promise<Education> {
    const newItem: Education = {
      ...item,
      id: isSupabaseConfigured() ? undefined as any : 'edu-' + Date.now(),
    };

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('education')
        .insert([item])
        .select()
        .single();
      if (error) throw error;
      return data as Education;
    }

    const current = await this.getEducation(false);
    const updated = [...current, newItem];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return newItem;
  },

  async updateEducation(id: string, updates: Partial<Education>): Promise<Education> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('education')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Education;
    }

    const current = await this.getEducation(false);
    const updated = current.map(e => e.id === id ? { ...e, ...updates } : e);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return updated.find(e => e.id === id)!;
  },

  async deleteEducation(id: string): Promise<void> {
    if (isSupabaseConfigured()) {
      const { error } = await supabase
        .from('education')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return;
    }

    const current = await this.getEducation(false);
    const updated = current.filter(e => e.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  },

  async togglePublish(id: string, currentStatus: boolean): Promise<Education> {
    return this.updateEducation(id, { is_published: !currentStatus });
  }
};
