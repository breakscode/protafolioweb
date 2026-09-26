import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { DocumentItem } from '../types';
import { initialDocuments } from '../lib/mockData';

const LOCAL_STORAGE_KEY = 'portfolio_documents';

export const documentsService = {
  async getDocuments(): Promise<DocumentItem[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('documents')
          .select('*')
          .order('updated_at', { ascending: false });

        if (error) throw error;
        if (data && data.length > 0) return data as DocumentItem[];
      } catch (err) {
        console.warn('Error fetching documents from Supabase, using local fallback:', err);
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
    return initialDocuments;
  },

  async getActiveCV(): Promise<DocumentItem | null> {
    const docs = await this.getDocuments();
    return docs.find(d => d.doc_type === 'cv' && d.is_active) || docs[0] || null;
  },

  async uploadOrUpdateCV(file: File, title = 'CV - Jhampier Iván Juárez Mauricio'): Promise<DocumentItem> {
    let fileUrl = '';
    const fileName = file.name;
    const fileSize = `${(file.size / 1024).toFixed(1)} KB`;

    if (isSupabaseConfigured()) {
      try {
        const fileExt = fileName.split('.').pop();
        const cleanFileName = `cv_${Date.now()}.${fileExt}`;
        const filePath = `cv/${cleanFileName}`;

        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, file, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('documents')
          .getPublicUrl(filePath);

        fileUrl = publicUrlData.publicUrl;

        const docRecord = {
          doc_type: 'cv',
          title,
          file_url: fileUrl,
          file_name: fileName,
          file_size: fileSize,
          is_active: true,
          updated_at: new Date().toISOString(),
        };

        const { data, error } = await supabase
          .from('documents')
          .insert([docRecord])
          .select()
          .single();

        if (error) throw error;
        return data as DocumentItem;
      } catch (err) {
        console.error('Error uploading CV to Supabase:', err);
        throw err;
      }
    }

    // Local simulated upload (converts to object URL or base64 placeholder)
    fileUrl = URL.createObjectURL(file);
    const newDoc: DocumentItem = {
      id: 'doc-' + Date.now(),
      doc_type: 'cv',
      title,
      file_url: fileUrl,
      file_name: fileName,
      file_size: fileSize,
      is_active: true,
      updated_at: new Date().toISOString(),
    };

    const current = await this.getDocuments();
    const updated = [newDoc, ...current.map(d => d.doc_type === 'cv' ? { ...d, is_active: false } : d)];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return newDoc;
  },

  async deleteDocument(id: string): Promise<void> {
    if (isSupabaseConfigured()) {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return;
    }

    const current = await this.getDocuments();
    const updated = current.filter(d => d.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  }
};
