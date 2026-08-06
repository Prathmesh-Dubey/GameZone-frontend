import React, { useState, useEffect } from 'react';
import { Notification, NotificationRequest, User } from '../api/api';
import { Plus, Edit, Trash2, CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { useAllNotifications } from '../hooks';
import { useCreateNotification, useUpdateNotification, useDeleteNotification, useToggleNotification } from '../hooks';

interface AdminNotificationsProps {
  user: User;
}

export default function AdminNotifications({ user }: AdminNotificationsProps) {
  const { data: rawNotifications = [], isLoading: loading, error: queryError } = useAllNotifications();
  const error = queryError ? (queryError as Error).message : null;
  
  // Sort notifications by created date
  const notifications = [...rawNotifications].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const createMutation = useCreateNotification();
  const updateMutation = useUpdateNotification();
  const deleteMutation = useDeleteNotification();
  const toggleMutation = useToggleNotification();
  const { refreshNotifications } = useNotifications();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<NotificationRequest>({
    title: '',
    message: '',
    type: 'INFO',
    expiresAt: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggleActive = async (id: string) => {
    try {
      await toggleMutation.mutateAsync(id);
      refreshNotifications(); // Global context refresh
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this notification?")) return;
    try {
      await deleteMutation.mutateAsync(id);
      refreshNotifications();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const openCreateModal = () => {
    setFormData({ title: '', message: '', type: 'INFO', expiresAt: '' });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (notification: Notification) => {
    setFormData({
      title: notification.title,
      message: notification.message,
      type: notification.type,
      expiresAt: notification.expiresAt || ''
    });
    setEditingId(notification.id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const dataToSubmit = {
        ...formData,
        expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : null
      };

      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, data: dataToSubmit });
      } else {
        await createMutation.mutateAsync({ data: dataToSubmit, adminId: user.id });
      }
      
      setIsModalOpen(false);
      refreshNotifications();
    } catch (err: any) {
      alert("Error saving notification: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'SUCCESS': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'WARNING': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'ERROR': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'INFO':
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  if (user.role !== 'ADMIN') {
    return <div className="p-8 text-center text-red-500">Access Denied. Admins only.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">System Notifications</h2>
          <p className="text-slate-500 text-sm">Manage global notifications and alerts.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold transition"
        >
          <Plus className="w-4 h-4" />
          Create Notification
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-medium">Type</th>
                  <th className="px-6 py-4 font-medium">Title & Message</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Created</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {notifications.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                      No notifications found.
                    </td>
                  </tr>
                ) : (
                  notifications.map((notif) => (
                    <tr key={notif.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getIconForType(notif.type)}
                          <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                            {notif.type}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-normal min-w-[300px]">
                        <p className="font-bold text-slate-900 dark:text-slate-100">{notif.title}</p>
                        <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 line-clamp-2">{notif.message}</p>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleActive(notif.id)}
                          className={`px-2.5 py-1 rounded-full text-xs font-bold border transition ${notif.active ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'}`}
                        >
                          {notif.active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
                        {new Date(notif.createdAt).toLocaleDateString()}
                        <div className="text-[10px] mt-0.5">by {notif.createdByUsername}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditModal(notif)}
                            className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(notif.id)}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {editingId ? 'Edit Notification' : 'Create Notification'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
                >
                  <option value="INFO">Info</option>
                  <option value="SUCCESS">Success</option>
                  <option value="WARNING">Warning</option>
                  <option value="ERROR">Error</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
                <input
                  required
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
                  placeholder="e.g. System Maintenance"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Message</label>
                <textarea
                  required
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white resize-none"
                  placeholder="Notification details..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Expiration Date (Optional)</label>
                <input
                  type="datetime-local"
                  value={formData.expiresAt ? formData.expiresAt.slice(0, 16) : ''}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-semibold transition disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Notification'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
