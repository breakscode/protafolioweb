import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { navigationService } from '../../services/navigationService';
import { NavigationItem } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Switch } from '../../components/ui/Switch';
import { Save, CheckCircle2, ArrowUp, ArrowDown, Compass, Eye, EyeOff } from 'lucide-react';

export const NavigationAdminPage: React.FC = () => {
  const { onToggleSidebar } = useOutletContext<{ onToggleSidebar: () => void }>();

  const [items, setItems] = useState<NavigationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const loadNav = async () => {
    setLoading(true);
    const data = await navigationService.getNavigation(false);
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    loadNav();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleLabelChange = (id: string, label: string) => {
    setItems(items.map((i) => (i.id === id ? { ...i, label } : i)));
  };

  const handleToggleVisibility = (id: string) => {
    setItems(items.map((i) => (i.id === id ? { ...i, is_visible: !i.is_visible } : i)));
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    // Update sort_order numbers
    const updated = newItems.map((item, idx) => ({ ...item, sort_order: idx + 1 }));
    setItems(updated);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      await navigationService.saveAll(items);
      showToast('Navegación guardada correctamente.');
    } catch (err) {
      console.error('Error saving navigation:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <AdminHeader
        onToggleSidebar={onToggleSidebar}
        title="Menú & Navegación"
        subtitle="Controla qué secciones son visibles en el menú público y su orden de aparición."
        actions={
          <Button
            variant="primary"
            size="sm"
            isLoading={saving}
            leftIcon={<Save className="w-4 h-4" />}
            onClick={handleSaveAll}
          >
            Guardar Navegación
          </Button>
        }
      />

      <div className="px-4 sm:px-8 max-w-4xl space-y-6">
        {toastMessage && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        <div className="glass-card rounded-2xl border border-white/10 overflow-hidden divide-y divide-white/5">
          {items.map((item, index) => (
            <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-1">
                  <button
                    disabled={index === 0}
                    onClick={() => moveItem(index, 'up')}
                    className="p-1 text-slate-500 hover:text-white disabled:opacity-20 transition-colors"
                    title="Mover arriba"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    disabled={index === items.length - 1}
                    onClick={() => moveItem(index, 'down')}
                    className="p-1 text-slate-500 hover:text-white disabled:opacity-20 transition-colors"
                    title="Mover abajo"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="w-8 h-8 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center text-cyan-400 font-mono text-xs font-bold">
                  0{index + 1}
                </div>

                <div className="w-48">
                  <Input
                    value={item.label}
                    onChange={(e) => handleLabelChange(item.id, e.target.value)}
                  />
                </div>

                <span className="text-xs font-mono text-slate-400">
                  {item.href}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleToggleVisibility(item.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-semibold border transition-all ${
                    item.is_visible
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 border-white/10'
                  }`}
                >
                  {item.is_visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{item.is_visible ? 'Visible' : 'Oculto'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
