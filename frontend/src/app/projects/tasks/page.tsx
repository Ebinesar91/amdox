'use client';

import { 
  Plus, 
  MoreHorizontal, 
  Clock, 
  MessageSquare, 
  Paperclip,
  CheckCircle2,
  Calendar,
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface Task {
  id: string;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  category: string;
  assignees: string[];
  dueDate: string;
  comments: number;
  attachments: number;
  completed?: boolean;
}

const tasks: Record<string, Task[]> = {
  'Backlog': [
    { id: '1', title: 'Q3 Financial Audit Preparation', priority: 'High', category: 'Finance', assignees: ['S', 'M'], dueDate: 'May 20', comments: 12, attachments: 4 },
    { id: '2', title: 'Update Vendor Compliance Policy', priority: 'Medium', category: 'Legal', assignees: ['K'], dueDate: 'May 25', comments: 3, attachments: 1 },
  ],
  'In Progress': [
    { id: '3', title: 'ERP Multi-tenant Migration', priority: 'High', category: 'Engineering', assignees: ['A', 'C', 'R'], dueDate: 'May 15', comments: 45, attachments: 8 },
    { id: '4', title: 'New Employee Onboarding Flow', priority: 'Medium', category: 'HR', assignees: ['E'], dueDate: 'May 18', comments: 8, attachments: 2 },
  ],
  'Review': [
    { id: '5', title: 'APAC Region Logistics Report', priority: 'Low', category: 'Supply Chain', assignees: ['R'], dueDate: 'May 10', comments: 15, attachments: 12 },
  ],
  'Done': [
    { id: '6', title: 'System Security Patch v2.4', priority: 'High', category: 'IT', assignees: ['C'], dueDate: 'May 01', comments: 2, attachments: 0, completed: true },
  ]
};

export default function KanbanPage() {
  return (
    <div className="space-y-8 h-[calc(100vh-160px)] flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Project <span className="text-primary">Kanban</span></h1>
          <p className="text-slate-400 mt-1 font-medium">Strategic initiative tracking and task management.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex -space-x-2 mr-4">
             {['S', 'M', 'K', 'A', 'E'].map((initial, i) => (
               <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0a0a0a] bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white cursor-pointer hover:z-10 hover:border-primary transition-all">
                 {initial}
               </div>
             ))}
             <button className="w-8 h-8 rounded-full border-2 border-[#0a0a0a] bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all">
               <Plus className="w-4 h-4" />
             </button>
          </div>
          <button className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <button className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex space-x-6 overflow-x-auto pb-6 custom-scrollbar">
        {Object.entries(tasks).map(([column, columnTasks]) => (
          <div key={column} className="w-80 shrink-0 flex flex-col space-y-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center space-x-3">
                <h3 className="font-bold text-white text-sm uppercase tracking-wider">{column}</h3>
                <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-bold text-slate-500">{columnTasks.length}</span>
              </div>
              <button className="text-slate-600 hover:text-white">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
              {columnTasks.map((task) => (
                <motion.div 
                  key={task.id}
                  whileHover={{ y: -4 }}
                  className="glass-card p-5 rounded-2xl cursor-grab active:cursor-grabbing group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className={cn(
                      "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase",
                      task.priority === 'High' ? "bg-rose-500/10 text-rose-400" :
                      task.priority === 'Medium' ? "bg-amber-500/10 text-amber-400" :
                      "bg-emerald-500/10 text-emerald-400"
                    )}>
                      {task.priority}
                    </span>
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{task.category}</span>
                  </div>
                  
                  <h4 className="font-bold text-white leading-snug group-hover:text-primary transition-colors">{task.title}</h4>
                  
                  <div className="flex items-center space-x-4 mt-4 text-slate-500">
                    <div className="flex items-center space-x-1">
                       <Clock className="w-3.5 h-3.5" />
                       <span className="text-[10px] font-medium">{task.dueDate}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                       <MessageSquare className="w-3.5 h-3.5" />
                       <span className="text-[10px] font-medium">{task.comments}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                    <div className="flex -space-x-1.5">
                       {task.assignees.map((a, i) => (
                         <div key={i} className="w-6 h-6 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[8px] font-bold text-white">
                           {a}
                         </div>
                       ))}
                    </div>
                    {task.completed && (
                       <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    )}
                  </div>
                </motion.div>
              ))}
              <button className="w-full py-3 rounded-2xl border border-dashed border-white/10 text-slate-600 hover:text-white hover:border-white/20 transition-all text-sm font-medium flex items-center justify-center space-x-2">
                 <Plus className="w-4 h-4" />
                 <span>Add Task</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
