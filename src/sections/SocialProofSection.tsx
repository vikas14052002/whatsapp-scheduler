'use client';

import { Scissors, Stethoscope, GraduationCap, Briefcase, Heart } from 'lucide-react';
import { Container } from '@/design-system/primitives';
import { SectionHeader } from '@/components/SectionHeader';
import { stats, businessTypes } from '@/content/landing-page';
import Counter from '@/components/Counter';
import { useScrollReveal } from '@/design-system/hooks/useScrollReveal';

const iconMap: Record<string, React.ComponentType<{ size?: number | string; className?: string }>> = {
  Scissors, Stethoscope, GraduationCap, Briefcase, Heart,
};

export default function SocialProofSection() {
  const tickerRef = useScrollReveal<HTMLDivElement>({ y: 20 });

  return (
    <section className="py-20 lg:py-28 bg-warm-paper relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230F0F12' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />

      <Container className="relative z-10">
        <SectionHeader
          overline="Trusted across India"
          headline="From Mumbai salons to Delhi clinics"
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16 mt-14">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center p-4 lg:p-6">
              <p className="font-display text-4xl lg:text-5xl font-bold text-deep-ink mb-2">
                {stat.isDecimal ? (
                  <span>{stat.value}{stat.suffix}</span>
                ) : (
                  <Counter end={stat.value} suffix={stat.suffix} />
                )}
              </p>
              <p className="text-sm text-deep-ink/50 font-body">{stat.label}</p>
            </div>
          ))}
        </div>

        <div ref={tickerRef} className="relative overflow-hidden py-6 border-y border-deep-ink/[0.06]">
          <div className="flex animate-ticker">
            {[...businessTypes, ...businessTypes, ...businessTypes, ...businessTypes].map((type, i) => {
              const Icon = iconMap[type.icon];
              return (
                <div key={`${type.id}-${i}`} className="flex items-center gap-3 px-8 flex-shrink-0 group">
                  {Icon && <Icon size={20} className="text-deep-ink/30 group-hover:text-saffron-glow transition-colors" />}
                  <span className="text-lg font-headline font-medium text-deep-ink/40 group-hover:text-deep-ink transition-colors whitespace-nowrap">
                    {type.title}
                  </span>
                  <span className="text-muted-gold/30 mx-4">•</span>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
