"use client"

import React, { useState, useRef, useEffect } from 'react';

export default function DashboardPage() {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      role: 'assistant', 
      text: 'Hello! I am Lexora, your intelligent assistant. Upload a PDF or image, or simply ask me a question.', 
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }
  ]);
  const [input, setInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() && !file) return;

    const newMessage = {
      id: Date.now(),
      role: 'user',
      text: input,
      file: file ? file.name : null,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setFile(null);
    setIsProcessing(true);
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    // Simulate RAG bot processing and response
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        role: 'assistant',
        text: 'I have analyzed your query based on the provided context. This is a simulated response demonstrating the RAG capabilities. In a production environment, this would integrate with your vector database and LLM backend.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botResponse]);
      setIsProcessing(false);
    }, 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // SVG Icons
  const PaperclipIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  );

  const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );

  const FileIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );

  const ImageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  );

  const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );

  const BotIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="10" x="3" y="11" rx="2" />
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v4" />
      <line x1="8" x2="8" y1="16" y2="16" />
      <line x1="16" x2="16" y1="16" y2="16" />
    </svg>
  );

  const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );

  const SettingsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

  return (
    <div className="flex h-screen bg-neutral-950 text-neutral-100 font-sans overflow-hidden">
      {/* Sidebar */}
      <div className="w-72 bg-neutral-900 border-r border-neutral-800 hidden md:flex flex-col relative z-20 shadow-2xl">
        <div className="p-5 border-b border-neutral-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <BotIcon />
          </div>
          <div>
            <div className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">Lexora</div>
            <div className="text-xs text-indigo-400 font-medium">Enterprise RAG</div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <button className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/20 font-medium mb-6 hover:scale-[1.02] active:scale-[0.98]">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            New Session
          </button>

          <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3 px-1">Recent Sessions</div>
          <div className="space-y-1">
            {['Q3 Financial Report Analysis', 'Onboarding Documentation', 'API Integration Specs'].map((chat, i) => (
              <button key={i} className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-neutral-800 transition-colors text-sm text-neutral-300 truncate group flex items-center gap-3">
                <svg className="text-neutral-500 group-hover:text-indigo-400 transition-colors" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                <span className="truncate">{chat}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-neutral-800">
          <button className="w-full flex items-center gap-3 hover:bg-neutral-800 px-3 py-2.5 rounded-lg transition-colors text-sm text-neutral-300">
            <SettingsIcon />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-neutral-950">
        {/* Header */}
        <header className="h-16 border-b border-neutral-800/50 bg-neutral-950/50 backdrop-blur-xl flex items-center px-4 md:px-6 sticky top-0 z-10 shadow-sm">
          <h1 className="text-lg font-medium text-neutral-200">Current Session</h1>
          <div className="ml-auto flex items-center gap-3 bg-neutral-900/80 px-3 py-1.5 rounded-full border border-neutral-800">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-medium text-neutral-300">RAG Engine Active</span>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
          <div className="max-w-4xl mx-auto space-y-8 pb-10">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''} group transition-all duration-300 ease-in-out`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-1 shadow-md ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-br from-neutral-700 to-neutral-800 border border-neutral-700' 
                    : 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-500/20'
                }`}>
                  {msg.role === 'user' ? <UserIcon /> : <BotIcon />}
                </div>
                <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-[85%] md:max-w-[75%]`}>
                  <div className="flex items-center gap-2 mb-1.5 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm font-medium text-neutral-400">{msg.role === 'user' ? 'You' : 'Lexora'}</span>
                    <span className="text-xs text-neutral-600">{msg.timestamp}</span>
                  </div>
                  
                  <div className={`p-4 md:p-5 text-[15px] leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-neutral-800 text-neutral-100 rounded-2xl rounded-tr-sm border border-neutral-700/50' 
                      : 'bg-neutral-900/80 backdrop-blur-sm text-neutral-200 rounded-2xl rounded-tl-sm border border-neutral-800/80 shadow-inner'
                  }`}>
                    {msg.file && (
                      <div className="flex items-center gap-3 bg-black/30 p-2.5 rounded-xl mb-3 text-sm border border-white/5">
                        <div className={`p-2 rounded-lg ${msg.file.match(/\.(jpeg|jpg|gif|png)$/i) ? 'bg-blue-500/20 text-blue-400' : 'bg-rose-500/20 text-rose-400'}`}>
                          {msg.file.match(/\.(jpeg|jpg|gif|png)$/i) ? <ImageIcon /> : <FileIcon />}
                        </div>
                        <span className="truncate max-w-[200px] font-medium text-neutral-300">{msg.file}</span>
                      </div>
                    )}
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Processing Indicator */}
            {isProcessing && (
              <div className="flex gap-4 items-start animate-pulse">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20 mt-1">
                  <BotIcon />
                </div>
                <div className="bg-neutral-900/80 p-5 rounded-2xl rounded-tl-sm border border-neutral-800/80">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} className="h-4" />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 bg-gradient-to-t from-neutral-950 via-neutral-950/90 to-transparent pt-10">
          <div className="max-w-4xl mx-auto">
            {/* File Preview before send */}
            {file && (
              <div className="mb-3 flex items-center gap-3 bg-neutral-800/80 backdrop-blur-md p-2 pl-3 rounded-xl w-max border border-neutral-700 shadow-xl transition-all">
                <div className={`p-2 rounded-lg ${file.name.match(/\.(jpeg|jpg|gif|png)$/i) ? 'bg-blue-500/20 text-blue-400' : 'bg-rose-500/20 text-rose-400'}`}>
                   {file.name.match(/\.(jpeg|jpg|gif|png)$/i) ? <ImageIcon /> : <FileIcon />}
                </div>
                <div className="flex flex-col pr-2">
                  <span className="text-sm font-medium text-neutral-200 truncate max-w-[200px]">{file.name}</span>
                  <span className="text-[11px] text-neutral-400">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
                <button 
                  onClick={() => setFile(null)}
                  className="ml-1 p-2 hover:bg-neutral-700 rounded-lg transition-colors text-neutral-400 hover:text-white"
                >
                  <XIcon />
                </button>
              </div>
            )}

            <form 
              onSubmit={handleSend}
              className={`relative bg-neutral-900/80 backdrop-blur-xl border ${isDragging ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_30px_rgba(99,102,241,0.2)]' : 'border-neutral-700/80'} rounded-2xl shadow-2xl transition-all duration-300 focus-within:border-indigo-500/70 focus-within:ring-4 focus-within:ring-indigo-500/10 focus-within:bg-neutral-900`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  setFile(e.dataTransfer.files[0]);
                }
              }}
            >
              <div className="flex items-end p-2 gap-2">
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,image/*"
                />
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-3 text-neutral-400 hover:text-indigo-400 hover:bg-neutral-800 rounded-xl transition-all shrink-0 ${file ? 'text-indigo-400 bg-indigo-500/10' : ''}`}
                  title="Upload PDF or Image"
                >
                  <PaperclipIcon />
                </button>
                
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask a question or upload a document for RAG context..."
                  className="flex-1 max-h-40 min-h-[44px] bg-transparent border-none focus:ring-0 resize-none py-3 px-2 text-neutral-100 placeholder:text-neutral-500 scrollbar-thin text-[15px]"
                  rows={1}
                  style={{
                    height: 'auto'
                  }}
                />

                <button 
                  type="submit"
                  disabled={(!input.trim() && !file) || isProcessing}
                  className="p-3 bg-white text-black hover:bg-indigo-50 hover:text-indigo-600 disabled:bg-neutral-800 disabled:text-neutral-600 rounded-xl transition-all shrink-0 font-medium mb-0.5 mr-0.5 shadow-sm active:scale-95"
                >
                  <SendIcon />
                </button>
              </div>
            </form>
            <div className="text-center mt-4 mb-2 flex justify-between items-center px-2">
              <p className="text-xs text-neutral-500">Lexora AI may produce inaccurate information about uploaded documents.</p>
              <p className="text-[10px] text-neutral-600 font-medium">PRESS ENTER TO SEND</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Global styles for scrollbar customization */}
      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: #3f3f46;
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #27272a;
          border-radius: 20px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background-color: #3f3f46;
        }
      `}} />
    </div>
  );
}