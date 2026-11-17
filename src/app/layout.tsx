import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'ProofDesk — Clarity before commitment',
  description:
    'ProofDesk is a parent trust and lead conversion platform that brings transparency, verified evidence, and structured dossiers to education enrollment decisions.',
  keywords: [
    'university verification',
    'enrollment trust',
    'parent engagement',
    'lead conversion',
    'education transparency',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} bg-midnight-950 antialiased`}>
        {children}
      </body>
    </html>
  );
}
