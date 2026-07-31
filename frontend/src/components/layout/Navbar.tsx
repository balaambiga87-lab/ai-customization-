'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Gem, Palette, Heart, Search, Bell, User, ShoppingBag, Menu, X } from 'lucide-react';
import { useCartStore } from '../../stores/useCartStore';

const NAV_LINKS = [
  { href: '/catalog',    label: 'Collections' },
  { href: '/customizer', label: 'Studio' },
  { href: '/my-designs', label: 'My Designs' },
];

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { items, setDrawerOpen } = useCartStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const cartCount = items.reduce((s, i) => s + i.quantity, 0);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <>
      {/* Floating Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 px-4 pt-3">
        <nav
          className={`mx-auto max-w-7xl glass-light rounded-2xl h-[60px] flex items-center px-5 transition-all duration-300 ${
            scrolled ? 'shadow-lg' : 'shadow-md'
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group" aria-label="Caratline Home">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-sm">
              <Gem size={16} className="text-white" />
            </div>
            <span className="font-display font-bold text-base tracking-wider text-gradient-primary hidden sm:block">
              Caratline
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1 mx-auto">
            {NAV_LINKS.map(({ href, label }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href} href={href}
                  className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    active
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-1 ml-auto shrink-0">
            <button className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all" aria-label="Search">
              <Search size={17} />
            </button>
            <button className="hidden sm:flex w-9 h-9 rounded-full items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all relative" aria-label="Notifications">
              <Bell size={17} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
            </button>
            <button
              onClick={() => setDrawerOpen(true)}
              className="relative w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all"
              aria-label={`Cart (${cartCount} items)`}
            >
              <ShoppingBag size={17} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full text-[8px] font-black flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <Link href="/dashboard" className="hidden sm:flex w-9 h-9 rounded-full items-center justify-center text-slate-500 hover:bg-slate-100 transition-all" aria-label="Profile">
              <User size={17} />
            </Link>
            <button onClick={() => setMobileOpen(true)} className="md:hidden w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-all ml-1" aria-label="Open menu">
              <Menu size={20} />
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50" onClick={() => setMobileOpen(false)} />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 bottom-0 w-72 bg-white border-l border-gray-100 z-50 flex flex-col p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="font-display font-bold text-gradient-primary">CARATLINE</span>
                <button onClick={() => setMobileOpen(false)} className="text-slate-400 hover:text-slate-900 p-1 rounded-full hover:bg-slate-100 transition-all"><X size={20} /></button>
              </div>
              <div className="flex flex-col gap-2">
                {NAV_LINKS.map(({ href, label }) => {
                  const active = isActive(href);
                  return (
                    <Link key={href} href={href} onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                        active ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >{label}</Link>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
