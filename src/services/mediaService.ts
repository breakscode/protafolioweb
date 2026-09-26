import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { MediaItem } from '../types';

const LOCAL_STORAGE_KEY = 'portfolio_media_library';

const defaultMedia: MediaItem[] = [
  {
    id: 'med-1',
    bucket: 'projects',
    file_name: 'patrimonial-system.png',
    file_path: 'projects/patrimonial-system.png',
    public_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    mime_type: 'image/jpeg',
    size_bytes: 524288,
    created_at: '2026-02-01T12:00:00Z',
  },
  {
    id: 'med-2',
    bucket: 'projects',
    file_name: 'ventas-nest-react.png',
    file_path: 'projects/ventas-nest-react.png',
    public_url: 'https://images.unsplash.com/photo-1556742049-0a67e5572263?auto=format&fit=crop&w=1200&q=80',
    mime_type: 'image/jpeg',
    size_bytes: 412000,
    created_at: '2026-02-02T12:00:00Z',
  },
  {
    id: 'med-3',
    bucket: 'projects',
    file_name: 'ai-automation-n8n.png',
    file_path: 'projects/ai-automation-n8n.png',
    public_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    mime_type: 'image/jpeg',
    size_bytes: 654000,
    created_at: '2026-02-03T12:00:00Z',
  }
];

export const mediaService = {
  async getMedia(bucket?: string): Promise<MediaItem[]> {
    if (isSupabaseConfigured()) {
      try {
        let query = supabase
          .from('media')
          .select('*')
          .order('created_at', { ascending: false });

        if (bucket) {
          query = query.eq('bucket', bucket);
        }

        const { data, error } = await query;
        if (error) throw error;
        if (data && data.length > 0) return data as MediaItem[];
      } catch (err) {
        console.warn('Error fetching media from Supabase, using local fallback:', err);
      }
    }

    const local = localStorage.getItem(LOCAL_STORAGE_KEY);
    let items = defaultMedia;
    if (local) {
      try {
        items = JSON.parse(local);
      } catch {
        // ignore
      }
    }
    return bucket ? items.filter(m => m.bucket === bucket) : items;
  },

  async uploadFile(file: File, bucket = 'general'): Promise<MediaItem> {
    const fileExt = file.name.split('.').pop();
    const cleanFileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = `${bucket}/${cleanFileName}`;

    if (isSupabaseConfigured()) {
      try {
        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(cleanFileName, file, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(cleanFileName);

        const mediaRecord = {
          bucket,
          file_name: file.name,
          file_path: filePath,
          public_url: publicUrlData.publicUrl,
          mime_type: file.type,
          size_bytes: file.size,
        };

        const { data, error: dbError } = await supabase
          .from('media')
          .insert([mediaRecord])
          .select()
          .single();

        if (dbError) {
          console.warn('Failed to insert media metadata into DB:', dbError);
          return {
            id: 'med-' + Date.now(),
            ...mediaRecord,
            created_at: new Date().toISOString(),
          };
        }

        return data as MediaItem;
      } catch (err) {
        console.error('Error uploading file to Supabase storage:', err);
        throw err;
      }
    }

    // Local simulated file
    const localUrl = URL.createObjectURL(file);
    const newItem: MediaItem = {
      id: 'med-' + Date.now(),
      bucket,
      file_name: file.name,
      file_path: filePath,
      public_url: localUrl,
      mime_type: file.type,
      size_bytes: file.size,
      created_at: new Date().toISOString(),
    };

    const current = await this.getMedia();
    const updated = [newItem, ...current];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return newItem;
  },

  async deleteMedia(id: string, bucket: string, fileName: string): Promise<void> {
    if (isSupabaseConfigured()) {
      try {
        await supabase.storage.from(bucket).remove([fileName]);
        await supabase.from('media').delete().eq('id', id);
        return;
      } catch (err) {
        console.error('Error deleting media from Supabase:', err);
      }
    }

    const current = await this.getMedia();
    const updated = current.filter(m => m.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  }
};
