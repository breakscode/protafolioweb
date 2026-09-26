import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ContactMessage } from '../types';
import { initialMessages } from '../lib/mockData';

const LOCAL_STORAGE_KEY = 'portfolio_messages';

export const messagesService = {
  async getMessages(): Promise<ContactMessage[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('contact_messages')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data) return data as ContactMessage[];
      } catch (err) {
        console.warn('Error fetching messages from Supabase, using local fallback:', err);
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
    return initialMessages;
  },

  async sendMessage(message: { name: string; email: string; subject?: string; message: string }): Promise<ContactMessage> {
    const newMessage: ContactMessage = {
      id: isSupabaseConfigured() ? undefined as any : 'msg-' + Date.now(),
      name: message.name,
      email: message.email,
      subject: message.subject || 'Mensaje de contacto web',
      message: message.message,
      status: 'new',
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('contact_messages')
          .insert([{
            name: message.name,
            email: message.email,
            subject: message.subject,
            message: message.message,
            status: 'new'
          }])
          .select()
          .single();

        if (error) throw error;
        return data as ContactMessage;
      } catch (err) {
        console.error('Error sending message to Supabase:', err);
        throw err;
      }
    }

    const current = await this.getMessages();
    const updated = [newMessage, ...current];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return newMessage;
  },

  async updateStatus(id: string, status: ContactMessage['status']): Promise<ContactMessage> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('contact_messages')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as ContactMessage;
    }

    const current = await this.getMessages();
    const updated = current.map(m => m.id === id ? { ...m, status } : m);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return updated.find(m => m.id === id)!;
  },

  async deleteMessage(id: string): Promise<void> {
    if (isSupabaseConfigured()) {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return;
    }

    const current = await this.getMessages();
    const updated = current.filter(m => m.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  }
};
