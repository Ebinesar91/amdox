import { 
  LayoutDashboard, 
  Wallet, 
  Users, 
  Box, 
  Briefcase, 
  LineChart, 
  PieChart, 
  ShieldCheck, 
  Bell, 
  Settings,
  ShieldAlert,
  Building2
} from "lucide-react";

export type Role = 'SUPER_ADMIN' | 'TENANT_ADMIN' | 'FINANCE_MANAGER' | 'HR_MANAGER' | 'SCM_MANAGER' | 'PROJECT_MANAGER' | 'EMPLOYEE';

export interface NavItem {
  title: string;
  href: string;
  icon: any;
  roles: Role[];
  items?: { title: string; href: string }[];
}

export const navigation: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ['SUPER_ADMIN', 'TENANT_ADMIN', 'FINANCE_MANAGER', 'HR_MANAGER', 'SCM_MANAGER', 'PROJECT_MANAGER', 'EMPLOYEE'],
  },
  {
    title: "Finance",
    href: "/finance",
    icon: Wallet,
    roles: ['SUPER_ADMIN', 'TENANT_ADMIN', 'FINANCE_MANAGER'],
    items: [
      { title: "General Ledger", href: "/finance/ledger" },
      { title: "Journal Entries", href: "/finance/journal" },
      { title: "Accounts Payable", href: "/finance/ap" },
      { title: "Accounts Receivable", href: "/finance/ar" },
    ]
  },
  {
    title: "HR & Payroll",
    href: "/hr",
    icon: Users,
    roles: ['SUPER_ADMIN', 'TENANT_ADMIN', 'HR_MANAGER'],
    items: [
      { title: "Employee Directory", href: "/hr/employees" },
      { title: "Attendance", href: "/hr/attendance" },
      { title: "Leave Management", href: "/hr/leave" },
      { title: "Payroll", href: "/hr/payroll" },
    ]
  },
  {
    title: "Supply Chain",
    href: "/supply-chain",
    icon: Box,
    roles: ['SUPER_ADMIN', 'TENANT_ADMIN', 'SCM_MANAGER'],
    items: [
      { title: "Inventory", href: "/supply-chain/inventory" },
      { title: "Purchase Orders", href: "/supply-chain/orders" },
      { title: "Vendors", href: "/supply-chain/vendors" },
    ]
  },
  {
    title: "Projects",
    href: "/projects",
    icon: Briefcase,
    roles: ['SUPER_ADMIN', 'TENANT_ADMIN', 'PROJECT_MANAGER', 'EMPLOYEE'],
    items: [
      { title: "Active Projects", href: "/projects/active" },
      { title: "Task Board", href: "/projects/tasks" },
      { title: "Resources", href: "/projects/resources" },
    ]
  },
  {
    title: "AI Insights",
    href: "/ai-insights",
    icon: LineChart,
    roles: ['SUPER_ADMIN', 'TENANT_ADMIN', 'FINANCE_MANAGER', 'SCM_MANAGER'],
  },
  {
    title: "Business Intelligence",
    href: "/bi",
    icon: PieChart,
    roles: ['SUPER_ADMIN', 'TENANT_ADMIN', 'FINANCE_MANAGER'],
  },
  {
    title: "Compliance & Audit",
    href: "/compliance",
    icon: ShieldCheck,
    roles: ['SUPER_ADMIN', 'TENANT_ADMIN'],
  },
  {
    title: "Notifications",
    href: "/notifications",
    icon: Bell,
    roles: ['SUPER_ADMIN', 'TENANT_ADMIN', 'FINANCE_MANAGER', 'HR_MANAGER', 'SCM_MANAGER', 'PROJECT_MANAGER', 'EMPLOYEE'],
  },
  {
    title: "System Admin",
    href: "/admin",
    icon: ShieldAlert,
    roles: ['SUPER_ADMIN', 'TENANT_ADMIN'],
    items: [
      { title: "Tenant Management", href: "/admin/tenants" },
      { title: "User Roles", href: "/admin/roles" },
      { title: "API Keys", href: "/admin/api-keys" },
      { title: "Settings", href: "/admin/settings" },
    ]
  }
];
