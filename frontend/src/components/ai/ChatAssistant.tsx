'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Brain, DollarSign, Users, Package, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '@/lib/utils';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
  component?: React.ReactNode;
}

export function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: "Hello! I am AMDOX AI, your intelligent ERP assistant. Ask me anything about Finance, HR, Inventory, or overall business KPIs.",
      timestamp: new Date()
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Math.random().toString(),
      sender: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    const query = input.toLowerCase();
    setInput('');

    // Simulate AI thinking
    setTimeout(() => {
      let replyText = "I'm analyzing the ERP database for that. Could you please specify if you're looking for Finance, HR, or Inventory records?";
      let customNode: React.ReactNode = null;

      if (query.includes('finance') || query.includes('cash') || query.includes('revenue') || query.includes('profit') || query.includes('ledger')) {
        replyText = "Here is the summary of our current Financial Ledger:";
        customNode = (
          <div className="mt-3 p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Total Revenue:</span>
              <span className="font-bold text-white">$3,450,200</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Net Profit Margin:</span>
              <span className="font-bold text-emerald-400">+12.5%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Accounts Payable:</span>
              <span className="font-bold text-amber-400">$17,890.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Accounts Receivable:</span>
              <span className="font-bold text-blue-400">$45,200.00</span>
            </div>
          </div>
        );
      } else if (query.includes('hr') || query.includes('employee') || query.includes('leave') || query.includes('attendance') || query.includes('staff')) {
        replyText = "Here is the current HR & Attendance overview:";
        customNode = (
          <div className="mt-3 p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Total Headcount:</span>
              <span className="font-bold text-white">1,248 Employees</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Present Today:</span>
              <span className="font-bold text-emerald-400">1,180 (94.5%)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">On Scheduled Leave:</span>
              <span className="font-bold text-amber-400">68</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Open Job Positions:</span>
              <span className="font-bold text-blue-400">12 active</span>
            </div>
          </div>
        );
      } else if (query.includes('inventory') || query.includes('stock') || query.includes('warehouse') || query.includes('sku') || query.includes('supply')) {
        replyText = "Here is the latest Inventory & SCM metrics:";
        customNode = (
          <div className="mt-3 p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Total Inventory Value:</span>
              <span className="font-bold text-white">$892,400</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Active Warehouses:</span>
              <span className="font-bold text-white">4 Locations</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Low Stock SKUs:</span>
              <span className="font-bold text-rose-400">8 Items Alert</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Pending Purchase Orders:</span>
              <span className="font-bold text-amber-400">15 Orders</span>
            </div>
          </div>
        );
      } else if (query.includes('kpi') || query.includes('roi') || query.includes('performance') || query.includes('executive')) {
        replyText = "Here are the top high-level business performance metrics:";
        customNode = (
          <div className="mt-3 p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Operational ROI:</span>
              <span className="font-bold text-emerald-400">24.8% (vs 22% target)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Customer Satisfaction:</span>
              <span className="font-bold text-white">96.5% CSAT</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Project Delivery Index:</span>
              <span className="font-bold text-blue-400">92% on time</span>
            </div>
          </div>
        );
      }

      setMessages(prev => [...prev, {
        id: Math.random().toString(),
        sender: 'ai',
        text: replyText,
        component: customNode,
        timestamp: new Date()
      }]);
    }, 1000);
  };

  return (
    <>
      {/* Trigger Button */}
      <div className="fixed bottom-6 right-6 z-[100]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-primary hover:bg-primary/95 text-white flex items-center justify-center shadow-xl shadow-primary/30 hover:scale-105 transition-all duration-300 relative group"
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#020617]" />
        </button>
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-[380px] h-[520px] glass-darker border border-white/10 rounded-[28px] shadow-2xl flex flex-col overflow-hidden z-[100]"
          >
            {/* Header */}
            <div className="p-5 border-b border-white/10 bg-white/5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">AMDOX AI Assistant</h3>
                  <div className="flex items-center space-x-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-primary text-white rounded-tr-none'
                      : 'bg-white/5 border border-white/10 text-slate-300 rounded-tl-none'
                  }`}>
                    <p>{msg.text}</p>
                    {msg.component}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-4 border-t border-white/10 bg-white/5 flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about bills, staff, inventory..."
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white/10 transition-all"
              />
              <button
                type="submit"
                className="p-3 bg-primary hover:bg-primary/95 text-white rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
