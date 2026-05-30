import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  description?: string;
  loading?: boolean;
}

export function KPICard({ title, value, change, icon: Icon, trend, description }: KPICardProps) {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="glass-card p-6 rounded-3xl"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        {change !== undefined && (
          <div className={cn(
            "flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold",
            trend === 'up' ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
          )}>
            <span>{change > 0 ? '+' : ''}{change}%</span>
            {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          </div>
        )}
      </div>
      <div>
        <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
        {description && (
          <p className="text-xs text-slate-500 mt-2 font-medium">{description}</p>
        )}
      </div>
    </motion.div>
  );
}
