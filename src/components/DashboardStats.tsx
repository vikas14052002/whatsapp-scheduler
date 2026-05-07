'use client';

import { Calendar, Users, TrendingUp, AlertCircle } from 'lucide-react';

interface StatsProps {
  stats: {
    total_appointments_today: number;
    total_appointments_week: number;
    total_patients: number;
    no_show_rate: number;
  };
}

export default function DashboardStats({ stats }: StatsProps) {
  const cards = [
    {
      title: "Today's Appointments",
      value: stats.total_appointments_today,
      icon: Calendar,
      color: 'bg-blue-50 text-blue-600',
      hoverColor: 'hover:bg-blue-100',
    },
    {
      title: 'This Week',
      value: stats.total_appointments_week,
      icon: TrendingUp,
      color: 'bg-saffron-glow/10 text-saffron-glow',
      hoverColor: 'hover:bg-saffron-glow/15',
    },
    {
      title: 'Total Customers',
      value: stats.total_patients,
      icon: Users,
      color: 'bg-purple-50 text-purple-600',
      hoverColor: 'hover:bg-purple-100',
    },
    {
      title: 'No-Show Rate',
      value: `${stats.no_show_rate}%`,
      icon: AlertCircle,
      color: 'bg-orange-50 text-orange-600',
      hoverColor: 'hover:bg-orange-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className={`dashboard-card ${card.hoverColor} group cursor-default`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-deep-ink/40 mb-1 font-body">{card.title}</p>
                <p className="text-2xl font-bold text-deep-ink font-display transition-transform duration-300 group-hover:scale-105 origin-left">{card.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${card.color} transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                <Icon size={20} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
