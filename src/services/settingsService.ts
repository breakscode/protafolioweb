import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { SiteSettings } from '../types';
import { initialSiteSettings } from '../lib/mockData';

const LOCAL_STORAGE_KEY = 'portfolio_settings';

export const settingsService = {
  async getSettings(): Promise<SiteSettings> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('*')
          .limit(1)
          .maybeSingle();

        if (error) throw error;
        if (data) return data as SiteSettings;
      } catch (err) {
        console.warn('Error fetching settings from Supabase, using local fallback:', err);
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
    return initialSiteSettings;
  },

  async updateSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    if (isSupabaseConfigured()) {
      try {
        const current = await this.getSettings();
        const { data, error } = await supabase
          .from('site_settings')
          .upsert({ ...current, ...settings, updated_at: new Date().toISOString() })
          .select()
          .single();

        if (error) throw error;
        if (data) {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
          return data as SiteSettings;
        }
      } catch (err) {
        console.error('Error updating settings in Supabase:', err);
        throw err;
      }
    }

    const current = await this.getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return updated as SiteSettings;
  }
};
