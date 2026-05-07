'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Clock, IndianRupee } from 'lucide-react';
import Dialog from '@/components/ui/Dialog';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Tooltip from '@/components/ui/Tooltip';
import { Service } from '@/types';

export default function ServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    name: '', description: '', duration_minutes: 30, price: 0, deposit_amount: 0,
  });

  useEffect(() => { fetchServices(); }, []);

  async function fetchServices() {
    try {
      const res = await fetch('/api/services');
      if (res.status === 401) { router.push('/login'); return; }
      const data = await res.json();
      setServices(data.services || []);
    } catch { router.push('/login'); }
    finally { setLoading(false); }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/services', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      setShowAddModal(false);
      setFormData({ name: '', description: '', duration_minutes: 30, price: 0, deposit_amount: 0 });
      fetchServices();
    }
  }

  function initiateDelete(id: string) {
    setServiceToDelete(id);
    setShowDeleteConfirm(true);
  }

  async function handleDelete() {
    if (!serviceToDelete) return;
    setIsDeleting(true);
    await fetch('/api/services', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: serviceToDelete }),
    });
    setIsDeleting(false);
    setShowDeleteConfirm(false);
    setServiceToDelete(null);
    fetchServices();
  }

  const inputClass = "w-full px-4 py-3 border border-deep-ink/15 rounded-xl bg-white text-deep-ink placeholder:text-deep-ink/30 transition-all duration-200 hover:border-deep-ink/25 focus:outline-none focus:ring-2 focus:ring-saffron-glow/25 focus:border-saffron-glow focus:shadow-[0_0_0_4px_rgba(232,93,4,0.08)]";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-saffron-glow border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-deep-ink font-display">Services</h1>
          <p className="text-deep-ink/40 font-body text-sm mt-0.5">Manage services your customers can book</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center gap-2 text-sm px-5 py-3">
          <Plus size={18} />
          Add Service
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <div key={service.id} className="dashboard-card group relative">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-deep-ink font-headline">{service.name}</h3>
              <Tooltip text="Deactivate Service">
                <button
                  onClick={() => initiateDelete(service.id)}
                  className="p-1.5 rounded-lg text-deep-ink/20 hover:text-red-500 hover:bg-red-50 transition-all duration-200 opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
              </Tooltip>
            </div>
            <p className="text-sm text-deep-ink/40 font-body mt-1">{service.description}</p>
            <div className="flex items-center gap-4 mt-4 text-sm font-body">
              <span className="inline-flex items-center gap-1 text-deep-ink/50">
                <Clock size={14} />
                {service.duration_minutes} min
              </span>
              <span className="inline-flex items-center gap-1 text-deep-ink/50">
                <IndianRupee size={14} />
                {service.price}
              </span>
              {service.deposit_amount > 0 && (
                <span className="text-orange-600 text-xs bg-orange-50 px-2.5 py-1 rounded-full font-medium border border-orange-200">
                  Deposit ₹{service.deposit_amount}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Service Modal */}
      <Dialog open={showAddModal} onClose={() => setShowAddModal(false)} className="max-w-md w-full p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-deep-ink font-headline">Add Service</h2>
        </div>
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="label">Service Name</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputClass} placeholder="Haircut" required />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className={inputClass} rows={2} placeholder="Brief description..." />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="label">Duration</label>
              <input type="number" value={formData.duration_minutes} onChange={(e) => setFormData({ ...formData, duration_minutes: Number(e.target.value) })} className={inputClass} min={5} required />
            </div>
            <div>
              <label className="label">Price ₹</label>
              <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} className={inputClass} min={0} required />
            </div>
            <div>
              <label className="label">Deposit ₹</label>
              <input type="number" value={formData.deposit_amount} onChange={(e) => setFormData({ ...formData, deposit_amount: Number(e.target.value) })} className={inputClass} min={0} />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 inline-flex items-center justify-center px-6 py-3.5 rounded-xl border border-deep-ink/10 text-deep-ink font-body font-medium text-sm transition-all duration-200 hover:bg-deep-ink/5 hover:-translate-y-0.5 active:translate-y-0">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1 text-sm py-3.5">Add Service</button>
          </div>
        </form>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={showDeleteConfirm}
        onClose={() => { setShowDeleteConfirm(false); setServiceToDelete(null); }}
        onConfirm={handleDelete}
        title="Deactivate Service?"
        description="This service will no longer be available for booking. You can reactivate it later from settings."
        confirmText="Deactivate"
        confirmVariant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
