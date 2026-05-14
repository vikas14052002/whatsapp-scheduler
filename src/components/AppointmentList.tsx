'use client';

import { useState } from 'react';
import { Appointment } from '@/types';
import { CheckCircle, XCircle, UserX, Phone } from 'lucide-react';
import Tooltip from '@/components/ui/Tooltip';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

interface Props {
  appointments: Appointment[];
  showActions?: boolean;
  onStatusChange?: () => void;
}

const statusColors: Record<string, string> = {
  confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
  completed: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
  no_show: 'bg-orange-50 text-orange-700 border-orange-200',
};

const statusLabels: Record<string, string> = {
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
  no_show: 'No Show',
};

export default function AppointmentList({ appointments, showActions = true, onStatusChange }: Props) {
  const [updating, setUpdating] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    id: string;
    status: string;
    title: string;
    description: string;
  }>({ open: false, id: '', status: '', title: '', description: '' });

  async function updateStatus(id: string, status: string) {
    setUpdating(id);
    try {
      await fetch('/api/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      onStatusChange?.();
    } finally {
      setUpdating(null);
    }
  }

  function initiateStatusChange(id: string, status: string) {
    if (status === 'completed') {
      setConfirmDialog({
        open: true, id, status,
        title: 'Mark as Completed?',
        description: 'This will mark the appointment as successfully completed.',
      });
    } else if (status === 'no_show') {
      setConfirmDialog({
        open: true, id, status,
        title: 'Mark as No-Show?',
        description: 'The customer did not show up for this appointment.',
      });
    } else if (status === 'cancelled') {
      setConfirmDialog({
        open: true, id, status,
        title: 'Cancel Appointment?',
        description: 'This appointment will be cancelled. The customer will be notified.',
      });
    }
  }

  function handleConfirm() {
    updateStatus(confirmDialog.id, confirmDialog.status);
    setConfirmDialog(prev => ({ ...prev, open: false }));
  }

  if (appointments.length === 0) {
    return (
      <div className="text-center py-12 text-deep-ink/30 font-body">
        <div className="w-16 h-16 rounded-full bg-deep-ink/5 flex items-center justify-center mx-auto mb-4">
          <CalendarIcon size={24} className="text-deep-ink/20" />
        </div>
        No appointments found.
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {appointments.map((appt, index) => (
          <div
            key={appt.id}
            className="dashboard-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300"
            style={{ animationDelay: `${index * 50}ms` }}
            onMouseEnter={() => setHoveredId(appt.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                <h4 className="font-semibold text-deep-ink font-body">{appt.patient_name}</h4>
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border transition-all duration-200 ${statusColors[appt.status]} ${hoveredId === appt.id ? 'scale-105' : ''}`}>
                  {statusLabels[appt.status]}
                </span>
                {appt.source === 'whatsapp' && (
                  <span className="inline-flex px-2 py-0.5 rounded-full text-xs bg-green-50 text-green-700 border border-green-200 font-medium transition-all duration-200 hover:scale-105">
                    WhatsApp
                  </span>
                )}
              </div>
              <p className="text-sm text-deep-ink/50 font-body">{appt.service_name}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-deep-ink/40 font-body flex-wrap">
                <span className="inline-flex items-center gap-1">📅 {new Date(appt.appointment_date + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                <span className="inline-flex items-center gap-1">⏰ {appt.start_time}</span>
                {appt.deposit_amount > 0 && (
                  <span className={`inline-flex items-center gap-1 font-medium transition-all duration-200 ${appt.deposit_paid ? 'text-green-600' : 'text-orange-600'}`}>
                    {appt.deposit_paid ? '✅' : '⏳'} Deposit ₹{appt.deposit_amount}
                  </span>
                )}
              </div>
              {appt.notes && <p className="text-xs text-deep-ink/30 mt-1.5 font-body italic">{appt.notes}</p>}
            </div>

            {showActions && appt.status === 'confirmed' && (
              <div className="flex items-center gap-1.5">
                <Tooltip text="Mark Completed">
                  <button
                    onClick={() => initiateStatusChange(appt.id, 'completed')}
                    disabled={updating === appt.id}
                    className="action-btn text-green-600 hover:bg-green-50 hover:shadow-sm"
                  >
                    <CheckCircle size={18} />
                  </button>
                </Tooltip>
                <Tooltip text="Mark No-Show">
                  <button
                    onClick={() => initiateStatusChange(appt.id, 'no_show')}
                    disabled={updating === appt.id}
                    className="action-btn text-orange-600 hover:bg-orange-50 hover:shadow-sm"
                  >
                    <UserX size={18} />
                  </button>
                </Tooltip>
                <Tooltip text="Cancel Appointment">
                  <button
                    onClick={() => initiateStatusChange(appt.id, 'cancelled')}
                    disabled={updating === appt.id}
                    className="action-btn text-red-600 hover:bg-red-50 hover:shadow-sm"
                  >
                    <XCircle size={18} />
                  </button>
                </Tooltip>
                <Tooltip text="Message on WhatsApp">
                  <a
                    href={`https://wa.me/${appt.patient_phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="action-btn text-whatsapp hover:bg-green-50 hover:shadow-sm"
                  >
                    <Phone size={18} />
                  </a>
                </Tooltip>
              </div>
            )}
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog(prev => ({ ...prev, open: false }))}
        onConfirm={handleConfirm}
        title={confirmDialog.title}
        description={confirmDialog.description}
        confirmText="Confirm"
        confirmVariant={confirmDialog.status === 'cancelled' ? 'danger' : 'primary'}
        isLoading={updating === confirmDialog.id}
      />
    </>
  );
}

function CalendarIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
