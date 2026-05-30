'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { navigation, NavItem } from '@/lib/navigation';
import { useUIStore, useAuthStore } from '@/store/useStore';
import { ChevronLeft, ChevronRight, ChevronDown, LogOut, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const { user } = useAuthStore();
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const toggleMenu = (title: string) => {
    setOpenMenus(prev => 
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  const filteredNav = navigation.filter(item => 
    user && item.roles.includes(user.role)
  );

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 80 : 280 }}
      className={cn(
        "fixed left-0 top-0 h-screen z-50 glass-darker border-r border-white/10 flex flex-col transition-all duration-300 ease-in-out",
        sidebarCollapsed ? "w-20" : "w-[280px]"
      )}
    >
      {/* Logo Section */}
      <div className="h-20 flex items-center px-6 border-b border-white/5">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
          <span className="text-white font-bold text-lg italic">A</span>
        </div>
        {!sidebarCollapsed && (
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="ml-3 font-bold text-xl tracking-tight text-white"
          >
            Amdox<span className="text-primary font-light">ERP</span>
          </motion.span>
        )}
      </div>

      {/* Nav Section */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-4 space-y-2 custom-scrollbar">
        {filteredNav.map((item) => {
          const hasSubItems = item.items && item.items.length > 0;
          const isMenuOpen = openMenus.includes(item.title);
          const isActive = pathname.startsWith(item.href);

          return (
            <div key={item.title} className="space-y-1">
              {hasSubItems ? (
                <button
                  onClick={() => !sidebarCollapsed && toggleMenu(item.title)}
                  className={cn(
                    "w-full flex items-center h-11 px-3 rounded-xl transition-all duration-200 group relative",
                    isActive 
                      ? "bg-primary/10 text-primary border border-primary/20" 
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <item.icon className={cn("w-5 h-5 shrink-0", isActive ? "text-primary" : "text-slate-400 group-hover:text-white")} />
                  {!sidebarCollapsed && (
                    <>
                      <motion.span 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="ml-3 font-medium text-sm whitespace-nowrap"
                      >
                        {item.title}
                      </motion.span>
                      <ChevronDown className={cn("ml-auto w-4 h-4 transition-transform", isMenuOpen && "rotate-180")} />
                    </>
                  )}
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center h-11 px-3 rounded-xl transition-all duration-200 group relative",
                    isActive 
                      ? "bg-primary/10 text-primary border border-primary/20" 
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <item.icon className={cn("w-5 h-5 shrink-0", isActive ? "text-primary" : "text-slate-400 group-hover:text-white")} />
                  {!sidebarCollapsed && (
                    <motion.span 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="ml-3 font-medium text-sm whitespace-nowrap"
                    >
                      {item.title}
                    </motion.span>
                  )}
                  {isActive && !sidebarCollapsed && (
                    <motion.div 
                      layoutId="active-pill"
                      className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                    />
                  )}
                </Link>
              )}

              {/* Sub-items */}
              <AnimatePresence>
                {hasSubItems && isMenuOpen && !sidebarCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden pl-10 pr-2 space-y-1"
                  >
                    {item.items?.map((sub) => (
                      <Link
                        key={sub.title}
                        href={sub.href}
                        className={cn(
                          "flex items-center h-9 px-3 rounded-lg text-[13px] transition-all duration-200",
                          pathname === sub.href 
                            ? "text-primary font-bold bg-primary/5" 
                            : "text-slate-500 hover:text-white hover:bg-white/5"
                        )}
                      >
                        {sub.title}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-white/5 space-y-2">
        <button
          onClick={toggleSidebar}
          className="w-full h-10 flex items-center justify-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
        >
          {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
    </motion.aside>
  );
}
