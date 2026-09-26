import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { NavigationItem } from '../types';
import { initialNavigation } from '../lib/mockData';

const LOCAL_STORAGE_KEY = 'portfolio_navigation';

export const navigationService = {
  async getNavigation(onlyVisible = false): Promise<NavigationItem[]> {
    if (isSupabaseConfigured()) {
      try {
        let query = supabase
          .from('navigation')
          .select('*')
          .order('sort_order', { ascending: true });

        if (onlyVisible) {
          query = query.eq('is_visible', true);
        }

        const { data, error } = await query;
        if (error) throw error;
        if (data && data.length > 0) return data as NavigationItem[];
      } catch (err) {
        console.warn('Error fetching navigation from Supabase, using local fallback:', err);
      }
    }

    const local = localStorage.getItem(LOCAL_STORAGE_KEY);
    let items: NavigationItem[] = initialNavigation;
    if (local) {
      try {
        items = JSON.parse(local);
      } catch {
        // ignore
      }
    }
    return onlyVisible ? items.filter(i => i.is_visible) : items;
  },

  async updateNavigationItem(id: string, updates: Partial<NavigationItem>): Promise<NavigationItem> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('navigation')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as NavigationItem;
    }

    const current = await this.getNavigation(false);
    const updated = current.map(i => i.id === id ? { ...i, ...updates } : i);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return updated.find(i => i.id === id)!;
  },

  async saveAll(items: NavigationItem[]): Promise<NavigationItem[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('navigation')
        .upsert(items)
        .select();
      if (error) throw error;
      return data as NavigationItem[];
    }

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
    return items;
  },

  async toggleVisibility(id: string, currentStatus: boolean): Promise<NavigationItem> {
    return this.updateNavigationItem(id, { is_visible: !currentStatus });
  }
};
