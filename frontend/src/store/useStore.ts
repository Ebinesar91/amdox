import { create } from 'zustand';
import { Role } from '@/lib/navigation';

interface AuthState {
  user: {
    name: string;
    email: string;
    role: Role;
    avatar?: string;
  } | null;
  tenant: {
    id: string;
    name: string;
  } | null;
  setAuth: (user: AuthState['user'], tenant: AuthState['tenant']) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: {
    name: "Alex Sterling",
    email: "alex.sterling@amdox.corp",
    role: "SUPER_ADMIN",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  },
  tenant: {
    id: "t-001",
    name: "Amdox Corp Global",
  },
  setAuth: (user, tenant) => set({ user, tenant }),
  logout: () => set({ user: null, tenant: null }),
}));

interface UIState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
}));
