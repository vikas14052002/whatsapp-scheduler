/**
 * ┌─────────────────────────────────────────┐
 * │  ICON — Dynamic Lucide Icon Mapper      │
 * │  Maps string names to icon components   │
 * └─────────────────────────────────────────┘
 */

import {
  MessageSquare,
  Calendar,
  Bell,
  IndianRupee,
  Scissors,
  Stethoscope,
  GraduationCap,
  Briefcase,
  Heart,
  Star,
  Check,
  Sparkles,
  ArrowRight,
  MessageCircle,
  Menu,
  X,
  Phone,
  LogOut,
  LayoutDashboard,
  CalendarDays,
  Users,
  Settings,
  Plus,
  Filter,
  Trash2,
  Clock,
  Copy,
  CheckCircle,
  Loader2,
  FilterIcon,
  type LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  MessageSquare,
  Calendar,
  Bell,
  IndianRupee,
  Scissors,
  Stethoscope,
  GraduationCap,
  Briefcase,
  Heart,
  Star,
  Check,
  Sparkles,
  ArrowRight,
  MessageCircle,
  Menu,
  X,
  Phone,
  LogOut,
  LayoutDashboard,
  CalendarDays,
  Users,
  Settings,
  Plus,
  Filter,
  Trash2,
  Clock,
  Copy,
  CheckCircle,
  Loader2,
  FilterIcon,
};

interface IconProps {
  name: string;
  size?: number;
  className?: string;
}

export function Icon({ name, size = 20, className }: IconProps) {
  const IconComponent = iconMap[name];
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }
  return <IconComponent size={size} className={className} />;
}

export { iconMap };
