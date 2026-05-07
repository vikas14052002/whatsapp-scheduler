'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, MessageCircle } from 'lucide-react';
import DashboardStats from '@/components/DashboardStats';
import AppointmentList from '@/components/AppointmentList';
import Dialog from '@/components/ui/Dialog';
import { DashboardStats as StatsType, Appointment, Patient } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<StatsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [services, setServices] = useState<{ id: string; name: string; deposit_amount: number }[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const [formData, setFormData] = useState({
    service_id: '',
    patient_name: '',
    patient_phone: '',
    appointment_date: '',
    start_time: '',
    notes: '',
  });

  useEffect(() => {
    fetchStats();
    fetchServices();
  }, [refreshKey]);

  async function fetchStats() {
    try {
      const res = await fetch('/api/appointments');
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      const data = await res.json();
      const today = new Date().toISOString().split('T')[0];
      const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
      const allAppts = data.appointments || [];
      const todayAppts = allAppts.filter((a: Appointment) => a.appointment_date === today);
      const weekAppts = allAppts.filter((a: Appointment) => a.appointment_date >= weekAgo);
      const patientsRes = await fetch('/api/patients');
      const patientsData = await patientsRes.json();
      const patients = patientsData.patients || [];
      const noShows = allAppts.filter((a: Appointment) => a.status === 'no_show').length;
      const completed = allAppts.filter((a: Appointment) => a.status === 'completed').length;
      const cancelled = allAppts.filter((a: Appointment) => a.status === 'cancelled').length;
      const totalFinished = completed + noShows + cancelled;

      setStats({
        total_appointments_today: todayAppts.length,
        total_appointments_week: weekAppts.length,
        total_patients: patients.length,
        no_show_rate: totalFinished > 0 ? Math.round((noShows / totalFinished) * 100) : 0,
        upcoming_appointments: allAppts.filter((a: Appointment) => a.appointment_date >= today && a.status === 'confirmed').slice(0, 5),
        recent_patients: patients.slice(0, 5),
      });
    } catch {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }

  async function fetchServices() {
    const res = await fetch('/api/services');
    if (res.ok) {
      const data = await res.json();
      setServices(data.services || []);
      if (data.services?.length > 0 && !formData.service_id) {
        setFormData(prev => ({ ...prev, service_id: data.services[0].id }));
      }
    }
  }

  async function handleAddAppointment(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      setShowAddModal(false);
      setFormData({ service_id: services[0]?.id || '', patient_name: '', patient_phone: '', appointment_date: '', start_time: '', notes: '' });
      setRefreshKey(k => k + 1);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-saffron-glow border-t-transparent" />
      </div>
    );
  }

  if (!stats) return null;

  const today = new Date().toISOString().split('T')[0];
  const todaysAppointments = stats.upcoming_appointments.filter(a => a.appointment_date === today);
  const upcomingAppointments = stats.upcoming_appointments.filter(a => a.appointment_date > today);

  const inputClass = "w-full px-4 py-3 border border-deep-ink/15 rounded-xl bg-white text-deep-ink placeholder:text-deep-ink/30 transition-all duration-200 hover:border-deep-ink/25 focus:outline-none focus:ring-2 focus:ring-saffron-glow/25 focus:border-saffron-glow focus:shadow-[0_0_0_4px_rgba(232,93,4,0.08)]";

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-deep-ink font-display">Dashboard</h1>
          <p className="text-deep-ink/40 font-body text-sm mt-0.5">Welcome back! Here&apos;s what&apos;s happening today.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2 text-sm px-5 py-3"
        >
          <Plus size={18} />
          Add Appointment
        </button>
      </div>

      <DashboardStats stats={stats} />

      <div className="grid lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Appointments */}
          <div className="dashboard-card">
            <h2 className="text-lg font-semibold text-deep-ink font-headline mb-4">Today&apos;s Appointments</h2>
            <AppointmentList appointments={todaysAppointments} onStatusChange={() => setRefreshKey(k => k + 1)} />
          </div>

          {/* Upcoming */}
          {upcomingAppointments.length > 0 && (
            <div className="dashboard-card">
              <h2 className="text-lg font-semibold text-deep-ink font-headline mb-4">Upcoming</h2>
              <AppointmentList appointments={upcomingAppointments} showActions={false} />
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Recent Customers */}
          <div className="dashboard-card">
            <h2 className="text-lg font-semibold text-deep-ink font-headline mb-4">Recent Customers</h2>
            <div className="space-y-3">
              {stats.recent_patients.map((patient: Patient, i: number) => (
                <div
                  key={patient.id}
                  className="flex items-center gap-3 p-2 -mx-2 rounded-xl transition-all duration-200 hover:bg-deep-ink/3 cursor-default"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="w-10 h-10 rounded-full bg-saffron-glow/10 flex items-center justify-center text-saffron-glow font-display font-bold text-sm transition-transform duration-200 hover:scale-110">
                    {patient.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-deep-ink font-body text-sm truncate">{patient.name}</p>
                    <p className="text-xs text-deep-ink/40 font-body">{patient.visit_count} visits</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* WhatsApp Bot Card */}
          <div className="dashboard-card bg-saffron-glow/5 border-saffron-glow/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-whatsapp/10 text-whatsapp transition-transform duration-300 hover:scale-110">
                <MessageCircle size={20} />
              </div>
              <h3 className="font-semibold text-deep-ink font-headline">WhatsApp Booking Bot</h3>
            </div>
            <p className="text-sm text-deep-ink/50 font-body mb-4 leading-relaxed">
              Your customers can book appointments by messaging your WhatsApp number.
            </p>
            <div className="bg-white rounded-xl px-4 py-3 text-sm font-mono text-deep-ink/60 border border-deep-ink/5 shadow-sm">
              demo@glowsalon.in
            </div>
          </div>
        </div>
      </div>

      {/* Add Appointment Modal */}
      <Dialog open={showAddModal} onClose={() => setShowAddModal(false)} className="max-w-md w-full p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-deep-ink font-headline">Add Appointment</h2>
        </div>
        <form onSubmit={handleAddAppointment} className="space-y-4">
          <div>
            <label className="label">Service</label>
            <select
              value={formData.service_id}
              onChange={(e) => setFormData({ ...formData, service_id: e.target.value })}
              className={inputClass}
              required
            >
              {services.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Customer Name</label>
            <input
              type="text"
              value={formData.patient_name}
              onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
              className={inputClass}
              placeholder="Priya Sharma"
              required
            />
          </div>
          <div>
            <label className="label">Phone</label>
            <input
              type="tel"
              value={formData.patient_phone}
              onChange={(e) => setFormData({ ...formData, patient_phone: e.target.value })}
              className={inputClass}
              placeholder="+91 98765 43210"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Date</label>
              <input
                type="date"
                value={formData.appointment_date}
                onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className="label">Time</label>
              <input
                type="time"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                className={inputClass}
                required
              />
            </div>
          </div>
          <div>
            <label className="label">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className={inputClass}
              rows={2}
              placeholder="Any special requests..."
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="flex-1 inline-flex items-center justify-center px-6 py-3.5 rounded-xl border border-deep-ink/10 text-deep-ink font-body font-medium text-sm transition-all duration-200 hover:bg-deep-ink/5 hover:-translate-y-0.5 active:translate-y-0"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1 text-sm py-3.5">
              Add Appointment
            </button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
