'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { ChatAssistant } from '@/components/ai/ChatAssistant';
import { useUIStore } from '@/store/useStore';
import { cn } from '@/lib/utils';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const { sidebarCollapsed } = useUIStore();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background text-foreground flex overflow-hidden">
        <Sidebar />
        <div 
          className={cn(
            "flex-1 flex flex-col transition-all duration-300 relative",
            sidebarCollapsed ? "ml-20" : "ml-[280px]"
          )}
        >
          <Topbar />
          <main className="mt-20 p-8 flex-1 overflow-y-auto custom-scrollbar">
            {children}
          </main>
        </div>
        <ChatAssistant />
      </div>
    </QueryClientProvider>
  );
}
