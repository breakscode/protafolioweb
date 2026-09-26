import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Profile } from '../types';
import { initialProfile } from '../lib/mockData';

const LOCAL_STORAGE_KEY = 'portfolio_profile';

export const profileService = {
  async getProfile(): Promise<Profile> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .limit(1)
          .maybeSingle();

        if (error) throw error;
        if (data) return data as Profile;
      } catch (err) {
        console.warn('Error fetching profile from Supabase, falling back to local state:', err);
      }
    }

    const local = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (local) {
      try {
        return JSON.parse(local);
      } catch {
        // ignore error
      }
    }
    return initialProfile;
  },

  async updateProfile(profile: Partial<Profile>): Promise<Profile> {
    if (isSupabaseConfigured()) {
      try {
        const current = await this.getProfile();
        const { data, error } = await supabase
          .from('profiles')
          .upsert({ ...current, ...profile, updated_at: new Date().toISOString() })
          .select()
          .single();

        if (error) throw error;
        if (data) {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
          return data as Profile;
        }
      } catch (err) {
        console.error('Error updating profile in Supabase:', err);
        throw err;
      }
    }

    const current = await this.getProfile();
    const updated = { ...current, ...profile, updated_at: new Date().toISOString() };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return updated as Profile;
  }
};
