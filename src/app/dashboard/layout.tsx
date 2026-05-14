import Sidebar from '@/components/Sidebar';
import { Toaster } from '@/components/ui/toaster';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-sage-whisper/30">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto min-h-screen">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
      <Toaster />
    </div>
  );
}
