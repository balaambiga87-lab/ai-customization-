import React from 'react';
import type { Metadata } from 'next';
import Providers from './providers';
import { Navbar } from '../components/layout/Navbar';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Caratline | AI-Powered Luxury Jewellery Studio',
  description: 'Design and customize luxury jewellery with real-time AI styling and a professional design studio.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-gray-900 antialiased">
        {/* Ambient Bottom-Right Pink Blob */}
        <div className="fixed bottom-0 right-0 w-[40vw] h-[40vw] pointer-events-none z-0"
          style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.07) 0%, rgba(245,158,11,0.04) 50%, transparent 70%)', filter: 'blur(80px)' }} />
        <Providers>
          <Navbar />
          <main className="flex-grow pt-[72px] relative z-10">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
