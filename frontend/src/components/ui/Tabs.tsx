'use client';

import React, { useState, createContext, useContext } from 'react';
import { motion } from 'framer-motion';

interface TabsContextType { active: string; setActive: (id: string) => void; }
const TabsContext = createContext<TabsContextType>({ active: '', setActive: () => {} });

export const Tabs: React.FC<{ defaultTab: string; children: React.ReactNode; className?: string }> = ({
  defaultTab, children, className = '',
}) => {
  const [active, setActive] = useState(defaultTab);
  return <TabsContext.Provider value={{ active, setActive }}><div className={className}>{children}</div></TabsContext.Provider>;
};

export const TabList: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`relative flex gap-1 bg-slate-100/80 rounded-full p-1 ${className}`} role="tablist">{children}</div>
);

export const Tab: React.FC<{ id: string; children?: React.ReactNode; icon?: React.ReactNode }> = ({ id, children, icon }) => {
  const { active, setActive } = useContext(TabsContext);
  const isActive = active === id;
  return (
    <button
      role="tab"
      aria-selected={isActive}
      onClick={() => setActive(id)}
      className={`relative flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-[10px] font-bold uppercase tracking-wider rounded-full transition-all duration-200 z-10
        ${isActive ? 'text-white' : 'text-slate-500 hover:text-slate-700'}`}
    >
      {isActive && (
        <motion.div
          layoutId="light-tab-indicator"
          className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full shadow-sm"
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}
      <span className="relative z-10 flex items-center gap-1">{icon}{children}</span>
    </button>
  );
};

export const TabPanel: React.FC<{ id: string; children: React.ReactNode; className?: string }> = ({ id, children, className = '' }) => {
  const { active } = useContext(TabsContext);
  if (active !== id) return null;
  return (
    <motion.div key={id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className={className}>
      {children}
    </motion.div>
  );
};
