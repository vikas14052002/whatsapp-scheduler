'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Phone } from 'lucide-react';
import Dialog from '@/components/ui/Dialog';
import Tooltip from '@/components/ui/Tooltip';
import { Customer } from '@/types';

export default function PatientsPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', notes: '' });

  useEffect(() => { fetchCustomers(); }, []);

  async function fetchCustomers() {
    try {
      const res = await fetch('/api/patients');
      if (res.status === 401) { router.push('/login'); return; }
      const data = await res.json();
      setCustomers(data.customers || []);
    } catch { router.push('/login'); }
    finally { setLoading(false); }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/patients', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      setShowAddModal(false);
      setFormData({ name: '', phone: '', email: '', notes: '' });
      fetchCustomers();
    }
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
          <h1 className="text-2xl font-bold text-deep-ink font-display">Customers</h1>
          <p className="text-deep-ink/40 font-body text-sm mt-0.5">Manage your customer database</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center gap-2 text-sm px-5 py-3">
          <Plus size={18} />
          Add Customer
        </button>
      </div>

      <div className="dashboard-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-deep-ink/8">
              <th className="text-left py-3.5 px-5 text-sm font-semibold text-deep-ink/40 font-body">Name</th>
              <th className="text-left py-3.5 px-5 text-sm font-semibold text-deep-ink/40 font-body">Phone</th>
              <th className="text-left py-3.5 px-5 text-sm font-semibold text-deep-ink/40 font-body">Visits</th>
              <th className="text-left py-3.5 px-5 text-sm font-semibold text-deep-ink/40 font-body">Last Visit</th>
              <th className="text-left py-3.5 px-5 text-sm font-semibold text-deep-ink/40 font-body">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-b border-deep-ink/5 transition-all duration-200 hover:bg-sage-whisper/30">
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-saffron-glow/10 flex items-center justify-center text-saffron-glow font-display font-bold text-sm transition-transform duration-200 hover:scale-110">
                      {customer.name.charAt(0)}
                    </div>
                    <span className="font-medium text-deep-ink font-body text-sm">{customer.name}</span>
                  </div>
                </td>
                <td className="py-3.5 px-5 text-sm text-deep-ink/50 font-body">{customer.phone}</td>
                <td className="py-3.5 px-5 text-sm text-deep-ink/50 font-body">{customer.visit_count}</td>
                <td className="py-3.5 px-5 text-sm text-deep-ink/50 font-body">
                  {customer.last_visit ? new Date(customer.last_visit).toLocaleDateString('en-IN') : '-'}
                </td>
                <td className="py-3.5 px-5">
                  <Tooltip text="Message on WhatsApp">
                    <a
                      href={`https://wa.me/${customer.phone.replace(/\D/g, '')}`}
                      target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-whatsapp hover:text-whatsapp-dark transition-colors duration-200 hover:underline"
                    >
                      <Phone size={14} />
                      Message
                    </a>
                  </Tooltip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {customers.length === 0 && (
          <div className="text-center py-12 text-deep-ink/30 font-body">No customers yet.</div>
        )}
      </div>

      {/* Add Customer Modal */}
      <Dialog open={showAddModal} onClose={() => setShowAddModal(false)} className="max-w-md w-full p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-deep-ink font-headline">Add Customer</h2>
        </div>
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="label">Name</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputClass} placeholder="Priya Sharma" required />
          </div>
          <div>
            <label className="label">Phone</label>
            <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className={inputClass} placeholder="+91 98765 43210" required />
          </div>
          <div>
            <label className="label">Email (optional)</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={inputClass} placeholder="priya@email.com" />
          </div>
          <div>
            <label className="label">Notes</label>
            <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className={inputClass} rows={2} placeholder="Any notes..." />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 inline-flex items-center justify-center px-6 py-3.5 rounded-xl border border-deep-ink/10 text-deep-ink font-body font-medium text-sm transition-all duration-200 hover:bg-deep-ink/5 hover:-translate-y-0.5 active:translate-y-0">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1 text-sm py-3.5">Add Customer</button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
