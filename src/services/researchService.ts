import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Research } from '../types';
import { initialResearch } from '../lib/mockData';

const LOCAL_STORAGE_KEY = 'portfolio_research';

export const researchService = {
  async getResearch(onlyPublished = false): Promise<Research[]> {
    if (isSupabaseConfigured()) {
      try {
        let query = supabase
          .from('research')
          .select('*')
          .order('sort_order', { ascending: true });

        if (onlyPublished) {
          query = query.eq('is_published', true);
        }

        const { data, error } = await query;
        if (error) throw error;
        if (data && data.length > 0) return data as Research[];
      } catch (err) {
        console.warn('Error fetching research from Supabase, using local fallback:', err);
      }
    }

    const local = localStorage.getItem(LOCAL_STORAGE_KEY);
    let items: Research[] = initialResearch;
    if (local) {
      try {
        items = JSON.parse(local);
      } catch {
        // ignore
      }
    }
    return onlyPublished ? items.filter(r => r.is_published) : items;
  },

  async createResearch(item: Omit<Research, 'id'>): Promise<Research> {
    const newItem: Research = {
      ...item,
      id: isSupabaseConfigured() ? undefined as any : 'res-' + Date.now(),
    };

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('research')
        .insert([item])
        .select()
        .single();
      if (error) throw error;
      return data as Research;
    }

    const current = await this.getResearch(false);
    const updated = [...current, newItem];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return newItem;
  },

  async updateResearch(id: string, updates: Partial<Research>): Promise<Research> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('research')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Research;
    }

    const current = await this.getResearch(false);
    const updated = current.map(r => r.id === id ? { ...r, ...updates } : r);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return updated.find(r => r.id === id)!;
  },

  async deleteResearch(id: string): Promise<void> {
    if (isSupabaseConfigured()) {
      const { error } = await supabase
        .from('research')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return;
    }

    const current = await this.getResearch(false);
    const updated = current.filter(r => r.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  },

  async togglePublish(id: string, currentStatus: boolean): Promise<Research> {
    return this.updateResearch(id, { is_published: !currentStatus });
  }
};
