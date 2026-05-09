"use client";
import React, { useState, useRef } from "react";
import {
  BotIcon,
  PaperclipIcon,
  SendIcon,
  FileIcon,
  ImageIcon,
  UserIcon,
  SettingsIcon,
  XIcon,
} from "@/app/components/Svg";

export default function HeroPage() {
  type Message = {
    id: number;
    text: string;
    timestamp: string;
    role: string;
  };


  const [Message, setMessage] = useState<Message[]>([]);
  const [Textarea, setTextarea] = useState([]);
  const [Input, setInput] = useState("");
  const [File, setFile] = useState<File | null>(null);
  const [Processing, setProcessing] = useState(false);
  const [Recentsession, setRecentsession] = useState<string[]>([
    "Q3 Financial Report Analysis",
    "Onboarding Documentation",
    "API Integration Specs",
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!Input.trim()) return;

    const newMessage = {
      id: Date.now(),
      role: "user",
      text: Input,
      timestamp: new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };
    setMessage((prev) => [...prev, newMessage]);
    setInput("");
  };

  const handleClearChat = () => {

    setMessage([]);
    setInput("");
    setFile(null);
  };

  const handleclick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;
  };

  return (
    <div className="flex h-screen bg-neutral-950 text-neutral-100 font-sans overflow-hidden">
      {/* Sidebar */}
      <div className="w-72 bg-neutral-900 border-r border-neutral-800 hidden md:flex flex-col relative z-20 shadow-2xl">
        <div className="p-5 border-b border-neutral-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <BotIcon />
          </div>
          <div>
            <div className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
              Lexora
            </div>
            <div className="text-xs text-indigo-400 font-medium">
              Enterprise RAG
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <button 
          onClick={handleClearChat}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/20 font-medium mb-6 hover:scale-[1.02] active:scale-[0.98]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            New Session
          </button>

          <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3 px-1">
            Recent Sessions
          </div>
          <div className="space-y-1">
            {/* Static Example Sessions */}
            <button className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-neutral-800 transition-colors text-sm text-neutral-300 truncate group flex items-center gap-3">
              <svg
                className="text-neutral-500 group-hover:text-indigo-400 transition-colors"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <span className="truncate">Q3 Financial Report Analysis</span>
            </button>
            <button className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-neutral-800 transition-colors text-sm text-neutral-300 truncate group flex items-center gap-3">
              <svg
                className="text-neutral-500 group-hover:text-indigo-400 transition-colors"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <span className="truncate">Onboarding Documentation</span>
            </button>
            <button className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-neutral-800 transition-colors text-sm text-neutral-300 truncate group flex items-center gap-3">
              <svg
                className="text-neutral-500 group-hover:text-indigo-400 transition-colors"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <span className="truncate">API Integration Specs</span>
            </button>
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
          <h1 className="text-lg font-medium text-neutral-200">
            Current Session
          </h1>
          <div className="ml-auto flex items-center gap-3 bg-neutral-900/80 px-3 py-1.5 rounded-full border border-neutral-800">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-medium text-neutral-300">
              RAG Engine Active
            </span>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
          <div className="max-w-4xl mx-auto space-y-8 pb-10">
            {/* Static Assistant Message */}
            <div className="flex gap-4 group transition-all duration-300 ease-in-out">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-1 shadow-md bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-500/20">
                <BotIcon />
              </div>
              <div className="flex flex-col items-start max-w-[85%] md:max-w-[75%]">
                <div className="flex items-center gap-2 mb-1.5 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm font-medium text-neutral-400">
                    Lexora
                  </span>
                  <span className="text-xs text-neutral-600">10:00 AM</span>
                </div>
                <div className="p-4 md:p-5 text-[15px] leading-relaxed shadow-sm bg-neutral-900/80 backdrop-blur-sm text-neutral-200 rounded-2xl rounded-tl-sm border border-neutral-800/80 shadow-inner">
                  <p className="whitespace-pre-wrap">
                    Hello! I am Lexora, your intelligent assistant. Upload a PDF
                    or image, or simply ask me a question.
                  </p>
                </div>
              </div>
            </div>

            {/* Render dynamically created user messages */}
            {Message.map((msg) => (
              <div
                key={msg.id}
                className="flex gap-4 flex-row-reverse group transition-all duration-300 ease-in-out"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-1 shadow-md bg-gradient-to-br from-neutral-700 to-neutral-800 border border-neutral-700">
                  <UserIcon />
                </div>

                <div className="flex flex-col items-end max-w-[85%] md:max-w-[75%]">
                  <div className="flex items-center gap-2 mb-1.5 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm font-medium text-neutral-400">
                      You
                    </span>
                    <span className="text-xs text-neutral-600">
                      {msg.timestamp}
                    </span>
                  </div>
                  <div className="p-4 md:p-5 text-[15px] leading-relaxed shadow-sm bg-neutral-800 text-neutral-100 rounded-2xl rounded-tr-sm border border-neutral-700/50">
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              </div>
            ))}
            <div className="h-4" />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 bg-gradient-to-t from-neutral-950 via-neutral-950/90 to-transparent pt-10">
          <div className="max-w-4xl mx-auto">
            <form
              onSubmit={handleSend}
              className="relative bg-neutral-900/80 backdrop-blur-xl border border-neutral-700/80 rounded-2xl shadow-2xl transition-all duration-300 focus-within:border-indigo-500/70 focus-within:ring-4 focus-within:ring-indigo-500/10 focus-within:bg-neutral-900"
            >
              <div className="flex items-end p-2 gap-2">
                <button
                  onClick={handleclick}
                  type="button"
                  className="p-3 text-neutral-400 hover:text-indigo-400 hover:bg-neutral-800 rounded-xl transition-all shrink-0"
                  title="Upload PDF or Image"
                >
                  <PaperclipIcon />
                </button>
                {/* <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                /> */}

                <textarea
                  value={Input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask a question or upload a document for RAG context..."
                  className="flex-1 max-h-40 min-h-[44px] bg-transparent border-none focus:ring-0 resize-none py-3 px-2 text-neutral-100 placeholder:text-neutral-500 scrollbar-thin text-[15px]"
                  rows={1}
                  style={{
                    height: "auto",
                  }}
                />

                <button
                  type="submit"
                  className="p-3 bg-white text-black hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all shrink-0 font-medium mb-0.5 mr-0.5 shadow-sm active:scale-95"
                >
                  <SendIcon />
                </button>
              </div>
            </form>
            <div className="text-center mt-4 mb-2 flex justify-between items-center px-2">
              <p className="text-xs text-neutral-500">
                Lexora AI may produce inaccurate information about uploaded
                documents.
              </p>
              <p className="text-[10px] text-neutral-600 font-medium">
                PRESS ENTER TO SEND
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Global styles for scrollbar customization */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
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
      `,
        }}
      />
    </div>
  );
}
