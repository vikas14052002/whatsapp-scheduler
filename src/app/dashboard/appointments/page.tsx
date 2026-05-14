'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Filter } from 'lucide-react';
import AppointmentList from '@/components/AppointmentList';
import { Appointment } from '@/types';

const statusOptions = [
  { value: 'all', label: 'All' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'no_show', label: 'No Show' },
];

export default function AppointmentsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchAppointments();
  }, []);

  async function fetchAppointments() {
    try {
      const res = await fetch('/api/appointments');
      if (res.status === 401) { router.push('/login'); return; }
      const data = await res.json();
      setAppointments(data.appointments || []);
    } catch { router.push('/login'); }
    finally { setLoading(false); }
  }

  const filtered = statusFilter === 'all'
    ? appointments
    : appointments.filter(a => a.status === statusFilter);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-saffron-glow border-t-transparent" />
        <p className="text-sm text-deep-ink/40 dark:text-white/40 font-body">Loading appointments...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-deep-ink font-display">Appointments</h1>
        <p className="text-deep-ink/40 font-body text-sm mt-0.5">Manage all your appointments</p>
      </div>

      <div className="dashboard-card mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <Filter size={18} className="text-deep-ink/30" />
          {statusOptions.map((status) => (
            <button
              key={status.value}
              onClick={() => setStatusFilter(status.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium font-body transition-all duration-200 ${
                statusFilter === status.value
                  ? 'bg-saffron-glow text-white shadow-md shadow-saffron-glow/25'
                  : 'bg-deep-ink/5 text-deep-ink/50 hover:bg-deep-ink/10 hover:text-deep-ink'
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      <div className="dashboard-card">
        <AppointmentList appointments={filtered} onStatusChange={fetchAppointments} />
      </div>
    </div>
  );
}
