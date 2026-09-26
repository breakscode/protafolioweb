import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { HeroData } from '../types';
import { initialHero } from '../lib/mockData';

const LOCAL_STORAGE_KEY = 'portfolio_hero';

export const heroService = {
  async getHero(): Promise<HeroData> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('hero')
          .select('*')
          .limit(1)
          .maybeSingle();

        if (error) throw error;
        if (data) return data as HeroData;
      } catch (err) {
        console.warn('Error fetching hero from Supabase, falling back to local state:', err);
      }
    }

    const local = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (local) {
      try {
        return JSON.parse(local);
      } catch {
        // ignore
      }
    }
    return initialHero;
  },

  async updateHero(hero: Partial<HeroData>): Promise<HeroData> {
    if (isSupabaseConfigured()) {
      try {
        const current = await this.getHero();
        const { data, error } = await supabase
          .from('hero')
          .upsert({ ...current, ...hero, updated_at: new Date().toISOString() })
          .select()
          .single();

        if (error) throw error;
        if (data) {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
          return data as HeroData;
        }
      } catch (err) {
        console.error('Error updating hero in Supabase:', err);
        throw err;
      }
    }

    const current = await this.getHero();
    const updated = { ...current, ...hero };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return updated as HeroData;
  }
};
