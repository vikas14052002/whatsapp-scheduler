'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Calendar, Users, TrendingUp, AlertCircle,
  CheckCircle2, Clock, ArrowRight, Sparkles
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import DialogWrapper from '@/components/ui/Dialog';
import { Button } from '@/components/ui/button';
import type { DashboardStats, Appointment } from '@/types';

const COLORS = ['#E85D04', '#10B981', '#8B5CF6', '#F59E0B'];

function AnimatedCounter({ value, duration = 1.5 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;
    const incrementTime = (duration / end) * 1000;
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);
    return () => clearInterval(timer);
  }, [value, duration]);
  return <span>{count}</span>;
}

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [services, setServices] = useState<{ id: string; name: string }[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const [formData, setFormData] = useState({
    service_id: '', patient_name: '', patient_phone: '',
    appointment_date: '', start_time: '', notes: '',
  });

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    try {
      const [apptRes, svcRes] = await Promise.all([
        fetch('/api/appointments'),
        fetch('/api/services'),
      ]);
      if (apptRes.status === 401) { router.push('/login'); return; }
      const apptData = await apptRes.json();
      const svcData = await svcRes.json();
      const all = apptData.appointments || [];
      const today = new Date().toISOString().split('T')[0];
      const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
      const svcs = svcData.services || [];

      setAppointments(all);
      setServices(svcs);
      if (svcs[0] && !formData.service_id) setFormData(p => ({ ...p, service_id: svcs[0].id }));

      const todayAppts = all.filter((a: Appointment) => a.appointment_date === today);
      const weekAppts = all.filter((a: Appointment) => a.appointment_date >= weekAgo);
      const noShows = all.filter((a: Appointment) => a.status === 'no_show').length;
      const completed = all.filter((a: Appointment) => a.status === 'completed').length;
      const cancelled = all.filter((a: Appointment) => a.status === 'cancelled').length;
      const totalFinished = completed + noShows + cancelled;

      setStats({
        total_appointments_today: todayAppts.length,
        total_appointments_week: weekAppts.length,
        total_customers: all.length > 0 ? new Set(all.map((a: Appointment) => a.patient_phone)).size : 0,
        no_show_rate: totalFinished > 0 ? Math.round((noShows / totalFinished) * 100) : 0,
        upcoming_appointments: all.filter((a: Appointment) => a.appointment_date >= today && a.status === 'confirmed').slice(0, 5),
        recent_customers: [],
      });
    } catch { router.push('/login'); }
    finally { setLoading(false); }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/appointments', {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, status: 'confirmed' }),
    });
    if (res.ok) { setShowAddModal(false); fetchData(); }
  }

  // Build chart data
  const today = new Date();
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const label = d.toLocaleDateString('en-IN', { weekday: 'short' });
    return {
      day: label,
      appointments: appointments.filter((a: Appointment) => a.appointment_date === dateStr).length,
    };
  });

  const statusData = [
    { name: 'Confirmed', value: appointments.filter(a => a.status === 'confirmed').length },
    { name: 'Completed', value: appointments.filter(a => a.status === 'completed').length },
    { name: 'No Show', value: appointments.filter(a => a.status === 'no_show').length },
    { name: 'Cancelled', value: appointments.filter(a => a.status === 'cancelled').length },
  ].filter(d => d.value > 0);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-saffron-glow border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Hero Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-deep-ink via-deep-ink to-saffron-glow/20 p-8 text-white"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-saffron-glow/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={16} className="text-saffron-glow" />
            <span className="text-sm text-white/60 font-body">{greeting()}</span>
          </div>
          <h1 className="text-3xl font-bold font-display mb-2">
            Here&apos;s what&apos;s happening today
          </h1>
          <p className="text-white/50 font-body text-sm max-w-lg">
            You have <span className="text-saffron-glow font-semibold">{stats?.total_appointments_today || 0}</span> appointments today.
            Keep your customers happy and your schedule full.
          </p>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Today', value: stats?.total_appointments_today || 0, icon: Calendar, color: 'from-saffron-glow to-coral-blush', text: 'white' },
          { label: 'This Week', value: stats?.total_appointments_week || 0, icon: TrendingUp, color: 'from-green-500 to-emerald-400', text: 'white' },
          { label: 'Customers', value: stats?.total_customers || 0, icon: Users, color: 'from-violet-500 to-purple-400', text: 'white' },
          { label: 'No-Show Rate', value: `${stats?.no_show_rate || 0}%`, icon: AlertCircle, color: 'from-orange-500 to-amber-400', text: 'white', isText: true },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className={`relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br ${card.color} text-${card.text}`}
          >
            <div className="relative z-10">
              <card.icon size={20} className="opacity-60 mb-3" />
              <div className="text-2xl font-bold font-display">
                {card.isText ? card.value : <AnimatedCounter value={card.value as number} />}
              </div>
              <div className="text-xs opacity-70 font-body mt-0.5">{card.label}</div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
          </motion.div>
        ))}
      </div>

      {/* Charts + Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 dashboard-card"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-headline font-semibold text-deep-ink dark:text-white">Weekly Overview</h3>
            <Button variant="outline" size="sm" onClick={() => setShowAddModal(true)}>
              <Plus size={14} className="mr-1" /> New Booking
            </Button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorAppts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E85D04" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#E85D04" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} allowDecimals={false} />
                <RechartsTooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="appointments" stroke="#E85D04" strokeWidth={2} fill="url(#colorAppts)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Status Donut */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="dashboard-card flex flex-col items-center justify-center"
        >
          <h3 className="font-headline font-semibold text-deep-ink dark:text-white mb-2 self-start">Status Breakdown</h3>
          <div className="h-48 w-full">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%" cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 mt-2">
            {statusData.map((s, i) => (
              <div key={s.name} className="flex items-center gap-1.5 text-xs font-body">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                <span className="text-deep-ink/60 dark:text-white/60">{s.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Today's Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="dashboard-card"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-headline font-semibold text-deep-ink dark:text-white flex items-center gap-2">
            <Clock size={16} className="text-saffron-glow" />
            Today&apos;s Schedule
          </h3>
        </div>
        {stats?.upcoming_appointments && stats.upcoming_appointments.length > 0 ? (
          <div className="space-y-3">
            {stats.upcoming_appointments.map((appt, i) => (
              <motion.div
                key={appt.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                className="flex items-center gap-4 p-4 rounded-xl bg-sage-whisper/30 dark:bg-white/5 hover:bg-sage-whisper/50 dark:hover:bg-white/10 transition-colors"
              >
                <div className="w-14 text-center shrink-0">
                  <div className="text-lg font-bold font-display text-deep-ink dark:text-white">{appt.start_time}</div>
                </div>
                <div className="w-px h-10 bg-deep-ink/10 dark:bg-white/10" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-deep-ink dark:text-white font-body truncate">{appt.patient_name}</div>
                  <div className="text-xs text-deep-ink/40 dark:text-white/40 font-body">{appt.service_name}</div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  appt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                  appt.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                  'bg-orange-100 text-orange-700'
                }`}>
                  {appt.status}
                </span>
                <ArrowRight size={14} className="text-deep-ink/20 dark:text-white/20" />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-deep-ink/30 dark:text-white/30 font-body">
            <CheckCircle2 size={32} className="mx-auto mb-2 opacity-40" />
            <p>No appointments today. Time to relax!</p>
          </div>
        )}
      </motion.div>

      {/* Add Modal */}
      <DialogWrapper open={showAddModal} onClose={() => setShowAddModal(false)}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-deep-ink dark:text-white font-headline">New Appointment</h2>
        </div>
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="label">Service</label>
            <select value={formData.service_id} onChange={e => setFormData(p => ({ ...p, service_id: e.target.value }))}
              className="input" required>
              {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Customer Name</label>
            <input type="text" value={formData.patient_name} onChange={e => setFormData(p => ({ ...p, patient_name: e.target.value }))}
              className="input" placeholder="Priya Sharma" required />
          </div>
          <div>
            <label className="label">Phone</label>
            <input type="tel" value={formData.patient_phone} onChange={e => setFormData(p => ({ ...p, patient_phone: e.target.value }))}
              className="input" placeholder="+91 98765 43210" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Date</label>
              <input type="date" value={formData.appointment_date} onChange={e => setFormData(p => ({ ...p, appointment_date: e.target.value }))}
                className="input" required />
            </div>
            <div>
              <label className="label">Time</label>
              <input type="time" value={formData.start_time} onChange={e => setFormData(p => ({ ...p, start_time: e.target.value }))}
                className="input" required />
            </div>
          </div>
          <div>
            <label className="label">Notes</label>
            <textarea value={formData.notes} onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))}
              className="input resize-none" rows={2} placeholder="Any special requests..." />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button type="submit" className="flex-1 bg-saffron-glow hover:bg-saffron-dark">Create Booking</Button>
          </div>
        </form>
      </DialogWrapper>
    </div>
  );
}
