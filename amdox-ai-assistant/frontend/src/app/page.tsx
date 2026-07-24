'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Settings, 
  Plus, 
  MessageSquare, 
  TrendingUp, 
  Users, 
  CreditCard, 
  Sparkles, 
  Search, 
  Terminal, 
  Database,
  ChevronRight,
  LogOut,
  Brain
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  pinned: boolean;
}

export default function Page() {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 'conv-1',
      title: 'ERP Financial Insights',
      pinned: true,
      messages: [
        { id: 'm1', sender: 'ai', text: 'Hello! I am your AMDOX AI Assistant. I can search invoice logs, employee registries, and general ledgers. Try clicking one of the suggested prompts below to start!', timestamp: '10:00 AM' }
      ]
    }
  ]);
  const [activeConvId, setActiveConvId] = useState('conv-1');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // App Config States
  const [backendUrl, setBackendUrl] = useState('http://localhost:8050');
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('admin@amdox.corp');
  const [providerUsed, setProviderUsed] = useState('Offline Fallback');
  const [isConnected, setIsConnected] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversations, activeConvId]);

  // Initial Mock Login validation against FastAPI backend
  const performLogin = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        const data = await res.json();
        setToken(data.accessToken);
        setIsConnected(true);
      }
    } catch {
      // Offline fallback state
      setIsConnected(false);
    }
  };

  useEffect(() => {
    performLogin();
  }, [backendUrl]);

  const activeConv = conversations.find(c => c.id === activeConvId) || conversations[0];

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Update state immediately
    const updatedConvs = conversations.map(c => {
      if (c.id === activeConv.id) {
        return {
          ...c,
          title: c.messages.length === 1 ? textToSend.substring(0, 24) + '...' : c.title,
          messages: [...c.messages, userMsg]
        };
      }
      return c;
    });
    setConversations(updatedConvs);
    setInput('');
    setLoading(true);

    try {
      const chatHistory = activeConv.messages.map(m => ({
        sender: m.sender,
        text: m.text
      }));

      const res = await fetch(`${backendUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: textToSend,
          history: [...chatHistory, { sender: 'user', text: textToSend }]
        })
      });

      if (!res.ok) throw new Error();
      const reply = await res.json();
      setProviderUsed(reply.provider || 'AI Engine');

      const aiMsg: ChatMessage = {
        id: `m-${Date.now() + 1}`,
        sender: 'ai',
        text: reply.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setConversations(prev => prev.map(c => {
        if (c.id === activeConv.id) {
          return { ...c, messages: [...c.messages, aiMsg] };
        }
        return c;
      }));
    } catch {
      // Offline simulation response fallback
      const aiMsg: ChatMessage = {
        id: `m-${Date.now() + 1}`,
        sender: 'ai',
        text: `I apologize, but I could not connect to the FastAPI AI service at ${backendUrl}. Please ensure the backend server is running and accessible.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setConversations(prev => prev.map(c => {
        if (c.id === activeConv.id) {
          return { ...c, messages: [...c.messages, aiMsg] };
        }
        return c;
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChat = () => {
    const newId = `conv-${Date.now()}`;
    const newConv: Conversation = {
      id: newId,
      title: 'New Discussion',
      pinned: false,
      messages: [
        { id: `m-${Date.now()}`, sender: 'ai', text: 'Hello! Ask me any operational or database inquiry regarding AMDOX ERP.', timestamp: 'Now' }
      ]
    };
    setConversations([newConv, ...conversations]);
    setActiveConvId(newId);
  };

  const suggestedPrompts = [
    { title: "Show Invoices Pending Approval", prompt: "Show invoices pending approval and summarize the policy for manual approvals." },
    { title: "Verify Employee Directory", prompt: "Find employees registered in operations and summarize active headcount." },
    { title: "Analyze Ledger Accounts", prompt: "Show total ledger accounts balance and details." },
    { title: "Check Vendor Ratings", prompt: "Retrieve SCM vendor rankings and details." }
  ];

  return (
    <div className="flex h-screen w-screen bg-[#09090b] text-[#f4f4f5] overflow-hidden">
      {/* 1. Left Sidebar Workspace */}
      <aside className="w-72 shrink-0 sidebar-glass flex flex-col justify-between">
        <div>
          {/* Logo Header */}
          <div className="h-16 flex items-center px-6 border-b border-white/5 space-x-2">
            <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center font-bold">
              <Brain className="w-5 h-5 text-[#09090b]" />
            </div>
            <span className="font-bold text-base tracking-tight text-white">AMDOX <span className="font-light text-slate-400">AI Assistant</span></span>
          </div>

          {/* Action Row */}
          <div className="p-4">
            <button 
              onClick={handleCreateChat}
              className="w-full flex items-center justify-center space-x-2 h-10 rounded-xl bg-white text-[#09090b] hover:bg-slate-200 transition-all font-bold text-xs cursor-pointer shadow-lg shadow-white/5"
            >
              <Plus className="w-4 h-4" />
              <span>New Conversation</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="px-4 mb-4 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-7 top-2.5" />
            <input 
              type="text" 
              placeholder="Search chat history..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-4 bg-white/5 border border-white/10 rounded-lg text-xs placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-white focus:bg-white/10 transition-all"
            />
          </div>

          {/* Chat History List */}
          <div className="flex-1 overflow-y-auto px-2 space-y-1 custom-scrollbar max-h-[55vh]">
            {conversations
              .filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={`w-full flex items-center h-10 px-3 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    conv.id === activeConvId 
                      ? 'bg-white/10 text-white border border-white/10' 
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 text-slate-500 shrink-0 mr-2.5" />
                  <span className="truncate pr-2">{conv.title}</span>
                </button>
              ))}
          </div>
        </div>

        {/* User Workspace Profile Footer */}
        <div className="p-4 border-t border-white/5 space-y-2 bg-[#050507]">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-white truncate max-w-[150px]">{email}</p>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Super Admin</span>
            </div>
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="ml-auto p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <Settings className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. Main Chat Panel */}
      <main className="flex-1 flex flex-col justify-between bg-[#08080a] relative">
        {/* Top Operational Status Bar */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-white/5 bg-[#09090b]">
          <div className="flex items-center space-x-3">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Enterprise BI Dashboard</span>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Database className="w-4 h-4 text-slate-500" />
              <span className="text-[11px] font-bold text-slate-400">ERP Connection:</span>
              <span className={`inline-block w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            </div>
            <div className="text-[11px] font-bold text-slate-400">
              Model Engine: <span className="text-white bg-white/5 border border-white/10 px-2 py-0.5 rounded font-mono font-semibold">{providerUsed}</span>
            </div>
          </div>
        </header>

        {/* Chat Messages Log */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
          {activeConv.messages.map((msg) => (
            <div key={msg.id} className="max-w-4xl mx-auto flex items-start space-x-4">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                msg.sender === 'ai' 
                  ? 'bg-white/5 border-white/10 text-white' 
                  : 'bg-white text-black border-transparent'
              }`}>
                {msg.sender === 'ai' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{msg.sender === 'ai' ? 'AMDOX AI' : 'User'}</span>
                  <span className="text-[10px] text-slate-700">{msg.timestamp}</span>
                </div>
                <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="max-w-4xl mx-auto flex items-start space-x-4">
              <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Thinking</div>
                <div className="flex space-x-1.5 items-center h-5">
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 3. Suggested Prompts Helper (renders only on initial new conversations) */}
        {activeConv.messages.length === 1 && (
          <div className="max-w-3xl mx-auto w-full px-8 grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {suggestedPrompts.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(item.prompt)}
                className="p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/5 hover:border-white/15 transition-all text-left text-xs text-slate-400 hover:text-white cursor-pointer flex items-center justify-between group"
              >
                <span>{item.title}</span>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
        )}

        {/* 4. Input Prompt Form */}
        <div className="p-8 border-t border-white/5 bg-[#09090b]">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
            className="max-w-4xl mx-auto flex items-center space-x-3 bg-white/5 border border-white/10 rounded-2xl p-3 focus-within:ring-1 focus-within:ring-white focus-within:bg-white/10 transition-all"
          >
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Query corporate dashboards, audit logs, or financial performance..."
              className="flex-1 px-3 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
            />
            <button 
              type="submit"
              className="p-2.5 bg-white text-black hover:bg-slate-200 transition-all rounded-xl cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-center text-[10px] text-slate-600 mt-3 font-semibold uppercase tracking-wider">AI Assistant utilizes live ERP REST integrations. Database queries are isolated per tenant context.</p>
        </div>
      </main>

      {/* 5. Configuration Settings Slide Panel */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
          <div className="w-96 h-full bg-[#0b0f19] border-l border-white/10 p-8 flex flex-col justify-between shadow-2xl">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white">System Settings</h3>
                <p className="text-xs text-slate-400 mt-1">Configure LLM parameters and API endpoints.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">FastAPI Backend URL</label>
                  <input 
                    type="text" 
                    value={backendUrl}
                    onChange={(e) => setBackendUrl(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-white focus:bg-white/10"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Corporate Email</label>
                  <input 
                    type="text" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">LLM Provider</label>
                  <select 
                    defaultValue="openai"
                    className="w-full px-4 py-2.5 bg-[#09090b] border border-white/10 rounded-lg text-xs text-white focus:outline-none"
                  >
                    <option value="openai">OpenAI (GPT-4)</option>
                    <option value="gemini">Google Gemini Pro</option>
                    <option value="ollama">Ollama (Offline Llama)</option>
                    <option value="azure">Azure OpenAI</option>
                  </select>
                </div>
              </div>
            </div>

            <button 
              onClick={() => { setShowSettings(false); performLogin(); }}
              className="w-full h-11 bg-white text-black hover:bg-slate-200 font-bold text-xs rounded-xl cursor-pointer"
            >
              Save Configuration
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
