import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Profile } from '../types';
import { initialProfile } from '../lib/mockData';

const LOCAL_STORAGE_KEY = 'portfolio_profile';

export const profileService = {
  async getProfile(): Promise<Profile> {
    const local = localStorage.getItem(LOCAL_STORAGE_KEY);
    let localData: Partial<Profile> = {};
    if (local) {
      try {
        localData = JSON.parse(local);
      } catch {
        // ignore error
      }
    }

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .limit(1)
          .maybeSingle();

        if (error) throw error;
        if (data) {
          const merged: Profile = {
            ...initialProfile,
            ...localData,
            ...data,
            // Keep availability_text from Supabase if present, or local fallback
            availability_text: data.availability_text ?? localData.availability_text ?? initialProfile.availability_text,
          };
          return merged;
        }
      } catch (err) {
        console.warn('Error fetching profile from Supabase, falling back to local state:', err);
      }
    }

    if (local) {
      try {
        return { ...initialProfile, ...JSON.parse(local) };
      } catch {
        // ignore error
      }
    }
    return initialProfile;
  },

  async updateProfile(profile: Partial<Profile>): Promise<Profile> {
    const current = await this.getProfile();
    const updatedPayload = { ...current, ...profile, updated_at: new Date().toISOString() };

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .upsert(updatedPayload)
          .select()
          .single();

        if (error) {
          // If availability_text column is not yet migrated in Supabase, strip it and upsert the rest
          if (error.message?.includes('availability_text') || (error as any).code === '42703') {
            const { availability_text, ...safePayload } = updatedPayload;
            const { data: safeData } = await supabase
              .from('profiles')
              .upsert(safePayload)
              .select()
              .single();

            const finalData = { ...(safeData || safePayload), availability_text: updatedPayload.availability_text };
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(finalData));
            return finalData as Profile;
          }
          throw error;
        }

        if (data) {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
          return data as Profile;
        }
      } catch (err) {
        console.error('Error updating profile in Supabase:', err);
        throw err;
      }
    }

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedPayload));
    return updatedPayload as Profile;
  }
};
