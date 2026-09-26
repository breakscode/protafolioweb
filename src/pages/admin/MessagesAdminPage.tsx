import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { messagesService } from '../../services/messagesService';
import { ContactMessage } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { 
  MessageSquare, 
  Trash2, 
  Eye, 
  Mail, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Archive 
} from 'lucide-react';
import { formatDateTime } from '../../lib/utils';

export const MessagesAdminPage: React.FC = () => {
  const { onToggleSidebar } = useOutletContext<{ onToggleSidebar: () => void }>();

  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContactMessage | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [toastMessage, setToastMessage] = useState('');

  const loadMessages = async () => {
    setLoading(true);
    const data = await messagesService.getMessages();
    setMessages(data);
    setLoading(false);
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleStatusChange = async (id: string, newStatus: ContactMessage['status']) => {
    await messagesService.updateStatus(id, newStatus);
    if (selectedMessage && selectedMessage.id === id) {
      setSelectedMessage({ ...selectedMessage, status: newStatus });
    }
    await loadMessages();
    showToast(`Estado actualizado a "${newStatus}".`);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await messagesService.deleteMessage(deleteTarget.id);
    showToast('Mensaje eliminado.');
    setDeleteTarget(null);
    if (selectedMessage?.id === deleteTarget.id) {
      setSelectedMessage(null);
    }
    await loadMessages();
  };

  const handleOpenDetail = async (msg: ContactMessage) => {
    setSelectedMessage(msg);
    if (msg.status === 'new') {
      await handleStatusChange(msg.id, 'read');
    }
  };

  const filteredMessages = messages.filter((m) => {
    return statusFilter === 'all' || m.status === statusFilter;
  });

  const getStatusBadge = (status: ContactMessage['status']) => {
    switch (status) {
      case 'new': return <Badge variant="warning" size="sm">Nuevo</Badge>;
      case 'read': return <Badge variant="primary" size="sm">Leído</Badge>;
      case 'replied': return <Badge variant="success" size="sm">Respondido</Badge>;
      case 'archived': return <Badge variant="neutral" size="sm">Archivado</Badge>;
      default: return <Badge variant="neutral" size="sm">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <AdminHeader
        onToggleSidebar={onToggleSidebar}
        title="Bandeja de Contactos"
        subtitle="Mensajes enviados por reclutadores y visitantes desde el portafolio público."
      />

      <div className="px-4 sm:px-8 space-y-6">
        {toastMessage && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Filter bar */}
        <div className="flex items-center gap-4">
          <div className="w-48">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: 'all', label: 'Todos los estados' },
                { value: 'new', label: 'Nuevos' },
                { value: 'read', label: 'Leídos' },
                { value: 'replied', label: 'Respondidos' },
                { value: 'archived', label: 'Archivados' },
              ]}
            />
          </div>
        </div>

        {/* Table */}
        <div className="glass-card rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-mono border-b border-white/10 text-[11px]">
                <tr>
                  <th className="px-6 py-4">Remitente</th>
                  <th className="px-6 py-4">Asunto / Mensaje</th>
                  <th className="px-6 py-4">Fecha</th>
                  <th className="px-6 py-4 text-center">Estado</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredMessages.map((msg) => (
                  <tr
                    key={msg.id}
                    onClick={() => handleOpenDetail(msg)}
                    className={`hover:bg-white/5 transition-colors cursor-pointer ${
                      msg.status === 'new' ? 'bg-cyan-500/5' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <p className="font-bold text-white text-sm">{msg.name}</p>
                      <p className="text-[11px] text-cyan-400 font-mono">{msg.email}</p>
                    </td>

                    <td className="px-6 py-4 max-w-xs">
                      <p className="font-semibold text-slate-200 truncate">{msg.subject || 'Sin asunto'}</p>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">{msg.message}</p>
                    </td>

                    <td className="px-6 py-4 font-mono text-slate-400">
                      {formatDateTime(msg.created_at)}
                    </td>

                    <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                      {getStatusBadge(msg.status)}
                    </td>

                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenDetail(msg)}
                          className="p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-cyan-400 transition-colors"
                          title="Ver Mensaje"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(msg)}
                          className="p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-rose-400 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredMessages.length === 0 && (
            <div className="p-8 text-center text-xs text-slate-400">
              No hay mensajes en esta vista.
            </div>
          )}
        </div>
      </div>

      {/* Message Detail Modal */}
      <Modal
        isOpen={Boolean(selectedMessage)}
        onClose={() => setSelectedMessage(null)}
        title="Detalle del Mensaje"
        maxWidth="lg"
      >
        {selectedMessage && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
              <div>
                <h3 className="text-base font-bold text-white">{selectedMessage.name}</h3>
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="text-xs text-cyan-400 font-mono hover:underline flex items-center gap-1 mt-0.5"
                >
                  <Mail className="w-3.5 h-3.5" /> {selectedMessage.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">
                  {formatDateTime(selectedMessage.created_at)}
                </span>
                {getStatusBadge(selectedMessage.status)}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                Asunto:
              </p>
              <p className="text-sm font-semibold text-white">
                {selectedMessage.subject || 'Sin asunto'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 space-y-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                Contenido del Mensaje:
              </p>
              <p className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                {selectedMessage.message}
              </p>
            </div>

            {/* Status change actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono">Cambiar Estado:</span>
                <select
                  value={selectedMessage.status}
                  onChange={(e) => handleStatusChange(selectedMessage.id, e.target.value as any)}
                  className="bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white"
                >
                  <option value="new">Nuevo</option>
                  <option value="read">Leído</option>
                  <option value="replied">Respondido</option>
                  <option value="archived">Archivado</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject || 'Contacto')}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" /> Responder por Email
                </a>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={`¿Eliminar mensaje de ${deleteTarget?.name}?`}
        message="Esta acción no se puede deshacer."
      />
    </div>
  );
};
