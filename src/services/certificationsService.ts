import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Certification } from '../types';
import { initialCertifications } from '../lib/mockData';

const LOCAL_STORAGE_KEY = 'portfolio_certifications';

export const certificationsService = {
  async getCertifications(onlyPublished = false): Promise<Certification[]> {
    if (isSupabaseConfigured()) {
      try {
        let query = supabase
          .from('certifications')
          .select('*')
          .order('sort_order', { ascending: true });

        if (onlyPublished) {
          query = query.eq('is_published', true);
        }

        const { data, error } = await query;
        if (error) throw error;
        if (data && data.length > 0) return data as Certification[];
      } catch (err) {
        console.warn('Error fetching certs from Supabase, using local fallback:', err);
      }
    }

    const local = localStorage.getItem(LOCAL_STORAGE_KEY);
    let certs: Certification[] = initialCertifications;
    if (local) {
      try {
        certs = JSON.parse(local);
      } catch {
        // ignore
      }
    }
    return onlyPublished ? certs.filter(c => c.is_published) : certs;
  },

  async createCertification(cert: Omit<Certification, 'id'>): Promise<Certification> {
    const newCert: Certification = {
      ...cert,
      id: isSupabaseConfigured() ? undefined as any : 'cert-' + Date.now(),
    };

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('certifications')
        .insert([cert])
        .select()
        .single();
      if (error) throw error;
      return data as Certification;
    }

    const current = await this.getCertifications(false);
    const updated = [...current, newCert];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return newCert;
  },

  async updateCertification(id: string, updates: Partial<Certification>): Promise<Certification> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('certifications')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Certification;
    }

    const current = await this.getCertifications(false);
    const updated = current.map(c => c.id === id ? { ...c, ...updates } : c);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return updated.find(c => c.id === id)!;
  },

  async deleteCertification(id: string): Promise<void> {
    if (isSupabaseConfigured()) {
      const { error } = await supabase
        .from('certifications')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return;
    }

    const current = await this.getCertifications(false);
    const updated = current.filter(c => c.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  },

  async togglePublish(id: string, currentStatus: boolean): Promise<Certification> {
    return this.updateCertification(id, { is_published: !currentStatus });
  }
};
