import type { Metadata } from 'next';
import { Space_Grotesk, Outfit, Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  weight: ['500', '700'],
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['500', '600', '700'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600'],
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['500', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'BookKar — WhatsApp Appointment Booking for Indian Businesses',
  description: 'Let your customers book appointments via WhatsApp. Built for salons, clinics, tuition centers & more.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${outfit.variable} ${inter.variable} ${playfair.variable}`}>
      <body className="bg-warm-paper text-deep-ink antialiased">{children}</body>
    </html>
  );
}
